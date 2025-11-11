import React from "react";
import {
  isPlainObject,
  prettyKey,
  isIsoDateLike,
} from "../../utils/passwordUtils";
import "../../styles/components/key-value.css";

/**
 * Format primitive-ish values with semantic styling.
 */
export const formatValue = (v) => {
  if (v === null) return <span className="kv-muted">null</span>;
  if (v === undefined) return <span className="kv-muted">undefined</span>;

  if (typeof v === "boolean") {
    return <span className="kv-mono">{String(v)}</span>;
  }

  if (typeof v === "number") {
    return <span className="kv-mono">{v}</span>;
  }

  if (typeof v === "string") {
    if (isIsoDateLike(v)) {
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) {
        return <time title={d.toISOString()}>{d.toLocaleString()}</time>;
      }
    }

    if (v.length > 120) {
      return <pre className="kv-pre">{v}</pre>;
    }

    return <span>{v}</span>;
  }

  return <span>{String(v)}</span>;
};

export const ValueRenderer = ({ value }) => {
  // Arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="kv-muted">[]</span>;
    }

    return (
      <div className="kv-array">
        {value.map((item, idx) => {
          const key = `${idx}-${typeof item}`;
          const complex = isPlainObject(item) || Array.isArray(item);

          return (
            <div key={key} className="kv-array-item">
              {complex ? (
                <details className="kv-details">
                  <summary className="kv-summary">Item {idx + 1}</summary>
                  <div className="kv-nested">
                    <ValueRenderer value={item} />
                  </div>
                </details>
              ) : (
                <span>
                  • <span className="kv-mono">{formatValue(item)}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Plain objects
  if (isPlainObject(value)) {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (entries.length === 0) {
      return <span className="kv-muted">{`{}`}</span>;
    }

    return (
      <div className="kv-nested-grid">
        {entries.map(([k, v]) => (
          <KeyValueRow key={k} k={k} v={v} />
        ))}
      </div>
    );
  }

  // Primitives / fallbacks
  return formatValue(value);
};

export const KeyValueRow = ({ k, v }) => (
  <>
    <div className="kv-key">{prettyKey(k)}</div>
    <div className="kv-val">
      <ValueRenderer value={v} />
    </div>
  </>
);
