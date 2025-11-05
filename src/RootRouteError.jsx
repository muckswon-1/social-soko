import React from 'react';
import {useLocation, isRouteErrorResponse,useRouteError, Link} from 'react-router-dom';

const RootRouteError = () => {
    const error  = useRouteError();
    const location = useLocation();

    if(import.meta.env.ENV !== 'production'){
        console.error('Route error at', location.pathname, error)
    }

    if(isRouteErrorResponse && isRouteErrorResponse(error)){
       return(  <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Oops — {error.status} {error.statusText}</h2>
        {error.data && typeof error.data === 'string' ? (
          <p className="muted">{error.data}</p>
        ) : null}
        <div className="row-actions" style={{ marginTop: 16 }}>
          <Link className="btn" to="/">Go Home</Link>
          <button className="btn btn-outline" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    )
}

//unexpected js eerors
let message = "Something went wrong";
if(error instanceof Error && error.message) message = message.error


    return (
        <div className="card" style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Something broke 😬</h2>
      <p className="muted">{message}</p>
      {import.meta.ENV !== 'production' && error?.stack ? (
        <pre style={{ overflow: 'auto', maxHeight: 240, background: 'var(--bg-secondary)', padding: 12, borderRadius: 8 }}>
          {String(error.stack)}
        </pre>
      ) : null}
      <div className="row-actions" style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => window.location.assign('/')}>Go Home</button>
        <button className="btn btn-outline" onClick={() => window.location.reload()}>Reload</button>
      </div>
    </div>
    );
}

export default RootRouteError;
