import React from 'react';

const Header = () => {
    return (
        <>
        <header className="soko-header" role="banner">
        <div className="hdr-inner">
          <div className="hdr-brand" aria-label="Social Soko">Social Soko</div>
          <div className="hdr-actions">
            <button className="hdr-btn"  aria-label="User settings">
              ⚙️
            </button>
          </div>
        </div>
      </header>
      </>
    )
}

export default Header;
