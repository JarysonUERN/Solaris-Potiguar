import { RouterProvider } from "react-router-dom";
import router from "./routes/index.js";

export default function App() {
  return <RouterProvider router={router} />;
}
