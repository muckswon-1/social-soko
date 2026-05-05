// src/routes/business/$businessId/profile.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useSelector } from "react-redux";

import { selectAuthUser } from "../../features/auth/authSlice";
import {
  useGetBusinessQuery,
  useUpdateBusinessMutation,
} from "../../services/businessApi";

import countryCodes from "../../utils/CountryCodes.json";

import "../../styles/business/business.css";
import "../../styles/business/business-profile.css";

/**
 * @typedef {import("../../types/business").Business} Business
 */

function formatLabel(value) {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getVerificationTone(status) {
  if (status === "verified") return "verified";
  if (status === "requested") return "requested";
  if (status === "rejected") return "danger";
  if (status === "pending") return "warning";
  return "neutral";
}

function getCountryByCode(code) {
  if (!code) return null;

  return (
    countryCodes.find(
      (country) =>
        String(country.code).toUpperCase() === String(code).toUpperCase()
    ) || null
  );
}

function getCountryByName(name) {
  if (!name) return null;

  return (
    countryCodes.find(
      (country) =>
        String(country.name).toLowerCase() === String(name).toLowerCase()
    ) || null
  );
}

function getCountryByDialCode(phoneNumber) {
  if (!phoneNumber) return null;

  const normalizedPhone = String(phoneNumber).trim();

  return (
    countryCodes
      .slice()
      .sort((a, b) => String(b.dial_code).length - String(a.dial_code).length)
      .find((country) => normalizedPhone.startsWith(country.dial_code)) || null
  );
}

function stripDialCode(phoneNumber, country) {
  if (!phoneNumber) return "";

  const normalizedPhone = String(phoneNumber).trim();

  if (country?.dial_code && normalizedPhone.startsWith(country.dial_code)) {
    return normalizedPhone
      .slice(country.dial_code.length)
      .replace(/^[\s-]+/, "")
      .trim();
  }

  return normalizedPhone;
}

function getInitialPhoneCountry(business) {
  const byPhone = getCountryByDialCode(business?.phoneNumber);
  if (byPhone) return byPhone;

  const byBusinessCountry = getCountryByName(business?.country);
  if (byBusinessCountry) return byBusinessCountry;

  return getCountryByCode("KE") || countryCodes[0];
}

function getInitialForm(business) {
  const phoneCountry = getInitialPhoneCountry(business);

  return {
    name: business?.name || "",
    username: business?.username || "",
    slug: business?.slug || "",
    description: business?.description || "",
    website: business?.website || "",
    email: business?.email || "",

    countryIso2: phoneCountry?.code || "KE",
    localPhone: stripDialCode(business?.phoneNumber, phoneCountry),

    address: business?.address || "",
    city: business?.city || "",
    state: business?.state || "",
    country: business?.country || "",
    postal_code: business?.postalCode || "",
  };
}

function buildChangedPayload(originalForm, currentForm) {
  return Object.entries(currentForm).reduce((payload, [key, value]) => {
    const originalValue = originalForm[key] || "";
    const currentValue = value || "";

    if (originalValue === currentValue) {
      return payload;
    }

    if (key === "countryIso2" || key === "localPhone") {
      payload.countryIso2 = currentForm.countryIso2 || "";
      payload.localPhone = currentForm.localPhone || "";
      return payload;
    }

    payload[key] = currentValue;
    return payload;
  }, {});
}

function BusinessProfileBadge({ children, tone = "neutral" }) {
  return (
    <span className={`business-profile__badge business-profile__badge--${tone}`}>
      {children}
    </span>
  );
}

function FieldDisplay({ label, value, href }) {
  const hasValue =
    value !== undefined && value !== null && String(value).trim() !== "";

  return (
    <div className="business-profile__field-display">
      <span className="business-profile__field-label">{label}</span>

      {hasValue ? (
        href ? (
          <a
            className="business-profile__field-value business-profile__field-link"
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </a>
        ) : (
          <span className="business-profile__field-value">{value}</span>
        )
      ) : (
        <span className="business-profile__field-value business-profile__field-value--empty">
          Not added yet
        </span>
      )}
    </div>
  );
}

function EditableField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  textarea = false,
  disabled = false,
}) {
  return (
    <label className="business-profile__input-group">
      <span className="business-profile__input-label">{label}</span>

      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={5}
          className="business-profile__textarea"
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="business-profile__input"
        />
      )}
    </label>
  );
}

function EditablePhoneField({
  countryIso2,
  localPhone,
  onChange,
  disabled = false,
}) {
  const selectedCountry = getCountryByCode(countryIso2) || getCountryByCode("KE");

  return (
    <div className="business-profile__input-group business-profile__phone-group">
      <span className="business-profile__input-label">Phone</span>

      <div className="business-profile__phone-row">
        <select
          name="countryIso2"
          value={countryIso2}
          onChange={onChange}
          disabled={disabled}
          className="business-profile__select business-profile__phone-select"
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name} ({country.dial_code})
            </option>
          ))}
        </select>

        <input
          name="localPhone"
          type="tel"
          value={localPhone}
          onChange={onChange}
          disabled={disabled}
          className="business-profile__input business-profile__phone-input"
          placeholder={`${selectedCountry?.dial_code || "+254"} ...`}
        />
      </div>
    </div>
  );
}

export function meta() {
  return [{ title: "Business Profile | Social Soko" }];
}

export default function BusinessProfileRoute() {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useSelector(selectAuthUser);
  const userId = user?.id || null;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBusinessQuery(businessId, {
    skip: !userId || !businessId,
    refetchOnMountOrArgChange: true,
  });

  const [updateBusiness, updateState] = useUpdateBusinessMutation();

  const business = data?.business || null;
  const membership = data?.membership || null;

  const membershipRole = data?.membershipRole || membership?.role || null;
  const membershipStatus = data?.membershipStatus || membership?.status || null;

  const roleCanManage = membershipRole === "owner" || membershipRole === "admin";

  const permissions = {
    canManage: data?.permissions?.canManage ?? roleCanManage,
    canEdit: data?.permissions?.canEdit ?? roleCanManage,
    canManageMembers: data?.permissions?.canManageMembers ?? roleCanManage,
    canViewPrivateDetails:
      data?.permissions?.canViewPrivateDetails ?? roleCanManage,
  };

  const canManage = Boolean(permissions.canManage || roleCanManage);
  const canEdit = Boolean(permissions.canEdit || roleCanManage);
  const canManageMembers = Boolean(permissions.canManageMembers || roleCanManage);

  const modeFromUrl = searchParams.get("mode");
  const shouldStartEditing = modeFromUrl === "edit" && canEdit;

  const originalForm = useMemo(() => getInitialForm(business), [business]);

  const [form, setForm] = useState(originalForm);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setForm(originalForm);
  }, [originalForm]);

  useEffect(() => {
    if (shouldStartEditing) {
      setIsEditing(true);
    }
  }, [shouldStartEditing]);

  const changedPayload = useMemo(
    () => buildChangedPayload(originalForm, form),
    [originalForm, form]
  );

  const hasChanges = Object.keys(changedPayload).length > 0;

  const verificationStatus = business?.verificationStatus || "unverified";
  const verificationTone = getVerificationTone(verificationStatus);

  const websiteHref =
    business?.website && /^https?:\/\//i.test(business.website)
      ? business.website
      : business?.website
        ? `https://${business.website}`
        : null;

  const locationLine = [
    business?.address,
    business?.city,
    business?.state,
    business?.country,
    business?.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  function onInputChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setSaveMessage("");
    setSaveError("");
  }

  function onEditClick() {
    if (!canEdit) return;

    setIsEditing(true);
    setSearchParams({ mode: "edit" });
  }

  function onCancelClick() {
    setForm(originalForm);
    setIsEditing(false);
    setSaveMessage("");
    setSaveError("");
    setSearchParams({});
  }

  async function onSaveClick() {
    if (!canEdit || !business?.id || !userId) return;

    if (!hasChanges) {
      setSaveMessage("No profile changes to save.");
      setSaveError("");
      return;
    }

    try {
      setSaveMessage("");
      setSaveError("");

      await updateBusiness({
        id: business.id,
        businessData: changedPayload,
      }).unwrap();

      setIsEditing(false);
      setSearchParams({});
      setSaveMessage("Business profile updated successfully.");
      await refetch();
    } catch (saveErr) {
      setSaveError(
        saveErr?.error ||
          saveErr?.message ||
          "Could not update this business profile."
      );
    }
  }

  if (!userId) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          You need to be signed in to view this business profile.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">Loading business profile…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          <div className="stack-sm">
            <div>
              {error?.error || "An error occurred while loading this profile."}
            </div>

            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => refetch()}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          <div className="stack-sm">
            <div>We couldn&apos;t find that business.</div>

            <div className="row-center">
              <Link to="/business" className="btn btn-secondary">
                Back to My Businesses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="business-profile">
      <section className="business-profile__hero">
        <div className="business-profile__cover" />

        <div className="business-profile__hero-content">
          <div className="business-profile__identity-row">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="business-profile__logo"
              />
            ) : (
              <div className="business-profile__logo business-profile__logo--fallback">
                {business?.name?.slice(0, 1)?.toUpperCase() || "B"}
              </div>
            )}

            <div className="business-profile__identity-copy">
              <p className="business-profile__eyebrow">Business profile</p>
              <h1 className="business-profile__title">{business.name}</h1>

              <div className="business-profile__handle">
                @{business.username || business.slug || "business"}
              </div>

              <div className="business-profile__badges">
                <BusinessProfileBadge tone={verificationTone}>
                  {formatLabel(verificationStatus)}
                </BusinessProfileBadge>

                <BusinessProfileBadge tone="role">
                  {formatLabel(membershipRole)}
                </BusinessProfileBadge>

                <BusinessProfileBadge tone="status">
                  {formatLabel(membershipStatus)}
                </BusinessProfileBadge>
              </div>
            </div>
          </div>

          <div className="business-profile__hero-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/business/${business.id}`)}
            >
              Back to overview
            </button>

            {canEdit && !isEditing ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onEditClick}
              >
                Edit profile
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {saveMessage ? (
        <div className="business-profile__notice business-profile__notice--success">
          {saveMessage}
        </div>
      ) : null}

      {saveError ? (
        <div className="business-profile__notice business-profile__notice--error">
          {saveError}
        </div>
      ) : null}

      {!canEdit ? (
        <div className="business-profile__notice business-profile__notice--info">
          You have {formatLabel(membershipRole)} access. Only owners and admins
          can edit this profile.
        </div>
      ) : null}

      <div className="business-profile__grid">
        <main className="business-profile__main">
          <section className="card business-profile__section">
            <div className="business-profile__section-header">
              <div>
                <p className="business-profile__eyebrow">Public identity</p>
                <h2 className="business-profile__section-title">
                  How this business appears on Social Soko
                </h2>
              </div>

              {isEditing ? (
                <div className="business-profile__edit-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={onCancelClick}
                    disabled={updateState.isLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onSaveClick}
                    disabled={updateState.isLoading || !hasChanges}
                  >
                    {updateState.isLoading ? "Saving…" : "Save changes"}
                  </button>
                </div>
              ) : null}
            </div>

            {isEditing ? (
              <div className="business-profile__form-grid">
                <EditableField
                  label="Business name"
                  name="name"
                  value={form.name}
                  onChange={onInputChange}
                  placeholder="Example: Prairie Grid Components Ltd"
                  disabled={updateState.isLoading}
                />

                <EditableField
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={onInputChange}
                  placeholder="prairie_grid"
                  disabled={updateState.isLoading}
                />

                <EditableField
                  label="Slug"
                  name="slug"
                  value={form.slug}
                  onChange={onInputChange}
                  placeholder="prairie-grid-components"
                  disabled={updateState.isLoading}
                />

                <EditableField
                  label="Website"
                  name="website"
                  value={form.website}
                  onChange={onInputChange}
                  placeholder="https://example.com"
                  disabled={updateState.isLoading}
                />

                <div className="business-profile__form-full">
                  <EditableField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={onInputChange}
                    placeholder="Describe what this business supplies, buys, sells, or specializes in."
                    textarea
                    disabled={updateState.isLoading}
                  />
                </div>
              </div>
            ) : (
              <div className="business-profile__display-grid">
                <FieldDisplay label="Business name" value={business.name} />
                <FieldDisplay label="Username" value={business.username} />
                <FieldDisplay label="Slug" value={business.slug} />
                <FieldDisplay
                  label="Website"
                  value={business.website}
                  href={websiteHref}
                />

                <div className="business-profile__display-full">
                  <FieldDisplay
                    label="Description"
                    value={business.description}
                  />
                </div>
              </div>
            )}
          </section>

          <section className="card business-profile__section">
            <div className="business-profile__section-header">
              <div>
                <p className="business-profile__eyebrow">
                  Contact and location
                </p>
                <h2 className="business-profile__section-title">
                  Business contact details
                </h2>
              </div>
            </div>

            {isEditing ? (
              <div className="business-profile__form-grid">
                <EditableField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onInputChange}
                  placeholder="sales@example.com"
                  disabled={updateState.isLoading}
                />

                <EditablePhoneField
                  countryIso2={form.countryIso2}
                  localPhone={form.localPhone}
                  onChange={onInputChange}
                  disabled={updateState.isLoading}
                />

                <EditableField
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={onInputChange}
                  placeholder="Street address"
                  disabled={updateState.isLoading}
                />

                <EditableField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={onInputChange}
                  placeholder="City"
                  disabled={updateState.isLoading}
                />

                <EditableField
                  label="State / Province"
                  name="state"
                  value={form.state}
                  onChange={onInputChange}
                  placeholder="State or province"
                  disabled={updateState.isLoading}
                />

                <EditableField
                  label="Country"
                  name="country"
                  value={form.country}
                  onChange={onInputChange}
                  placeholder="Country"
                  disabled={updateState.isLoading}
                />

                <EditableField
                  label="Postal code"
                  name="postal_code"
                  value={form.postal_code}
                  onChange={onInputChange}
                  placeholder="Postal code"
                  disabled={updateState.isLoading}
                />
              </div>
            ) : (
              <div className="business-profile__display-grid">
                <FieldDisplay label="Email" value={business.email} />
                <FieldDisplay label="Phone" value={business.phoneNumber} />
                <FieldDisplay label="Address" value={business.address} />
                <FieldDisplay label="City" value={business.city} />
                <FieldDisplay label="State / Province" value={business.state} />
                <FieldDisplay label="Country" value={business.country} />
                <FieldDisplay label="Postal code" value={business.postalCode} />

                <div className="business-profile__display-full">
                  <FieldDisplay label="Full location" value={locationLine} />
                </div>
              </div>
            )}
          </section>
        </main>

        <aside className="business-profile__sidebar">
          <section className="card business-profile__side-card business-profile__trust-card">
            <p className="business-profile__eyebrow">Trust status</p>
            <h2 className="business-profile__side-title">
              {formatLabel(verificationStatus)}
            </h2>

            <p className="business-profile__side-copy">
              Verification helps buyers and sellers trust that this business is
              legitimate.
            </p>

            <div className="business-profile__trust-meta">
              <div>
                <span>Requested</span>
                <strong>{formatDate(business.verificationRequestedAt)}</strong>
              </div>

              <div>
                <span>Verified</span>
                <strong>{formatDate(business.verifiedAt)}</strong>
              </div>

              <div>
                <span>Rejected</span>
                <strong>{formatDate(business.verificationRejectedAt)}</strong>
              </div>
            </div>

            {business.verificationRejectedReason ? (
              <div className="business-profile__rejection-note">
                {business.verificationRejectedReason}
              </div>
            ) : null}

            {canManage && verificationStatus !== "verified" ? (
              <button
                type="button"
                className="btn btn-secondary business-profile__wide-btn"
              >
                Request verification
              </button>
            ) : null}
          </section>

          <section className="card business-profile__side-card">
            <p className="business-profile__eyebrow">Access</p>
            <h2 className="business-profile__side-title">Your role</h2>

            <div className="business-profile__permission-list">
              <div>
                <span>Role</span>
                <strong>{formatLabel(membershipRole)}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{formatLabel(membershipStatus)}</strong>
              </div>

              <div>
                <span>Edit profile</span>
                <strong>{canEdit ? "Allowed" : "Not allowed"}</strong>
              </div>

              <div>
                <span>Manage members</span>
                <strong>{canManageMembers ? "Allowed" : "Not allowed"}</strong>
              </div>
            </div>

            {canManageMembers ? (
              <button
                type="button"
                className="btn btn-ghost business-profile__wide-btn"
                onClick={() => navigate(`/business-memberships/${business.id}`)}
              >
                Manage members
              </button>
            ) : null}
          </section>

          <section className="card business-profile__side-card">
            <p className="business-profile__eyebrow">System record</p>
            <h2 className="business-profile__side-title">Profile metadata</h2>

            <div className="business-profile__permission-list">
              <div>
                <span>Created</span>
                <strong>{formatDate(business.createdAt)}</strong>
              </div>

              <div>
                <span>Updated</span>
                <strong>{formatDate(business.updatedAt)}</strong>
              </div>

              <div>
                <span>Business ID</span>
                <strong className="business-profile__mono">
                  {business.id}
                </strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}