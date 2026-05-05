// app/menu/profile/UpdatePasswordVerifyStep.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Form } from "react-router";

import {
  OTP_LEN,
  buildOtpString,
  handleOtpChange,
  handleOtpKeyDown,
  handleOtpPaste,
  normaliseFieldToList,
} from "../utils/accountSettingsUtils";

/**
 * @typedef {import("../../../types/formError").FormError} FormError
 * @typedef {import("../../../types/authForm").UpdatePasswordForm} UpdatePasswordForm
 * 
 */

/**
 * @param {{
 *   values: UpdatePasswordForm,
 *   fieldErrors: FormError,
 *   isSubmitting: boolean
 * }} props
 */
export default function UpdatePasswordVerifyStep({
  values,
  fieldErrors,
  isSubmitting,
}) {
  const [otp, setOtp] = useState(Array(OTP_LEN).fill(""));
  const inputsRef = useRef(/** @type {(HTMLInputElement|null)[]} */ ([]));

  const otpString = useMemo(() => buildOtpString(otp), [otp]);
  const otpErrorItems = normaliseFieldToList(fieldErrors.otp);
  const otpValid =
    otpString.length === OTP_LEN && /^\d+$/.test(otpString) && !isSubmitting;

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const onOtpChange = (idx, char) => {
    handleOtpChange(idx, char, otp, setOtp, inputsRef);
  };

  const onOtpKeyDown = (idx, e) => {
    handleOtpKeyDown(idx, e, otp, inputsRef);
  };

  const onOtpPaste = (e) => {
    handleOtpPaste(e, setOtp, inputsRef);
  };

  return (
    <Form method="post" className="form-grid-1" noValidate>
      {/* Preserve values so confirmChange action has everything it needs */}
      <input type="hidden" name="email" value={values.email || ""} />
      <input type="hidden" name="password" value={values.password || ""} />
      <input
        type="hidden"
        name="confirmPassword"
        value={values.confirmPassword || ""}
      />
      <input type="hidden" name="otp" value={otpString} />

      <div className="form-field">
        <label className="form-label">Enter 6-digit code</label>
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
              disabled={isSubmitting}
            />
          ))}
        </div>
        <div className="form-hint">
          We sent this code to your registered email.
        </div>
        {otpErrorItems.length > 0 && (
          <div className="form-error">
            <ul className="form-error-list">
              {otpErrorItems.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        className="inline-actions"
        style={{ justifyContent: "space-between" }}
      >
        <button
          className="btn btn-ghost"
          type="submit"
          name="_intent"
          value="backToRequest"
          disabled={isSubmitting}
        >
          Back
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          name="_intent"
          value="confirmChange"
          disabled={!otpValid}
        >
          {isSubmitting ? "Confirming…" : "Confirm change"}
        </button>
      </div>
    </Form>
  );
}
