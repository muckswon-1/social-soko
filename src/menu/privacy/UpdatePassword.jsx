// src/menu/profile/UpdatePassword.jsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { sendSixDigitCode, resetPasswordWithDigitCode, logout } from '../../features/auth/authThunk';
import '../../styles/inline-tabs-reusable.css';
import { useDispatch, useSelector } from 'react-redux';
import { authUserSelector } from '../../features/auth/authSlice';
import { calcStrength } from '../../utils/passwordUtils';


const OTP_LEN = 6;


const UpdatePassword = () => {
  // Step management
  const [stage, setStage] = useState(() => localStorage.getItem("updatePasswordStage") || "verify"); // 'request' | 'verify'
  const [loading, setLoading] = useState(false);



  // Form state
  const [showCurrent, setShowCurrent] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  //const { sendSixDigitCode, resetPasswordWithDigitCode, user } = useAuth();

  const user = useSelector(authUserSelector);
  const dispatch = useDispatch();

  // OTP
  const [otp, setOtp] = useState(Array(OTP_LEN).fill(''));
  const inputsRef = useRef([]);

  const strength = useMemo(() => calcStrength(newPwd), [newPwd]);

  const newPwdValid = useMemo(() => {
    if (newPwd.length < 8) return false;
    if (!/[A-Z]/.test(newPwd)) return false;
    if (!/[a-z]/.test(newPwd)) return false;
    if (!/\d/.test(newPwd)) return false;
    return true;
  }, [newPwd]);

  const canSendCode = useMemo(() => {
    if (!newPwdValid) return false;
    if (!confirmPwd || newPwd !== confirmPwd) return false;
    // If you want current password mandatory, also require currentPwd here.
    return true;
  }, [newPwdValid, newPwd, confirmPwd]);

  const otpString = useMemo(() => otp.join(''), [otp]);
  const otpValid = useMemo(
    () => otpString.length === OTP_LEN && /^\d+$/.test(otpString),
    [otpString]
  );

  // --- handlers -------------------------------------------------------------

  const handleSendCode = useCallback(
    async (e) => {
      e.preventDefault();
      if (!canSendCode) return;
      setLoading(true);
      try {
        await dispatch(sendSixDigitCode({email:user.email})).unwrap();
        toast.success('Verification code sent to your email');
        localStorage.setItem("updatePasswordStage", "verify")
        setStage('verify');
        setTimeout(() => inputsRef.current?.[0]?.focus(), 50);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Could not send verification code');
      } finally {
        setLoading(false);
      }
    },
    [canSendCode, sendSixDigitCode, user?.email]
  );

  const handleConfirmChange = useCallback(
    async (e) => {
      e.preventDefault();
      if (!otpValid) return;
      setLoading(true);
      try {
        const res = await dispatch(resetPasswordWithDigitCode({ password: newPwd, digitCodes: otpString })).unwrap();
        console.log(res);
        toast.success('Password updated successfully.');
        toast.info("Please login again.")
        // reset form
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
        setOtp(Array(OTP_LEN).fill(''));
        localStorage.setItem("updatePasswordStage","request")
        setStage('request');
        dispatch(logout());
      } catch (err) {
        console.log(err);
        toast.error(err?.error || 'Verification failed');
        localStorage.removeItem("updatePasswordStage");
      } finally {
        setLoading(false);
      }
    },
    [otpValid, otpString, newPwd, resetPasswordWithDigitCode]
  );

  console.log(otpValid)

  // OTP helpers
  const handleOtpChange = (idx, char) => {
    if (!/^\d?$/.test(char)) return;
    const next = [...otp];
    next[idx] = char;
    setOtp(next);
    if (char && idx < OTP_LEN - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < OTP_LEN - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const text = (e.clipboardData.getData('text') || '')
      .trim()
      .replace(/\D/g, '')
      .slice(0, OTP_LEN);
    if (!text) return;
    e.preventDefault();
    const next = Array(OTP_LEN)
      .fill('')
      .map((_, i) => text[i] || '');
    setOtp(next);
    const focusIndex = Math.min(text.length, OTP_LEN - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  // --- UI -------------------------------------------------------------

  const StrengthBar = () => (
    <div className="strength">
      <div className={`bar ${strength >= 1 ? 'on' : ''}`} />
      <div className={`bar ${strength >= 2 ? 'on' : ''}`} />
      <div className={`bar ${strength >= 3 ? 'on' : ''}`} />
      <div className={`bar ${strength >= 4 ? 'on' : ''}`} />
      <div className={`bar ${strength >= 5 ? 'on' : ''}`} />
      <span className="label">
        {newPwd
          ? strength <= 2
            ? 'Weak'
            : strength === 3
            ? 'Fair'
            : strength === 4
            ? 'Strong'
            : 'Very strong'
          : 'Enter a password'}
      </span>
    </div>
  );

  return (
    <div className="card card--cozy">
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">Update Password</h2>
          <p className="section-sub">
            For your security, we'll email a verification code to confirm this change.
          </p>
        </div>
      </header>

      {stage === 'request' && (
        <form className="form-grid-1" onSubmit={handleSendCode}>
          <div className="form-field">
            <label className="form-label">
              Current password <span className="muted">(optional)</span>
            </label>
            <div className="input-affix">
              <input
                className="form-control"
                type={showCurrent ? 'text' : 'password'}
                autoComplete="current-password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="btn btn-xxs btn-ghost"
                onClick={() => setShowCurrent((v) => !v)}
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="form-hint">
              If your policy requires it, we can enforce this on the backend.
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">New password</label>
            <input
              className="form-control"
              type="password"
              autoComplete="new-password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="At least 8 chars, mixed case, number"
            />
            <StrengthBar />
          </div>

          <div className="form-field">
            <label className="form-label">Confirm new password</label>
            <input
              className="form-control"
              type="password"
              autoComplete="new-password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Re-enter new password"
            />
            {confirmPwd && confirmPwd !== newPwd && (
              <div className="form-error">Passwords do not match</div>
            )}
          </div>

          <div className="inline-actions" style={{ justifyContent: 'flex-end' }}>
            <button className="btn" disabled={!canSendCode || loading}>
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </div>
        </form>
      )}

      {stage === 'verify' && (
        <form className="form-grid-1" onSubmit={handleConfirmChange}>
          <div className="form-field">
            <label className="form-label">Enter 6-digit code</label>
            <div className="otp" onPaste={handleOtpPaste}>
              {Array.from({ length: OTP_LEN }).map((_, i) => (
                <input
                  key={i}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  className="otp-input"
                  value={otp[i]}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  ref={(el) => (inputsRef.current[i] = el)}
                />
              ))}
            </div>
            <div className="form-hint">We sent the code to your registered email address.</div>
          </div>

          <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                localStorage.setItem("updatePasswordStage","request")
                setStage('request')

              }}
              disabled={loading}
            >
              Back
            </button>
            <button
             type='submit'
            className="btn" disabled={!otpValid || loading}>
              {loading ? 'Confirming…' : 'Confirm change'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdatePassword;
