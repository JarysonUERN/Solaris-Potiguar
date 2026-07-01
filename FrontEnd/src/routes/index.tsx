import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing.js";
import Login from "../pages/login.js";
import Onboarding from "../pages/Onboarding.js";
import Dashboard from "../pages/Dashboard.js";
import Result from "../pages/Result.js";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/onboarding", element: <Onboarding /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/result", element: <Result /> },
]);

export default router;
