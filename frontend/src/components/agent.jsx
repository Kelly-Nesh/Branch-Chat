import { useState } from "react";
import axios from "axios";
import React, { useEffect } from "react";
import { backend } from "../App";
import { Link, useParams } from "react-router-dom";

const Agent = () => {
  const [chats, setChats] = useState([]);
  const [interval, setnterval] = useState(5000);

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

  const chatmap = chats.map((c, idx) => {
    return <p key={c.message + idx}>{c.message}</p>;
  });

  return <div>{chatmap}</div>;
};

export default Agent;
export const Login = () => {
  return <Link to="support">Login</Link>;
};
