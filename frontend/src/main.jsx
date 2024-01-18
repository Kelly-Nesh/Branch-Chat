import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import Chat from "./components/chat.jsx";
import Agent, { Login } from "./components/agent.jsx";

const router = createBrowserRouter([
  { path: "", element: <App /> },
  { path: "chat/:group_name/", element: <Chat /> },
  {
    path: "agent/",
    children: [
      { path: "", element: <Login /> },
      { path: "support", element: <Agent /> },
      { path: "support/:group_name/", element: <Chat /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
