import React, { useEffect, useState, useRef } from "react";

import "../../styles/components/verify-email-token-modal.css";
import { useGenerateVerifyEmailTokenMutation } from "../../services/adminVerifyTokensApi";

/**
 * Props:
 * - email: string (user's email)
 * - onClose: () => void
 */
export default function VerifyEmailTokenModal({ email, onClose }) {
  const [
    generateToken,
    { data, isLoading, isError, error, isSuccess },
  ] = useGenerateVerifyEmailTokenMutation();

  const [copyStatus, setCopyStatus] = useState("");
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if(!email) return;
    if(hasRequestedRef.current) return;

    hasRequestedRef.current = true;
   
      generateToken({userEmail: email});
  
    
  }, [email, generateToken]);

  const token = data?.token || "";

  const handleCopy = async () => {
    if (!token) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(token);
        setCopyStatus("Copied!");
      } else {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = token;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopyStatus("Copied!");
      }

      setTimeout(() => setCopyStatus(""), 2000);
    } catch (e) {
      console.error("Failed to copy token", e);
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="verify-token-overlay">
      <div className="verify-token-modal">
        {/* Header */}
        <div className="verify-token-header">
          <div>
            <h2 className="verify-token-title">Verification Token</h2>
            <p className="verify-token-subtitle">
              For: <span className="verify-token-mono">{email}</span>
            </p>
          </div>

          <button
            type="button"
            className="btn btn-ghost verify-token-close-btn"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="verify-token-body">
          {isLoading && (
            <p className="verify-token-status">Generating token…</p>
          )}

          {isError && (
            <div className="verify-token-error-block">
              <p className="verify-token-error-title">
                Failed to generate token
              </p>
              <pre className="verify-token-error-pre">
                {JSON.stringify(error?.data || error, null, 2)}
              </pre>
            </div>
          )}

          {isSuccess && token && (
            <>
              <p className="verify-token-helper">
                Use this token in your email parameters or JSON payload. It will
                typically be valid for a limited time (e.g. 60 minutes).
              </p>

              <div className="verify-token-box">
                <code className="verify-token-code">{token}</code>
              </div>

              <div className="verify-token-actions">
                <button
                  type="button"
                  className="btn btn-admin verify-token-copy-btn"
                  onClick={handleCopy}
                >
                  Copy token
                </button>
                {copyStatus && (
                  <span className="verify-token-copy-status">
                    {copyStatus}
                  </span>
                )}
              </div>
            </>
          )}

          {isSuccess && !token && !isLoading && !isError && (
            <p className="verify-token-status">
              Token generated, but no token returned by server.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="verify-token-footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
