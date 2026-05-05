import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLocation, useNavigate, useNavigation } from "react-router";
import "../../styles/auth/auth-modal.css";
import { ReactComponent as Close } from "../../assets/svg/cross.svg";

/**
 * @typedef {{
 *  isOpen: boolean;
 *  title: string;
 *  message: string;
 *  open: (opts?: { title?: string; message?: string }) => void;
 *  close: () => void;
 *  goLogin: () => void;
 *  goSignup: () => void;
 * }} AuthGateContextValue
 */

/**@type {React.Context<AuthGateContextValue>} */
const AuthGateContext = createContext(null);

export function useAuthGate() {
    const context = useContext(AuthGateContext);
    if(!context) throw new Error("useAuthGate must be used within <AuthGateProvider />");
    return context
}


function AuthGateModal({isOpen, title, message, onClose, onLogin,onSignup}){
    if(!isOpen) return null;


  return (
   <div className="auth-gate">
  {/* Backdrop */}
  <button
    className="auth-gate__backdrop"
    aria-label="Close"
    onClick={onClose}
  />

  {/* Dialog panel */}
  <div
    className="auth-gate__panel"
    role="dialog"
    aria-modal="true"
    aria-labelledby="auth-gate-title"
  >
    <div className="auth-gate__header">
      <div
        id="auth-gate-title"
        className="auth-gate__title"
      >
        {title}
      </div>

      <button
        type="button"
        className="auth-gate__close"
        onClick={onClose}
        aria-label="Close dialog"
      >
        <Close className="icon-svg icon-svg--close" />
      </button>
    </div>

    <div className="auth-gate__body">
      <p>{message}</p>
    </div>

    <div className="auth-gate__footer">
      <button
        type="button"
        className="auth-gate__btn"
        onClick={onLogin}
      >
        Log In
      </button>

      <button
        type="button"
        className="auth-gate__btn"
        onClick={onSignup}
      >
        Sign Up
      </button>

      <button
        type="button"
        className="auth-gate__btn"
        onClick={onClose}
      >
        Continue browsing
      </button>
    </div>
  </div>
</div>

  );
}

export default function AuthGateProvider({children}){
    const [state, setState] = useState({
        isOpen: false,
        title: "Login to continue",
        message: "You can browse posts as a guest. Login to react, comment,share, or review products"
    });

    const navigate = useNavigate();
    const location = useLocation();

    const open = useCallback((opts = {}) => {

    

        setState((prev) => ({
            ...prev,
            isOpen: true,
            title: opts.title || prev.title,
            message: opts.message || prev.message
        }));

    },[]);

  

    const close = useCallback(() => {
        setState((prev) => ({...prev, isOpen: false}))
    },[]);

    const goLogin = useCallback(() => {
        //preserver where the user was for after login
        const next = encodeURIComponent(location.pathname + location.search);
        
        
        close();
        navigate(`/login?next=${next}`);

    },[close, navigate, location.pathname, location.search]);

    const goSignUp = useCallback(() => {
        //preserver where the user was for after login
        const next = encodeURIComponent(location.pathname + location.search);
        close();
        navigate(`/register?next=${next}`);
    },[close, navigate, location.pathname, location.search]);

    const value = useMemo(() => ({
        isOpen: state.isOpen,
        title: state.title,
        message: state.message,
        open,
        close,
        goLogin,
        goSignUp
    }),[state.isOpen, state.title, state.message, open, close,goLogin,goSignUp]);

    return (
        <AuthGateContext.Provider value={value}>
            {children}
            <AuthGateModal
            isOpen={state.isOpen}
            title={state.title}
            message={state.message}
            onClose={close}
            onSignup={goSignUp}
            onLogin={goLogin}
            
            />
        </AuthGateContext.Provider>
    )
}