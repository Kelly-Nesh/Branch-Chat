import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "./agent.css";
import { Navigator, backend } from "../App";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardHeader,
  MDBCardText,
  MDBCardSubTitle,
} from "mdb-react-ui-kit";

const Agent = () => {
  const [chats, setChats] = useState([]);
  const [filter, setFilter] = useState();
  const [show, setShow] = useState(false);
  const [agent, setAgent] = useState();
  const [hasAgent, setHasAgent] = useState(false);
  const POLLING_INTERVAL = 5000;

  useEffect(() => {
    setAgent(sessionStorage.getItem("emp_id"));
    /* First Time */
    axios.get(backend).then((r) => {
      setChats(r.data);
    });

    /* After interval */
    const intervalID = setInterval(() => {
      retrieve_chats();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalID);
  }, []);

  async function retrieve_chats() {
    await axios.get(backend).then((r) => {
      setChats(r.data);
    });
  }

  if (!chats) return <></>;
  const filters = [
    [
      "Clear filter",
      () => {
        setFilter(null), setHasAgent(false);
      },
    ],
    ["Loan application", "application"],
    ["Loan repayment", "repayment"],
    ["Account", "account"],
    ["Other", "other"],
  ];
  return (
    <Container fluid className="agent">
      <Navigator name={agent} func={setShow} flag={show} />
      <Row style={{ minHeight: "95vh" }}>
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
        <Col
          md={3}
          lg={2}
          className={`position-fixed menu-block agent-menu  ${
            show ? "menu-active" : ""
          }`}
        >
          <div className={`menu ${show ? "menu-active" : ""}`}>
            <h5 style={{ color: "#4fcdff" }}>Filters: Topics | Agent</h5>
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

  function setData(topic, conversation_id) {
    sessionStorage.setItem("topic", topic);
    navigate(conversation_id);
  }
  return filtered_chats.map((e, idx) => {
    let msg = e.message;
    msg = msg.length > 20 ? msg.slice(0, 90) + "..." : msg;
    return (
      <Col xs={6} lg={4} key={idx} className="mt-3">
        <MDBCard
          style={{ width: "100%" }}
          className={`${e.hasAgent ? "hasagent" : "noagent"}`}
        >
          <MDBCardBody>
            <MDBCardHeader className="mb-1">{e.topic}</MDBCardHeader>

            <MDBCardTitle>{e.sender}</MDBCardTitle>
            <MDBCardText>{msg}</MDBCardText>
            <Button
              variant="light"
              onClick={() => {
                setData(e.topic, e.conversation_id);
              }}
            >
              Respond
            </Button>
            <hr className="hr" />
            <MDBCardSubTitle>{e.timestamp.split(" ")[1]}</MDBCardSubTitle>
          </MDBCardBody>
        </MDBCard>
      </Col>
    );
  });
}
