import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Amplify } from "aws-amplify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { pages } from "./pages/pages";

const router = createBrowserRouter(pages);

console.log(import.meta.env);

const userPoolId = import.meta.env.VITE_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID;

console.log({ userPoolId, userPoolClientId });

Amplify.configure({
  Auth: {
    Cognito: {
      // ENV VARS MUST BE SET FOR AUTH TO WORK
      userPoolId,
      userPoolClientId,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
