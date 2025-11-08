// src/menu/profile/UpdateEmail.jsx
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import '../../styles/inline-tabs-reusable.css';
import { useDispatch, useSelector } from 'react-redux';
import { authUserSelector } from '../../features/auth/authSlice';
import { logout, sendSixDigitCode, updateEmailWithDigitCode } from '../../features/auth/authThunk';



const OTP_LEN = 6;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const UpdateEmail = () => {


  const user = useSelector(authUserSelector);
  const dispatch = useDispatch();

  const [stage, setStage] = useState(() => localStorage.getItem("updateEmailStage") || 'request'); // 'request' | 'verify'
  const [loading, setLoading] = useState(false);

  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [otp, setOtp] = useState(Array(OTP_LEN).fill(''));
  const inputsRef = useRef([]);

  const [resendIn, setResendIn] = useState(0);
  const canResend = resendIn === 0;

  const emailValid = useMemo(() => emailRe.test(newEmail), [newEmail]);
  const emailsMatch = useMemo(
    () => newEmail && confirmEmail && newEmail.trim() === confirmEmail.trim(),
    [newEmail, confirmEmail]
  );
  const canSend = emailValid && emailsMatch && newEmail !== user?.email;

  const otpString = useMemo(() => otp.join(''), [otp]);
  const otpValid = useMemo(() => otpString.length === OTP_LEN && /^\d+$/.test(otpString), [otpString]);

  // countdown helper
  const startCountdown = useCallback((sec = 60) => {
    setResendIn(sec);
    const id = setInterval(() => {
      setResendIn((t) => {
        if (t <= 1) { clearInterval(id); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  const handleSendCode = useCallback(async (e) => {
    e.preventDefault();
    if (!canSend) return;
    setLoading(true);
    try {
      // Send to the account email (server sends code and handles the flow)
      const res = await dispatch(sendSixDigitCode({email:user.email})).unwrap();
      if (!res?.success) throw new Error(res?.error || 'Failed to send code');
      console.log(res.success);
      toast.success('Verification code sent');
      localStorage.setItem("updateEmailStage",'verify');
      setStage("verify");
      startCountdown(60);
      setTimeout(() => inputsRef.current?.[0]?.focus(), 40);
    } catch (err) {
      toast.error(err?.message || 'Could not send verification code');
      localStorage.removeItem("updateEmailStage");
    } finally {
      setLoading(false);
    }
  }, [canSend, user?.email, sendSixDigitCode, startCountdown]);

  const handleConfirmChange = useCallback(async (e) => {
    e.preventDefault();
    if (!otpValid) return;
    setLoading(true);
    try {
      const res = await dispatch(updateEmailWithDigitCode({
        email: newEmail.trim(),
        digitCodes: otpString,
      })).unwrap();
      if (!res?.success) throw new Error(res?.error || 'Update failed');

      toast.success('Email updated successfully. Please login');
      setOtp(Array(OTP_LEN).fill(''));
      localStorage.removeItem("updateEmailStage");
      setStage('request');
      setResendIn(0);
      setConfirmEmail('');
       dispatch(logout());
      // keep newEmail so the user sees what they changed to
    } catch (err) {
      toast.error(err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }, [otpValid, otpString, newEmail, updateEmailWithDigitCode]);

  // OTP handlers
  const onOtpChange = (i, ch) => {
    if (!/^\d?$/.test(ch)) return;
    const next = [...otp];
    next[i] = ch;
    setOtp(next);
    if (ch && i < OTP_LEN - 1) inputsRef.current[i + 1]?.focus();
  };

  const onOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < OTP_LEN - 1) inputsRef.current[i + 1]?.focus();
  };

  const onOtpPaste = (e) => {
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, OTP_LEN);
    if (!text) return;
    e.preventDefault();
    const filled = Array(OTP_LEN).fill('').map((_, idx) => text[idx] || '');
    setOtp(filled);
    inputsRef.current[Math.min(text.length, OTP_LEN - 1)]?.focus();
  };

  const resend = async () => {
    if (!canResend || !emailValid) return;
    try {
      const res = await dispatch(sendSixDigitCode(newEmail.trim())).unwrap();
      if (!res?.success) throw new Error(res?.error || 'Resend failed');
      toast.info('Code resent');
      startCountdown(60);
    } catch (err) {
      toast.error(err?.message || 'Could not resend code');
    }
  };

  console.log(stage);

  return (
    <div className="card card--cozy">
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">Update Email</h2>
          <p className="section-sub">
            We'll send a 6-digit code to the <b>new address</b> to confirm you own it.
            Your current email is <span className="kv-mono">{user?.email}</span>.
          </p>
        </div>
      </header>

      {stage === 'request' && (
        <form className="form-grid-2" onSubmit={handleSendCode}>
          <label className="form-field">
            <span className="form-label">New email</span>
            <input
              className="form-control"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
            />
            {!newEmail ? null :
              !emailValid ? <div className="form-error">Enter a valid email</div> :
              (newEmail === user?.email) ? <div className="form-error">This is your current email</div> : null}
          </label>

          <label className="form-field">
            <span className="form-label">Confirm new email</span>
            <input
              className="form-control"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Re-enter new email"
              autoComplete="email"
            />
            {confirmEmail && !emailsMatch && (
              <div className="form-error">Emails do not match</div>
            )}
          </label>

          <div className="inline-actions" style={{ gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
            <button className="btn" disabled={!canSend || loading}>
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </div>
        </form>
      )}

      {stage === 'verify' && (
        <form className="form-grid-1" onSubmit={handleConfirmChange}>
          <div className="form-field">
            <span className="form-label">Enter 6-digit code</span>
            <div className="otp" onPaste={onOtpPaste}>
              {Array.from({ length: OTP_LEN }).map((_, i) => (
                <input
                  key={i}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  className="otp-input"
                  value={otp[i]}
                  onChange={(e) => onOtpChange(i, e.target.value)}
                  onKeyDown={(e) => onOtpKeyDown(i, e)}
                  ref={(el) => (inputsRef.current[i] = el)}
                />
              ))}
            </div>
            <div className="form-hint">
              Code sent to <b>{user.email}</b>.{' '}
              {canResend ? (
                <button type="button" className="link-btn" onClick={resend}>Resend code</button>
              ) : (
                <>Resend in {resendIn}s</>
              )}
            </div>
          </div>

          <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" type="button" onClick={() => {
              setStage('request');
              localStorage.removeItem("updateEmailStage");
            
            }
              
              } disabled={loading}>
              Back
            </button>
            <button className="btn" disabled={!otpValid || loading}>
              {loading ? 'Confirming…' : 'Confirm email change'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateEmail;
