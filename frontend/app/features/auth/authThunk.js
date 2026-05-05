/**
 * Auth thunks with normalized responses & errors
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../lib/api.client";

import {
  normaliseUserLoginError,
  normaliseUserLoginResponse,
  normaliseVerifySessionResponse,
  normaliseRefreshUserResponse,
  normaliseAuthGenericError,
  normaliseMessageResponse,
} from "./authTransformers";

/**
 * @typedef {import ("../../store").RootState} RootState
 */

/**
 * Verifies the current session.
 * Fulfilled payload: { success: boolean, user: User }
 * Rejected payload: ResponseError
 */
export const verifySession = createAsyncThunk(
  "auth/verifySession",
  /**
   * 
   * @param {void} _ 
   * @param {{getState: () => RootState, rejectWithValue: (v:any) => ResponseError}} thunkApi
   * 
   */
  async (_, { getState,rejectWithValue }) => {
    const state = getState();
    const {user, accessTokenExpiresAt } = state.auth;

    const now = Date.now();
    const SKEW_MS = 30_000;

    if(user && typeof accessTokenExpiresAt === "number" && accessTokenExpiresAt - SKEW_MS > now){
      console.log("returning cached user")
      
      return {
        success: true,
        user,
        accessTokenExpiresAt,
        fromCache: true
      }
    }
    try {
      const response = await apiClient.get("/auth/verify");
      const normalised = normaliseVerifySessionResponse(response);
      return normalised;
    } catch (error) {
    
      const err = normaliseAuthGenericError(
        error,
        "Failed to verify session"
      );


      if(err.status === 401 || err.status === 403){
        const normalised = {
          ...err,
          code: "GUEST"
        }

        return rejectWithValue(normalised);
      }



      return rejectWithValue({...err, code: "VERIFY_FAILED"});
    }
  }
);

/**
 * Login: email + password.
 * Fulfilled payload: { success: boolean, message: string | null, user: User }
 * Rejected payload: ResponseError
 */
export const login = createAsyncThunk(
  "auth/login",
  /**
   * @param {{ email: string, password: string }} credentials
   * @param {{ rejectWithValue: (value: import("../../types/responseError").ResponseError) => any }} thunkApi
   */
  async ({ email, password }, { rejectWithValue }) => {
    
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      

      const normalised = normaliseUserLoginResponse(response);
      return normalised;
    } catch (error) {
      //console.log("Login thunk error",error)

      const normalised = normaliseUserLoginError(error);
      return rejectWithValue(normalised);
    }
  }
);

/**
 * Logout.
 * Fulfilled payload: { success: boolean, message: string }
 * Rejected payload: ResponseError
 */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/logout");
      const normalised = normaliseMessageResponse(
        response,
        "Logged out successfully"
      );
      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(error, "Logout failed");
      return rejectWithValue(err);
    }
  }
);

/**
 * Refresh user data.
 * Fulfilled payload: { success: boolean, user: User }
 * Rejected payload: ResponseError
 */
export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/auth/refresh-user");
      const normalised = normaliseRefreshUserResponse(response);
      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(
        error,
        "Failed to refresh user"
      );
      return rejectWithValue(err);
    }
  }
);

/**
 * Register a new account.
 * Fulfilled payload: { success: boolean, message: string }
 * Rejected payload: ResponseError
 */
export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
      });

      // We only care about a success message here.
      const normalised = normaliseMessageResponse(
        response,
        "Account created successfully."
      );

      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(error, "Registration failed");
      return rejectWithValue(err);
    }
  }
);

/**
 * Forgot password.
 * Fulfilled payload: { success: boolean, message: string }
 * Rejected payload: ResponseError
 */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email });
      const normalised = normaliseMessageResponse(
        response,
        "Password reset link sent"
      );
      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(
        error,
        "Failed to send reset password email"
      );
      return rejectWithValue(err);
    }
  }
);

/**
 * Update password via token.
 * Fulfilled payload: { success: boolean, message: string }
 * Rejected payload: ResponseError
 */
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/auth/reset-password/${token}`, {
        password,
      });

      const normalised = normaliseMessageResponse(
        response,
        "Password reset successful"
      );
      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(
        error,
        "Failed to reset password"
      );
      return rejectWithValue(err);
    }
  }
);

/**
 * Send six-digit verification code.
 * Fulfilled payload: { success: boolean, message: string }
 * Rejected payload: ResponseError
 */
export const sendSixDigitCode = createAsyncThunk(
  "auth/sendSixDigitCode",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/auth/send-verification-digits-code",
        { email }
      );

      const normalised = normaliseMessageResponse(
        response,
        "Verification code sent to your email"
      );
      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(
        error,
        "Could not send verification code."
      );
      return rejectWithValue(err);
    }
  }
);

/**
 * Reset password with digit code.
 * Fulfilled payload: { success: boolean, message: string }
 * Rejected payload: ResponseError
 */
export const resetPasswordWithDigitCode = createAsyncThunk(
  "auth/resetPasswordWithDigitCode",
  async ({ password, digitCodes }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/auth/reset-password-with-digit-code",
        { password, digitCodes }
      );

      const normalised = normaliseMessageResponse(
        response,
        "Password reset successful"
      );
      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(
        error,
        "Failed to reset password"
      );
      return rejectWithValue(err);
    }
  }
);

/**
 * Send verification email.
 * Fulfilled payload: { success: boolean, message: string }
 * Rejected payload: ResponseError
 */
export const sendVerificationEmail = createAsyncThunk(
  "auth/sendVerificationEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/send-verification-email", {
        email,
      });

      const normalised = normaliseMessageResponse(
        response,
        "Verification email sent to your email"
      );
      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(
        error,
        "Could not send verification email."
      );
      return rejectWithValue(err);
    }
  }
);

/**
 * Update email with digit code.
 * Fulfilled payload: { success: boolean, message: string }
 * Rejected payload: ResponseError
 */
export const updateEmailWithDigitCode = createAsyncThunk(
  "auth/updateEmailWithDigitCode",
  async ({ email, digitCodes }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/auth/email-update-with-digit-code",
        { email, digitCodes }
      );

      const normalised = normaliseMessageResponse(
        response,
        "Email updated successfully"
      );
      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(
        error,
        "Error updating email"
      );
      return rejectWithValue(err);
    }
  }
);

/**
 * Verify email with token.
 * Fulfilled payload: { success: boolean, message: string }
 * Rejected payload: ResponseError
 */
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/auth/verify-email/${token}`,
        {},
        { _skipRefresh: true, withCredentials: false }
      );

      const normalised = normaliseMessageResponse(
        response,
        "Email verified successfully"
      );
      return normalised;
    } catch (error) {
      const err = normaliseAuthGenericError(
        error,
        "Email verification failed"
      );
      return rejectWithValue(err);
    }
  }
);
