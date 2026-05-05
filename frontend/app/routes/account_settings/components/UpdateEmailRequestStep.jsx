import React, { useEffect, useState } from "react";
import { Form } from "react-router";

import { toErrorList } from "../../auth/utils/authUtils";

/**
 * @typedef {import("../../../types/formError").FormError} FormError
 * @typedef {import("../../../types/authForm").UpdateEmailForm} UpdateEmailForm
 */

/**
 * @param {{
 *   values: UpdateEmailForm,
 *   fieldErrors: FormError,
 *   isSubmitting: boolean
 * }} props
 */
export default function UpdateEmailRequestStep({
  values,
  fieldErrors,
  isSubmitting,
}) {
  const [newEmail, setNewEmail] = useState(values.newEmail || "");
  const [confirmEmail, setConfirmEmail] = useState(
    values.confirmEmail || "",
  );

  const currentEmail = values.currentEmail || "";

  // Convert server errors to arrays for rendering
  const newEmailErrorItems = toErrorList(fieldErrors.newEmail);
  const confirmEmailErrorItems = toErrorList(fieldErrors.confirmEmail);

  // Minimal client-side check: only disable button if fields are empty or submitting.
  const canSendCode =
    !!newEmail && !!confirmEmail && !isSubmitting;

  // Keep local state in sync with server-side values (e.g. on failed submission)
  useEffect(() => {
    setNewEmail(values.newEmail || "");
    setConfirmEmail(values.confirmEmail || "");
  }, [values.newEmail, values.confirmEmail]);

  return (
    <Form method="post" className="form-grid-2" noValidate>
      {/* Hidden field: backend always needs currentEmail */}
      <input
        type="hidden"
        name="currentEmail"
        value={currentEmail}
      />

      {/* New email */}
      <div className="form-field">
        <label className="form-label" htmlFor="newEmail">
          New email
        </label>
        <input
          id="newEmail"
          name="newEmail"
          className="form-control"
          type="email"
          autoComplete="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          disabled={isSubmitting}
          placeholder="name@example.com"
        />

        {/* SERVER-SIDE ERRORS ONLY */}
        {newEmailErrorItems.length > 0 && (
          <div className="form-error">
            <ul className="form-error-list">
              {newEmailErrorItems.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Confirm email */}
      <div className="form-field">
        <label className="form-label" htmlFor="confirmEmail">
          Confirm new email
        </label>
        <input
          id="confirmEmail"
          name="confirmEmail"
          className="form-control"
          type="email"
          autoComplete="email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          disabled={isSubmitting}
          placeholder="Re-enter new email"
        />

        {/* SERVER-SIDE ERRORS ONLY */}
        {confirmEmailErrorItems.length > 0 && (
          <div className="form-error">
            <ul className="form-error-list">
              {confirmEmailErrorItems.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Informational helper */}
      {currentEmail && (
        <p className="form-hint form-field-full">
          Current email: <span className="kv-mono">{currentEmail}</span>
        </p>
      )}

      <div className="inline-actions form-actions-right">
        <button
          type="submit"
          className={`btn btn-primary ${
            !canSendCode ? "btn-disabled" : ""
          }`}
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
