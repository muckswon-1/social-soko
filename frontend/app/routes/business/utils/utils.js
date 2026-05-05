import countryCodes from "../../../utils/CountryCodes.json";
import { emailRe, urlRe } from "../../../utils/formValidation";
import { slugify } from "../../../utils/slugify";

const BUSINESS_UTILS = {
  getEmptyForm: (email = "") => ({
    user_id: "",
    username: "",
    name: "",
    description: "",
    website: "",
    email,
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    slug: "",
    logo_url: "",
    verification_status: "",
    verification_requested_at: "",
    verification_rejected_at: "",
    verification_rejected_reason: "",
    verified_at: "",
    created_at: "",
    updated_at: "",
  }),

  handlePhoneCountryChange:
    ({ phoneCountryCode, setForm, setPhoneCountryCode }) =>
    (code, country) => {
      setPhoneCountryCode(code);

      const prevCountry =
        countryCodes.find((c) => c.code === phoneCountryCode) || null;

      setForm((prev) => {
        const current = (prev.phone || "").trim();

        // If no phone yet → prefill with new dial code
        if (!current) {
          return {
            ...prev,
            phone: country?.dial_code || "",
          };
        }

        // If phone was exactly the old dial code → swap to new dial code
        if (prevCountry && current === prevCountry.dial_code) {
          return {
            ...prev,
            phone: country?.dial_code || "",
          };
        }

        // Otherwise, don't touch user input
        return prev;
      });
    },
  selectedPhoneCountry: (phoneCountryCode) =>
    countryCodes.find((c) => c.code === phoneCountryCode) || null,

  phonePlaceHolder: (selectedPhoneCountry) => {
    if (selectedPhoneCountry) {
      return `${selectedPhoneCountry.dial_code} ...`;
    }

    return "+254";
  },

  formIsValid: ({
    form,
    checkUsername = false,
    usernameStatus = "",
    checkSlug = false,
    slugStatus = "",
  }) => {
    // Username required only when creating
    if (checkUsername && !form.username.trim()) return false;

    // Basic required fields
    if (!form.name.trim()) return false;

    // Email validation (if present)
    if (form.email && !emailRe.test(form.email)) return false;

    // Website validation (if present)
    if (form.website && !urlRe.test(form.website)) return false;

    // Username availability
    if (
      checkUsername &&
      (usernameStatus === "taken" || usernameStatus === "invalid")
    ) {
      return false;
    }

    // Slug availability
    if (checkSlug && form.slug.trim() && slugStatus === "taken") {
      return false;
    }

    return true;
  },

  onChange: (setForm, autoSlug) => (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "name" && autoSlug) {
        next.slug = slugify(value);
      }
      return next;
    });
  },
  handleSlugChange: (e, setForm, setAutoSlug, autoSlug) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      slug: val,
    }));
    // once user types slug manually, turn off auto
    if (autoSlug) setAutoSlug(false);
  },

  toggleAutoSlug: (setAutoSlug, setForm) => () => {
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
  },
};

export default BUSINESS_UTILS;
