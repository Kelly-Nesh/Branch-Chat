import { useRef, useState } from "react";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "./agent.css";
import { backend } from "../App";

const Agent = () => {
  const [chats, setChats] = useState([]);
  const [interval, setnterval] = useState(5000);
  const [filter, setFilter] = useState();
  const [show, setShow] = useState(false);
  const [agent, setAgent] = useState();
  const [hasAgent, setHasAgent] = useState(false);

  useEffect(() => {
    /* called immediately after render */
    setAgent(localStorage.getItem("emp_id"));
    axios.get(backend).then((r) => {
      setChats(r.data);
    });
    /* called after intervals */
    retrieve_chats();
  }, []);

  async function retrieve_chats() {
    setInterval(() => {
      axios.get(backend).then((r) => {
        setChats(r.data);
      });
    }, interval);
  }

  if (!chats) return <></>;
  const filters = [
    ["Loan application", "application"],
    ["Loan repayment", "repayment"],
    ["Account", "account"],
    ["Other", "other"],
    [
      "Clear filter",
      () => {
        setFilter(null), setHasAgent(false);
      },
    ],
  ];
  return (
    <Container fluid>
      <Row className="my-2 mx-2">
        <h2 className="d-inline header">Branch|Agent|{agent}</h2>
        <div className="menu-bars" onClick={() => setShow(!show)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </Row>
      <Row style={{ background: "#4fcdff", minHeight: "95vh" }}>
        <Col xs={12} md={9} lg={10}>
          <Container fluid>
            <Row className="gx-2 gy-2">
              <ChatListFormat
                chats={chats}
                filter={filter}
                hasAgent={hasAgent}
              />
            </Row>
          </Container>
        </Col>
        <Col md={3} lg={2} className="position-fixed agent-menu">
          <div className={`menu ${show ? "menu-active" : ""}`}>
            <h3 style={{ color: "#4fcdff" }}>Filters</h3>
            <div className="ps-2">
              {filters.map(([name, filter]) => {
                return (
                  <p
                    key={filter}
                    onClick={() => {
                      setFilter(filter);
                    }}
                    style={{ color: "#ffffff", cursor: "pointer" }}
                  >
                    {name}
                  </p>
                );
              })}
              <p
                onClick={() => {
                  setFilter();
                  setHasAgent(true);
                }}
                style={{ color: "#ffffff", cursor: "pointer" }}
              >
                Without Agents
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Agent;

const cl = console.log;

function ChatListFormat({ chats, filter, hasAgent }) {
  const navigate = useNavigate();
  let filtered_chats;
  if (filter) {
    filtered_chats = chats.filter((c) => {
      return c.topic.includes(filter);
    });
  } else if (hasAgent) {
    filtered_chats = chats.filter((c) => {
      return !c.hasAgent;
    });
  } else filtered_chats = chats;

  const timestamp = (time) => {
    const minute = 1000 * 60;
    let now = Date.now();
    const past = new Date(time);
    now -= past.getTime();
    now /= minute;
    const elapsed_min = now.toString().split(".")[0] + "m ago";
    return elapsed_min;
  };

  function setData(topic, user, conversation_id) {
    localStorage.setItem("topic", topic);
    localStorage.setItem("myuser", user);
    navigate(conversation_id);
  }
  return filtered_chats.map((e, idx) => {
    let msg = e.message;
    msg = msg.length > 20 ? msg.slice(0, 90) + "..." : msg;
    // console.log(e.hasAgent)
    return (
      <Col xs={6} lg={4} key={idx} className="mt-3">
        <Card
          style={{ width: "100%" }}
          className={`${e.hasAgent ? "hasagent" : "noagent"}`}
        >
          <Card.Body>
            <Card.Title>{e.topic}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Customer: {e.sender}
            </Card.Subtitle>
            <h1>{e.user_id}</h1>
            <Card.Text>{msg}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">
              {timestamp(e.timestamp)}
            </Card.Subtitle>
            <Button
              variant="light"
              onClick={() => {
                setData(e.topic, e.user_id, e.conversation_id);
              }}
            >
              Respond
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  });
}
