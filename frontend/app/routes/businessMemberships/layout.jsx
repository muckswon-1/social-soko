import React from "react";
import { isRouteErrorResponse, Link } from "react-router";
import { Outlet, useParams } from "react-router";

import SectionLayout from "../components/SectionLayout";

import sectionStyles from "../../styles/layout/section-layout.css?url";
import errorStyles from "../../styles/error/error-boundary.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: sectionStyles },
    { rel: "stylesheet", href: errorStyles },
  ];
}

export default function BusinessMembershipsLayout() {
  const { businessId } = useParams();

  const sectionMeta = {
    header: "Business Memberships",
    description:
      "Manage active members, roles, and membership requests for this business.",
    sectionLinks: [
      {
        to: `/business-memberships/${businessId}`,
        title: "Members",
      },
      {
        to: `/business-memberships/${businessId}/requests`,
        title: "Requests",
      },
      {
        to: `/business/${businessId}`,
        title: "Back to Business",
      },
    ],
  };

  return (
    <SectionLayout sectionMeta={sectionMeta}>
      <Outlet />
    </SectionLayout>
  );
}

export function ErrorBoundary({ error }) {
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let statusCode;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;

    if (error.status === 404) {
      title = "Membership page not found";
      message = "We couldn't find the membership page you're looking for.";
    } else if (error.status === 401 || error.status === 403) {
      title = "Access restricted";
      message = "You don't have permission to view this membership area.";
    } else {
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

        {statusCode ? <div className="error-code">Error {statusCode}</div> : null}

        <h1 className="error-title">{title}</h1>
        <p className="error-message">{message}</p>

        <div className="error-actions">
          <Link to="/business" className="btn btn-secondary">
            Back to Businesses
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

        {!isRouteErrorResponse(error) && error instanceof Error ? (
          <details className="error-details">
            <summary>Technical details</summary>
            <pre>{error.stack || error.message}</pre>
          </details>
        ) : null}
      </div>
    </div>
  );
}