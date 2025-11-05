// src/pages/dashboard/Account.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; // use your path
import api from '../../lib/api';
import { toast } from 'react-toastify';
import EmailCard from '../../components/EmailCard';
import UserInfo from './UserAuthInfoTab';
import VerticalTabs from '../../components/VerticalTabs';
import UpdatePassword from './UpdatePassword';
import UpdateEmail from './UpdateEmail';

const Privacy = () => {
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || '');
  const [emailVerified, setEmailVerified] = useState(!!user?.emailVerified);

  const [sendingVerify, setSendingVerify] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });


  const tabs = [
    {
      id: "user-info",
      label: "User Info",
      content:(<UserInfo />)
    },
    {
      id: "update-password",
      label: "Update Password",
      content: <UpdatePassword />
    },
    {
      id: 'update-email',
      label: "Update Email",
      content: <UpdateEmail />
    }

  ]

  // keep local state synced if user changes in context
  // useEffect(() => {
  //   setEmail(user?.email || '');
  //   setEmailVerified(!!user?.emailVerified);
  // }, [user]);

  // const sendVerification = async () => {
  //   if (!email) return;
  //   setSendingVerify(true);
  //   try {
  //     const { data } = await api.post('auth/send-verification-email', { email });
  //     toast.success(data?.message || 'Verification email sent');
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message || 'Failed sending verification');
  //   } finally {
  //     setSendingVerify(false);
  //   }
  // };

  // const refreshVerification = async () => {
  //   try {
  //     // This endpoint returns { valid, user }
  //     const { data } = await api.get('auth/verify');
  //     const verified = !!data?.user?.emailVerified;
  //     setEmailVerified(verified);
  //     toast[verified ? 'success' : 'info'](
  //       verified ? 'Email verified ✅' : 'Not verified yet.'
  //     );
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message || 'Could not refresh status');
  //   }
  // };

  // const saveEmail = async (e) => {
  //   e.preventDefault();
  //   if (!email) return;
  //   setSavingEmail(true);
  //   try {
  //     await api.put('users/me/email', { email }); // implement server-side
  //     toast.success('Email updated');
  //     // Typically, email change requires re-verification:
  //     setEmailVerified(false);
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message || 'Email update failed');
  //   } finally {
  //     setSavingEmail(false);
  //   }
  // };

 

  const savePassword = async (e) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPass(true);
    try {
      await api.put('users/me/password', { current: pwd.current, next: pwd.next }); // implement server-side
      setPwd({ current: '', next: '', confirm: '' });
      toast.success('Password updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Password update failed');
    } finally {
      setSavingPass(false);
    }
  };

  if (!user) return <div>Loading…</div>;

  return (
   <VerticalTabs tabs={tabs} defaultId={"user-info"} />
  );
};

export default Privacy;
