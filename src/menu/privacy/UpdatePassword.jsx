import React, { useCallback, useMemo, useRef, useState } from 'react';
import api from '../../lib/api';
import { toast } from 'react-toastify';
import './update-password.css';
import { useAuth } from '../../hooks/useAuth';


//TODO Add resend token

const OTP_LEN = 6;

const calcStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 5); // 0..5
};

const UpdatePassword = () => {
  // Step management
  const [stage, setStage] = useState('request'); // 'request' | 'verify'
  const [loading, setLoading] = useState(false);

  // Form state
  const [showCurrent, setShowCurrent] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');


  const {sendSixDigitCode,resetPasswordWithDigitCode, user} = useAuth();

  // OTP
  const [otp, setOtp] = useState(Array(OTP_LEN).fill(''));
  const inputsRef = useRef([]);

  const strength = useMemo(() => calcStrength(newPwd), [newPwd]);

  const newPwdValid = useMemo(() => {
    // basic policy (tweak as needed)
    if (newPwd.length < 8) return false;
    if (!/[A-Z]/.test(newPwd)) return false;
    if (!/[a-z]/.test(newPwd)) return false;
    if (!/\d/.test(newPwd)) return false;
    return true;
  }, [newPwd]);

  const canSendCode = useMemo(() => {
    if (!newPwdValid) return false;
    if (!confirmPwd || newPwd !== confirmPwd) return false;
    // If you want current password to be mandatory, uncomment:
    // if (!currentPwd) return false;
    return true;
  }, [newPwdValid, newPwd, confirmPwd /*, currentPwd*/]);

  const otpString = useMemo(() => otp.join(''), [otp]);
  const otpValid = useMemo(() => otpString.length === OTP_LEN && /^\d+$/.test(otpString), [otpString]);

  // --- handlers -------------------------------------------------------------

  const handleSendCode = useCallback(async (e) => {
    e.preventDefault();
    if (!canSendCode) return;
    setLoading(true);
    try {
      // placeholder: adjust to your API contract
      // Suggested payload: { current, next }
    //   await api.post('/auth/request-password-change', {
    //     current: currentPwd || undefined,
    //     next: newPwd,
    //   });

      await sendSixDigitCode(user.email);
      toast.success('Verification code sent to your email');
      setStage('verify');
      // focus first OTP box
      setTimeout(() => inputsRef.current?.[0]?.focus(), 50);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send verification code');
    } finally {
      setLoading(false);
    }
  }, [canSendCode, currentPwd, newPwd]);

  const handleConfirmChange = useCallback(async (e) => {
    e.preventDefault();
    if (!otpValid) return;
    setLoading(true);
    try {
      // placeholder: adjust to your API contract
      // Suggested payload: { code, next }
      await resetPasswordWithDigitCode({newPassword:newPwd, digitCodes: otpString})
      toast.success('Password updated successfully');
      // reset form to a clean state
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setOtp(Array(OTP_LEN).fill(''));
      setStage('request');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }, [otpValid, otpString, newPwd]);

  const handleOtpChange = (idx, char) => {
    if (!/^\d?$/.test(char)) return; // only digits
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
    const text = (e.clipboardData.getData('text') || '').trim().replace(/\D/g, '').slice(0, OTP_LEN);
    if (!text) return;
    e.preventDefault();
    const next = Array(OTP_LEN)
      .fill('')
      .map((_, i) => text[i] || '');
    setOtp(next);
    const focusIndex = Math.min(text.length, OTP_LEN - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const StrengthBar = () => (
    <div className="pwdcard-strength">
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
    <div className="pwdcard">
      <header className="pwdcard-head">
        <h2 className="pwdcard-title">Update Password</h2>
        <p className="pwdcard-sub">For your security, we'll email a verification code to confirm this change.</p>
      </header>

      {stage === 'request' && (
        <form className="pwdcard-grid" onSubmit={handleSendCode}>
          <div className="pwdcard-field">
            <label className="pwdcard-label">
              Current password <span className="pwdcard-optional">(optional)</span>
            </label>
            <div className="pwdcard-inputwrap">
              <input
                className="pwdcard-input"
                type={showCurrent ? 'text' : 'password'}
                autoComplete="current-password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="pwdcard-eye"
                onClick={() => setShowCurrent((v) => !v)}
                aria-label={showCurrent ? 'Hide password' : 'Show password'}
              >
                {showCurrent ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="pwdcard-hint">If your policy requires it, we can enforce this on the backend.</div>
          </div>

          <div className="pwdcard-field">
            <label className="pwdcard-label">New password</label>
            <input
              className="pwdcard-input"
              type="password"
              autoComplete="new-password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="At least 8 chars, mixed case, number"
            />
            <StrengthBar />
          </div>

          <div className="pwdcard-field">
            <label className="pwdcard-label">Confirm new password</label>
            <input
              className="pwdcard-input"
              type="password"
              autoComplete="new-password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Re-enter new password"
            />
            {confirmPwd && confirmPwd !== newPwd && (
              <div className="pwdcard-error">Passwords do not match</div>
            )}
          </div>

          <div className="pwdcard-actions">
            <button className="btn" disabled={!canSendCode || loading}>
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </div>
        </form>
      )}

      {stage === 'verify' && (
        <form className="pwdcard-grid" onSubmit={handleConfirmChange}>
          <div className="pwdcard-field">
            <label className="pwdcard-label">Enter 6-digit code</label>
            <div className="pwdcard-otp" onPaste={handleOtpPaste}>
              {Array.from({ length: OTP_LEN }).map((_, i) => (
                <input
                  key={i}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  className="pwdcard-otp-input"
                  value={otp[i]}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  ref={(el) => (inputsRef.current[i] = el)}
                />
              ))}
            </div>
            <div className="pwdcard-hint">We sent the code to your registered email address.</div>
          </div>

          <div className="pwdcard-actions">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => setStage('request')}
              disabled={loading}
            >
              Back
            </button>
            <button className="btn" disabled={!otpValid || loading}>
              {loading ? 'Confirming…' : 'Confirm change'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdatePassword;
