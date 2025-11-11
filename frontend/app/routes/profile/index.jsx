// src/menu/profile/Profile.jsx
import React, { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { authUserSelector } from "../../features/auth/authSlice";
import { getInitials } from "../../utils/passwordUtils";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../../services/profileApi";

import styles from "../../styles/profile/profile.css?url";
import sharedFormStyles from "../../styles/forms/forms.css?url";
import kvStyles from "../../styles/components/key-value.css?url";
import chipStyles from "../../styles/components/chip.css?url";
import Skeleton from "../components/Skeleton";
import Row from "../components/Row";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: kvStyles },
    { rel: "stylesheet", href: chipStyles },
    { rel: "stylesheet", href: sharedFormStyles },
  ];
}

export default function Profile() {
  const user = useSelector(authUserSelector);

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetUserProfileQuery(user?.id, { skip: !user?.id });

  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const profile = profileResponse?.data || null;
  const loading = isProfileLoading;

  const [isEditing, setIsEditing] = useState(false);

  const initialForm = useMemo(() => {
    if (!profile) {
      return { first_name: "", last_name: "", phone: "" };
    }
    return {
      first_name: profile.firstName || "",
      last_name: profile.lastName || "",
      phone: profile.phoneNumber || "",
    };
  }, [profile]);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isEditing) {
      setForm(initialForm);
    }
  }, [initialForm, isEditing]);

  if (loading) return <Skeleton />;

  if (!user?.id) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          No profile data found. Please sign in to view your profile.
        </div>
      </div>
    );
  }

  if (isProfileError || !profile) {
    return (
      <>
        <title>Social Soko | Error</title>
        <div className="layout-empty">
          <div className="layout-empty__inner">
            Error fetching profile data. Please try again later.
          </div>
        </div>
      </>
    );
  }

  const { firstName, lastName, phoneVerified, accountVerified } = profile;
  const initials = getInitials(`${firstName} ${lastName}`);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const isDirty =
    form.first_name !== (initialForm.first_name || "") ||
    form.last_name !== (initialForm.last_name || "") ||
    form.phone !== (initialForm.phone || "");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (e) => {
    e?.preventDefault?.();
    if (!user?.id) return;
    if (!isDirty) {
      setIsEditing(false);
      return;
    }

    const patch = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone: form.phone.trim(),
    };

    try {
      await updateUserProfile({ userId: user.id, patch }).unwrap();
      toast.success("Profile updated");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const onCancel = () => {
    setForm(initialForm);
    setIsEditing(false);
  };

  return (
    <>
      <title>Social Soko | Profile</title>
      <div className="card card--cozy profile-card">
        {/* Header */}
        <header className="section-head profile-header">
          <div className="pf-avatar" aria-hidden="true">
            {initials}
          </div>

          <div className="section-titles">
            <h2 className="section-title">{fullName || "Your Profile"}</h2>
            <div className="section-sub">
              <span className="kv-mono">{user?.email}</span>
            </div>
          </div>

          <div className="section-right profile-chips">
            <span
              className={`chip ${
                user?.emailVerified ? "chip--success" : "chip--danger"
              }`}
            >
              {user?.emailVerified ? "Email Verified" : "Not Verified"}
            </span>
            <span
              className={`chip ${
                phoneVerified ? "chip--success" : "chip--warning"
              }`}
            >
              {phoneVerified ? "Phone Verified" : "Phone Unverified"}
            </span>
            <span
              className={`chip ${
                accountVerified ? "chip--success" : "chip--neutral"
              }`}
            >
              {accountVerified ? "Account Verified" : "Verification Pending"}
            </span>
          </div>
        </header>

        {/* Edit / View toggle */}
        <div className="inline-actions profile-actions">
          {!isEditing ? (
            <button
              type="button"
              className="btn nav-link"
              onClick={() => setIsEditing(true)}
            >
              Edit profile
            </button>
          ) : (
            <>
              <button
                className="btn btn-xxs"
                onClick={onSave}
                disabled={isUpdating || !isDirty}
                type="submit"
              >
                {isUpdating ? "Saving…" : "Save"}
              </button>
              <button
                className="btn btn-xxs btn-outline"
                onClick={onCancel}
                disabled={isUpdating}
                type="button"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Profile Details / Edit Form */}
        {!isEditing ? (
          <section className="kv-grid" aria-label="Profile details">
            <Row
              label="First Name"
              value={firstName || <span className="kv-muted">N/A</span>}
            />
            <Row
              label="Last Name"
              value={lastName || <span className="kv-muted">N/A</span>}
            />
            <Row
              label="Phone"
              value={
                profile.phoneNumber || <span className="kv-muted">N/A</span>
              }
            />
          </section>
        ) : (
          <form className="form-grid-2" onSubmit={onSave}>
            <label className="form-field">
              <span className="form-label">First Name</span>
              <input
                className="form-control"
                name="first_name"
                value={form.first_name}
                onChange={onChange}
                autoComplete="given-name"
              />
            </label>

            <label className="form-field">
              <span className="form-label">Last Name</span>
              <input
                className="form-control"
                name="last_name"
                value={form.last_name}
                onChange={onChange}
                autoComplete="family-name"
              />
            </label>

            <label className="form-field profile-field-full">
              <span className="form-label">Phone</span>
              <input
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={onChange}
                autoComplete="tel"
                inputMode="tel"
              />
            </label>
          </form>
        )}
      </div>
    </>
  );
}
