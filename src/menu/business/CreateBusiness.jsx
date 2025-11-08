import React, { useMemo, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../lib/api';
import '../../styles/inline-tabs-reusable.css';
import { useSelector } from 'react-redux';
import { authUserSelector } from '../../features/auth/authSlice';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const urlRe =
  /^(https?:\/\/)?([a-z0-9\-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

const slugify = (s = '') =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const CreateBusiness = ({ onCreated }) => {
  const user = useSelector(authUserSelector);

  const [autoSlug, setAutoSlug] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    phone: '',
    email: user?.email || '',
    website: '',
    slug: '',
    logo_url: '',
  });

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
      if (name === 'name' && autoSlug) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const toggleAutoSlug = () => {
    setAutoSlug((v) => !v);
    // when enabling autoslug, regenerate from current name
    if (!autoSlug) {
      setForm((s) => ({ ...s, slug: slugify(s.name) }));
    }
  };

  const submit = useCallback(async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('Not authenticated');
      return;
    }
    if (!isValid) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setLoading(true);
    try {
      const payload = { newBusiness: { ...form } };
      // Adjust path if your route differs:
      // Controller expects: req.params.userId + body { newBusiness }
      const { data } = await api.post(`/business/${user.id}`, payload);

      if (data?.success) {
        toast.success(data?.message || 'Business created');
        onCreated?.(data.business);
        // Optional: reset the form except email
        setForm((s) => ({
          ...s,
          name: '',
          description: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postal_code: '',
          phone: '',
          website: '',
          slug: '',
          logo_url: '',
        }));
      } else {
        toast.error(data?.message || 'Creation failed');
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Error creating business';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [form, isValid, onCreated, user?.id]);

  return (
    <div className="card card--cozy">
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">Create Business</h2>
          <p className="section-sub">
            Set up your business profile. We’ll email you a confirmation after creation.
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
          {!form.name.trim() && <div className="form-error">Name is required</div>}
        </label>

        {/* Slug + autoslug toggle */}
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
              placeholder="acme-co"
            />
            <button
              type="button"
              className="btn btn-xxs btn-ghost"
              onClick={toggleAutoSlug}
            >
              {autoSlug ? 'Manual' : 'Auto'}
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

        {/* Address block (full width grid row split manually as needed) */}
        <label className="form-field" style={{ gridColumn: '1 / -1' }}>
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
        <div className="inline-actions" style={{ gridColumn: '1 / -1', justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              setForm({
                name: '',
                description: '',
                address: '',
                city: '',
                state: '',
                country: '',
                postal_code: '',
                phone: '',
                email: user?.email || '',
                website: '',
                slug: '',
                logo_url: '',
              })
            }
            disabled={loading}
          >
            Reset
          </button>

          <button className="btn" disabled={!isValid || loading}>
            {loading ? 'Creating…' : 'Create Business'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBusiness;
