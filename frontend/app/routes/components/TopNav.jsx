import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { selectAuthUser } from "../../features/auth/authSlice";
import { useShellLayout } from "./ResponsiveShell";
import {ReactComponent as SearchIcon } from "../../assets/svg/search.svg"
import {ReactComponent as MenuIcon} from "../../assets/svg/hamburger-menu.svg";
import {ReactComponent as PlusIcon} from "../../assets/svg/plus.svg"


const TopNav = () => {
  const { pathname } = useLocation();
  const user = useSelector(selectAuthUser);
  const navigate = useNavigate();
  const location = useLocation();
    const next = encodeURIComponent(location.pathname + location.search);

  const isGuest = !user;

  const { isMobile, isTablet, toggleLeftRail, toggleRightRail } = useShellLayout();

  const showDrawers = isMobile || isTablet;

  const showHamburger = isMobile || isTablet;

  const pageMeta = useMemo(() => {
    const isFeed =
      pathname === "/dashboard" || pathname === "/feed" || pathname === "/";

    return { isFeed };
  }, [pathname]);



  return (
    <header className="topnav" role="banner">
      <div className="topnav__inner">
        {/* Left: hamburger + brand */}
        <div className="topnav__left">
          {showDrawers ? (
            <button
              type="button"
              className="topnav__iconbtn topnav__hamburger"
              onClick={toggleLeftRail}
              aria-label="Open Menu"
              aria-haspopup="dialog"
            >
              <span aria-hidden="true"><MenuIcon className="icon-svg icon-svg--md" /></span>
            </button>
          ) : (
            <div className="topnav__hamburger-spacer" />
          )}
          <div className="topnav__brand" aria-label="Social Soko">
            Social Soko
          </div>
        </div>

        {/* Center: search */}
         {/* Center: search */}
<div className="topnav__center">
  <form
    className="topnav__search"
    role="search"
    onSubmit={(e) => e.preventDefault()}
  >
    <label className="sr-only" htmlFor="topnav-search">
      Search
    </label>

    <SearchIcon className="topnav__searchIcon icon-svg icon-svg--sm" />

    <input
      id="topnav-search"
      className="topnav__searchInput"
      type="search"
      autoComplete="off"
      placeholder="Find anything"
    />

    <button type="button" className="topnav__searchCta" aria-label="Ask">
      Ask
    </button>
  </form>
</div>


        {/* Right: user actions */}
        <div className="topnav__right">
       
          {isGuest ? (
            <>
              <button
                type="button"
                className="topnav__actionbtn"
                onClick={() => {navigate(`/login?next=${next}`)}}
              >
                Login
              </button>
              <button
                type="button"
                className="topnav__actionbtn"
                onClick={() => {console.log("clicked")}}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
            <div className={`topnav__actionbtn-container ${isMobile ? "topnav__actionbtn-container__mobile" : ""}`}>

             <button
                type="button"
                className="topnav__createbtn"
                aria-label="Create Post"
                onClick={() => navigate("posts/new-post",{replace: true})}
              >
                {isMobile ? <PlusIcon className="icon-svg  .icon-svg--md topnav__createbtn__icon" /> : "Create"}
              </button>




              <button
                type="button"
                className="topnav__iconbtn"
                aria-label="Messages"
              >
                💬
              </button>

              <button
                type="button"
                className="topnav__iconbtn"
                aria-label="Notifications"
              >
                🔔
              </button>
              </div>

              <button
                type="button"
                className="topnav__profileBtn"
                aria-label="Profile"
              >
                

                {/* Later we’ll swap to avatar */}
                <span className="topnav__profileAvatar" aria-hidden="true">
                  {user?.firstName?.[0] || "👤"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
      {/* TODO: Route context row (like Reddit "Hot") */}
    </header>
  );
};

export default TopNav;
