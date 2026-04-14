
// root.jsx
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";
import "./styles/error/error-boundary.css";
import { Provider,  useSelector} from "react-redux";
import { store } from "./store";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import TopNav from "./routes/components/TopNav";
import ResponsiveShell from "./routes/components/ResponsiveShell";
import LeftRail from "./routes/components/LeftRail";
import RightRail from "./routes/components/RightRail";
import { selectAuthUser } from "./features/auth/authSlice";
import GuestLeftRail from "./routes/guest/GuestLeftRail";
import GuestRightRail from "./routes/guest/GuestRightRail";
import AuthGateProvider from "./routes/components/AuthGateProvider";
import shellStyles from "./styles/layout/responsive-shell.css?url"
import topNavStyles from './styles/nav/topnav.css?url';
import iconStyles from './styles/icons/icons.css?url';


export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Funnel+Display:wght@300..800&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Saira:ital,wght@0,100..900;1,100..900&display=swap",
    rel: "stylesheet",
  },
  {
    rel: 'stylesheet',
    href: shellStyles
  },
   {
    rel: 'stylesheet',
    href: topNavStyles
  },
  {
    rel:"stylesheet",
    href:iconStyles
  },

];

export function Layout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <title>Social Soko</title>
      </head>
      <body>
        <Provider store={store}>
          <div className="app-container">{children}</div>
          <ToastContainer />
          <ScrollRestoration />
          <Scripts />
        </Provider>
      </body>
    </html>
  );
}

export default function App() {
  const user = useSelector(selectAuthUser);
  const isGuest = !user;
  
  return (
  
     <AuthGateProvider>
      <ResponsiveShell header={<TopNav />}
       leftRail={isGuest ? <GuestLeftRail /> : <LeftRail />}
        rightRail={isGuest ? <GuestRightRail /> : <RightRail />}>
        <Outlet />
      </ResponsiveShell>
      </AuthGateProvider>
    
  );
}

export function ErrorBoundary({ error }) {
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let statusCode;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;

    if (error.status === 404) {
      title = "Page not found";
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
