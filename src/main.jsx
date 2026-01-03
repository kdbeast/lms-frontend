import "./index.css";
import App from "./App.jsx";
import { Custom } from "./Custom";
import store from "./app/store";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster />
      <Custom>
        <App />
      </Custom>
    </Provider>
  </StrictMode>
);
