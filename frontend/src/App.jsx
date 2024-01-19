import { useState } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const backend = "http://localhost:8000/api/message/";

function App() {
  const [topic, setTopic] = useState();
  const [message, setMessage] = useState();
  const [alert, setAlert] = useState();
  const navigate = useNavigate();

  let today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const timestamp = date + " " + time;

  async function submitTopic(e) {
    e.preventDefault();
    if (!message || !topic) {
      setAlert("All fields required");
      return;
    }
    const data = {
      user_id: Math.floor(Math.random() * 100) + 1,
      topic: topic,
      timestamp: timestamp,
      message: message,
    };
    data.message_by = "user_" + data.user_id;
    data.group_name = "group_" + data.user_id;
    axios
      .post(backend, data)
      .then(() => {
        localStorage.setItem("msg_data", JSON.stringify(data));
        data.group_name
          ? navigate(`chat/${data.group_name}/`)
          : setAlert("Error. Try again.");
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <Container className="mt-3">
      {alert ? (
        <Row>
          <Col>
            <Toast
              bg="danger"
              className="d-block m-1 mx-auto"
            >
              <Toast.Body className="text-white">{alert}</Toast.Body>
            </Toast>
          </Col>
        </Row>
      ) : null}
      <Row>
        <Col sm={6} className="mx-auto mb-3">
          <h3>Need help? Send us a message and talk to an agent.</h3>
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
                alert ? setAlert() : "";
              }}
            >
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
                alert ? setAlert() : "";
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
      </Row>
    </Container>
  );
}
export default App;
