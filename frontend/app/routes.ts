import {
  index,
  layout,
  prefix,
  route,
  RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/landing-page.jsx"),
  // root route
  route("login", "./routes/auth/login.jsx"),
  route("register", "./routes/auth/register.jsx"),
  route("forgot-password", "./routes/auth/forgot-password.jsx"),
  route("reset-password", "./routes/auth/reset-password.jsx"),
  route("verify-email", "./routes/auth/verify-email.jsx"),

  ...prefix("dashboard", [
    layout("./routes/dashboard/layout.jsx", [
      index("./routes/dashboard/index.jsx"),

      ...prefix("privacy", [
        layout("./routes/privacy/layout.jsx", [
          index("./routes/privacy/index.jsx"),
          route("update-password", "./routes/privacy/update-password.jsx"),
          route("update-email", "./routes/privacy/update-email.jsx"),
        ]),
      ]),
      ...prefix("business", [
        layout("./routes/business/layout.jsx", [
          index("./routes/business/index.jsx"),
          route("create-business", "./routes/business/create-business.jsx"),
          route("update-business", "./routes/business/update-business.jsx"),
        ]),
      ]),
      ...prefix("profile", [
        layout("./routes/profile/layout.jsx", [
          index("./routes/profile/index.jsx"),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
