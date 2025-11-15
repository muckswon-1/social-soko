// admin/src/features/email/EmailJobsList.jsx
import React, { useState } from "react";
import { useListEmailJobsQuery, useRetryEmailJobMutation } from "../../services/emailJobApi";
import "../../styles/email_jobs/email-jobs.css";
import EmailJobJsonEditor from "./EmailJobJsonEditor";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
];

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function statusClass(status) {
  if (!status) return "status-pill status-pill--unknown";

  switch (status.toLowerCase()) {
    case "pending":
      return "status-pill status-pill--pending";
    case "processing":
      return "status-pill status-pill--processing";
    case "sent":
      return "status-pill status-pill--sent";
    case "failed":
      return "status-pill status-pill--failed";
    default:
      return "status-pill status-pill--unknown";
  }
}

export default function EmailJobsList() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isFetching, isError, error, refetch } =
    useListEmailJobsQuery({ status: statusFilter, page: 1, limit: 50 },{
      pollingInterval: 60000,
      
    });

  const [editingJobId, setEditingJobId] = useState(null);
  

  const [retryEmailJob, { isLoading: isRetrying }] = useRetryEmailJobMutation();
 
  const jobs = data?.items || [];
  const meta = data?.meta || {};

  // const handleRetry = async (jobId) => {
  //   try {
  //     await retryEmailJob(jobId).unwrap();
  //     refetch();
  //   } catch (e) {
  //     console.error("Failed to retry email job", e);
  //   }
  // };

  return (
    <div className="email-jobs-page">
      {/* Filter + actions row at top of section-layout__content */}
    <div className="email-jobs-toolbar">
        <div className="email-jobs-toolbar-left">
          <label className="email-jobs-filter-label">
            Status
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="email-jobs-filter"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="email-jobs-toolbar-right">
          <button
            type="button"
            className="btn btn-admin email-jobs-refresh"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

       {/* Content card (uses your admin colors)  */}
       <div className="email-jobs-card">
        {isLoading && (
          <div className="empty-state">
            <div className="empty-state-inner">
              <p>Loading email jobs…</p>
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="empty-state">
            <div className="empty-state-inner">
              <p>Failed to load email jobs.</p>
              <pre className="email-jobs-error-pre">
                {JSON.stringify(error?.data || error, null, 2)}
              </pre>
              <button
                type="button"
                className="btn btn-admin email-jobs-refresh-inline"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!isLoading && !isError && jobs.length === 0 && (
          <div className="empty-state empty-state--inline">
            <div className="empty-state-inner">
              <p>No email jobs found for this filter.</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && jobs.length > 0 && (
          <>
            <div className="email-jobs-meta">
              <span>Total jobs: {meta.total ?? jobs.length}</span>
              {meta.page && meta.limit && (
                <span>
                  Page {meta.page} · {meta.limit} per page
                </span>
              )}
            </div>

            <div className="email-jobs-table-wrapper">
              <table className="email-jobs-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>To</th>
                    <th>Template</th>
                    <th>Attempts</th>
                    <th>Scheduled</th>
                    <th>Sent At</th>
                    <th>Last Error</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <span className={statusClass(job.status)}>
                          {job.status || "unknown"}
                        </span>
                      </td>
                      <td className="email-jobs-cell--mono">{job.to}</td>
                      <td className="email-jobs-cell--mono">{job.template}</td>
                      <td>{job.attempts}</td>
                      <td>{formatDate(job.scheduled_at)}</td>
                      <td>{formatDate(job.sent_at)}</td>
                      <td className="email-jobs-cell--error">
                        {job.last_error ? (
                          <span title={job.last_error}>
                            {job.last_error.length > 80
                              ? `${job.last_error.slice(0, 77)}…`
                              : job.last_error}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
               
                      <td className="email-jobs-actions-cell">
                        {job.status === "failed" || job.status === "pending" ? (
                          <>
                            {/* <button
                              type="button"
                              className="btn btn-admin btn-admin--secondary"
                              onClick={() => handleRetry({id: job.id})}
                              disabled={isRetrying}
                            >
                              Retry
                            </button> */}

                            <button
                              type="button"
                              className="btn btn-ghost"
                              onClick={
                                () => {
                                   setEditingJobId(job.id)
                                }

                              }
                              style={{ marginLeft: "0.35rem" }}
                            >
                              Edit JSON & Retry
                            </button>
                          </>
                        ) : (
                          <span className="email-jobs-actions-placeholder">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div> 

      {editingJobId && <EmailJobJsonEditor jobId={editingJobId} onClose={() => setEditingJobId(null)} onSuccess={() => refetch()}  />}
       
      
    </div>
  );
}
