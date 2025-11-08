// src/menu/profile/UserAuthInfoTab.jsx
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/inline-tabs-reusable.css'; // ← use the shared reusables
import { useDispatch, useSelector } from 'react-redux';
import { authUserSelector } from '../../features/auth/authSlice';
import { refreshUser, sendVerificationEmail } from '../../features/auth/authThunk';
import {  isPlainObject, prettyKey, isIsoDateLike } from '../../utils/passwordUtils';


export const formatValue = (v) => {
  if (v === null) return <span className="kv-muted">null</span>;
  if (v === undefined) return <span className="kv-muted">undefined</span>;
  if (typeof v === 'boolean') return <span className="kv-mono">{String(v)}</span>;
  if (typeof v === 'number') return <span className="kv-mono">{v}</span>;
  if (typeof v === 'string') {
    if (isIsoDateLike(v)) {
      const d = new Date(v);
      if (!isNaN(d)) {
        return <time title={d.toISOString()}>{d.toLocaleString()}</time>;
      }
    }
    if (v.length > 120) return <pre className="kv-pre">{v}</pre>;
    return <span>{v}</span>;
  }
  return <span>{String(v)}</span>;
};





const KeyValueRow = ({ k, v }) => (
  <>
    <div className="kv-key">{prettyKey(k)}</div>
    <div className="kv-val">
      <ValueRenderer value={v} />
    </div>
  </>
);


const ValueRenderer = ({ value }) => {
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="kv-muted">[]</span>;
    
    return (
      <div>
        {value.map((item, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            {isPlainObject(item) || Array.isArray(item) ? (
              <details className="kv-details">
                <summary className="kv-summary">Item {idx + 1}</summary>
                <div style={{ paddingLeft: '0.75rem', marginTop: '0.25rem' }}>
                  <ValueRenderer value={item} />
                </div>
              </details>
            ) : (
              <span>• <span className="kv-mono">{formatValue(item)}</span></span>
            )}
          </div>
        ))}
      </div>
    );
  }



  if (isPlainObject(value)) {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return <span className="kv-muted">{'{}'}</span>;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '.5rem 1rem' }}>
        {entries.map(([k, v]) => (
          <KeyValueRow key={k} k={k} v={v} />
        ))}
      </div>
    );
  }

  return formatValue(value);
};

const EmailChip = ({ verified }) => (
  <span className={`chip ${verified ? 'chip--success' : 'chip--danger'}`}>
    {verified ? 'Email Verified' : 'Not Verified'}
  </span>
);

const UserAuthInfoTab = () => {
 
  const user = useSelector(authUserSelector);
 const dispatch = useDispatch();

  const [sendingLink, setSendingLink] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const topEntries = useMemo(() => {
    if (!user || !isPlainObject(user)) return [];
    const priority = ['id', '_id', 'email', 'name', 'username', 'role'];
    const keys = Object.keys(user);
    const sorted = [
      ...priority.filter((k) => keys.includes(k)),
      ...keys.filter((k) => !priority.includes(k)).sort(),
    ];
    return sorted.map((k) => [k, user[k]]);
  }, [user]);

  if (!user) {
    return <div className="card card--cozy">No user loaded.</div>;
  }

  const email = user.email;
  const emailVerified = !!user.emailVerified || !!user.email_verified;

  const handleSendVerifyLink = async () => {
    if (!email) {
      toast.error('No email found on your account.');
      return;
    }
    setSendingLink(true);
    try {
      const res = await dispatch(sendVerificationEmail(email)).unwrap();
      if (res?.success) toast.success(res.message || 'Verification email sent');
      else toast.error(res?.message || 'Failed to send verification email');
    } finally {
      setSendingLink(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await dispatch(refreshUser()).unwrap();
      if (res?.success) toast.success('Status refreshed');
      else toast.info(res?.message || 'Could not refresh status');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="card card--cozy">
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">Authentication &amp; Session</h2>
          <div className="section-sub">These values come from the current auth context.</div>
        </div>
      </header>

      {/* Email verification */}
      <section className="inline-actions" style={{ justifyContent: 'space-between' }}>
        <div>
          <span className="form-label">Email</span>{' '}
          <span className="kv-mono">{email || <span className="kv-muted">N/A</span>}</span>{' '}
          <EmailChip verified={emailVerified} />
        </div>
        <div className="inline-actions">
          {!emailVerified && (
            <>
              <button className="btn btn-xxs" onClick={handleRefresh} disabled={refreshing}>
                {refreshing ? 'Refreshing…' : 'Refresh status'}
              </button>
              <button
                className="btn btn-xxs btn-outline"
                onClick={handleSendVerifyLink}
                disabled={sendingLink || !email}
              >
                {sendingLink ? 'Sending…' : 'Send verify link'}
              </button>
            </>
          )}
        </div>
      </section>

      {/* Raw auth/user data */}
      <section className="kv-grid" aria-label="Auth fields">
        {topEntries.map(([k, v]) => (
          <KeyValueRow key={k} k={k} v={v} />
        ))}
      </section>
    </div>
  );
};

export default UserAuthInfoTab;
