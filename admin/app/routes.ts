import { index, RouteConfig, route, layout, prefix } from "@react-router/dev/routes";

export default [
    index("./routes/_index.jsx"),
    route("login","./routes/auth/login.jsx"),
    ...prefix("admin",[
        layout("./routes/dashboard/layout.jsx",[
            index("./routes/dashboard/index.jsx"),
            route("email-jobs","./routes/email_jobs/list-email-jobs.jsx"),
            route("users","./routes/users/users.jsx"),
            route("businesses", "./routes/businesses/list-businesses.jsx")
        ])
    ])

] satisfies RouteConfig;
