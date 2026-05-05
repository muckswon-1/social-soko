// src/menu/profile/Profile.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import { selectAuthUser } from "../../features/auth/authSlice";
import { getInitials } from "../../utils/passwordUtils";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../../services/profileApi";

import styles from "../../styles/profile/profile.css?url";
import sharedFormStyles from "../../styles/forms/forms.css?url";
import kvStyles from "../../styles/components/key-value.css?url";
import chipStyles from "../../styles/components/chip.css?url";
import logoUploadStyles from "../../styles/business/logo-upload.css?url";
import Skeleton from "../components/Skeleton";
import Row from "../components/Row";
import BusinessMemberships from "./BusinessMemberships";
import ProfileUpload from "./ProfileUpload";
import ProfileEditForm from "./ProfileEditForm";

const isServer = typeof window === "undefined";

const BACKEND_URL =  isServer ? import.meta.env.VITE_API_URL_INTERNAL: import.meta.env.VITE_API_URL_BROWSER;


export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: kvStyles },
    { rel: "stylesheet", href: chipStyles },
    { rel: "stylesheet", href: sharedFormStyles },
    { rel: "stylesheet", href: logoUploadStyles },
  ];
}

export default function Profile() {
  // 🔹 All hooks at the top, no conditionals
  const user = useSelector(selectAuthUser);
  const [isEditing, setIsEditing] = useState(false);
  const [showPicUploader, setShowPicUploader] = useState(false);

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch,
  } = useGetUserProfileQuery(user?.id, { skip: !user?.id });

  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  const profile = profileResponse?.user || null;
  const loading = isProfileLoading;

  let mainContent = null;

  // 🔹 Case 1: still loading
  if (loading) {
    mainContent = <Skeleton />;
  }
  // 🔹 Case 2: no user
  else if (!user?.id) {
    mainContent = (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          No profile data found. Please sign in to view your profile.
        </div>
      </div>
    );
  }
  
  // 🔹 Case 3: error or no profile
  else if (isProfileError || !profile) {
    mainContent = (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          Error fetching profile data. Please try again later.
        </div>
      </div>
    );
  }
  // 🔹 Case 4: happy path – we have a profile
  else {
    const {
      id: profileId,
      first_name,
      last_name,
      account_verified,
      phone,
      email_verified,
      email,
      phone_verified,
      avatar_url,
      title,
      bio,
      skills,
    } = profile;

    const initials = getInitials(`${first_name} ${last_name}`);
    const fullName = [first_name, last_name].filter(Boolean).join(" ");
    const normalizedAvatarUrl = avatar_url
      ? `${BACKEND_URL}${avatar_url}`
      : null;

    const initialFormValues = {
      first_name: first_name || "",
      last_name: last_name || "",
      phone: phone || "",
      title: title || "",
      bio: bio || "",
      skills: skills || "",
    };

    const handleSaveProfile = async (values) => {
      if (!user?.id) return;

      const patch = {
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        phone: values.phone.trim(),
        title: values.title.trim(),
        bio: values.bio.trim(),
        skills: values.skills.trim(),
      };

      try {
        await updateUserProfile({ userId: user.id, patch }).unwrap();
        toast.success("Profile updated");
        setIsEditing(false);
        await refetch();
      } catch {
        toast.error("Failed to update profile");
      }
    };

    mainContent = (
      <>
        <div className="card card--cozy profile-card">
          {/* Header */}
          <header className="section-head profile-header">
            <div className="pf-avatar-wrap">
              <div className="pf-avatar" aria-hidden="true">
                {avatar_url && normalizedAvatarUrl ? (
                  <img src={normalizedAvatarUrl} alt="Profile" />
                ) : (
                  <div className="pf-avatar-placeholder">{initials}</div>
                )}
              </div>

              {avatar_url ? (
                <button
                  type="button"
                  className="pf-avatar-change"
                  onClick={() => setShowPicUploader(true)}
                >
                  Change profile picture
                </button>
              ) : (
                <button
                  type="button"
                  className="pf-avatar-change"
                  onClick={() => setShowPicUploader(true)}
                >
                  Upload profile picture
                </button>
              )}
            </div>

            <div className="section-titles">
              <h2 className="section-title">
                {fullName || "Your Profile"}
              </h2>
              <div className="section-sub">
                <span className="kv-mono">{email}</span>
                {title && (
                  <span
                    className="kv-mono"
                    style={{ marginLeft: "0.5rem" }}
                  >
                    • {title}
                  </span>
                )}
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
                  phone_verified ? "chip--success" : "chip--warning"
                }`}
              >
                {phone_verified
                  ? "Phone Verified"
                  : "Phone Unverified"}
              </span>
              <span
                className={`chip ${
                  account_verified
                    ? "chip--success"
                    : "chip--neutral"
                }`}
              >
                {account_verified
                  ? "Account Verified"
                  : "Verification Pending"}
              </span>
            </div>
          </header>

          {/* Edit / View toggle */}
          <div className="inline-actions profile-actions">
            {!isEditing && (
              <button
                type="button"
                className="btn nav-link"
                onClick={() => setIsEditing(true)}
              >
                Edit profile
              </button>
            )}
          </div>

          {/* Inline profile picture upload editor */}
          {showPicUploader && profileId && (
            <section className="business-logo-editor">
              <ProfileUpload
                profileId={profileId}
                onSkip={() => setShowPicUploader(false)}
                onDone={() => {
                  setShowPicUploader(false);
                  refetch();
                }}
              />
            </section>
          )}

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
                label="Title"
                value={title || <span className="kv-muted">Add a title</span>}
              />
              <Row
                label="Phone"
                value={phone || <span className="kv-muted">N/A</span>}
              />
              <Row
                label="Bio"
                value={
                  bio ? (
                    bio
                  ) : (
                    <span className="kv-muted">
                      Add a short bio so people know who you are.
                    </span>
                  )
                }
              />
              <Row
                label="Skills"
                value={
                  skills ? (
                    skills
                  ) : (
                    <span className="kv-muted">
                      Add your skills or areas of expertise.
                    </span>
                  )
                }
              />
            </section>
          ) : (
            <ProfileEditForm
              initialValues={initialFormValues}
              isSubmitting={isUpdating}
              onSubmit={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </div>

        <div className="profile-memberships">
          <BusinessMemberships />
        </div>
      </>
    );
  }

  return (
    <>
      <title>Social Soko | Profile</title>
      {mainContent}
    </>
  );
}
