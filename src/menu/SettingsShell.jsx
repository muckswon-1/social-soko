import React, { useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './settings-shell.css';
import InlineTabs from '../components/InlineTabs';

const SettingsShell = ({ title, description, tabs, defaultId, rightSlot, className }) => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const activeId = useMemo(() => {
    const q = params.get('tab');
    if (q && tabs.some(t => t.id === q)) return q;
    return defaultId || (tabs[0] && tabs[0].id);
  }, [params, tabs, defaultId]);

  const onTabChange = useCallback(
    (nextId) => {
      const next = new URLSearchParams(params);
      next.set('tab', nextId);
      navigate({ search: `?${next.toString()}` }, { replace: true });
      setParams(next, { replace: true });
    },
    [params, setParams, navigate]
  );

  return (
    <div className={`settings-shell ${className || ''}`}>
      <div className="settings-shell__header">
        <div className="settings-shell__titles">
          <h2 className="settings-shell__title">{title}</h2>
          {description && <p className="settings-shell__description">{description}</p>}
        </div>
        {rightSlot ? <div className="settings-shell__right">{rightSlot}</div> : null}
      </div>

      <div className="settings-shell__body">
        <InlineTabs tabs={tabs} activeId={activeId} onChange={onTabChange} />
      </div>
    </div>
  );
};

export default SettingsShell;
