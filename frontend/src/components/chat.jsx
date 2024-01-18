import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Toast from "react-bootstrap/Toast";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { group_name } = useParams();
  const ref = useRef();
  const [messagelog, setMessagelog] = useState([]);
  const ws_url = "ws://localhost:8000/ws/support/" + group_name + "/";
  const navigate = useNavigate();

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(ws_url);
  useEffect(() => {
    const first_message = JSON.parse(localStorage.getItem("user_data"));

    if (lastJsonMessage !== null) {
      setMessagelog((prev) => prev.concat(lastJsonMessage.message));
    } else {
      first_message ? setMessagelog([first_message.message]) : null;
    }
  }, [lastJsonMessage, setMessagelog]);

  const handleSend = useCallback((e) => {
    sendJsonMessage({ message: ref.current.value });
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting...",
    [ReadyState.OPEN]: "Connected.",
    [ReadyState.CLOSING]: "Disconnecting...",
    [ReadyState.CLOSED]: "Disconnected.",
  }[readyState];
  function nav() {
    navigate("/");
  }
  return (
    <>
      {connectionStatus ? (
        <Toast>
          <Toast.Body>{connectionStatus}</Toast.Body>
        </Toast>
      ) : null}
      <input type="text" placeholder="write a message" ref={ref} />
      <button
        type="submit"
        disabled={readyState !== ReadyState.OPEN}
        onClick={handleSend}
      >
        Send
      </button>
      <br></br>
      {lastJsonMessage ? <p>{lastJsonMessage.data}</p> : null}
      {messagelog.map((message, idx) => {
        return <p key={idx}>{message}</p>;
      })}
      <button onClick={nav}>HOME</button>
    </>
  );
};

export default Chat;
