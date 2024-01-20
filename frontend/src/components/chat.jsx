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
const c = console.log;
/* get previous messages from db
 */
function getMessages(url, setMessagelog, setAgent) {
  axios
    .get(url)
    .then((e) => {
      setMessagelog(e.data);
      const hasAgent = e.data.find((e) => {
        return e.hasAgent;
      });
      hasAgent.hasAgent ? setAgent(true) : "";
    })
    .catch((e) => {
      console.log(e.status);
    });
}

const Chat = ({ caller }) => {
  const { convo_id } = useParams();
  let ws_url = "ws://localhost:8000/ws/support/" + convo_id + "/";
  const ref = useRef();
  const [messagelog, setMessagelog] = useState([]);
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [alert, setAlert] = useState(false);
  const [sender, setSender] = useState("user");
  const [agent, setAgent] = useState(false);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    ws_url,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 5,
    }
  );

  const backend = "http://localhost:8000/api/";

  useEffect(() => {
    if (lastJsonMessage !== null) {
      setMessagelog((prev) => prev.concat(lastJsonMessage));
    } else {
      /* if new browser agent get chatlog from database */
      const url = `${backend}conv/history/?convo_id=${convo_id}`;
      getMessages(url, setMessagelog, setAgent);
      // console.log(messagelog);

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
    // console.log(sender);
    setSender(sender);
    const data = {
      conversation_id: convo_id,
      topic: topic,
      timestamp: timestamp(),
      message: ref.current.value,
      sender: sender,
    };
    agent ? (data.hasAgent = true) : null;
    axios.post(backend + "message/", data).catch((e) => {
      console.log(e);
    });
    ref.current.value = "";
    sendJsonMessage(data);
  });

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
      {connectionStatus && show && <Alert>{connectionStatus}</Alert>}
      <Row className="justify-content-center">
        <Col md={6} className="overflow-scroll" style={{ height: "75svh" }}>
          {lastJsonMessage ? <p>{lastJsonMessage.data}</p> : null}
          <Chatformat messages={messagelog} sender={sender} />
        </Col>
      </Row>
      <br />
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Form.Control
            as="textarea"
            placeholder="write a message"
            ref={ref}
            className="d-block mx-auto mb-2"
          />
          <Button
            variant="primary"
            disabled={readyState !== ReadyState.OPEN}
            onClick={handleSend}
          >
            Send
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
function Chatformat({ messages, sender }) {
  let align;
  // console.log(messages)
  return messages.map((m, idx) => {
    const sender = m.sender;
    // console.log(m, m.sender, sender);

    align = sender === m.sender ? "end" : "start";
    return (
      <p className={`text-${align}`} key={idx}>
        {m.message}
      </p>
    );
  });
}
