import React from "react";
import "../../styles/components/row.css";

export default function Row({ label, value, mono = false }) {
  return (
    <>
      <div className="kv-key">{label}</div>
      <div className={`kv-val ${mono ? "kv-mono" : ""}`}>
        {value ?? <span className="kv-muted">N/A</span>}
      </div>
    </>
  );
}
