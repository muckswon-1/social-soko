import React from "react";



const Skeleton = () => (
  <div className="card card--cozy">
    <header className="section-head">
      <div className="pf-avatar pf-skel" aria-hidden />
      <div className="section-titles">
        <div className="pf-skel pf-line lg" />
        <div className="pf-skel pf-line" />
      </div>
    </header>
    <section className="kv-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <React.Fragment key={i}>
          <div className="pf-skel pf-line" />
          <div className="pf-skel pf-line" />
        </React.Fragment>
      ))}
    </section>
  </div>
);

export default Skeleton;