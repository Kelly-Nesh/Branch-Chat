import { useRef, useState } from "react";
import axios from "axios";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import "./agent.css";
import { backend } from "../App";

const Agent = () => {
  const [chats, setChats] = useState([]);
  const [interval, setnterval] = useState(5000);
  const [filter, setFilter] = useState();
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    /* called immediately after render */
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
    ["Clear filter", null],
  ];
  return (
    <Container fluid>
      <Row className="my-2 mx-2">
        <h2 className="d-inline header">Branch|Agent support</h2>
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
              <ChatListFormat chats={chats} filter={filter} />
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
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Agent;
export const Login = () => {
  return <Link to="support/">Login</Link>;
};
const c = console.log;
function ChatListFormat({ chats, filter }) {
  const filtered_chats = filter
    ? chats.filter((c) => {
        const topic = c.topic;
        // console.log(topic.includes(filter), topic, filter)
        return topic.includes(filter);
      })
    : chats;
  const timestamp = (time) => {
    const minute = 1000 * 60;
    let now = Date.now();
    const past = new Date(time);
    now -= past.getTime();
    now /= minute;
    const elapsed_min = now.toString().split(".")[0] + "m ago";
    return elapsed_min;
  };
  return filtered_chats.map((e, idx) => {
    return (
      <Col xs={6} lg={4} key={idx}>
        <Card style={{ width: "100%" }}>
          <Card.Body>
            <Card.Title>{e.topic}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Agent: {e.agent ? e.agent : "None"}
            </Card.Subtitle>
            <Card.Text>{e.message}</Card.Text>
            <Card.Subtitle className="mb-2 text-muted">
              {timestamp(e.timestamp)}
            </Card.Subtitle>
            <Card.Link href={e.group_name}>Respond</Card.Link>
          </Card.Body>
        </Card>
      </Col>
    );
  });
}
