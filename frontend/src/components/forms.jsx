import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { Navigator } from "../App";
import { MenuBlock } from "../App";
const backend = "http://localhost:8000/api/";

export function CustomerForm() {
  const ref = useRef();
  const ref2 = useRef();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [show, setShow] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const username = ref.current.value;
    const password = ref2.current.value;

    if (!username || !password) {
      setAlert(true);
      return;
    }
    const data = {
      username: username,
      password: password,
    };
    axios.post(backend + "customer/", data).then((id) => {
      sessionStorage.setItem("customer_id", id.data.user_id);
      navigate("chat/");
    });
  }
  return (
    <Container className="d-grid min-vh-100">
      <Navigator name="" func={setShow} flag={show} />
      <Row className="justify-self-center">
        <Col md={6} className="mx-auto">
          {alert && <Alert variant="danger">Please fill all fields</Alert>}
          <Form style={{ maxWidth: "600px" }}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                ref={ref}
                type="text"
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control ref={ref2} type="password" placeholder="Password" />
            </Form.Group>
            <Button
              className="mx-auto d-block"
              variant="primary"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Form>
        </Col>
        <MenuBlock show={show} />
      </Row>
    </Container>
  );
}

export function AgentForm() {
  const ref = useRef();
  const ref2 = useRef();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [show, setShow] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const username = ref.current.value;
    const password = ref2.current.value;

    if (!username || !password) {
      setAlert(true);
      return;
    }
    const data = {
      employee_id: username,
      password: password,
    };
    axios.post(backend + "agent/", data).then((id) => {
      sessionStorage.setItem("emp_id", id.data.emp_id);
      navigate("support/");
    });
  }
  return (
    <Container className="d-grid min-vh-100">
      <Navigator name="" func={setShow} flag={show} />
      <Row className="justify-self-center">
        <Col md={6} className="mx-auto">
          {alert && <Alert variant="danger">Please fill all fields</Alert>}
          <Form style={{ maxWidth: "600px", justifySelf: "center" }}>
            <Form.Group className="mb-3">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                ref={ref}
                type="text"
                placeholder="Enter your employee id"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control ref={ref2} type="password" placeholder="Password" />
            </Form.Group>
            <Button
              className="mx-auto d-block"
              variant="primary"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Form>
        </Col>
        <MenuBlock show={show} />
      </Row>
    </Container>
  );
}
