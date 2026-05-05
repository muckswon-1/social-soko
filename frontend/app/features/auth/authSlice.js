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

const initialState = {
  user: null,
  loading: false,
  bootstraping: true,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    finishBootstraping(state) {
      state.bootstraping = false;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearAuth(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------------- Verify Session --------------
      .addCase(verifySession.pending, (state) => {
        state.bootstraping = true;
        state.error = null;
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        const payload = action.payload || {};
        const user = payload.user || payload.data?.user || null;
        state.user = user;
        state.bootstraping = false;
        state.error = null;
      })
      .addCase(verifySession.rejected, (state, action) => {
        state.user = null;
        state.bootstraping = false;
        state.error = action.payload.error;
      })

      //---------------- Login --------------------
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user || action.payload.data?.user || null;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.error || "Login failed";
      })

      // ----------------- Logout ----------------------
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.bootstraping = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.bootstraping = false;
        state.error = action.payload || action.error || null;
      })

      // ----------------- Refresh User ------------------
      .addCase(refreshUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload.user || action.payload.data?.user || null;
        state.loading = false;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload || action.error || null;
      })

      //-----------------Register---------------------
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || null;
      })

      //---------------- Frogot Password --------------
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || null;
      })

      //----------------- Update Password ------------
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || null;
      })

      // ----------------Send Six Digit Code ---------
      .addCase(sendSixDigitCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSixDigitCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendSixDigitCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || null;
      })

      //-------- Reset Password With Digit Code -----
      .addCase(resetPasswordWithDigitCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordWithDigitCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordWithDigitCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || null;
      })

      //-------- Send verification Email -------
      .addCase(sendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || null;
      })

      // ---------- Update Email With Digit Code ---
      .addCase(updateEmailWithDigitCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmailWithDigitCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateEmailWithDigitCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || null;
      })

      //----------- Verifiy  Email ------------------
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || null;
      });
  },
});

// Selectors
export const authLoadingSelector = (state) => state.auth.loading;
export const authErrorSelector = (state) => state.auth.error;
export const authUserSelector = (state) => state.auth.user;
export const authBootstrapingSelector = (state) => state.auth.bootstraping;

// Actions
export const { finishBootstraping, setUser, clearAuth } = authSlice.actions;

export default authSlice.reducer;
