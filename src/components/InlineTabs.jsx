import React, { useMemo, useState, useEffect, useCallback } from 'react';
import './inline-tabs.css';

/**
 * InlineTabs
 * props:
 *  - tabs: [{ id, label, content }]
 *  - defaultId: string
 *  - syncWithQuery?: boolean (default true)
 */
const InlineTabs = ({ tabs = [], defaultId, syncWithQuery = true }) => {
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

  // ensure valid tab
  useEffect(() => {
    if (!tabMap.has(activeId)) {
      setActiveId(getInitial());
    }
  }, [activeId, tabMap, getInitial]);

  // keep URL synced
  useEffect(() => {
    if (!syncWithQuery) return;
    const q = new URLSearchParams(window.location.search);
    if (activeId) q.set('tab', activeId);
    else q.delete('tab');
    const next = `${window.location.pathname}?${q.toString()}`;
    window.history.replaceState({}, '', next);
  }, [activeId, syncWithQuery]);

  return (
    <div className="inlinetabs">
      <div className="inlinetabs-header" role="tablist" aria-orientation="horizontal">
        {tabs.map((t) => {
          const selected = t.id === activeId;
          return (
            <button
              key={t.id}
              className={`inlinetabs-btn ${selected ? 'is-active' : ''}`}
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

      <div className="inlinetabs-panelwrap">
        {tabs.map((t) => {
          const hidden = t.id !== activeId;
          return (
            <section
              key={t.id}
              role="tabpanel"
              id={`panel-${t.id}`}
              aria-labelledby={`tab-${t.id}`}
              hidden={hidden}
              className="inlinetabs-panel"
            >
              {!hidden && t.content}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default InlineTabs;
