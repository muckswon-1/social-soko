/**
 * Verifies the current session
 * On success returns ok({user})
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { fail, ok } from "../../utils/resHelpers";
import { apiClient } from "../../lib/api.client";

export const verifySession = createAsyncThunk(
  "auth/verifySession",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/auth/verify");

      return ok({ user: data.user });
    } catch (error) {
      const status = error.status;

      //  if(status === 401 || status === 403){
      //     return rejectWithValue({unauthenticated: true})
      //  }

      return rejectWithValue(fail(error, "Failed to verify session"));
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });

      const user = data.data;

      return ok({ user });
    } catch (error) {
      return rejectWithValue(fail(error, "Login Failed"));
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post("/auth/logout");
      return ok();
    } catch (error) {
      return rejectWithValue(fail(error, "Logout Failed"));
    }
  },
);

export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/auth/refresh-user");

      return ok({ user: data?.data });
    } catch (error) {
      return rejectWithValue(fail(error, "Failed to refresh user"));
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, status } = await apiClient.post("/auth/register", {
        email,
        password,
      });

      const created = status === 201 && (data?.id || data?.user?.id);

      if (!created) return rejectWithValue(fail("Registration Failed"));

      return ok({ message: "Account created successfully." });
    } catch (error) {
      return rejectWithValue(fail(error, "Registration Failed"));
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/forgot-password", { email });

      return ok({ message: data?.message || "Password reset link sent" });
    } catch (error) {
      return rejectWithValue(
        fail(error, "Failed to send reset password email"),
      );
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/auth/reset-password/${token}`, {
        password: password,
      });

      return ok({ message: data?.message || "Password reset successful" });
    } catch (error) {
      return rejectWithValue(fail(error, "Failed to reset password"));
    }
  },
);

export const sendSixDigitCode = createAsyncThunk(
  "auth/sendSixDigitCode",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/auth/send-verification-digits-code",
        { email },
      );

      return ok({
        message:
          response?.data?.message || "Verification Code sent to your email",
      });
    } catch (error) {
      return rejectWithValue(fail(error, "Could not send verification code."));
    }
  },
);

export const resetPasswordWithDigitCode = createAsyncThunk(
  "auth/resetPasswordWithDigitCode",
  async ({ password, digitCodes }, { rejectWithValue }) => {
    console.log("reset password with digit code");
    try {
      const response = await apiClient.post(
        "/auth/reset-password-with-digit-code",
        { password, digitCodes },
      );
      console.log(response);
      return ok({
        message: response.data?.message || "Password reset successful",
      });
    } catch (error) {
      return rejectWithValue(fail(error, "Failed to reset password"));
    }
  },
);

export const sendVerificationEmail = createAsyncThunk(
  "auth/sendVerificationEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/send-verification-email", {
        email,
      });

      return ok({
        message:
          response?.data?.message || "Verification email sent to your email",
      });
    } catch (error) {
      return rejectWithValue(fail(error, "Could not send verification email."));
    }
  },
);

export const updateEmailWithDigitCode = createAsyncThunk(
  "auth/updateEmailWithDigitCode",
  async ({ email, digitCodes }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/auth/email-update-with-digit-code",
        { email, digitCodes },
      );

      return ok({
        message: response?.data?.message || "Email updated successfully",
      });
    } catch (error) {
      return rejectWithValue(fail(error, "Error updating email"));
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(
        `/auth/verify-email/${token}`,
        {},
        { _skipRefresh: true, withCredentials: false },
      );
      return ok({ message: data?.message || "Email verified successfully" });
    } catch (error) {
      return rejectWithValue(fail(error, "Email verification failed"));
    }
  },
);
