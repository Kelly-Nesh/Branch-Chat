import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import Chat from "./components/chat.jsx";
import Agent from "./components/agent.jsx";
import { AgentForm, CustomerForm } from "./components/forms.jsx";

const router = createBrowserRouter([
  { path: "", element: <CustomerForm /> },
  { path: "chat/", element: <App /> },
  { path: "chat/:chat_id/", element: <Chat caller="user" /> },
  {
    path: "agent/",
    children: [
      { path: "", element: <AgentForm /> },
      { path: "support/", element: <Agent /> },
      { path: "support/:chat_id/", element: <Chat caller="agent" /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
