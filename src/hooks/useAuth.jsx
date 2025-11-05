import { useContext, createContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../lib/api';
import { useLocation } from 'react-router-dom';
import { fail, ok, setIfMounted } from '../utils/resHelpers';



const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const mounted = useRef(true);


  const skipBootstrap = /^\/(login|register|forgot-password|reset-password|verify-email)(\/|$)/.test(location.pathname);


  // ---- session bootstrap ---------------------------------------------------
  const verifySession = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/verify');
      setIfMounted(() => setUser(data.user),mounted);
      return ok({ user: data.user });
    } catch (error) {
      setIfMounted(() => setUser(null),mounted);
      return fail(error, 'Not authenticated');
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      //await verifySession();
      
      if (!skipBootstrap) {
           await Promise.race([
        verifySession(),
        new Promise((r) => setTimeout(r, 1500))

      ]);
      }
      setIfMounted(() => setLoading(false),mounted);
    })();
    return () => {
      mounted.current = false;
    };
  }, [verifySession, skipBootstrap]);

  // ---- actions -------------------------------------------------------------
  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setIfMounted(() => setUser(data.user),mounted);
      return ok();
    } catch (error) {
      return fail(error, 'Login failed');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // even if the server call fails, clear local state
    } finally {
      setIfMounted(() => setUser(null), mounted);
    }
    return ok();
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/refresh-user');
      setIfMounted(() => setUser(data.user),mounted);
      return ok({ user: data.user });
    } catch (error) {
      setIfMounted(() => setUser(null), mounted);
      return fail(error, 'Failed to refresh user');
    }
  }, []);

 
  
  const register = useCallback(async (email, password, role) => {
    try {
      const { data, status } = await api.post('/auth/register', { email, password, role });
      const created = status === 201 && (data?.id || data?.user?.id);
      return created ? ok({ message: 'Account created successfully.' }) : fail(null, 'Registration failed');
    } catch (error) {
      return fail(error, 'Registration failed');
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return ok({ message: data?.message || 'Password reset link sent' });
    } catch (error) {
      return fail(error, 'Failed to send reset password email');
    }
  }, []);

  const updatePassword = useCallback(async (id, token, newPassword) => {
    try {
      const { data } = await api.post(`/auth/reset-password/${token}/${id}`, { password: newPassword });
      return ok({ message: data?.message || 'Password reset successful' });
    } catch (error) {
      return fail(error, 'Failed to reset password');
    }
  }, []);

  const sendSixDigitCode = useCallback(async(email) => {

   
    try {
      const response = await api.post('/auth/send-verification-digits-code', { email });
     
      return ok({message: response?.data?.message || 'Verification Code sent to your email'})
    } catch (error) {
      return fail(error, 'Could not send verification code.')
    }
  },[]);


  const resetPasswordWithDigitCode = useCallback(async({ newPassword, digitCodes}) => {
    try {
      const response = await api.post('/auth/reset-password-with-digit-code',{newPassword, digitCodes});

      return ok({ message: response.data?.message || 'Password reset successful' });


    } catch (error) {
      return fail(error, 'Failed to reset password');
    }
  },[]);


  const sendVerificationEmail = useCallback(async (email) => {
    try {
      const { data } = await api.post('/auth/send-verification-email', { email });
      return ok({ message: data?.message || 'Verification email sent' });
    } catch (error) {
      return fail(error, 'Sending email verification failed');
    }
  }, []);

  const updateEmailWithDigitCode = useCallback(async({newEmail, digitCodes}) => {
    try {
      const response = await api.post('/auth/email-update-with-digit-code',{newEmail, digitCodes});

       console.log(response);


      return ok({ message: response.data?.message || 'Email Updated Successfully' });

    } catch (error) {
      return fail(error, 'Error updating email');
    }
  },[])

  const verifyEmail = useCallback(async (token) => {
    try {
      const { data } = await api.post(`/auth/verify-email/${token}`,{},{_skipRefresh: true, withCredentials: false});
      return ok({ message: data?.message || 'Email verified successfully' });
    } catch (error) {
      return fail(error, 'Email verification failed');
    }
  }, []);

  const value = {
    user,
    loading,
    // main actions
    login,
    logout,
    refreshUser,
    verifySession,
    // optional extras
    register,
    forgotPassword,
    updatePassword,
    sendVerificationEmail,
    verifyEmail,
    sendSixDigitCode,
    resetPasswordWithDigitCode,
    updateEmailWithDigitCode
  };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
