import {
  index,
  layout,
  prefix,
  route,
  RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/_index.jsx"),
  // root route
  route("login", "./routes/auth/login.jsx"),
  route("logout", "routes/auth/logout.jsx"),
  route("register", "./routes/auth/register.jsx"),
  route("forgot-password", "./routes/auth/forgot-password.jsx"),
  route("reset-password", "./routes/auth/reset-password.jsx"),
  route("verify-email", "./routes/auth/verify-email.jsx"),

  route("posts/:postId","routes/pages/$postId.jsx"),
   route("posts/new-post","routes/pages/create-post.jsx"),
  
  route("business","routes/business/layout.jsx",[
    index("routes/business/my-businesses.jsx"),
    route("create-business","routes/business/create-business.jsx"),
    route(":businessId","routes/business/$businessId.jsx")
  ])




  // ...prefix("dashboard", [
  //   layout("./routes/dashboard/layout.jsx", [
  //     layout("./routes/posts/layout.jsx", [
  //       index("./routes/posts/foryou.jsx"),
  //       route("my-posts","./routes/posts/user-posts.jsx"),
  //       route("explore", "./routes/posts/explore.jsx"),
  //       route("following", "./routes/posts/following.jsx"),
  //     ]),
  //     ...prefix("account-settings", [
  //       layout("./routes/account_settings/layout.jsx", [
  //         index("./routes/account_settings/profile-summary.jsx"),
  //         route(
  //           "update-password",
  //           "./routes/account_settings/update-password.jsx",
  //         ),
  //         route("update-email", "./routes/account_settings/update-email.jsx"),
  //       ]),
      
        

  //     ]),
  //      ...prefix("business", [
  //         layout("./routes/business/layout.jsx", [
  //           index("./routes/business/index.jsx"),
  //           route("create-business", "./routes/business/create-business.jsx"),
  //           route("settings", "./routes/business/business-settings.jsx"),
  //         ]),
  //       ])
  //   ]),

  //   //   ...prefix("dashboard", [
  //   //    layout("./routes/dashboard/layout.jsx", [
  //   //      //layout("./routes/posts/layout.jsx",[
  //   // //     index("./routes/posts/foryou.jsx"),
  //   // //     route("explore","./routes/posts/explore.jsx"),
  //   // //     route("following","./routes/posts/following.jsx"),
  //   //    // ]),

  //   //     //]),
  //   //     // ...prefix("business", [
  //   //     //   layout("./routes/business/layout.jsx", [
  //   //     //     index("./routes/business/index.jsx"),
  //   //     //     route("create-business", "./routes/business/create-business.jsx"),
  //   //     //     route("settings", "./routes/business/business-settings.jsx"),
  //   //     //   ]),
  //   //     // ]),
  //   //   ]),
  // ]),
] satisfies RouteConfig;


