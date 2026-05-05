import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  refreshUser,
  forgotPassword,
  updatePassword,
  logout,
  register,
  verifySession,
  sendSixDigitCode,
  resetPasswordWithDigitCode,
  sendVerificationEmail,
  updateEmailWithDigitCode,
  verifyEmail,
} from "./authThunk";

/**
 *
 * @typedef {import("../../types/user").User} User
 * @typedef {import("../../types/authState").AuthState} AuthState
 * @typedef {import("../../types/responseError").ResponseError} ResponseError
 * @typedef {import("../../types/common").NullableString} NullableString
 */

/** @type {AuthState} */
const initialState = {
  user: null,
  loading: false,
  bootstraping: true,
  accessTokenExpiresAt: null,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Mark bootstrap as finished.
     * @param {AuthState} state
     */
    finishBootstraping(state) {
      state.bootstraping = false;
    },
    /**
     * Hard set the user (e.g., after hydrate).
     *
     * @param {AuthState} state
     * @param {{ payload: User | null }} action
     */
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.bootstraping = false;

    },
    /**
     * Clear auth data on forced logout / reset.
     * Does NOT touch `bootstraping` so the app can control that separately.
     *
     * @param {AuthState} state
     */
    clearAuth(state) {
      state.user = null;
      state.loading = false;
      state.accessTokenExpiresAt = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------------- Verify Session --------------
      .addCase(
        verifySession.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.bootstraping = true;
          state.error = null;
        }
      )
      .addCase(
        verifySession.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, user: User } }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.user = action.payload.user;
          state.bootstraping = false;
          state.error = null;
        }
      )
      .addCase(
        verifySession.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          if(action.payload.code === "GUEST"){
            /** @type {AuthState} */ (state);
            state.user = null;
            state.bootstraping = false;
            state.error = null;
            return
          }

          /** @type {AuthState} */ (state);
          state.user = null;
          state.bootstraping = false;
          state.error = action.payload || null;
        }
      )

      //---------------- Login --------------------
      .addCase(
        login.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        login.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: NullableString, user: User, accessTokenExpiresAt: number } }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.user = action.payload.user;
          state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt
          state.loading = false;
          state.bootstraping = false;
          state.error = null;
        }
      )
      .addCase(
        login.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = action.payload || null;
        }
      )

      // ----------------- Logout ----------------------
      .addCase(
        logout.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        logout.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: string } }} */ _action
        ) => {
          /** @type {AuthState} */ (state);
          state.user = null;
          state.loading = false;
          state.bootstraping = false;
          state.accessTokenExpiresAt = null;
          state.error = null;
        }
      )
      .addCase(
        logout.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.user = null;
          state.loading = false;
          state.bootstraping = false;
          state.accessTokenExpiresAt = null;
          state.error = action.payload || null;
        }
      )

      // ----------------- Refresh User ------------------
      .addCase(
        refreshUser.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        refreshUser.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, user: User } }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.user = action.payload.user;
          state.loading = false;
        }
      )
      .addCase(
        refreshUser.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.user = null;
          state.loading = false;
          state.error = action.payload || null;
        }
      )

      //----------------- Register ---------------------
      .addCase(
        register.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        register.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: string } }} */ _action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        register.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = action.payload || null;
        }
      )

      //---------------- Forgot Password --------------
      .addCase(
        forgotPassword.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        forgotPassword.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: string } }} */ _action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        forgotPassword.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = action.payload || null;
        }
      )

      //----------------- Update Password ------------
      .addCase(
        updatePassword.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        updatePassword.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: string } }} */ _action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        updatePassword.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = action.payload || null;
        }
      )

      // ----------------Send Six Digit Code ---------
      .addCase(
        sendSixDigitCode.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        sendSixDigitCode.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: string } }} */ _action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
        }
      )
      .addCase(
        sendSixDigitCode.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = action.payload || null;
        }
      )

      //-------- Reset Password With Digit Code -----
      .addCase(
        resetPasswordWithDigitCode.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        resetPasswordWithDigitCode.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: string } }} */ _action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
        }
      )
      .addCase(
        resetPasswordWithDigitCode.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = action.payload || null;
        }
      )

      //-------- Send verification Email -------
      .addCase(
        sendVerificationEmail.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        sendVerificationEmail.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: string } }} */ _action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
        }
      )
      .addCase(
        sendVerificationEmail.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = action.payload || null;
        }
      )

      // ---------- Update Email With Digit Code ---
      .addCase(
        updateEmailWithDigitCode.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        updateEmailWithDigitCode.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: string } }} */ _action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
        }
      )
      .addCase(
        updateEmailWithDigitCode.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = action.payload || null;
        }
      )

      //----------- Verify Email ------------------
      .addCase(
        verifyEmail.pending,
        (state) => {
          /** @type {AuthState} */ (state);
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        verifyEmail.fulfilled,
        (
          state,
          /** @type {{ payload: { success: boolean, message: string } }} */ _action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(
        verifyEmail.rejected,
        (
          state,
          /** @type {{ payload?: ResponseError }} */ action
        ) => {
          /** @type {AuthState} */ (state);
          state.loading = false;
          state.error = action.payload || null;
        }
      );
  },
});

/**
 * RootState shape (minimal view from this slice's perspective).
 *
 * @typedef {Object} RootState
 * @property {AuthState} auth
 */

// Selectors (Redux "selectX" convention)

/**
 * Selects whether auth is currently loading.
 * @param {RootState} state
 * @returns {boolean}
 */
export const selectAuthLoading = (state) => state.auth.loading;

/**
 * Selects the current auth error (if any).
 * @param {RootState} state
 * @returns {ResponseError | null}
 */
export const selectAuthError = (state) => state.auth.error;

/**
 * Selects the authenticated user (or null if not logged in).
 * @param {RootState} state
 * @returns {User | null}
 */
export const selectAuthUser = (state) => state.auth.user;

/**
 * Selects whether the app is still bootstrapping auth.
 * @param {RootState} state
 * @returns {boolean}
 */
export const selectAuthBootstrapping = (state) => state.auth.bootstraping;

// Actions
export const { finishBootstraping, setUser, clearAuth } = authSlice.actions;

export default authSlice.reducer;
