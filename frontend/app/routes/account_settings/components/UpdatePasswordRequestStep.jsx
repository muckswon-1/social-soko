// app/menu/profile/UpdatePasswordRequestStep.jsx
import React, { useEffect, useState } from "react";
import { Form } from "react-router";
import { toErrorList } from "../../auth/utils/authUtils";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../../features/auth/authSlice";

/**
 * @typedef {import("../../../types/formError").FormError} FormError
 */
/**
 * @typedef {import("../../../types/authForm").UpdatePasswordForm} UpdatePasswordForm
 *  (or copy the typedef here if you prefer)
 */

/**
 * @param {{
 *   values: UpdatePasswordForm,
 *   fieldErrors: FormError,
 *   isSubmitting: boolean
 * }} props
 */
export default function UpdatePasswordRequestStep({
  values,
  fieldErrors,
  isSubmitting,
}) {

    const [password, setPassword] = useState(values.password || "");
    const [confirmPassword, setConfirmPassword] = useState(values.confirmPassword || "");


 


  const passwordErrorItems = toErrorList(fieldErrors.password);

  let confirmPwdError = "";
  if (Array.isArray(fieldErrors.confirmPassword)) {
    confirmPwdError = fieldErrors.confirmPassword[0] || "";
  } else if (typeof fieldErrors.confirmPassword === "string") {
    confirmPwdError = fieldErrors.confirmPassword;
  }


  const canSendCode = !!password && !!confirmPassword && !isSubmitting;

   console.log("Can send", canSendCode)
    console.log("passowrd",password);
    console.log("confirm password",confirmPassword);


       //sync server-side values 
    useEffect(() => {
        setPassword(values.password || "");
        setConfirmPassword(values.confirmPassword || "");
    },[values.password, values.confirmPassword]);



  return (
    <Form method="post" className="form-grid-1" noValidate>
      {/* Hidden email so server action knows who to send to */}
      <input type="hidden" name="email" value={values.email || ""} />

      {/* New password */}
      <div className="form-field">
        <label className="form-label" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          className="form-control"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          placeholder="At least 8 chars, mixed case, number"
        />
        {passwordErrorItems.length > 0 && (
          <div className="form-error">
            <ul className="form-error-list">
              {passwordErrorItems.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="form-field">
        <label className="form-label" htmlFor="confirmPassword">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          className="form-control"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
          placeholder="Re-enter new password"
        />
        {confirmPwdError && (
          <div className="form-error">{confirmPwdError}</div>
        )}
      </div>

      {/* Email hint */}
      {values.email && (
        <p className="form-hint">
          We'll send a 6-digit code to{" "}
          <span className="kv-mono">{values.email}</span>.
        </p>
      )}

      <div className="inline-actions form-actions-right">
        <button
          type="submit"
          className={`btn btn-primary ${!canSendCode && "btn-disabled"}`}
          name="_intent"
          value="sendCode"
          disabled={!canSendCode}
        >
          {isSubmitting ? "Sending…" : "Send code"}
        </button>
      </div>
    </Form>
  );
}
