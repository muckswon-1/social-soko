import React, { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";
import "./user-profile-tab.css";

const getInitials = (first, last, email) => {
  const a = (first || "").trim();
  const b = (last || "").trim();
  if (a || b) return `${a[0] || ""}${b[0] || ""}`.toUpperCase();
  const e = (email || "").trim();
  return e ? e[0].toUpperCase() : "U";
};

const Chip = ({ children, tone = "neutral" }) => (
  <span className={`chip chip--${tone}`}>{children}</span>
);

const Row = ({ label, value, mono = false }) => (
  <div className="pf-row">
    <div className="pf-key">{label}</div>
    <div className={`pf-val ${mono ? "pf-mono" : ""}`}>
      {value ?? <span className="pf-muted">N/A</span>}
    </div>
  </div>
);

const Skeleton = () => (
  <div className="profile-card card">
    <div className="pf-head">
      <div className="pf-avatar pf-skel" />
      <div className="pf-titlewrap">
        <div className="pf-skel pf-line lg" />
        <div className="pf-skel pf-line" />
      </div>
    </div>
    <div className="pf-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="pf-row" key={i}>
          <div className="pf-skel pf-line" />
          <div className="pf-skel pf-line" />
        </div>
      ))}
    </div>
  </div>
);

const UserProfileTab = () => {
  const { user } = useAuth();
  const { profile, loading, fetchUserProfile, updateUserProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialForm = useMemo(() => {
    if (!profile) return { first_name: "", last_name: "", phone: "" };
    return {
      first_name: profile.firstName || "",
      last_name: profile.lastName || "",
      phone: profile.phoneNumber || "",
    };
  }, [profile]);

  const [form, setForm] = useState(initialForm);
  useEffect(() => {
    if (!isEditing) setForm(initialForm);
  }, [initialForm, isEditing]);

  if (loading) return <Skeleton />;
  if (!profile) return <div className="card">No profile data found.</div>;

  const { firstName, lastName, phoneVerified, accountVerified } = profile;

  const initials = getInitials(firstName, lastName, user?.email);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const isDirty =
    form.first_name !== (initialForm.first_name || "") ||
    form.last_name !== (initialForm.last_name || "") ||
    form.phone !== (initialForm.phone || "");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSave = async (e) => {
    e?.preventDefault?.();
    if (!user?.id) return;

    if (!isDirty) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      // backend expects phone_number
      const patch = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone_number: form.phone.trim(),
      };
      const res = await updateUserProfile(user.id, patch);

      if (res?.success) {
        toast.success("Profile updated");
        await fetchUserProfile(user.id);
        setIsEditing(false);
      } else {
        toast.error(res?.message || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setForm(initialForm);
    setIsEditing(false);
  };

  return (
     <div className="profile-card card">
      {/* Header */}
      <header className="pf-head pf-head--tight">
        <div className="pf-avatar" aria-hidden>
          {initials}
        </div>

        <div className="pf-titlewrap">
          <h2 className="pf-title">{fullName || "Your Profile"}</h2>
          <div className="pf-sub">
            <span className="pf-email">{user?.email}</span>
          </div>
        </div>

        <div className="pf-statuswrap">
          <Chip tone={user?.emailVerified ? "success" : "danger"}>
            {user?.emailVerified ? "Email Verified" : "Not Verified"}
          </Chip>
          <Chip tone={phoneVerified ? "success" : "warning"}>
            {phoneVerified ? "Phone Verified" : "Phone Unverified"}
          </Chip>
          <Chip tone={accountVerified ? "success" : "neutral"}>
            {accountVerified ? "Account Verified" : "Verification Pending"}
          </Chip>
        </div>
      </header>

      {/* small inline actions BELOW header */}
<div className="pf-inline-actions">
  {!isEditing ? (
    <button
      type="button"
      className="link-btn"
      onClick={() => setIsEditing(true)}
    >
      Edit
    </button>
  ) : (
    <div className="pf-actions"> {/* <-- added wrapper */}
      <button
        className="btn btn-xxs"            // <- slightly smaller
        onClick={onSave}
        disabled={saving || !isDirty}
      >
        {saving ? "Saving…" : "Save"}
      </button>
      <button
        className="btn btn-xxs btn-outline"
        onClick={onCancel}
        disabled={saving}
        type="button"
      >
        Cancel
      </button>
    </div>
  )}
</div>


      {/* Body */}
      {!isEditing ? (
        <section className="pf-grid" aria-label="Profile details">
          <Row label="First Name" value={firstName || <span className="pf-muted">N/A</span>} />
          <Row label="Last Name" value={lastName || <span className="pf-muted">N/A</span>} />
          <Row label="Phone" value={profile.phoneNumber || <span className="pf-muted">N/A</span>} />
        </section>
      ) : (
        <form className="pf-form" onSubmit={onSave}>
          <div className="pf-form-grid">
            <label className="pf-field">
              <span className="pf-label">First Name</span>
              <input
                className="form-control"
                name="first_name"
                value={form.first_name}
                onChange={onChange}
                autoComplete="given-name"
              />
            </label>

            <label className="pf-field">
              <span className="pf-label">Last Name</span>
              <input
                className="form-control"
                name="last_name"
                value={form.last_name}
                onChange={onChange}
                autoComplete="family-name"
              />
            </label>

            <label className="pf-field">
              <span className="pf-label">Phone</span>
              <input
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={onChange}
                autoComplete="tel"
                inputMode="tel"
              />
            </label>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfileTab;
