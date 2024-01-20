import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { timestamp } from "../App";

/* Contains code for the Chat page.
    Posts chat messages to the backend
    Connects, receives and sends data from the backend
      websocket
  */
const cl = console.log;
/* get previous messages from db
 */
function getMessages(url, setMessagelog, setAgent) {
  axios
    .get(url)
    .then((e) => {
      setMessagelog(e.data);
    })
    .catch((e) => {
      console.log(e.status);
    });
}

const Chat = ({ caller }) => {
  const { convo_id } = useParams();
  let ws_url = "ws://localhost:8000/ws/support/" + convo_id + "/";
  const ref = useRef();
  const lastmsgref = useRef();
  const [messagelog, setMessagelog] = useState([]);
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [alert, setAlert] = useState(false);
  const [sender, setSender] = useState("user");
  const [agent, setAgent] = useState(false);
  const [end, setEnd] = useState(false);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    ws_url,
    {
      onOpen: () => {
        setShow(true);
      },
      shouldReconnect: () => {
        setShow(true);
        return true;
      },
      reconnectAttempts: 5,
    }
  );

  const backend = "http://localhost:8000/api/";

  useEffect(() => {
    if (lastmsgref.current) {
      lastmsgref.current.scrollIntoView();
    }
    if (lastJsonMessage !== null) {
      setMessagelog((prev) => prev.concat(lastJsonMessage));
      setEnd(lastJsonMessage.complete);
      setAgent(lastJsonMessage.hasAgent);
      setShow(false);
    } else {
      /* if new browser agent get chatlog from database */
      const url = `${backend}conv/history/?convo_id=${convo_id}`;
      getMessages(url, setMessagelog, setAgent);

      setShow(false);
    }
  }, [lastJsonMessage, setMessagelog]);

  const handleSend = useCallback((e) => {
    if (!ref.current.value) {
      setAlert(true);
      return;
    }
    const topic = localStorage.getItem("topic");
    const sender =
      caller === "user"
        ? localStorage.getItem("customer_id")
        : localStorage.getItem("emp_id");
    setSender(sender);
    const agentissender = !sender.startsWith("user");
    const data = {
      conversation_id: convo_id,
      topic: topic,
      timestamp: timestamp(),
      message: ref.current.value,
      sender: sender,
      complete: end,
      hasAgent: agentissender || agent,
    };
    axios.post(backend + "message/", data).catch((e) => {
      console.log(e);
    });
    ref.current.value = "";
    sendJsonMessage(data);
  });
  const handleEnd = () => {
    const finalmessage = messagelog[messagelog.length - 1].conversation_id;
    axios
      .patch(backend + `message/${finalmessage}/`)
      .then((res) => {
        setEnd(res.data.complete);
      })
      .catch((e) => {
        console.log(e);
      });
    sendJsonMessage({ complete: true });
    navigate(-1);
  };
  let connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting...",
    [ReadyState.OPEN]: "Connected.",
    [ReadyState.CLOSING]: "Disconnecting...",
    [ReadyState.CLOSED]: "Disconnected.",
  }[readyState];

  function nav() {
    navigate("/");
  }
  return (
    <Container
      style={{ maxWidth: "80%" }}
      className="mx-auto place-items-center"
    >
      {connectionStatus && show && (
        <Alert className="alert">{connectionStatus}</Alert>
      )}
      {end && (
        <Alert className="alert" variant="danger">
          Conversation has ended
        </Alert>
      )}
      {alert && (
        <Alert variant="warning" className="alert">
          Write a message to send
        </Alert>
      )}
      <Row
        className="justify-content-center overflow-auto"
        style={{ height: "70svh" }}
      >
        <Col md={6} className="d-flex flex-column mb-2">
          {/* {lastJsonMessage ? <p>{lastJsonMessage.data}</p> : null} */}
          <Chatformat
            messages={messagelog}
            caller={caller}
            lastmsgref={lastmsgref}
          />
        </Col>
      </Row>
      <br />
      {end === false && (
        <Row
          className="justify-content-center position-relative"
          style={{ bottom: 0 }}
        >
          <Col md={6} className="text-center">
            <Form.Control
              as="textarea"
              placeholder="write a message"
              ref={ref}
              className="d-block mx-auto mb-2"
            />
            <div className="d-flex justify-content-evenly">
              {sender.startsWith("user") === false && (
                <Button
                  variant="primary"
                  disabled={readyState !== ReadyState.OPEN}
                  onClick={handleEnd}
                >
                  End Chat
                </Button>
              )}
              <Button
                variant="primary"
                disabled={readyState !== ReadyState.OPEN}
                onClick={handleSend}
              >
                Send
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Chat;
function Chatformat({ messages, caller, lastmsgref }) {
  let align;
  const mapped = messages.map((m, idx) => {
    const sd = m.sender ? m.sender : "";
    align =
      (caller === "user" && sd.startsWith("user")) ||
      (caller === "agent" && sd.startsWith("user") === false)
        ? "end"
        : "start";
    return (
      <p className={`text-${align}`} key={idx}>
        {m.message}
      </p>
    );
  });
  mapped.push(<p id="last" key={"last"} ref={lastmsgref}></p>);
  return mapped;
}
