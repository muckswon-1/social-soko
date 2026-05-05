import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { apiSlice } from "./services/apiSlice";
import { postUiSlice } from "./features/posts/postsUISlice";

/**@typedef {import("./features/auth/authSlice").AuthState} AuthState} */

/**
 * RootState typedef makes all selectors typed
 * @typedef {Object} RootState
 * @property {AuthState} auth
 * @property {ReturnType<typeof apiSlice.reducer} api
 */

/**
 * @typedef {import("redux").Action} Action
 * @typedef {(action: Action) => Action} AppDispatch
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    postsUi: postUiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

/**
 * @returns {RootState}
 */
export const getState = () => store.getState();

/**
 * @returns {AppDispatch}
 */

export const dispatch = () => store.dispatch;

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 */
