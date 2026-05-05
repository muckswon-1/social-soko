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
   const [isEditing, setIsEditing] = useState(false);

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetUserProfileQuery(user?.id, { skip: !user?.id });

  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const profile = profileResponse?.user || null;
  const loading = isProfileLoading;




   const {first_name, last_name, account_verified, phone, email_verified, email, phone_verifed} = profile || {};
   const emptyForm = () => (
     {
      first_name: "",
      last_name: "",
      phone: ""
     }
   );

  const initialForm = useMemo(() => {
    if (!profile) return emptyForm();
    
    return { first_name, last_name , phone };
  }, [profile]);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isEditing) {
      setForm(initialForm);
    }
  }, [initialForm, isEditing]);



 
  const initials = getInitials(`${first_name} ${last_name}`);
  const fullName = [first_name, last_name].filter(Boolean).join(" ");

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
              <span className="kv-mono">{email}</span>
            </div>
          </div>

          <div className="section-right profile-chips">
            <span
              className={`chip ${
                email_verified ? "chip--success" : "chip--danger"
              }`}
            >
              {email_verified ? "Email Verified" : "Not Verified"}
            </span>
            <span
              className={`chip ${
                phone_verifed? "chip--success" : "chip--warning"
              }`}
            >
              {phone_verifed ? "Phone Verified" : "Phone Unverified"}
            </span>
            <span
              className={`chip ${
                account_verified ? "chip--success" : "chip--neutral"
              }`}
            >
              {account_verified ? "Account Verified" : "Verification Pending"}
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
              value={first_name || <span className="kv-muted">N/A</span>}
            />
            <Row
              label="Last Name"
              value={last_name || <span className="kv-muted">N/A</span>}
            />
            <Row
              label="Phone"
              value={
                phone || <span className="kv-muted">N/A</span>
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
