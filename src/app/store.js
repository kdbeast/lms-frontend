import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";

export default configureStore({
  reducer: {
    auth: rootReducer,
  },
  middleware: (get) => get().concat(authApi.middleware),
});
