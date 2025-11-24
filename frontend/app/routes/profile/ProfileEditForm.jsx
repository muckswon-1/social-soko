// src/menu/profile/ProfileEditForm.jsx
import React, { useEffect, useState } from "react";

const EMPTY = {
  first_name: "",
  last_name: "",
  phone: "",
  title: "",
  bio: "",
  skills: "",
};

export default function ProfileEditForm({
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({ ...EMPTY, ...(initialValues || {}) });

  useEffect(() => {
    setForm({ ...EMPTY, ...(initialValues || {}) });
  }, [initialValues]);

  const isDirty =
    form.first_name !== (initialValues?.first_name || "") ||
    form.last_name !== (initialValues?.last_name || "") ||
    form.phone !== (initialValues?.phone || "") ||
    form.title !== (initialValues?.title || "") ||
    form.bio !== (initialValues?.bio || "") ||
    form.skills !== (initialValues?.skills || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onSubmit) return;

    if (!isDirty) {
      onCancel?.();
      return;
    }

    onSubmit({
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      title: form.title,
      bio: form.bio,
      skills: form.skills,
    });
  };

  return (
    <form className="form-grid-2" onSubmit={handleSubmit}>
      {/* Basic details */}
      <label className="form-field">
        <span className="form-label">First Name</span>
        <input
          className="form-control"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          autoComplete="given-name"
        />
      </label>

      <label className="form-field">
        <span className="form-label">Last Name</span>
        <input
          className="form-control"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          autoComplete="family-name"
        />
      </label>

      <label className="form-field">
        <span className="form-label">Title</span>
        <input
          className="form-control"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. CEO, Buyer, Sales Lead"
        />
      </label>

      <label className="form-field">
        <span className="form-label">Phone</span>
        <input
          className="form-control"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
          inputMode="tel"
        />
      </label>

      {/* Bio */}
      <label className="form-field form-field-full">
        <span className="form-label">Bio</span>
        <textarea
          className="form-control"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="A short introduction about you and what you do."
        />
      </label>

      {/* Skills */}
      <label className="form-field form-field-full">
        <span className="form-label">Skills</span>
        <textarea
          className="form-control"
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="e.g. Procurement, B2B Wholesale, Logistics, Sales, Product Sourcing"
        />
        <span className="form-hint">
          You can list skills as a sentence or comma-separated values.
        </span>
      </label>

      {/* Actions */}
      <div className="form-actions-right">
        <button
          type="button"
          className="btn btn-xxs btn-outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-xxs"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
