import { isRouteErrorResponse, Link } from "react-router";
import styles from "../../styles/layout/section-layout.css?url";
import errorStyles from "../../styles/error/error-boundary.css?url";
import SectionLayout from "../components/SectionLayout";
import { useFetchMyBusinessesQuery } from "../../services/businessApi";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: errorStyles },
  ];
}

export default function BusinessLayout() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useFetchMyBusinessesQuery(
    { page: 1, limit: 50 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Support both possible service return shapes while you finish normalising RTK:
  // 1) { success, message, data: { rows, count, ... } }
  // 2) { rows, count, ... }
  const rows = Array.isArray(data?.data?.rows)
    ? data.data.rows
    : Array.isArray(data?.rows)
      ? data.rows
      : [];


  const businessCount =
    typeof data?.data?.count === "number"
      ? data.data.count
      : typeof data?.count === "number"
        ? data.count
        : rows.length;

  const hasBusinesses = businessCount > 0;

  const sectionLinks = [
    { to: "/business", title: "My Businesses" },
    { to: "/business/create-business", title: "Create Business" },
    {
      to: "/dashboard/business/request-membership",
      title: "Join a Business",
    },
    { to: "/dashboard/business/settings", title: "Settings" },
  ];

  const sectionMeta = {
    header: "Business",
    description: hasBusinesses
      ? "Manage the businesses you own, administer, or belong to."
      : "Create a business or request membership to join one.",
    sectionLinks,
    stats: [
      {
        label: "Businesses",
        value: isLoading ? "…" : String(businessCount),
      },
    ],
    status:
      isError && error
        ? {
            tone: "danger",
            label: "Issue loading businesses",
          }
        : null,
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