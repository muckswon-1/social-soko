import React, { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import './update-email.css';

const OTP_LEN = 6;
const emailRe =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const UpdateEmail = () => {
  const { user, sendSixDigitCode, updateEmailWithDigitCode } = useAuth();

  const [stage, setStage] = useState('request'); // 'request' | 'verify'
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
  const otpValid = useMemo(
    () => otpString.length === OTP_LEN && /^\d+$/.test(otpString),
    [otpString]
  );

  // countdown helper
  const startCountdown = useCallback((sec = 60) => {
    setResendIn(sec);
    const id = setInterval(() => {
      setResendIn((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const handleSendCode = useCallback(async (e) => {
    e.preventDefault();
    if (!canSend) return;
    setLoading(true);
    try {
      // Send email to email on account for security
      const res = await sendSixDigitCode(user.email);

      if (!res?.success) throw new Error(res?.error || 'Failed to send code');
      toast.success('Verification code sent to the new email');
      setStage('verify');
      startCountdown(60);
      setTimeout(() => inputsRef.current?.[0]?.focus(), 40);
    } catch (err) {
      toast.error(err?.message || 'Could not send verification code');
    } finally {
      setLoading(false);
    }
  }, [canSend, newEmail, sendSixDigitCode, startCountdown]);

  const handleConfirmChange = useCallback(async (e) => {
    e.preventDefault();
    if (!otpValid) return;
    setLoading(true);
    try {
      const res = await updateEmailWithDigitCode({
        newEmail: newEmail.trim(),
        digitCodes: otpString,
      });

      console.log(res);
      
      if (!res?.success) throw new Error(res?.error || 'Update failed');

      toast.success('Email updated successfully');
      // Optional: notify old email is handled server-side
      setOtp(Array(OTP_LEN).fill(''));
      setStage('request');
      setResendIn(0);
      setConfirmEmail('');
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
      const res = await sendSixDigitCode(newEmail.trim());
      if (!res?.success) throw new Error(res?.error || 'Resend failed');
      toast.info('Code resent');
      startCountdown(60);
    } catch (err) {
      toast.error(err?.message || 'Could not resend code');
    }
  };

  return (
    <div className="emailupdate">
      <header className="emailupdate-head">
        <h2 className="emailupdate-title">Update Email</h2>
        <p className="emailupdate-sub">
          We’ll send a 6-digit code to the <b>new address</b> to confirm you own it.
          Your current email is <span className="emailupdate-current">{user?.email}</span>.
        </p>
      </header>

      {stage === 'request' && (
        <form className="emailupdate-grid" onSubmit={handleSendCode}>
          <div className="emailupdate-field">
            <label className="emailupdate-label">New email</label>
            <input
              className="emailupdate-input"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
            />
            {!newEmail ? null :
              !emailValid ? <div className="emailupdate-error">Enter a valid email</div> :
              (newEmail === user?.email) ? <div className="emailupdate-error">This is your current email</div> : null}
          </div>

          <div className="emailupdate-field">
            <label className="emailupdate-label">Confirm new email</label>
            <input
              className="emailupdate-input"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Re-enter new email"
              autoComplete="email"
            />
            {confirmEmail && !emailsMatch && (
              <div className="emailupdate-error">Emails do not match</div>
            )}
          </div>

          <div className="emailupdate-actions">
            <button className="btn" disabled={!canSend || loading}>
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </div>
        </form>
      )}

      {stage === 'verify' && (
        <form className="emailupdate-grid" onSubmit={handleConfirmChange}>
          <div className="emailupdate-field">
            <label className="emailupdate-label">Enter 6-digit code</label>
            <div className="emailupdate-otp" onPaste={onOtpPaste}>
              {Array.from({ length: OTP_LEN }).map((_, i) => (
                <input
                  key={i}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  className="emailupdate-otp-input"
                  value={otp[i]}
                  onChange={(e) => onOtpChange(i, e.target.value)}
                  onKeyDown={(e) => onOtpKeyDown(i, e)}
                  ref={(el) => (inputsRef.current[i] = el)}
                />
              ))}
            </div>
            <div className="emailupdate-hint">
              Code sent to <b>{newEmail}</b>. {canResend ? (
                <button type="button" className="linklike" onClick={resend}>Resend code</button>
              ) : (
                <>Resend in {resendIn}s</>
              )}
            </div>
          </div>

          <div className="emailupdate-actions">
            <button className="btn btn-ghost" type="button" onClick={() => setStage('request')} disabled={loading}>
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
