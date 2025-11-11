import styles from "../../styles/layout/section-layout.css?url";
import errorStyles from "../../styles/error/error-boundary.css?url";
import SectionLayout from "../components/SectionLayout";


export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: errorStyles },
  ];
}

export default function ProfileLayout() {
  const sectionMeta = {
    header: "Profile",
    description: "Manage your Profile Information",
    sectionLinks: [{ to: "/dashboard/profile", title: "Profile Summary" }],
  };

  return <SectionLayout sectionMeta={sectionMeta} />;
}

// Error boundary inside layout
export function ErrorBoundary({ error }) {
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let statusCode;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;

    if (error.status === 404) {
      title = "Page not found in DashBoard";
      message =
        "We couldn't find the page you're looking for. It may have been moved or doesn't exist.";
    } else if (error.status === 401 || error.status === 403) {
      title = "Access restricted";
      message =
        "You don't have permission to view this page. You may need to log in, switch accounts, or contact support.";
    } else {
      title = "Something went wrong";
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    // Hide stack in production; show friendly text
    message = error.message || message;
  }

  return (
    <div className="error-shell">
      <div className="error-card">
        <div className="error-icon" aria-hidden="true">
          ⚠️
        </div>

        {statusCode && <div className="error-code">Error {statusCode}</div>}

        <h1 className="error-title">{title}</h1>
        <p className="error-message">{message}</p>

        <div className="error-actions">
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }}
          >
            Retry
          </button>
        </div>

        {/* Optional: subtle technical info in dev; safe to ignore if no error.message */}
        {!isRouteErrorResponse(error) && error instanceof Error && (
          <details className="error-details">
            <summary>Technical details</summary>
            <pre>{error.stack || error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
