import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import formsStyles from "../../styles/forms/forms.css?url";
import businessStyles from "../../styles/business/create-business.css?url"; // reuse styling from CreateBusiness

export function links() {
  return [
    { rel: "stylesheet", href: formsStyles },
    { rel: "stylesheet", href: businessStyles },
  ];
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const urlRe = /^(https?:\/\/)?([a-z0-9\-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

const slugify = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function UpdateBusiness({ business, onUpdated }) {
  // Pre-fill with existing data
  const [form, setForm] = useState(() => ({
    name: business?.name || "",
    description: business?.description || "",
    address: business?.address || "",
    city: business?.city || "",
    state: business?.state || "",
    country: business?.country || "",
    postal_code: business?.postal_code || "",
    phone: business?.phone || "",
    email: business?.email || "",
    website: business?.website || "",
    slug: business?.slug || "",
    logo_url: business?.logo_url || "",
  }));

  const [autoSlug, setAutoSlug] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => {
    if (!form.name.trim()) return false;
    if (form.email && !emailRe.test(form.email)) return false;
    if (form.website && !urlRe.test(form.website)) return false;
    return true;
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => {
      const next = { ...s, [name]: value };
      if (name === "name" && autoSlug) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const toggleAutoSlug = () => {
    setAutoSlug((v) => !v);
    if (!autoSlug) {
      setForm((s) => ({ ...s, slug: slugify(s.name) }));
    }
  };

  const handleReset = () => {
    if (!business) return;
    setForm({
      name: business.name || "",
      description: business.description || "",
      address: business.address || "",
      city: business.city || "",
      state: business.state || "",
      country: business.country || "",
      postal_code: business.postal_code || "",
      phone: business.phone || "",
      email: business.email || "",
      website: business.website || "",
      slug: business.slug || "",
      logo_url: business.logo_url || "",
    });
    toast.info("Form reset to original values");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Please fix highlighted fields before saving.");
      return;
    }
    setLoading(true);
    // Placeholder for update logic
    setTimeout(() => {
      setLoading(false);
      toast.success("Business details updated.");
      onUpdated?.(form);
    }, 800);
  };

  return (
    <div className="card card--cozy create-business-card">
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">Update Business</h2>
          <p className="section-sub">
            Modify details for your existing business.{" "}
            <span className="muted">Save changes to apply immediately.</span>
          </p>
        </div>
      </header>

      <form className="form-grid-2" onSubmit={handleSubmit}>
        {/* Name */}
        <label className="form-field">
          <span className="form-label">Business Name *</span>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
          {!form.name.trim() && (
            <div className="form-error">Name is required</div>
          )}
        </label>

        {/* Slug */}
        <label className="form-field">
          <span className="form-label">
            Slug {autoSlug && <span className="muted">(auto)</span>}
          </span>
          <div className="input-affix">
            <input
              className="form-control"
              name="slug"
              value={form.slug}
              onChange={(e) => {
                setForm((s) => ({ ...s, slug: e.target.value }));
                if (autoSlug) setAutoSlug(false);
              }}
            />
            <button
              type="button"
              className="btn btn-xxs btn-ghost"
              onClick={toggleAutoSlug}
            >
              {autoSlug ? "Manual" : "Auto"}
            </button>
          </div>
          {!!form.slug && form.slug !== slugify(form.slug) && (
            <div className="form-hint">Slug will be sanitized on save.</div>
          )}
        </label>

        {/* Email */}
        <label className="form-field">
          <span className="form-label">Contact Email</span>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
          />
          {form.email && !emailRe.test(form.email) && (
            <div className="form-error">Enter a valid email</div>
          )}
        </label>

        {/* Phone */}
        <label className="form-field">
          <span className="form-label">Phone</span>
          <input
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={onChange}
          />
        </label>

        {/* Website */}
        <label className="form-field">
          <span className="form-label">Website</span>
          <input
            className="form-control"
            name="website"
            value={form.website}
            onChange={onChange}
          />
          {form.website && !urlRe.test(form.website) && (
            <div className="form-error">Enter a valid URL</div>
          )}
        </label>

        {/* Logo */}
        <label className="form-field">
          <span className="form-label">Logo URL</span>
          <input
            className="form-control"
            name="logo_url"
            value={form.logo_url}
            onChange={onChange}
          />
        </label>

        {/* Description */}
        <label className="form-field" style={{ gridColumn: "1 / -1" }}>
          <span className="form-label">Description</span>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Describe your business..."
            rows={3}
          />
        </label>

        {/* Address details */}
        <label className="form-field">
          <span className="form-label">Address</span>
          <input
            className="form-control"
            name="address"
            value={form.address}
            onChange={onChange}
          />
        </label>

        <label className="form-field">
          <span className="form-label">City</span>
          <input
            className="form-control"
            name="city"
            value={form.city}
            onChange={onChange}
          />
        </label>

        <label className="form-field">
          <span className="form-label">State / Province</span>
          <input
            className="form-control"
            name="state"
            value={form.state}
            onChange={onChange}
          />
        </label>

        <label className="form-field">
          <span className="form-label">Country</span>
          <input
            className="form-control"
            name="country"
            value={form.country}
            onChange={onChange}
          />
        </label>

        <label className="form-field">
          <span className="form-label">Postal Code</span>
          <input
            className="form-control"
            name="postal_code"
            value={form.postal_code}
            onChange={onChange}
          />
        </label>

        {/* Action buttons */}
        <div
          className="inline-actions create-business-actions"
          style={{ gridColumn: "1 / -1", justifyContent: "space-between" }}
        >
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>

          <button className="btn" disabled={!isValid || loading}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
