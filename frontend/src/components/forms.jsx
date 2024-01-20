import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";

const backend = "http://localhost:8000/api/";

export function CustomerForm() {
  const ref = useRef();
  const ref2 = useRef();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const val1 = ref.current.value;
    const val2 = ref2.current.value;

    if (!val1 || !val2) {
      setAlert(true);
      return;
    }
    const data = {
      username: val1,
      password: val2,
    };
    axios.post(backend + "customer/", data).then((id) => {
      localStorage.setItem("customer_id", id.data.user_id);
      navigate("chat/");
    });
  }
  return (
    <Container className="d-grid min-vh-100" style={{ placeItems: "center" }}>
      {alert && <Alert variant="danger">Please fill all fields</Alert>}
      <Form style={{ maxWidth: "500px" }}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control ref={ref} type="text" placeholder="Enter username" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control ref={ref2} type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export function AgentForm() {
  const ref = useRef();
  const ref2 = useRef();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const val1 = ref.current.value;
    const val2 = ref2.current.value;

    if (!val1 || !val2) {
      setAlert(true);
      return;
    }
    const data = {
      employee_id: val1,
      password: val2,
    };
    axios.post(backend + "agent/", data).then((id) => {
      localStorage.setItem("emp_id", id.data.emp_id);
      navigate("support/");
    });
  }
  return (
    <Container className="d-grid min-vh-100" style={{ placeItems: "center" }}>
      {alert && <Alert variant="danger">Please fill all fields</Alert>}
      <Form style={{ maxWidth: "500px" }}>
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
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </Container>
  );
}
