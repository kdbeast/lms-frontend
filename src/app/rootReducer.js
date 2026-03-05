import { authApi } from "../features/api/authApi";
import { combineReducers } from "@reduxjs/toolkit";
import { courseApi } from "../features/api/courseApi";
import { sectionApi } from "../features/api/sectionApi";
import { purchaseApi } from "../features/api/purchaseApi";
import { courseProgressApi } from "../features/api/courseProgressApi";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [sectionApi.reducerPath]: sectionApi.reducer,
  [courseProgressApi.reducerPath]: courseProgressApi.reducer,
});

export default rootReducer;
