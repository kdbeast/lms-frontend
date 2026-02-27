import "./index.css";
import App from "./App.jsx";
import { Custom } from "./Custom";
import store from "./app/store";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { Toaster } from "./components/ui/sonner";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <Toaster />
        <Custom>
          <App />
        </Custom>
      </Provider>
    </ClerkProvider>
  </StrictMode>,
);
