import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";

export default configureStore({
  reducer: rootReducer,
  middleware: (get) => get().concat(authApi.middleware),
});
