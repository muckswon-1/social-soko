// app/menu/profile/UpdateEmail.jsx
import React, { useEffect, useState } from "react";
import {
  redirect,
  useActionData,
  useNavigation,
  useNavigate,
} from "react-router";

import formStyles from "../../styles/forms/forms.css?url";
import authStyles from "../../styles/auth/auth.css?url";

import { ensureServerSession } from "../../lib/session.server";
import { createServerApi } from "../../lib/api.server";
import UpdateEmailRequestStep from "./components/UpdateEmailRequestStep";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";
import { hasErrors, validateAuthForm } from "../auth/utils/authUtils";
import { forwardSetCookie } from "../../lib/forwardSetCookie.server";
import {
  normaliseAuthGenericError,
  normaliseMessageResponse,
} from "../../features/auth/authTransformers";
import UpdateEmailVerifyStep from "./components/UpdateEmailVerifyStep";
import { OTP_LEN } from "./utils/accountSettingsUtils";

/**
 * @typedef {import("../../types/authForm").UpdateEmailForm} UpdateEmailForm
 * @typedef {import("../../types/formError").FormError} FormError
 * @typedef {import("../../types/responseError").ResponseError} ResponseError
 */

/**
 * @typedef {Object} UpdateEmailActionData
 * @property {boolean} [ok]
 * @property {"request"|"verify"|"done"} [stage]
 * @property {FormError} [fieldErrors]
 * @property {string} [formError]
 * @property {UpdateEmailForm} [values]
 * @property {string} [message]
 */

export function links() {
  return [
    { rel: "stylesheet", href: formStyles },
    { rel: "stylesheet", href: authStyles },
  ];
}

export function loader() {
  return null;
}

/** @param {{request: Request}} args */
export async function action({ request }) {
  const { success, user, headers } = await ensureServerSession(request);

  if (!success || !user) {
    return redirect("/login", { headers });
  }

  const api = createServerApi(request);
  const formData = await request.formData();

  /** @type {FormError} */
  const fieldErrors = {};

  /** @type {UpdateEmailForm} */
  const updateEmailValues = {
    currentEmail: String(formData.get("currentEmail") || user.email || ""),
    newEmail: String(formData.get("newEmail") || ""),
    confirmEmail: String(formData.get("confirmEmail") || ""),
    otp: String(formData.get("otp") || ""),
  };

  /** @type {"sendCode"|"confirmChange"|"backToRequest"|"unknown"} */
  const intent = String(formData.get("_intent") || "unknown");

  // Go back to request stage
  if (intent === "backToRequest") {
    return Response.json(
      {
        ok: true,
        stage: "request",
        fieldErrors: {},
        formError: "",
        values: {
          ...updateEmailValues,
          otp: "",
        },
        message: "",
      },
      { status: 200, headers },
    );
  }

  // ------------------ sendCode ------------------
  if (intent === "sendCode") {
    const valuesForValidation = {
      email: updateEmailValues.newEmail,
      confirmEmail: updateEmailValues.confirmEmail,
    };

    const emailErrors = validateAuthForm(
      valuesForValidation,
      "update_email_form",
    );

    if (emailErrors.email) {
      fieldErrors.newEmail = emailErrors.email;
    }
    if (emailErrors.confirmEmail) {
      fieldErrors.confirmEmail = emailErrors.confirmEmail;
    }

    if (hasErrors(fieldErrors)) {
      return Response.json(
        {
          ok: false,
          stage: "request",
          fieldErrors,
          formError: "Please fix the errors below",
          values: { ...updateEmailValues },
          message: "",
        },
        { status: 400, headers },
      );
    }

    try {
      const response = await api.post(
        "/auth/send-verification-digits-code",
        { email: updateEmailValues.currentEmail },
        { _skipRefresh: true },
      );

      forwardSetCookie(response, headers);

      const normalised = normaliseMessageResponse(response);

      return Response.json(
        {
          ok: true,
          stage: "verify",
          fieldErrors: {},
          formError: "",
          values: {
            ...updateEmailValues,
          },
          message: normalised.message || "Verification code sent to your email.",
        },
        { status: 200, headers },
      );
    } catch (error) {
      /** @type {ResponseError} */
      const normalised = normaliseAuthGenericError(
        error,
        "Could not send verification code",
      );

      return Response.json(
        {
          ok: false,
          stage: "request",
          fieldErrors: {},
          formError: normalised.error,
          values: { ...updateEmailValues },
          message: "",
        },
        { status: normalised.status || 400, headers },
      );
    }
  }

  // ------------------ confirmChange ------------------
  if (intent === "confirmChange") {
    const otpStr = (updateEmailValues.otp || "").trim().replace(/\D/g, "");

    if (!otpStr || otpStr.length !== OTP_LEN) {
      fieldErrors.otp = `Enter the ${OTP_LEN}-digit code sent to your email.`;
    }

    if (hasErrors(fieldErrors)) {
      return Response.json(
        {
          ok: false,
          stage: "verify",
          fieldErrors,
          formError: "Please fix the errors below.",
          values: updateEmailValues,
          message: "",
        },
        { status: 400, headers },
      );
    }

    try {
      const response = await api.post(
        "/auth/email-update-with-digit-code",
        { email: updateEmailValues.newEmail, digitCodes: otpStr },
        { _skipRefresh: true },
      );

      forwardSetCookie(response, headers);

      const normalised = normaliseMessageResponse(response);

      return Response.json(
        {
          ok: normalised.success,
          stage: "done",
          fieldErrors: {},
          formError: "",
          values: {
            currentEmail: updateEmailValues.newEmail.trim(),
            newEmail: "",
            confirmEmail: "",
            otp: "",
          },
          message:
            normalised.message ||
            "Email updated successfully. You may need to login again.",
        },
        { status: 200, headers },
      );
    } catch (error) {
      /** @type {ResponseError} */
      const normalised = normaliseAuthGenericError(
        error,
        "Failed to update email",
      );

      return Response.json(
        {
          ok: false,
          stage: "verify",
          fieldErrors: {},
          formError: normalised.error || "Failed to update email.",
          values: updateEmailValues,
          message: "",
        },
        { status: normalised.status || 400, headers },
      );
    }
  }

  // Fallback for unknown intent
  return Response.json(
    {
      ok: false,
      stage: "request",
      fieldErrors,
      formError: "Invalid email update request.",
      values: updateEmailValues,
      message: "",
    },
    { status: 400 },
  );
}

/**
 * Route component: orchestrates stages + renders the two sub-components
 */
export default function UpdateEmailRoute() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const navigate = useNavigate();

  const user = useSelector(selectAuthUser);

  /** @type {UpdateEmailActionData | undefined} */
  const actionData = useActionData();

  const stage = actionData?.stage || "request";

  /** @type {FormError} */
  const fieldErrors = actionData?.fieldErrors || {};
  const formError = actionData?.formError || "";
  const message = actionData?.message || "";

  /** @type {UpdateEmailForm} */
  const values =
    actionData?.values || {
      currentEmail: user?.email || "",
      newEmail: "",
      confirmEmail: "",
      otp: "",
    };

  const isDone = stage === "done" && actionData?.ok;

  // ⏱ countdown state for redirect
  const [countdown, setCountdown] = useState(5);

  // Reset countdown whenever we reach done state
  useEffect(() => {
    if (isDone) {
      setCountdown(5);
    }
  }, [isDone]);

  // Redirect after countdown hits 0
  useEffect(() => {
    if (!isDone) return;
    if (countdown === 0) {
      navigate("/login", { replace: true });
      return;
    }

    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [isDone, countdown, navigate]);

  // Scroll to error similar to login / update-password
  useEffect(() => {
    if (!formError && Object.keys(fieldErrors).length === 0) return;

    const el =
      document.querySelector(".auth-error") ||
      document.querySelector(".form-error");

    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [formError, fieldErrors]);

  if (!user) {
    return (
      <div className="card card--cozy security-card">
        <p className="form-hint">
          You must be logged in to update your email.
        </p>
      </div>
    );
  }

  return (
    <div className="card card--cozy security-card">
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">Update email</h2>
          <p className="section-sub">
            We'll verify this change using a 6-digit code sent to your
            current email.
          </p>
        </div>
      </header>

      {/* Global banners */}
      {formError && <div className="auth-error">{formError}</div>}
      {message && !formError && (
        <div className="auth-success">
          {message}
          {isDone && (
            <>
              <br />
              <small>
                You&apos;ll be redirected to login in {countdown} seconds.
              </small>
            </>
          )}
        </div>
      )}

      {isDone && (
        <div className="form-field-full">
          <p className="form-hint">
            Your email has been updated. You may need to log in again using your
            new email address.
          </p>
        </div>
      )}

      {!isDone && stage === "request" && (
        <UpdateEmailRequestStep
          values={values}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
        />
      )}

      {!isDone && stage === "verify" && (
        <UpdateEmailVerifyStep
          values={values}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
