// src/layout/SettingsShell.jsx
import React, { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";
import InlineTabs from "../components/InlineTabs";
import "../styles/components/settings-shell.css";

const SettingsShell = ({
  title,
  description,
  tabs,
  defaultId,
  rightSlot,
  className,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine active tab from ?tab=... or fall back
  const activeId = useMemo(() => {
    const fromQuery = searchParams.get("tab");
    if (fromQuery && tabs.some((t) => t.id === fromQuery)) {
      return fromQuery;
    }
    if (defaultId && tabs.some((t) => t.id === defaultId)) {
      return defaultId;
    }
    return tabs[0]?.id;
  }, [searchParams, tabs, defaultId]);

  const handleTabChange = useCallback(
    (nextId) => {
      const next = new URLSearchParams(searchParams);
      next.set("tab", nextId);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Optional: render tab-specific content if provided on the tab objects
  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeId),
    [tabs, activeId],
  );

  return (
    <div className={`settings-shell ${className || ""}`}>
      <div className="settings-shell__header">
        <div className="settings-shell__titles">
          <h2 className="settings-shell__title">{title}</h2>
          {description && (
            <p className="settings-shell__description">{description}</p>
          )}
        </div>
        {rightSlot && <div className="settings-shell__right">{rightSlot}</div>}
      </div>

      <div className="settings-shell__body">
        <InlineTabs
          tabs={tabs}
          activeId={activeId}
          onChange={handleTabChange}
        />

        {/* If tabs carry their own content, render it here. 
            Otherwise, the parent route/component can render below this shell. */}
        {activeTab?.content}
      </div>
    </div>
  );
};

export default SettingsShell;
