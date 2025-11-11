import React from "react";
import { NavLink, Outlet } from "react-router";

const SectionLayout = ({ sectionMeta }) => {
  const { sectionLinks } = sectionMeta;

  return (
    <div className="section-layout">
      <header className="layout-header section-layout__header">
        <div className="section-layout__titles">
          <h1 className="section-layout__title">{sectionMeta?.header || ""}</h1>
          <p className="section-layout__subtitle">
            {sectionMeta?.description || ""}
          </p>
        </div>
      </header>

      <nav
        className="layout-tabs section-tabs"
        aria-label="Privacy and security navigation"
      >
        {sectionLinks
          ? sectionLinks.map((sectionLinks, index) => (
              <NavLink
                key={index}
                to={sectionLinks.to}
                className={({ isActive }) =>
                  "section-tabs__link" +
                  (isActive ? " section-tabs__link--active" : "")
                }
              >
                {sectionLinks.title}
              </NavLink>
            ))
          : null}

        {/* <NavLink
          end
          to="/dashboard/business"
          className={({ isActive }) =>
            "section-tabs__link" +
            (isActive ? " section-tabs__link--active" : "")
          }
        >
          My Business
        </NavLink>

        <NavLink
          to="/dashboard/business/create-business"
          className={({ isActive }) =>
            "section-tabs__link" +
            (isActive ? " section-tabs__link--active" : "")
          }
        >
          Create Business
        </NavLink>

        <NavLink
          to="/dashboard/business/update-business"
          className={({ isActive }) =>
            "section-tabs__link" +
            (isActive ? " section-tabs__link--active" : "")
          }
        >
          Update Business
        </NavLink> */}
      </nav>

      {/* Nested routes render here */}
      <div className="section-layout__content">
        <Outlet />
      </div>
    </div>
  );
};

export default SectionLayout;
