import { index, layout, prefix, route, RouteConfig } from "@react-router/dev/routes";

export default  [
    index("routes/landing-page.jsx"),
    route("login", "routes/auth/login.jsx"),
    ...prefix("dashboard",[
        layout("routes/dashboard/layout.jsx",[
            index("routes/profile/profile.jsx")
        ])
    ])
] satisfies RouteConfig