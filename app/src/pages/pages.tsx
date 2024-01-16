import type { RouteObject } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";

export const pages: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
  },
];
