// // app/routes/dashboard/layout.jsx (user lands here if they visit "/" and are authenticated)



import React, { useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import canvasStyles from "../../styles/layout/canvas-layout.css?url";
import errorBoundaryStyles from "../../styles/error/error-boundary.css?url";

import Sidebar from "../components/Sidebar";
import { useCookieState } from "../../states/useCookieState";

import { verifySession } from "../../features/auth/authThunk";
import {
  selectAuthUser,
  selectAuthBootstrapping,
  selectAuthLoading,
} from "../../features/auth/authSlice";

export function links() {
  return [
    { rel: "stylesheet", href: canvasStyles },
    { rel: "stylesheet", href: errorBoundaryStyles },
  ];
}

export default function DashboardLayout() {
  const [expanded, setExpanded] = useCookieState("sidebarExpanded", true);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectAuthUser);
  const bootstrapping = useSelector(selectAuthBootstrapping);
  const authLoading = useSelector(selectAuthLoading);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };
  
   useEffect(() => {
    dispatch(verifySession())
   },[dispatch])


  // if (bootstrapping) {
  //   console.log("bootstrapping in dashboard ....")
  //   return (
  //     <>
  //       <title>Social Soko | Dashboard</title>
  //       <div className="layout-shell">
  //         <aside className="layout-sidebar layout-sidebar--collapsed" />
  //         <section className="layout-canvas">
  //           <div className="layout-canvas-inner">
  //             <div className="layout-topbar">
  //               <button className="mobile-menu-btn" disabled>
  //                 ▤
  //               </button>
  //             </div>
  //             <div className="layout-empty">
  //               <div className="layout-empty__inner">
  //                 Checking your session…
  //               </div>
  //             </div>
  //           </div>
  //         </section>
  //       </div>
  //     </>
  //   );
  // }



  // if(!user){
  //   navigate("/login");
  //   return null;
  // }

   

 

  // 3) Authenticated user → render full dashboard layout
  return (
    <>
      <title>Social Soko | Dashboard</title>

      {expanded && (
        <div
          className="mobile-sidebar-backdrop"
          onClick={() => setExpanded(false)}
        />
      )}

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
            <div className="layout-topbar">
              <button className="mobile-menu-btn" onClick={handleToggle}>
                ▤
              </button>
            </div>
            <Outlet />
          </div>
        </section>

      </div>


    </>
  );
}

