const Row = ({ label, value, mono = false }) => (
  <>
    <div className="kv-key">{label}</div>
    <div className={`kv-val ${mono ? "kv-mono" : ""}`}>
      {value ?? <span className="kv-muted">N/A</span>}
    </div>
  </>
);
export default Row;