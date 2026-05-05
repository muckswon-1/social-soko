import React from "react";

export const OTP_LEN = 6;

/**
 * Turn an array pf single-character strings into continuous OTP string
 * @param {string[]} otpArray
 * @returns {string}
 */
export function buildOtpString(otpArray){
    return (otpArray || []).join("");
}

/**
 * Normalise a filed error (string | string[] | undefined) into an array od strings
 * @param {string | string[] | undefined} value
 * @returns {string[]}
 */
export function normaliseFieldToList(value){
    if(!value) return [];
    if(Array.isArray(value)) return value;
    return [value];
}

/**
 * Handle a single OTP input change
 * @param {number} idx
 * @param {string} char
 * @param {string[]} otp
 * @param {(next: string[]) => void} setOtp
 * @param {React.MutableRefObject<(HTMLInputElement | null)[]>} inputRef
 */
export function handleOtpChange(idx, char, otp, setOtp, inputRef){
    if (!/^\d?$/.test(char)) return;
    const next = [...otp];
    next[idx] = char;
    setOtp(next);
    if(char && idx < OTP_LEN - 1){
        inputRef.current[idx +1]?.focus();
    }
}

/**
 * Handle keyboard navigation inside OTP inputs
 *
 * @param {number} idx
 * @param {React.KeyboardEvent<HTMLInputElement>} e
 * @param {string[]} otp
 * @param {React.MutableRefObject<(HTMLInputElement|null)[]>} inputsRef
 */
export function handleOtpKeyDown(idx, e, otp, inputsRef) {
  if (e.key === "Backspace" && !otp[idx] && idx > 0) {
    inputsRef.current[idx - 1]?.focus();
  }
  if (e.key === "ArrowLeft" && idx > 0) {
    inputsRef.current[idx - 1]?.focus();
  }
  if (e.key === "ArrowRight" && idx < OTP_LEN - 1) {
    inputsRef.current[idx + 1]?.focus();
  }
}

/**
 * Handle paste event for OTP fields
 *
 * @param {React.ClipboardEvent<HTMLDivElement>} e
 * @param {(next: string[]) => void} setOtp
 * @param {React.MutableRefObject<(HTMLInputElement|null)[]>} inputsRef
 */
export function handleOtpPaste(e, setOtp, inputsRef) {
  const text = (e.clipboardData.getData("text") || "")
    .trim()
    .replace(/\D/g, "")
    .slice(0, OTP_LEN);
  if (!text) return;

  e.preventDefault();
  const next = Array(OTP_LEN)
    .fill("")
    .map((_, i) => text[i] || "");
  setOtp(next);
  const focusIndex = Math.min(text.length, OTP_LEN - 1);
  inputsRef.current[focusIndex]?.focus();
}