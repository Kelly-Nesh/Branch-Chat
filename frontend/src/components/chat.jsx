import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { backend } from "../App";
/* Contains code for the Chat page.
    Posts chat messages to the backend
    Connects, receives and sends data from the backend
      websocket
  */
const c = console.log;
/* get previous messages from db
 */
function getMessages(url, setMessagelog) {
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
  const { group_name } = useParams();
  let ws_url = "ws://localhost:8000/ws/";
  if (caller === "user") {
    ws_url = `${ws_url}support/${group_name}/`;
  } else {
    ws_url = `${ws_url}agent/support/${group_name}/`;
  }
  const ref = useRef();
  const [messagelog, setMessagelog] = useState([]);
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(ws_url);
  const [chatdata, setChatData] = useState();

  const backend = "http://localhost:8000/api/";
  useEffect(() => {
    setChatData(JSON.parse(localStorage.getItem("msg_data")));

    if (lastJsonMessage !== null) {
      setMessagelog((prev) => prev.concat(lastJsonMessage.message));
    } else {
      /* if new browser agent get chatlog from database */
      const url = `${backend}prev/message/?group_name=${group_name}`;
      getMessages(url, setMessagelog);
      setShow(false);
    }
  }, [lastJsonMessage, setMessagelog]);

  const handleSend = useCallback((e) => {
    chatdata.message = ref.current.value;
    sendJsonMessage(chatdata);
    // chatdata.message_by = caller
    // agent will be set from angent side
    axios.post(backend + "message/", chatdata);
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
      {connectionStatus && show ? (
        <Toast>
          <Toast.Body>{connectionStatus}</Toast.Body>
        </Toast>
      ) : null}
      <Row className="justify-content-center">
        <Col sm={6} lg={4}>
          {lastJsonMessage ? <p>{lastJsonMessage.data}</p> : null}
          <Chatformat messages={messagelog} caller={caller} />
        </Col>
      </Row>
      <br />
      <Row className="justify-content-center">
        <Col sm={6} lg={4} className="text-center">
          <Form.Control
            type="text"
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
function Chatformat({ messages, caller }) {
  let align;
  return messages.map((m, idx) => {
    if (
      (!m.message_by && caller === "user") ||
      (m.message_by.startsWith(caller) && caller == "user") ||
      (m.message_by.startsWith(caller) && caller == "agent")
    ) {
      align = "end";
    } else {
      align = "start";
    }
    console.log(m.message_by);
    return <p className={`text-${align}`} key={idx}>{m.message}</p>;
  });
}
