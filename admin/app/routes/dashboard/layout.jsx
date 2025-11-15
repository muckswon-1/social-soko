import React, { useEffect } from "react";
import {
  isRouteErrorResponse,
  Link,
  Outlet,
  useNavigate,
} from "react-router";

import canvasStyles from "../../styles/layout/canvas-layout.css?url";
import errorBoundaryStyles from "../../styles/error/error-boundary.css?url";
import Sidebar from "../components/Sidebar";
import { useDispatch } from "react-redux";
// import { verifySession } from "../../features/auth/authThunk";
import { useCookieState } from "../../states/useCookieState";



export function links() {
  return [
    { rel: "stylesheet", href: canvasStyles },
    { rel: "stylesheet", href: errorBoundaryStyles },
  ];
}

export default function DashboardLayout() {
  const [expanded, setExpanded] = useCookieState("sidebarExpanded", true); // true = wide sidebar, false = collapsed

  const dispatch = useDispatch();
  const navigate = useNavigate();
 

   const handleToggle = () => { 
    setExpanded((prev) => !prev);
    };


//    useEffect(() => {
//       const validSession = async () => {
        
//         try {
//           const { success } = await dispatch(verifySession()).unwrap();
  
//           if (!success) {
//             navigate("/login", { replace: true });
//           }
        
//         } catch (error) {
//            console.error(error);
//             navigate("/login", { replace: true });
//         }
//       };
  
//       validSession();

//     }, [dispatch, navigate]);


  return (
    <>
      <title>Social Soko | Dashboard</title>
      <div className="layout-shell">
        <aside
          className={
            "layout-sidebar " +
            (expanded
              ? "layout-sidebar--expanded"
              : "layout-sidebar--collapsed")
          }
        >
          <Sidebar handleToggle={handleToggle} expanded={expanded} />
        </aside>

        <section className="layout-canvas">
          <div className="layout-canvas-inner">
            <Outlet />
          </div>
        </section>
      </div>
    </>
  );
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
