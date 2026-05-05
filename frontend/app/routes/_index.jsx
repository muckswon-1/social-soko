// app/routes/_index.jsx (landing page)

import React, { useEffect, useRef } from "react";

import styles from "../styles/landing-page.css?url";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthBootstrapping, selectAuthUser, setUser } from "../features/auth/authSlice";

import GuestFeedPage from "./guest/GuestFeedPage";
import FeedPage from "./pages/FeedPage";
import { verifySession } from "../features/auth/authThunk";


/**
 * @typedef {import("../types/reactRouterTypes").LoaderArgs} LoaderArgs
 * @typedef {import("../types/")}
 */

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function LandingPage() {
  const user  = useSelector(selectAuthUser);
  const bootstrapping = useSelector(selectAuthBootstrapping);
  const guest = !user;

const dispatch = useDispatch();




  /* Verify session and refresh access token if we have a valid refresh token */
  useEffect(() => void dispatch(verifySession()), [dispatch]);


  if(bootstrapping) return <div>Loading...</div>

  return guest ? <GuestFeedPage /> : <FeedPage />
}
