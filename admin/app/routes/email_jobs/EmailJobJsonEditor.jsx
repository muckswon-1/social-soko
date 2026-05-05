import React, { useEffect, useState } from "react";
import {
  useRetryEmailJobMutation,
  useGetEmailJobQuery,
} from "../../services/emailJobApi";
import "../../styles/email_jobs/json-editor.css";

// Props:
// - jobId: string
// - onClose: () => void
// - onSuccess?: (updatedJob) => void
export default function EmailJobJsonEditor({ jobId, onClose, onSuccess }) {
  const {
    data: job,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetEmailJobQuery(jobId);

  const [retryEmailJob, { isLoading: isRetrying }] =
    useRetryEmailJobMutation();

  const [editorValue, setEditorValue] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Populate editor with a full editable object when job loads
  useEffect(() => {
    if (!job) return;

    try {
      const editable = {
        to: job.to,
        template: job.template,
        payload: job.payload,
        // If you want to allow editing status/attempts/etc, add them too:
        // status: job.status,
        // attempts: job.attempts,
      };

      setEditorValue(JSON.stringify(editable, null, 2));
      setJsonError("");
    } catch (e) {
      setEditorValue("");
      setJsonError("Failed to stringify job data.");
    }
  }, [job]);

  const handleChange = (e) => {
    setEditorValue(e.target.value);
    setJsonError("");
    setSubmitError("");
  };

  const handleRetry = async () => {
    setJsonError("");
    setSubmitError("");

    // 1) Validate JSON locally
    let parsed;
    try {
      parsed =
        editorValue.trim() === "" ? {} : JSON.parse(editorValue);
    } catch (e) {
      setJsonError(e.message || "Invalid JSON");
      return;
    }


    try {
      // 2) Send the whole edited object as `data`
      const result = await retryEmailJob({
        id: jobId,
        data: parsed,
      }).unwrap();

      if (onSuccess) {
        onSuccess(result?.data ?? result);
      }

       onClose();
 
    } catch (e) {
      console.error("Retry failed", e);
      setSubmitError(
        e?.data?.message ||
          e?.data?.error ||
          "Failed to retry email job. Check the server logs."
      );
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // Basic loading / error states
  if (isLoading) {
    return (
      <div className="json-editor-overlay">
        <div className="json-editor-modal">
          <p>Loading email job…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="json-editor-overlay">
        <div className="json-editor-modal">
          <p>Failed to load email job.</p>
          <pre className="json-editor-error-pre">
            {JSON.stringify(error?.data || error, null, 2)}
          </pre>
          <div className="json-editor-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => refetch()}
            >
              Retry Load
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleCancel}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="json-editor-overlay">
      <div className="json-editor-modal">
        {/* Header */}
        <div className="json-editor-header">
          <div>
            <h2 className="json-editor-title">Edit Email Job JSON</h2>
            <p className="json-editor-subtitle">
              Job: <span className="json-editor-mono">{job.id}</span> ·
              Template:{" "}
              <span className="json-editor-mono">{job.template}</span>
            </p>
          </div>

          <button
            type="button"
            className="btn btn-ghost json-editor-close-btn"
            onClick={handleCancel}
          >
            ✕
          </button>
        </div>

        {/* Last error */}
        {job.last_error && (
          <div className="json-editor-last-error">
            <div className="json-editor-last-error-label">Last error</div>
            <pre className="json-editor-last-error-pre">
              {job.last_error}
            </pre>
          </div>
        )}

        {/* JSON editor */}
        <div className="json-editor-body">
          <label className="json-editor-label">
            Request body (JSON)
            <textarea
              className={`json-editor-textarea${
                jsonError ? " json-editor-textarea--invalid" : ""
              }`}
              value={editorValue}
              onChange={handleChange}
              spellCheck="false"
            />
          </label>

          {jsonError && (
            <div className="json-editor-error">
              <strong>JSON error:</strong> {jsonError}
            </div>
          )}

          {submitError && (
            <div className="json-editor-error">
              <strong>Submit error:</strong> {submitError}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="json-editor-footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleCancel}
            disabled={isRetrying}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? "Retrying…" : "Save & Retry"}
          </button>
        </div>
      </div>
    </div>
  );
}
