import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo_mfb.png";

export const backend = "http://localhost:8000/api/message/";

export function timestamp() {
  let today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
}

function App() {
  const [topic, setTopic] = useState();
  const [message, setMessage] = useState();
  const [notification, setNotification] = useState();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  async function submitTopic(e) {
    e.preventDefault();
    if (!message || !topic) {
      setNotification("All fields required");
      return;
    }
    const data = {
      timestamp: timestamp(),
      sender: sessionStorage.getItem("customer_id"),
      topic: topic,
      message: message,
    };
    sessionStorage.setItem("topic", topic);
    axios
      .post(backend, data)
      .then((resp) => {
        navigate(`${resp.data.conversation_id}/`);
      })
      .catch((e) => {
        console.log(e.data);
      });
  }
  return (
    <Container className="mt-3">
      <Navigator name={""} func={setShow} flag={show} />

      <Row>
        {notification && (
          <Row>
            <Col>
              <Alert variant="danger" className="d-block m-1 mx-auto">
                {notification}
              </Alert>
            </Col>
          </Row>
        )}
        <Col sm={12} className="mx-auto mb-3">
          <h3>
            Welcome to branch support.
            <br />
            Need help? Talk to an agent.
          </h3>
        </Col>
      </Row>
      <Row>
        <Col sm={6} className="mx-auto">
          <Form>
            <Form.Select
              required
              aria-label="Default select other"
              className="mb-2"
              onChange={(e) => {
                setTopic(e.target.value);
                notification && setNotification();
              }}
            >
              <option>Select topic</option>
              <option value="loan application">Loan Application</option>
              <option value="loan repayment">Loan Repayment</option>
              <option value="account">Account</option>
              <option defaultValue={true} value="other">
                Other
              </option>
            </Form.Select>
            <Form.Label htmlFor="message">Write message:</Form.Label>
            <Form.Control
              id="message"
              as="textarea"
              rows={3}
              size="100"
              required
              onChange={(e) => {
                notification && setNotification();
                setMessage(e.target.value);
              }}
            />
            <br />
            <Button
              id="topic-submit"
              type="button"
              value="Submit"
              variant="primary"
              onClick={submitTopic}
              className="d-block mx-auto"
            >
              Send
            </Button>
          </Form>
        </Col>
        <MenuBlock show={show} />
      </Row>
      <ResumeChat />
    </Container>
  );
}
export default App;

export function Navigator(props) {
  return (
    <Row
      className="my-2 mx-2 justify-content-center"
      style={{ background: "white", maxHeight: "6rem" }}
    >
      <img style={{ height: "4rem", width: "15rem" }} src={logo} />
      <h3 className="d-inline header">{props.name && "|" + props.name}</h3>
      <div className="menu-bars" onClick={() => props.func(!props.flag)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </Row>
  );
}
const cl = console.log;
export function MenuBlock({ show }) {
  const navigate = useNavigate();
  let paths = [
    ["Login", "/"],
    ["Agent", "/agent/"],
  ];

  return (
    <Col
      md={3}
      lg={2}
      className={`position-fixed menu-block ${show ? "menu-active" : ""}`}
    >
      <div className={`menu `}>
        <h5 style={{ color: "#4fcdff" }}>MENU</h5>
        <div className="ps-2">
          {paths.map(([name, path]) => {
            return (
              <p
                key={name}
                onClick={() => {
                  navigate(path);
                }}
                style={{ color: "#ffffff", cursor: "pointer" }}
              >
                {name}
              </p>
            );
          })}
        </div>
      </div>
    </Col>
  );
}

function ResumeChat() {
  /* Enable a user to resume an incomplete chat */
  const [message, setMessage] = useState();
  const id = useRef(sessionStorage.getItem("customer_id"));
  const backend = "http://localhost:8000/api/resume?user_id=";
  const url = backend + id.current;
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(url)
      .then((r) => {
        setMessage(r.data[0]);
      })
      .catch((e) => console.log(e));
  }, []);
  if (!message) return <></>;
  return (
    <Row className="my-3">
      <Col md={6}>
        <p className="h4">Resume previous Chat</p>
        <Card
          bg="secondary"
          onClick={() => {
            navigate(message.conversation_id);
          }}
          className="m-3 p-3"
          style={{ cursor: "pointer" }}
        >
          <Card.Title>{message.topic}</Card.Title>
          <Card.Body>
            <Card.Text>{message.message}</Card.Text>
            <Card.Subtitle>{message.timestamp}</Card.Subtitle>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
