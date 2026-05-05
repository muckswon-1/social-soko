// src/routes/business/business-edit-form.jsx
import React, { useEffect, useMemo, useState } from "react";
import "../../styles/business/business.css";
import {
  useGetBusinessQuery,
  useUpdateBusinessMutation,
} from "../../services/businessApi";
import { toast } from "react-toastify";
import PhoneSelection from "./PhoneSelection";
import { inferCountryFromPhone } from "../../utils/inferCountryFromPhone";
import { slugify } from "../../utils/slugify";
import BUSINESS_UTILS from "./utils/utils";
import { emailRe, urlRe } from "../../utils/formValidation";
import { mapUiBusinessToApiBusiness } from "./utils/businessTransformers";

 /**
    * @typedef {import("./utils/businessTransformers").Business} Business
    * 
    */

   /**
  * 
  * @typedef {import("../posts/utils/postTransformers").ErrorResponse} BusinessErrors
  */

    /**
    * @typedef {import("./utils/businessTransformers").BusinessForm} BusinessForm
    * 
    */

 

  

  

export default function BusinessEditForm({ setIsEditing }) {
  
  const {
    data,
    isLoading: isBusinessLoading,
    isError: isBusinessError,
    error: businessError,
  } = useGetBusinessQuery(user?.id, { skip: !user?.id });

  const [updateBusiness, { isLoading: isUpdating, isError: isUpdateError, error: updateError }] =
    useUpdateBusinessMutation();

  /**@type {Business} */
  const business = data;

/**@type {BusinessErrors} */
const getBusinessError = businessError;

/**@type {BusinessErrors} */
const updateBusinessError = updateError;




  const initialValues = mapUiBusinessToApiBusiness(business);

  const [autoSlug, setAutoSlug] = useState(true);


  /** @type {[BusinessForm, React.Dispatch<React.SetStateAction<BusinessForm>>]} */
  const [form, setForm] = useState(() =>
    initialValues
      ? { ...BUSINESS_UTILS.getEmptyForm(user?.email), ...initialValues }
      : BUSINESS_UTILS.getEmptyForm(user?.email),
  );

  const [phoneCountryCode, setPhoneCountryCode] = useState("KE");

  // keep form in sync if initialValues change (e.g. refetch)
  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({
        ...prev,
        ...initialValues,
      }));
      // if there is a slug already, default to manual mode
      setAutoSlug(!initialValues.slug);

      const inferred = inferCountryFromPhone(initialValues?.phone);
      if (inferred) {
        setPhoneCountryCode(inferred.code);
      }
    }
  }, [initialValues]);

  // PHONE + FORM UTILS USING BUSINESS_UTILS

  const selectedPhoneCountry = useMemo(
    () => BUSINESS_UTILS.selectedPhoneCountry(phoneCountryCode),
    [phoneCountryCode],
  );

  const phonePlaceHolder = useMemo(
    () => BUSINESS_UTILS.phonePlaceHolder(selectedPhoneCountry),
    [selectedPhoneCountry],
  );

  const isValid = useMemo(
    () => BUSINESS_UTILS.formIsValid({form}),
    [form],
  );

  const onChange = BUSINESS_UTILS.onChange(setForm, autoSlug);

  const handleSlugChange = (e) => BUSINESS_UTILS.handleSlugChange(
    e,
    setForm,
    setAutoSlug,
    autoSlug,
  );

  const toggleAutoSlug = BUSINESS_UTILS.toggleAutoSlug(setAutoSlug, setForm);

  const handlePhoneCountryChange = BUSINESS_UTILS.handlePhoneCountryChange({
    phoneCountryCode,
    setForm,
    setPhoneCountryCode

  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!business?.id || !user?.id) {
      toast.error("Business not found or user not authenticated.");
      return;
    }

    if (!isValid || isUpdating) return;

    // 🚫 Do not send username in payload (locked for now)
    const { username, ...rest } = form;

    const payload = {
      ...rest,
      slug: rest.slug ? slugify(rest.slug) : "",
    };

    try {
      const res = await updateBusiness({
        id: business.id,
        userId: user.id,
        businessData: payload,
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message || "Failed to update business. Please try again.",
      );
    }
  };

  // basic loading / error states
  if (!user) {
    return (
      <div className="business-edit-empty">
        <p>You need to be signed in to edit your business.</p>
      </div>
    );
  }

  if (isBusinessLoading && !business) {
    return (
      <div className="business-edit-empty">
        <p>Loading business details…</p>
      </div>
    );
  }

  if (isBusinessError || !business) {
    return (
      <div className="business-edit-empty">
        <p>Could not load your business.</p>
        {businessError?.data?.message && (
          <pre className="business-edit-error">
            {businessError.data.message}
          </pre>
        )}
      </div>
    );
  }

  return (
    <form className="form-grid-2 business-edit-form" onSubmit={handleSubmit}>
      {/* Username (read-only / disabled for now) */}
      <label className="form-field">
        <span className="form-label">Business Username</span>
        <input
          className="form-control-disabled form-control"
          name="username"
          value={form.username || ""}
          disabled
          readOnly
        />
        <div className="form-hint">
          Username is currently managed by support. Contact us if you need to
          change it.
        </div>
      </label>

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
        {!!form.slug && (
          <div className="form-hint">
            Public URL preview: <code>/b/{slugify(form.slug)}</code>
          </div>
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

      {/* Phone selection (matches create business layout) */}
      <label className="form-field">
        <span className="form-label">Phone</span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ flexBasis: "40%" }}>
            <PhoneSelection
              value={phoneCountryCode}
              onChange={handlePhoneCountryChange}
            />
          </div>

          <div style={{ flex: 1 }}>
            <input
              className="form-control"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder={phonePlaceHolder}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
        </div>
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
