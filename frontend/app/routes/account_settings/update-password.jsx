

/**
 * @typedef {import("../../types/formError").FormError} FormError
 * @typedef {import("../../types/common").NullableString} NullableString
 * @typedef {import("../../types/authForm").UpdatePasswordForm} UpdatePasswordForm
 * @typedef {import("../../types/responseError").ResponseError} ResponseError
 */
import { Form, redirect, useActionData, useNavigation } from "react-router";
import formStyles from '../../styles/forms/forms.css?url';
import styles from "../../styles/auth/auth.css?url";
import { hasErrors, validateAuthForm, toErrorList } from "../auth/utils/authUtils";
import React, { useEffect, useState } from "react";
import { createServerApi } from "../../lib/api.server";
import { normaliseAuthGenericError, normaliseMessageResponse } from "../../features/auth/authTransformers";
import { OTP_LEN } from "./utils/accountSettingsUtils";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";
import UpdatePasswordVerifyStep from "./components/UpdatePasswordVerifyStep";
import UpdatePasswordRequestStep from "./components/UpdatePasswordRequestStep";
import { ensureServerSession } from "../../lib/session.server";
import { forwardSetCookie } from "../../lib/forwardSetCookie.server";

/**
 * What update password action returns
 * 
 * @typedef {Object} UpdatePasswordActionData
 * @property {boolean} [ok]
 * @property {"request"|"verify"|"done"} [stage]
 * @property {FormError} [fieldErrors]
 * @property {string} [formError]
 * @property {UpdatePasswordForm} [values]
 * @property {string} [message]
 */


/**
 * @typedef {import("../../types/common").OtpStatus} OtpStatus
 */

/**
 * Meta / Links
 */

export function meta() {
  return [{title: "Social Soko | Update Password"}]
}

export function links(){
  return [
    {rel: "stylesheet", href: formStyles},
    {rel: "stylesheet", href: styles}
  ]
}

/**
 *  loader
 * 
 */
// TODO:  Ensure user is authenticated, else redirect
export function loader(){
  return null
}

/**
 * Action
 * @param {{request: Request}} args
 */
export async function action({ request }) {
  const { success, user, headers } = await ensureServerSession(request);

  if (!success) {
    return redirect("/login", { headers });
  }

  const api = createServerApi(request);
  const formData = await request.formData();

  /** @type {FormError} */
  const fieldErrors = {};

  /** @type {UpdatePasswordForm} */
  const values = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    confirmPassword: String(formData.get("confirmPassword") || ""),
    otp: String(formData.get("otp") || ""),
  };

  /** @type {"sendCode"|"confirmChange"|"backToRequest"|""} */
  const intent = String(formData.get("_intent") || "");

  /* -------------------------------
   * INTENT: sendCode
   * ----------------------------- */
  if (intent === "sendCode") {
    const passwordErrors = validateAuthForm(values, "update_password_form");

    if (passwordErrors.password) {
      fieldErrors.password = passwordErrors.password;
    }

    if (passwordErrors.confirmPassword) {
      fieldErrors.confirmPassword = passwordErrors.confirmPassword;
    }

    if (passwordErrors.email) {
      fieldErrors.email = passwordErrors.email;
    }

    if (hasErrors(fieldErrors)) {
      return Response.json(
        {
          ok: false,
          stage: "request",
          fieldErrors,
          formError: "Please fix the errors below",
          values,
          message: "",
        },
        { status: 400, headers },
      );
    }

    try {
      const response = await api.post(
        "/auth/send-verification-digits-code",
        { email: values.email },
        { _skipRefresh: true },
      );

      // forward any new cookies (if backend set something)
      forwardSetCookie(response, headers);

      const normalised = normaliseMessageResponse(response);

      return Response.json(
        {
          ok: normalised.success,
          stage: "verify",
          fieldErrors: {},
          formError: "",
          values,
          message:
            normalised.message || "Verification code sent to your email.",
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
          formError:
            normalised.error || "Could not send verification code",
          values,
          message: "",
        },
        { status: normalised.status || 400, headers },
      );
    }
  }

  /* -------------------------------
   * INTENT: confirmChange
   * ----------------------------- */
  if (intent === "confirmChange") {
    const otpStr = (values.otp || "").trim().replace(/\D/g, "");
    values.otp = otpStr;

    if (!otpStr || otpStr.length !== OTP_LEN) {
      fieldErrors.otp = `Enter the ${OTP_LEN}-digit code sent to your email.`;
    }

    const passwordErrors = validateAuthForm(
      values,
      "update_password_form",
    );

    if (passwordErrors.password) {
      fieldErrors.password = passwordErrors.password;
    }

    if (passwordErrors.confirmPassword) {
      fieldErrors.confirmPassword = passwordErrors.confirmPassword;
    }

    if (hasErrors(fieldErrors)) {
      return Response.json(
        {
          ok: false,
          stage: "verify",
          fieldErrors,
          formError: "Please fix the errors below.",
          values,
          message: "",
        },
        { status: 400, headers },
      );
    }

    try {
      const response = await api.post(
        "/auth/reset-password-with-digit-code",
        { password: values.password, digitCodes: otpStr },
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
            email: values.email,
            password: "",
            confirmPassword: "",
            otp: "",
          },
          message: normalised.message || "Password updated successfully",
        },
        { status: 200, headers },
      );
    } catch (error) {
      /** @type {ResponseError} */
      const normalised = normaliseAuthGenericError(
        error,
        "Failed to reset password",
      );

      return Response.json(
        {
          ok: false,
          stage: "verify",
          fieldErrors: {},
          formError: normalised.error,
          values,
          message: "",
        },
        { status: normalised.status || 400, headers },
      );
    }
  }

  /* -------------------------------
   * INTENT: backToRequest
   * ----------------------------- */
  if (intent === "backToRequest") {
    return Response.json(
      {
        ok: true,
        stage: "request",
        fieldErrors: {},
        formError: "",
        values: {
          email: values.email,
          password: "",
          confirmPassword: "",
          otp: "",
        },
        message: "",
      },
      { status: 200, headers },
    );
  }

  // Fallback for unknown intent
  return Response.json(
    {
      ok: false,
      stage: "request",
      fieldErrors,
      formError: "Invalid password update request.",
      values,
      message: "",
    },
    { status: 400, headers },
  );
}



export default function UpdatePasswordRoute() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const user = useSelector(selectAuthUser);

  /** @type {UpdatePasswordActionData | undefined} */
  const actionData = useActionData();

  /**@type {OtpStatus} */
  const stage = actionData?.stage || "request";

  console.log(stage);

  /** @type {FormError} */
  const fieldErrors = actionData?.fieldErrors || {};
  const formError = actionData?.formError || "";
  const message = actionData?.message || "";

  /** @type {UpdatePasswordForm} */
  const values =
    actionData?.values || {
      email: user?.email || "",
      password: "",
      confirmPassword: "",
      otp: "",
    };



  useEffect(() => {
    if (!formError && Object.keys(fieldErrors).length === 0) {
      return;
    }

    const el =
      document.querySelector(".auth-error") ||
      document.querySelector(".form-error");

    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [formError, fieldErrors]);

  const isDone = stage === "done" && actionData?.ok;

  if (!user) {
    return (
      <div className="card card--cozy security-card">
        <p className="form-hint">
          You must be logged in to update your password.
        </p>
      </div>
    );
  }

  return (
    <div className="card card--cozy security-card">
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">Update password</h2>
          <p className="section-sub">
            We'll send a verification code to your email to confirm this
            change.
          </p>
        </div>
      </header>

      {/* Global banners */}
      {formError && <div className="auth-error">{formError}</div>}
      {message && !formError && (
        <div className="auth-success">{message}</div>
      )}

      {isDone && (
        <div className="form-field-full">
          <p className="form-hint">
            Your password has been updated. You may need to log in again with
            your new password.
          </p>
        </div>
      )}

      {!isDone && stage === "request" && (
        <UpdatePasswordRequestStep
          values={values}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
        />
      )}

      {!isDone && stage === "verify" && (
        <UpdatePasswordVerifyStep
          values={values}
          fieldErrors={fieldErrors}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
