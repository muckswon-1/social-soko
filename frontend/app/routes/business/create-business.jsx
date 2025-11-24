import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import sharedFormStyles from "../../styles/forms/forms.css?url";
import businessStyles from "../../styles/business/create-business.css?url";
import logoUploadStyles from "../../styles/business/logo-upload.css?url";
import { ImageUp } from "lucide-react";
import { authUserSelector } from "../../features/auth/authSlice";
import {
  useCreateBusinessMutation,
  useLazyCheckBusinessSlugQuery,
  useLazyCheckBusinessUsernameQuery,
} from "../../services/businessApi";
import { emailRe, urlRe } from "../../utils/formValidation";
import { useNavigate } from "react-router";
import BusinessLogoUpload from "./BusinessLogoUpload";



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
    { rel: "stylesheet", href: logoUploadStyles },
  ];
}

export function meta() {
  return [{ title: "My Business | Social Soko" }];
}

const getEmptyForm = (email = "") => ({
  username: "",
  name: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  phone: "",
  email: email || "",
  website: "",
  slug: "",
});

export default function CreateBusiness() {
  const user = useSelector(authUserSelector);
  const navigate = useNavigate();

  const [createBusiness, { isLoading: loading, error }] =
    useCreateBusinessMutation();

  const [
    triggerUsernameCheck,
    { isFetching: isCheckingUsername },
  ] = useLazyCheckBusinessUsernameQuery();

  const [
    triggerSlugCheck,
    { isFetching: isCheckingSlug },
  ] = useLazyCheckBusinessSlugQuery();

  const errorMessage = error?.data?.message || error?.message || "";

  const [autoSlug, setAutoSlug] = useState(true);
  const [form, setForm] = useState(() => getEmptyForm(user?.email));

  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [slugStatus, setSlugStatus] = useState("idle");

  const [usernameStatusMessage, setUsernameStatusMessage] = useState("");
  const [slugStatusMessage, setSlugStatusMessage] = useState("");

  const draftKey = useMemo(
    () => `${DRAFT_KEY_BASE}:${user?.id || "anon"}`,
    [user?.id],
  );

  const hasInitializedRef = useRef(false);

  const [step, setStep] = useState(1);
  const [createdBusinessId, setCreatedBusinessId] = useState(null);

  const isValid = useMemo(() => {
    if (!form.username.trim()) return false;
    if (!form.name.trim()) return false;
    if (form.email && !emailRe.test(form.email)) return false;
    if (form.website && !urlRe.test(form.website)) return false;

    if (usernameStatus === "taken" || usernameStatus === "invalid")
      return false;

    if (form.slug.trim() && slugStatus === "taken") return false;

    return true;
  }, [form, usernameStatus, slugStatus]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "name") {
        if (autoSlug) {
          next.slug = slugify(value);
        }
        if (!prev.username?.trim()) {
          next.username = slugify(value);
        }
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
    setForm(getEmptyForm(user?.email || ""));
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
        const { success, business, message } = await createBusiness({
          userId: user?.id,
          businessData: form,
        }).unwrap();

        if (success) {
          const bizId = business?.id;

          if (!bizId) {
            toast.success(message || "Business created");
            navigate("/dashboard/business", { replace: true });
            return;
          }

          toast.success(
            message || "Business created. Next, upload a business logo",
          );

          setCreatedBusinessId(bizId);
          setStep(2);
          window.localStorage.removeItem(draftKey);
        } else {
          toast.error(message || "Creation failed");
        }
      } catch (err) {
        const msg = err?.message || "Error creating business";
        toast.error(msg);
      }
    },
    [form, isValid, user?.id, createBusiness, navigate, draftKey],
  );

  const businessHandlePreview = useMemo(() => {
    const base = (form.slug || "").trim() || (form.username || "").trim();
    if (!base) return;
    return slugify(base);
  }, [form.slug, form.username]);

  // draft load/save
  useEffect(() => {
    if (typeof window === "undefined") return;

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
              email: parsed.email || user?.email || prev.email,
            }));
          }
        } else {
          setForm((prev) => ({
            ...getEmptyForm(user?.email || ""),
            ...prev,
          }));
        }
      } catch (err) {
        console.error("Failed to load create-business draft:", err);
        setForm((prev) => ({
          ...getEmptyForm(user?.email || ""),
          ...prev,
        }));
      }

      return;
    }

    const hasAnyValue =
      form.username.trim() ||
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

  // username availability
  useEffect(() => {
    const value = form.username.trim();

    if (!value) {
      setUsernameStatus("idle");
      return;
    }

    if (isCheckingUsername) {
      setUsernameStatus("checking");
    }

    const handle = setTimeout(async () => {
      try {
        const res = await triggerUsernameCheck(value).unwrap();
        if (res) {
          setUsernameStatus("available");
        }
      } catch (error) {
        console.error("Username availability check failed: ", error);
        setUsernameStatus("error");
        setUsernameStatusMessage(error.message);
      }
    }, 450);

    return () => clearTimeout(handle);
  }, [form.username, triggerUsernameCheck, isCheckingUsername]);

  // slug availability
  useEffect(() => {
    const value = form.slug.trim();

    if (!value) {
      setSlugStatus("idle");
      return;
    }

    if (isCheckingSlug) {
      setSlugStatus("checking");
    }

    const handle = setTimeout(async () => {
      try {
        const res = await triggerSlugCheck(value).unwrap();
        if (res) {
          setSlugStatus("available");
        }
      } catch (error) {
        console.error("Slug availability check failed: ", error);
        setSlugStatusMessage(error.message);
        setSlugStatus("error");
      }
    }, 450);

    return () => clearTimeout(handle);
  }, [form.slug, triggerSlugCheck, isCheckingSlug]);

  if (!user) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          You need to be signed in to create a business.
        </div>
      </div>
    );
  }

  const showLogoStep = step === 2 && createdBusinessId;

  return (
    <div className="card card--cozy create-business-card">
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">
            {showLogoStep ? "Upload Business Logo" : "Create Business"}
          </h2>
          <p className="section-sub">
            {showLogoStep
              ? "Add a profile image so buyers and partners can recognize your brand."
              : "Set up your business profile. We'll use this to power your public presence and connections."}
          </p>
        </div>
      </header>

      {showLogoStep ? (
        <>
          {/* Small banner asking user to upload/replace logo */}
          <div className="logo-banner">
            <div className="logo-banner__icon">
              <ImageUp className="logo-banner__icon-svg" aria-hidden="true" />
            </div>
            <div className="logo-banner__content">
              <div className="logo-banner__title">Upload your logo</div>
              <p className="logo-banner__text">
                A clear logo helps buyers and partners recognize your brand.
                You can upload a new image now or replace it anytime from your
                business page.
              </p>
            </div>
          </div>

  
          {
            <BusinessLogoUpload
            businessId={createdBusinessId}
            onSkip={() => navigate("/dashboard/business", { replace: true })}
            onDone={() => navigate("/dashboard/business", { replace:true})}
            />
          }
        </>
      ) : (
        <form className="form-grid-2" onSubmit={submit}>
          {/* Username */}
          <label className="form-field">
            <span className="form-label">Business Username *</span>
            <input
              className="form-control"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="etac_service"
              autoComplete="off"
              required
            />
            {!form.username.trim() && (
              <div className="form-error">Username is required</div>
            )}

            {form.username.trim() && usernameStatus === "error" && (
              <div className="form-error">{usernameStatusMessage}</div>
            )}

            {form.username.trim() && usernameStatus === "checking" && (
              <div className="form-hint">Checking availability…</div>
            )}

            {form.username.trim() && usernameStatus === "available" && (
              <div className="form-hint">✅ Username is available</div>
            )}

            <div className="form-hint">
              Used as your handle (e.g. @etac_service). Must be unique.
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
              placeholder="ETAC Service and Supply Inc"
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
              {errorMessage && <div className="form-error">{errorMessage}</div>}
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
                placeholder="etac-service-and-supply"
              />
              <button
                type="button"
                className="btn btn-xxs btn-ghost"
                onClick={toggleAutoSlug}
              >
                {autoSlug ? "Manual" : "Auto"}
              </button>
            </div>

            {form.slug.trim() && slugStatus === "error" && (
              <div className="form-error">{slugStatusMessage}</div>
            )}

            {form.slug.trim() && slugStatus === "checking" && (
              <div className="form-hint">Checking slug availability…</div>
            )}

            {form.slug.trim() && slugStatus === "available" && (
              <div className="form-hint">✅ Slug is available</div>
            )}

            {!!form.slug && form.slug !== slugify(form.slug) && (
              <div className="form-hint">Slug will be sanitized on save.</div>
            )}
          </label>

          {businessHandlePreview && (
            <div className="form-hint">
              Public business URL (preview):{" "}
              <code>/b/{businessHandlePreview}</code>
            </div>
          )}

          {/* Email */}
          <label className="form-field">
            <span className="form-label">Business Email</span>
            <input
              className="form-control"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="owner@etac.com"
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
              placeholder="+1 ..."
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
              placeholder="Winnipeg"
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
              placeholder="Manitoba"
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
              placeholder="Canada"
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
              placeholder="R2J 4G7"
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
      )}
    </div>
  );
}
