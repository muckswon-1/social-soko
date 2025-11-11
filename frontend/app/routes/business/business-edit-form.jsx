// src/routes/business/business-edit-form.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { authUserSelector } from "../../features/auth/authSlice";
import "../../styles/business/business.css"
import { useGetBusinessQuery, useUpdateBusinessMutation } from "../../services/businessApi";
import { toast } from "react-toastify";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const urlRe = /^(https?:\/\/)?([a-z0-9\-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

const slugify = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const emptyForm = (email = "") => ({
  name: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  phone: "",
  email,
  website: "",
  slug: "",
  logo_url: "",
});

export default function BusinessEditForm({isEditing, setIsEditing}) {
  const user = useSelector(authUserSelector);
  const {data} = useGetBusinessQuery(user?.id, {skip: !user?.id});
  const business = data?.business || {}

  const [updateBusiness, { isLoading: isUpdating }] = useUpdateBusinessMutation();

  const initialValues = business;

  const [autoSlug, setAutoSlug] = useState(true);
  const [form, setForm] = useState(() =>
    initialValues
      ? { ...emptyForm(user?.email), ...initialValues }
      : emptyForm(user?.email)
  );

  // keep form in sync if initialValues change (e.g. refetch)
  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
      }));
      // if there is a slug already, default to manual mode
      setAutoSlug(!initialValues.slug);
    }
  }, [initialValues]);

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

  const handleSlugChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      slug: val,
    }));
    // once user types slug manually, turn off auto
    if (autoSlug) setAutoSlug(false);
  };

  const toggleAutoSlug = () => {
    setAutoSlug((on) => {
      const next = !on;
      if (next) {
        // when turning auto back on, regenerate from current name
        setForm((prev) => ({
          ...prev,
          slug: slugify(prev.name),
        }));
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!isValid || isUpdating) return;
    // if (onSave) {
    //   onSave({
    //     ...form,
    //     slug: form.slug ? slugify(form.slug) : "",
    //   });
    // }

    try {
       if(business?.id) {
         await updateBusiness({id: business?.id, businessData: form}).unwrap();
         toast.success("Business updated successfully");
         setIsEditing(false);
       }
    } catch (error) {
        console.error(error);
        toast.error("Failed to update business")
    }


  };



  return (
    <form className="form-grid-2 business-edit-form" onSubmit={handleSubmit}>
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
            onChange={handleSlugChange}
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

      {/* Contact */}
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

      {/* Online */}
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
      <label className="form-field full-width">
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
        <span className="form-label">State / Province</span>
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
      <div className="inline-actions edit-business-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setIsEditing(false)}
          disabled={isUpdating}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn"
          disabled={!isValid || isUpdating}
        >
          {isUpdating ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
