import React from "react";
import "../../styles/components/chip.css";

export default function EmailChip({ verified }) {
  const label = verified ? "Email Verified" : "Not Verified";
  const tone = verified ? "chip--success" : "chip--danger";

  return <span className={`chip ${tone}`}>{label}</span>;
}
