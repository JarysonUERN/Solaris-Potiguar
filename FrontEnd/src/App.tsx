import { RouterProvider } from "react-router-dom";
import router from "./routes/index.js";
import { LanguageProvider } from "./i18n/index.js";

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
