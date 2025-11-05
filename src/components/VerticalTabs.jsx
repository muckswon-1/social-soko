import React, { useMemo, useState, useEffect, useCallback } from 'react';
import './vertical-tabs.css';

/**
 * props:
 *  - tabs: [{ id, label, content }]
 *  - defaultId: string
 *  - syncWithQuery?: boolean (optional) – if true, it syncs the active tab to ?tab=<id>
 */
const VerticalTabs = ({ tabs = [], defaultId, syncWithQuery = true }) => {
  const tabMap = useMemo(() => {
    const map = new Map();
    tabs.forEach(t => map.set(t.id, t));
    return map;
  }, [tabs]);

  const getInitial = useCallback(() => {
    if (syncWithQuery && typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search);
      const fromQuery = q.get('tab');
      if (fromQuery && tabMap.has(fromQuery)) return fromQuery;
    }
    return defaultId || tabs[0]?.id;
  }, [defaultId, tabMap, tabs, syncWithQuery]);

  const [activeId, setActiveId] = useState(getInitial);

  useEffect(() => {
    if (!tabMap.has(activeId)) {
      setActiveId(getInitial());
    }
  }, [activeId, tabMap, getInitial]);

  useEffect(() => {
    if (!syncWithQuery) return;
    const q = new URLSearchParams(window.location.search);
    if (activeId) {
      q.set('tab', activeId);
    } else {
      q.delete('tab');
    }
    const next = `${window.location.pathname}?${q.toString()}`;
    window.history.replaceState({}, '', next);
  }, [activeId, syncWithQuery]);

  return (
    <div className="vtabs">
      <div className="vtabs-rail" role="tablist" aria-orientation="vertical">
        {tabs.map((t) => {
          const selected = t.id === activeId;
          return (
            <button
              key={t.id}
              className={`vtabs-btn ${selected ? 'is-active' : ''}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => setActiveId(t.id)}
              type="button"
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="vtabs-panelwrap">
        {tabs.map((t) => {
          const hidden = t.id !== activeId;
          return (
            <section
              key={t.id}
              role="tabpanel"
              id={`panel-${t.id}`}
              aria-labelledby={`tab-${t.id}`}
              hidden={hidden}
              className="vtabs-panel"
            >
              {!hidden && t.content}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalTabs;
