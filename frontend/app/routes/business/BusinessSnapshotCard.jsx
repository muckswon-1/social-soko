import React from "react";
import { KeyValueRow } from "../components/KeyValueHelpers";

 /**
    * @typedef {import("./utils/businessTransformers").Business} Business
    * 
    */


/**
 * 
 * @param {{business: Business}} 
 * @returns 
 */
export default function BusinessSnapshotCard({ business }) {
  const {
    name,
    country,
    city,
    verificationStatus,
    logoUrl,
  } = business || {};



  return (
    <section className="card">
      <h3 className="card-title">Business snapshot</h3>
      <p className="card-subtitle">
        A quick overview of your business profile and trust health.
      </p>

      <div className="kv-grid">
        <KeyValueRow k="Name" v={name} />
        <KeyValueRow k="Country" v={country} />
        <KeyValueRow k="City" v={city} />
        <KeyValueRow k="Verification" v={verificationStatus} />
        <KeyValueRow k="Logo" v={logoUrl ? "Set" : "Missing"} />
      </div>
    </section>
  );
}
