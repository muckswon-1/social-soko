// src/components/InlineTabs.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import "../styles/components/inline-tabs.css";

/**
 * InlineTabs
 *
 * Props:
 * - tabs: [{ id: string, label: string, content?: ReactNode }]
 * - activeId?: string            // controlled mode
 * - onChange?: (id: string) => void
 * - defaultId?: string           // uncontrolled initial
 * - syncWithQuery?: boolean      // uncontrolled: sync with ?tab=
 */
const InlineTabs = ({
  tabs = [],
  activeId,
  onChange,
  defaultId,
  syncWithQuery = true,
}) => {
  const tabMap = useMemo(() => {
    const map = new Map();
    tabs.forEach((t) => map.set(t.id, t));
    return map;
  }, [tabs]);

  const isControlled = activeId !== undefined && activeId !== null;

  const getInitial = useCallback(() => {
    if (tabs.length === 0) return undefined;

    if (syncWithQuery && typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search);
      const fromQuery = q.get("tab");
      if (fromQuery && tabMap.has(fromQuery)) return fromQuery;
    }

    if (defaultId && tabMap.has(defaultId)) return defaultId;

    return tabs[0]?.id;
  }, [tabs, tabMap, defaultId, syncWithQuery]);

  const [internalActiveId, setInternalActiveId] = useState(getInitial);

  // Ensure internal activeId always valid when tabs/default change
  useEffect(() => {
    if (isControlled) return;
    if (!tabMap.has(internalActiveId || "")) {
      setInternalActiveId(getInitial());
    }
  }, [isControlled, internalActiveId, tabMap, getInitial]);

  const currentActiveId = isControlled ? activeId : internalActiveId;

  const handleTabClick = (id) => {
    if (!tabMap.has(id)) return;

    if (!isControlled) {
      setInternalActiveId(id);
    }

    if (onChange) {
      onChange(id);
    }
  };

  // Sync URL with active tab (uncontrolled or controlled)
  useEffect(() => {
    if (!syncWithQuery) return;
    if (typeof window === "undefined") return;
    if (!currentActiveId) return;

    const q = new URLSearchParams(window.location.search);
    q.set("tab", currentActiveId);
    const next = `${window.location.pathname}?${q.toString()}`;
    window.history.replaceState({}, "", next);
  }, [currentActiveId, syncWithQuery]);

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="inline-tabs">
      <div
        className="inline-tabs__list"
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((t) => {
          const selected = t.id === currentActiveId;
          return (
            <button
              key={t.id}
              className={
                "inline-tabs__tab" +
                (selected ? " inline-tabs__tab--active" : "")
              }
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => handleTabClick(t.id)}
              type="button"
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="inline-tabs__panels">
        {tabs.map((t) => {
          const isActive = t.id === currentActiveId;
          return (
            <section
              key={t.id}
              role="tabpanel"
              id={`panel-${t.id}`}
              aria-labelledby={`tab-${t.id}`}
              hidden={!isActive}
              className={
                "inline-tabs__panel" +
                (!isActive ? " inline-tabs__panel--hidden" : "")
              }
            >
              {isActive && t.content}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default InlineTabs;
