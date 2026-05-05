import React from 'react';
import { useNavigate } from 'react-router';

const CreateBusinessBanner = () => {
    const navigate = useNavigate();
     return (
      <div className="business-dashboard__grid">
        <div className="business-dashboard__main">
          <div className="card card--cozy business-card">
            <header className="business-header">
              <div className="business-header-left">
                <div className="business-avatar">SB</div>
                <div>
                  <h2 className="business-title">
                    Create your business profile
                  </h2>
                  <p className="business-sub">
                    Tell us who you are so partners can discover and trust you.
                  </p>
                </div>
              </div>
              <div className="business-header-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    navigate("/dashboard/business/create-business", {
                      replace: true,
                    })
                  }
                >
                  Create business
                </button>
              </div>
            </header>
          </div>
        </div>
      </div>
    );
}

export default CreateBusinessBanner;
