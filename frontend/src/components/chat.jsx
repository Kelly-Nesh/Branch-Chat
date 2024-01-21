import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { MenuBlock, Navigator, timestamp } from "../App";
import "./chat.css";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
} from "mdb-react-ui-kit";
/* Contains code for the Chat page.
    Posts chat messages to the backend
    Connects, receives and sends data from the backend
      websocket
  */
const cl = console.log;
function Chatformat({ chats, caller, messageref }) {
  const mapped = chats.map((chat, idx) => {
    if (caller === chat.sender) {
      return (
        <div key={idx} className="d-flex flex-row justify-content-end">
          <div>
            <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
              {chat.message}
            </p>
            <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
              {chat.timestamp.split(" ")[1]}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div key={idx} className="d-flex flex-row justify-content-start mb-4">
          <div>
            <p
              className="small p-2 ms-3 mb-1 rounded-3"
              style={{ backgroundColor: "#f5f6f7" }}
            >
              {chat.message}
            </p>
            <p className="small ms-3 mb-3 rounded-3 text-muted">
              {chat.timestamp.split(" ")[1]}
            </p>
          </div>
        </div>
      );
    }
  });
  mapped.push(<small id="last" key={"last"} ref={messageref}></small>);
  return mapped;
}

function createWebSocket(chat_id) {
  let ws_url = "ws://localhost:8000/ws/support/" + chat_id + "/";
  return useWebSocket(ws_url, {
    shouldReconnect: () => {
      return true;
    },
    reconnectAttempts: 5,
  });
}

function getChatHistory(url, setChatLog) {
  axios
    .get(url)
    .then((e) => {
      setChatLog(e.data);
    })
    .catch((e) => {
      console.log(e.status);
    });
}

export default function Chat({ caller }) {
  const [end, setEnd] = useState(false);
  const [msg_alert, setAlert] = useState();
  const inputref = useRef();
  const messageref = useRef();
  const backend = "http://localhost:8000/api/";
  const [chatlog, setChatLog] = useState([]);
  const chat_id = useParams().chat_id;
  const [show, setShow] = useState(false);
  const [sender, setSender] = useState();
  const navigate = useNavigate();
  const { sendJsonMessage, lastJsonMessage, readyState } = useCallback(
    createWebSocket(chat_id)
  );

  useEffect(() => {
    if (!sender) {
      const agent_or_customer =
        caller === "user"
          ? sessionStorage.getItem("customer_id")
          : sessionStorage.getItem("emp_id");
      setSender(agent_or_customer);
    }
    if (lastJsonMessage !== null) {
      if (lastJsonMessage.complete) {
        setAlert(false)
        setEnd(lastJsonMessage.complete);
        return;
      }
      setChatLog((prev) => prev.concat(lastJsonMessage));
      if (messageref.current) {
        messageref.current.scrollIntoView();
      }
    } else {
      /* if new browser agent get chatlog from database */
      const url = `${backend}chat/history/?chat_id=${chat_id}`;
      getChatHistory(url, setChatLog);
    }
  }, [lastJsonMessage, setChatLog]);

  const handleSend = (e) => {
    e.preventDefault();
    if (end) {
      sendJsonMessage({ complete: true });
      return;
    }
    if (!inputref.current.value) {
      setAlert(true);
      return;
    }
    const topic = sessionStorage.getItem("topic");
    const hasAgent =
      !sender.startsWith("user") || chatlog[chatlog.length - 1].hasAgent;
    const data = {
      conversation_id: chat_id,
      topic: topic,
      timestamp: timestamp(),
      message: inputref.current.value,
      sender: sender,
      complete: end,
      hasAgent: hasAgent,
    };
    sendJsonMessage(data);
    axios.post(backend + "message/", data).catch((e) => {
      console.log(e);
    });
    inputref.current.value = "";
  };
  const handleEnd = () => {
    const finalmessage = chatlog[chatlog.length - 1].conversation_id;
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
  return (
    <MDBContainer fluid className="py-1" style={{ backgroundColor: "#eee" }}>
      <MDBRow className="d-flex justify-content-center min-vh-100">
        <Navigator name={sender} func={setShow} flag={show} />
        <MDBCol md="10" lg="8" xl="6">
          <MDBCard id="chat2" style={{ borderRadius: "15px" }}>
            <MDBCardHeader className="d-flex justify-content-between align-items-center p-3">
              <h5 className="mb-0">BranchChat | {sender}</h5>
              <>
                {msg_alert && (
                  <Alert variant="warning" className="alert">
                    Write a message to send
                  </Alert>
                )}
              {sender && sender.startsWith("user") === false && (
                <Button
                  variant="primary"
                  disabled={readyState !== ReadyState.OPEN}
                  onClick={handleEnd}
                >
                  End conversation
                </Button>
              )}
                {end && (
                  <Alert className="alert" variant="danger">
                    Conversation closed. <Link to="/chat/">Home</Link>
                  </Alert>
                )}
              </>
            </MDBCardHeader>
            <Container
              className="overflow-scroll"
              style={{ position: "relative", height: "60svh" }}
            >
              <MDBCardBody>
                <Chatformat
                  chats={chatlog}
                  caller={sender}
                  messageref={messageref}
                />
              </MDBCardBody>
            </Container>
            <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
              <input
                type="text"
                className="form-control form-control-lg"
                id="exampleFormControlInput1"
                placeholder="Type message"
                ref={inputref}
                onFocus={()=>{
                  alert && setAlert(false)
                }}
              ></input>
              <Button
                variant="primary"
                disabled={readyState !== ReadyState.OPEN}
                onClick={handleSend}
              >
                Send
              </Button>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
        <MenuBlock show={show} caller={caller} />
      </MDBRow>
    </MDBContainer>
  );
}
