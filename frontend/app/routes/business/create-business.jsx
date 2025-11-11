import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import sharedFormStyles from "../../styles/forms/forms.css?url";
import businessStyles from "../../styles/business/create-business.css?url";
import { authUserSelector } from "../../features/auth/authSlice";
import { useCreateBusinessMutation } from "../../services/businessApi";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const urlRe = /^(https?:\/\/)?([a-z0-9\-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

const slugify = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const DRAFT_KEY_BASE = "ss:create-business-draft:v1";

export function links() {
  return [
    { rel: "stylesheet", href: sharedFormStyles },
    { rel: "stylesheet", href: businessStyles },
  ];
}

export function meta() {
  return [{ title: "My Business | Social Soko" }];
}


const getEmptyForm = (email = "") => (
  {
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    phone: "",
    email: email  || "",
    website: "",
    slug: "",
    logo_url: "",
  }
)

export default function CreateBusiness() {
  const user = useSelector(authUserSelector);

  const [createBusiness, {isLoading: loading}] = useCreateBusinessMutation();

  const [autoSlug, setAutoSlug] = useState(true);
 
  const [form, setForm] = useState(() => getEmptyForm(user?.email));

  const draftKey = useMemo(
    () => `${DRAFT_KEY_BASE}:${user?.id || "anon"}`,
  [user?.id]);

  const hasInitializedRef = useRef(false);

  const isValid = useMemo(() => {
    if (!form.name.trim()) return false;
    if (form.email && !emailRe.test(form.email)) return false;
    if (form.website && !urlRe.test(form.website)) return false;
    return true;
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
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

  const resetForm = () => {
    setForm(getEmptyForm());
  };

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!user?.id) {
        toast.error("Not authenticated");
        return;
      }
      if (!isValid) {
        toast.error("Please fix the highlighted fields.");
        return;
      }
      try {
        const {data} = await createBusiness({userId: user?.id, businessData: form});
        if (data?.success) {
          toast.success(data?.message || "Business created");
          resetForm();
        } else {
          toast.error(data?.message || "Creation failed");
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error creating business";
        toast.error(msg);
      } 
    },
    [form, isValid, user?.id],
  );



  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1️⃣ First run for this component lifecycle: try to LOAD draft.
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;

      try {
        const raw = window.localStorage.getItem(draftKey);

        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            setForm((prev) => ({
              ...prev,
              ...parsed,
              // Always prefer current user email as fallback
              email: parsed.email || user?.email || prev.email,
            }));
          }
        } else {
          // No draft: ensure form at least has user email prefilled
          setForm((prev) => ({
            ...getEmptyForm(user?.email || ""),
            // Keep anything already typed before effect 
            ...prev,
          }));
        }
      } catch (err) {
        console.error("Failed to load create-business draft:", err);
        // Fallback: just ensure email is in place
        setForm((prev) => ({
          ...getEmptyForm(user?.email || ""),
          ...prev,
        }));
      }

      // Important: don't fall through to "persist" logic on this init run.
      return;
    }

    // 2️⃣ Subsequent runs: PERSIST or CLEAR draft based on current form.

    // Consider "empty" only if literally nothing meaningful is filled.
    const hasAnyValue =
      form.name.trim() ||
      form.description.trim() ||
      form.address.trim() ||
      form.city.trim() ||
      form.state.trim() ||
      form.country.trim() ||
      form.postal_code.trim() ||
      form.phone.trim() ||
      form.website.trim() ||
      form.slug.trim() ||
      form.logo_url.trim() ||
      // Only treat email as signal if it's different from the default user email
      (form.email && form.email !== (user?.email || ""));

    if (!hasAnyValue) {
      window.localStorage.removeItem(draftKey);
      return;
    }

    try {
      const payload = {
        ...form,
        email: form.email || user?.email || "",
      };
      window.localStorage.setItem(draftKey, JSON.stringify(payload));
    } catch (err) {
      console.error("Failed to persist create-business draft:", err);
    }
  }, [form, draftKey, user?.email]);

  if (!user) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          You need to be signed in to create a business.
        </div>
      </div>
    );
  }

  return (
    <div className="card card--cozy create-business-card">
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">Create Business</h2>
          <p className="section-sub">
            Set up your business profile. We’ll use this to power your public
            presence and connections.
          </p>
        </div>
      </header>

      <form className="form-grid-2" onSubmit={submit}>
        {/* Name */}
        <label className="form-field">
          <span className="form-label">Business Name *</span>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Acme Co."
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
                const val = e.target.value;
                setForm((s) => ({
                  ...s,
                  slug: val,
                }));
                if (autoSlug) setAutoSlug(false);
              }}
              placeholder="acme-co"
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
            placeholder="owner@acme.com"
            autoComplete="email"
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
            placeholder="+254 ..."
            autoComplete="tel"
            inputMode="tel"
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
            placeholder="https://example.com"
            inputMode="url"
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
            placeholder="https://cdn.example.com/logo.png"
            inputMode="url"
          />
        </label>

        {/* Description */}
        <label
          className="form-field"
          style={{
            gridColumn: "1 / -1",
          }}
        >
          <span className="form-label">Description</span>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="What does your business do?"
            rows={3}
          />
        </label>

        {/* Address */}
        <label className="form-field">
          <span className="form-label">Address</span>
          <input
            className="form-control"
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="123 Market St"
            autoComplete="street-address"
          />
        </label>

        <label className="form-field">
          <span className="form-label">City</span>
          <input
            className="form-control"
            name="city"
            value={form.city}
            onChange={onChange}
            placeholder="Nairobi"
            autoComplete="address-level2"
          />
        </label>

        <label className="form-field">
          <span className="form-label">State/Province</span>
          <input
            className="form-control"
            name="state"
            value={form.state}
            onChange={onChange}
            placeholder="Nairobi County"
            autoComplete="address-level1"
          />
        </label>

        <label className="form-field">
          <span className="form-label">Country</span>
          <input
            className="form-control"
            name="country"
            value={form.country}
            onChange={onChange}
            placeholder="Kenya"
            autoComplete="country-name"
          />
        </label>

        <label className="form-field">
          <span className="form-label">Postal Code</span>
          <input
            className="form-control"
            name="postal_code"
            value={form.postal_code}
            onChange={onChange}
            placeholder="00100"
            autoComplete="postal-code"
          />
        </label>

        {/* Actions */}
        <div className="inline-actions create-business-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={resetForm}
            disabled={loading}
          >
            Reset
          </button>
          <button className="btn" disabled={!isValid || loading}>
            {loading ? "Creating…" : "Create Business"}
          </button>
        </div>
      </form>
    </div>
  );
}
