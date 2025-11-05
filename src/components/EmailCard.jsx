import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import './email-card.css';

const EmailCard = () => {
  const { user, refreshUser, sendVerificationEmail } = useAuth();

  const currentEmail = useMemo(() => user?.email || '', [user]);
  const currentVerified = useMemo(
    () => Boolean(user?.emailVerified ?? user?.isEmailVerified),
    [user]
  );

  // UI state
  const [email, setEmail] = useState(currentEmail);
  const [emailVerified, setEmailVerified] = useState(currentVerified);
  const [savingEmail, setSavingEmail] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);
  const [editing, setEditing] = useState(false);

  // keep in sync with context
  useEffect(() => {
    if (!editing) {
      setEmail(currentEmail);
    }
    setEmailVerified(currentVerified);
  }, [currentEmail, currentVerified, editing]);

  const enterEdit = useCallback(() => {
    setEmail(currentEmail);
    setEditing(true);
  }, [currentEmail]);

  const cancelEdit = useCallback(() => {
    setEmail(currentEmail);
    setEditing(false);
  }, [currentEmail]);

  const saveEmail = useCallback(
    async (e) => {
      e.preventDefault();
      if (!editing) return; // only save in edit mode
      if (!email || email === currentEmail) {
        setEditing(false);
        return;
      }

      setSavingEmail(true);
      try {
        await api.patch('/auth/update-email', { email });
        const res = await refreshUser();
        if (res?.success) {
          const u = res.user;
          setEmailVerified(Boolean(u?.emailVerified ?? u?.isEmailVerified));
        }
        setEditing(false);
      } catch (err) {
        console.error(err);
      } finally {
        setSavingEmail(false);
      }
    },
    [email, currentEmail, editing, refreshUser]
  );

  const refreshVerification = useCallback(async () => {
    const res = await refreshUser();
    if (res?.success) {
      const u = res.user;
      setEmailVerified(Boolean(u?.emailVerified ?? u?.isEmailVerified));
    }
  }, [refreshUser]);

  const sendVerification = useCallback(async () => {
    setSendingVerify(true);
    try {
      await sendVerificationEmail(email || currentEmail);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingVerify(false);
    }
  }, [email, currentEmail, sendVerificationEmail]);

  return (
    <div className="emailcard">
      <form onSubmit={saveEmail} className="emailcard-grid">
        <div className="emailcard-field">
          <label className="emailcard-label">Email</label>
          <input
            className="emailcard-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            disabled={!editing}
          />
          <div className="emailcard-hint">
            Status:{' '}
            {emailVerified ? (
              <span className="status-ok">Verified</span>
            ) : (
              <span className="status-warn">Not verified</span>
            )}
          </div>
        </div>

        <div className="emailcard-actions">
          {!emailVerified && !editing && (
            <button
              className="btn btn-outline"
              type="button"
              onClick={refreshVerification}
            >
              Recheck status
            </button>
          )}

          {!editing ? (
            <button
              className="btn"
              type="button"
              onClick={enterEdit}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={cancelEdit}
                disabled={savingEmail}
              >
                Cancel
              </button>
              <button
                className="btn"
                disabled={savingEmail || !email}
                type="submit"
              >
                {savingEmail ? 'Saving…' : 'Save'}
              </button>
            </>
          )}
        </div>
      </form>

      {!emailVerified && (
        <div className="emailcard-footer">
          <button
            className="btn"
            onClick={sendVerification}
            disabled={sendingVerify}
          >
            {sendingVerify ? 'Sending…' : 'Send verification email'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailCard;
