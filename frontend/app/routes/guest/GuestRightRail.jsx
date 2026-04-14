import React from "react";
import { Link } from "react-router";
import { mockBusinesses } from "./mockData";

export default function GuestRightRail() {
  return (
    <aside className="right-rail" aria-label="Secondary content">
      <section className="right-rail__card">
        <div className="right-rail__title">Popular Businesses</div>
        <div className="right-rail__list">
          {mockBusinesses.map((b) => (
            <Link key={b.id} to={`/b/${b.slug}`} className="right-rail__item">
              <div>{b.name}</div>
              <div className="right-rail__meta">{b.membersCount.toLocaleString()} members</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="right-rail__card">
        <div className="right-rail__title">Guest mode</div>
        <div className="right-rail__text">
          You can browse posts. Log in to post, comment, or react.
        </div>
      </section>
    </aside>
  );
}
