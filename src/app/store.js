import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";

const appStore = configureStore({
  reducer: rootReducer,
  middleware: (get) => get().concat(authApi.middleware),
});

const initialiseApp = async () => {
  await appStore.dispatch(
    authApi.endpoints.getUserProfile.initiate({}, { forceRefetch: true })
  );
};

initialiseApp();

export default appStore;
