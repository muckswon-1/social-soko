import {
  Form,
  useNavigation,
  useActionData,
  redirect,
} from "react-router";

import styles from "../../styles/auth/auth.css?url";
import { createServerApi } from "../../lib/api.server";


export function meta() {
  return [{ title: "Social Soko Admin | Login" }];
}

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}

// We'll implement this together in the next step.
// For now it's just a placeholder.
export async function action({ request }) {

    const formData = await request.formData();

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
  
    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email || !emailRegex.test(email) || !password){
        return  Response.json({
            error: !email || !password ? "Email and password are required" : "Invalid email or password",
            status: 400
        })
                     
    }

   // Call backend login
   const headers = new Headers();
   
   try {
    const serverApi = createServerApi(request);

    const response = await serverApi.post("/auth/login",{email, password},{_skipRefresh: true});


    const data = response?.data;

    const success = data?.success ?? true;
    const user = data?.data;
    const role = user?.role;


    //console.log("Response in login: ", response);
    const setCookie = response?.headers?.["set-cookie"];
  

    

    if(Array.isArray(setCookie)){
        for(const cookie of setCookie) {
            headers.append("Set-Cookie", cookie)
        }
    }else if(setCookie){
        headers.append("Set-Cookie", setCookie)
    }

    if(!success) {
        return Response.json(
            {
            error: data?.error || "Login failed please check your credentials",   
          },
          {status: 401, headers}
    )
    }

    if(!role || !["admin","super_admin"].includes(role)){
        return Response.json(
         {
            error: "You are not authorized to access this page",
        },
        {status: 403, headers}
    )

    }

    return redirect("/", {headers});

   } catch (error) {
      const status = error?.response?.status || 500;
      const resData = error?.response?.data;

      const backendMessage = resData?.error || resData?.message || "Login failed please try again later";

      return Response.json(
        {
        error: backendMessage || "Something went wrong while logging in. Please try again",
        },
        {status: status, headers}
);
   }

}

export default function Login() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const actionData = useActionData();



  const error = actionData?.error || "";

  // Live validation without useState
  
  
  
  const handleEmailInput = (e) => {
    const value = e.target.value.trim();
    if (!value) {
      e.target.setCustomValidity("Email is required");
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      e.target.setCustomValidity("Enter a valid email address");
    } else {
      e.target.setCustomValidity("");
    }
    e.target.reportValidity();
  };

  const handlePasswordInput = (e) => {
    const value = e.target.value;
    if (!value) {
      e.target.setCustomValidity("Password is required.");
    } else if (value.length < 6) {
      e.target.setCustomValidity("Password must be at least 6 characters.");
    } else {
      e.target.setCustomValidity("");
    }
    e.target.reportValidity();
  };

  return (
    <div className="page page-auth page-auth-admin">
      <main className="main-content auth-main">
        <div className="auth-card auth-card-admin">
          <header className="auth-header">
            <div className="auth-badge">Admin</div>
            <h1 className="auth-title">Admin Login</h1>
            <p className="auth-subtitle">
              Sign in with an authorized admin account to access the Social Soko
              admin dashboard.
            </p>
          </header>

          {error && <div className="auth-error">{error}</div>}

          <Form method="post" className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Admin Email
              </label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                onInput={handleEmailInput}
              />
              <span className="field-hint">
                Use your admin or organization email.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                className="form-input"
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                onInput={handlePasswordInput}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-button auth-button-admin"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login to Admin"}
            </button>
          </Form>

          <footer className="auth-footer">
            <p className="auth-meta">
              Don't have admin access? Contact your organization owner or system
              administrator.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
