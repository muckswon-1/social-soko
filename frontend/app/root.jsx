import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css"
import { Provider } from "react-redux";
import { store } from "./store";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    href: "https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Funnel+Display:wght@300..800&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Saira:ital,wght@0,100..900;1,100..900&display=swap",
    rel: "stylesheet",
  }
];



export function Layout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <Meta />
        <Links />
        <title>Social Soko</title>
      </head>
      <body>
        <Provider store={store}>
        <div className="app-container">{children}</div>
        <ScrollRestoration />
        <Scripts />
        </Provider>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <h1 className="logo-text">Social Soko</h1>
          </div>
          <div className="nav-links">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link-active" : ""}`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link-active" : ""}`
              }
            >
              Register
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}

export function ErrorBoundary({ error }) {
  let title = "Error ⛔️";
  let message = "An unexpected error occurred";
  let stack;

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "404" : "Error";
    message =
      error.status === 404
        ? "Page not found"
        : error.statusText || message;
  } else if (
    import.meta.env.VITE_ENV === "development" &&
    error instanceof Error
  ) {
    message = error.message;
    stack = error.stack;
  }

  return (
    <main className="error-page">
      <h1>{title}</h1>
      <p>{message}</p>
      {stack && <pre>{stack}</pre>}
      <p>
        Back to{" "}
        <Link className="nav-link" to="/">
          Home
        </Link>
      </p>
    </main>
  );
}
