import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import './user-auth-info-tab.css';

const isPlainObject = (v) =>
  Object.prototype.toString.call(v) === '[object Object]';

const isIsoDateLike = (v) =>
  typeof v === 'string' &&
  /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2}(\.\d{3})?)?Z?)?$/.test(v);

const formatValue = (v) => {
  if (v === null) return <span className="ai-muted">null</span>;
  if (v === undefined) return <span className="ai-muted">undefined</span>;
  if (typeof v === 'boolean') return <span className="ai-mono">{String(v)}</span>;
  if (typeof v === 'number') return <span className="ai-mono">{v}</span>;
  if (typeof v === 'string') {
    if (isIsoDateLike(v)) {
      const d = new Date(v);
      if (!isNaN(d)) {
        return <time title={d.toISOString()}>{d.toLocaleString()}</time>;
      }
    }
    if (v.length > 120) return <pre className="ai-pre">{v}</pre>;
    return <span className="ai-text">{v}</span>;
  }
  return <span className="ai-text">{String(v)}</span>;
};

const prettyKey = (k) =>
  k
    .replace(/[_\-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\b(id)\b/i, 'ID')
    .replace(/\burl\b/i, 'URL')
    .replace(/\bip\b/i, 'IP')
    .replace(/\buuid\b/i, 'UUID')
    .replace(/\b2fa\b/i, '2FA')
    .replace(/\s+/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

const KeyValueRow = ({ k, v }) => (
  <div className="ai-row">
    <div className="ai-key">{prettyKey(k)}</div>
    <div className="ai-val">
      <ValueRenderer value={v} />
    </div>
  </div>
);

const ValueRenderer = ({ value }) => {
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="ai-muted">[]</span>;
    return (
      <div className="ai-array">
        {value.map((item, idx) => (
          <div key={idx} className="ai-array-item">
            {isPlainObject(item) || Array.isArray(item) ? (
              <details className="ai-details">
                <summary className="ai-summary">Item {idx + 1}</summary>
                <div className="ai-nested">
                  <ValueRenderer value={item} />
                </div>
              </details>
            ) : (
              <span className="ai-bullet">•</span>
            )}
            {!isPlainObject(item) && !Array.isArray(item) && (
              <span className="ai-inline">{formatValue(item)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return <span className="ai-muted">{'{}'}</span>;
    return (
      <div className="ai-nested-obj">
        {entries.map(([k, v]) => (
          <KeyValueRow key={k} k={k} v={v} />
        ))}
      </div>
    );
  }

  return formatValue(value);
};

const EmailChip = ({ verified }) => (
  <span className={`ai-chip ${verified ? 'ai-chip--success' : 'ai-chip--danger'}`}>
    {verified ? 'Email Verified' : 'Not Verified'}
  </span>
);

const UserAuthInfoTab = () => {
  const { user, refreshUser, sendVerificationEmail } = useAuth();
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
    return (
      <div className="authinfo-card card">
        <div className="ai-empty">No user loaded.</div>
      </div>
    );
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
      const res = await sendVerificationEmail(email);
      if (res?.ok) toast.success(res.message || 'Verification email sent');
      else toast.error(res?.message || 'Failed to send verification email');
    } finally {
      setSendingLink(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await refreshUser();
      if (res?.success) toast.success('Status refreshed');
      else toast.info(res?.message || 'Could not refresh status');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="authinfo-card card">
      <header className="ai-head">
        <h2 className="ai-title">Authentication & Session</h2>
        <div className="ai-sub">These values come from the current auth context.</div>
      </header>

      {/* Email verification only */}
      <section className="ai-block">
        <div className="ai-block-head">
          <div className="ai-emline">
            <span className="ai-emlabel">Email</span>
            <span className="ai-emvalue ai-mono">{email || <span className="ai-muted">N/A</span>}</span>
            <EmailChip verified={emailVerified} />
          </div>
          <div className="ai-block-actions">
  {
    !emailVerified && (
      <button className="btn btn-xxs" onClick={handleRefresh} disabled={refreshing}>
    {refreshing ? 'Refreshing…' : 'Refresh status'}
  </button>
    )

    
  }
  {!emailVerified && (
    <button
      className="btn btn-xxs btn-outline"
      onClick={handleSendVerifyLink}
      disabled={sendingLink || !email}
    >
      {sendingLink ? 'Sending…' : 'Send verify link'}
    </button>
  )}
</div>

        </div>
      </section>

      {/* Raw auth/user data */}
      <section className="ai-grid" aria-label="Auth fields">
        {topEntries.map(([k, v]) => (
          <KeyValueRow key={k} k={k} v={v} />
        ))}
      </section>
    </div>
  );
};

export default UserAuthInfoTab;
