import React from "react";

/**
 * @param {{ strength: number, hasPassword: boolean }} props
 */
export default function PasswordStrengthBar({ strength, hasPassword }) {
  const label = !hasPassword
    ? "Enter a password"
    : strength <= 2
    ? "Weak"
    : strength === 3
    ? "Fair"
    : strength === 4
    ? "Strong"
    : "Very strong";

  return (
    <div className="strength">
      <div className={`bar ${strength >= 1 ? "on" : ""}`} />
      <div className={`bar ${strength >= 2 ? "on" : ""}`} />
      <div className={`bar ${strength >= 3 ? "on" : ""}`} />
      <div className={`bar ${strength >= 4 ? "on" : ""}`} />
      <div className={`bar ${strength >= 5 ? "on" : ""}`} />
      <span className="label">{label}</span>
    </div>
  );
}
