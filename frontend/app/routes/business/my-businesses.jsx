// src/menu/dashboard/components/MyBusinessesSection.jsx
import React, { useMemo, useState } from "react";
import BusinessCard from "./BusinessCard";
import "../../styles/business/my-businesses.css";
import { useFetchMyBusinessesQuery } from "../../services/businessApi";


export default function MyBusinessesSection() {
  const [searchValue, setSearchValue] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data, isLoading, isError, error, refetch } = useFetchMyBusinessesQuery({
    page: 1,
    limit: 24,
  });

  const rows = data?.data?.rows || [];

  const filteredRows = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return rows.filter((row) => {
      const business = row?.business || {};
      const matchesSearch =
        !query ||
        business?.name?.toLowerCase().includes(query) ||
        business?.username?.toLowerCase().includes(query) ||
        business?.slug?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" || row?.membershipRole === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [rows, searchValue, roleFilter]);

  return (
    <section className="section-layout my-businesses-section">
      <div className="section-layout__header">
        <div className="section-layout__titles">
          <h2 className="section-layout__title">My businesses</h2>
          <p className="section-layout__subtitle">
            Manage the businesses you own or belong to.
          </p>
        </div>

        <div className="section-layout__actions">
          <button type="button" className="btn btn-primary">
            Create business
          </button>
        </div>
      </div>

      <div className="my-businesses-toolbar">
        <input
          type="text"
          className="my-businesses-toolbar__search"
          placeholder="Search businesses"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <select
          className="my-businesses-toolbar__filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All roles</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>

      {isLoading ? (
        <div className="card card--cozy">
          <div className="form-hint">Loading businesses…</div>
        </div>
      ) : null}

      {isError ? (
        <div className="card card--cozy">
          <div className="form-error">Failed to load businesses.</div>
          <button
            type="button"
            className="link-btn"
            onClick={() => refetch()}
            style={{ marginTop: "0.5rem" }}
          >
            Try again
          </button>
          {error?.error ? (
            <div className="form-hint" style={{ marginTop: "0.5rem" }}>
              {error.error}
            </div>
          ) : null}
        </div>
      ) : null}

      {!isLoading && !isError && filteredRows.length === 0 ? (
        <div className="layout-empty">
          <div className="layout-empty__inner">
            No businesses found yet.
          </div>
        </div>
      ) : null}

      {!isLoading && !isError && filteredRows.length > 0 ? (
        <div className="my-businesses-grid">
          {filteredRows.map((row) => (
            <BusinessCard
              key={row.business.id}
              business={row.business}
              membershipRole={row.membershipRole}
              membershipStatus={row.membershipStatus}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}