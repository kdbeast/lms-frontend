import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import { courseApi } from "../features/api/courseApi";

const appStore = configureStore({
  reducer: rootReducer,
  middleware: (get) => get().concat(authApi.middleware, courseApi.middleware),
});

const initialiseApp = async () => {
  await appStore.dispatch(
    authApi.endpoints.getUserProfile.initiate({}, { forceRefetch: true })
  );
};

initialiseApp();

export default appStore;
