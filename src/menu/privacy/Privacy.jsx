// src/pages/dashboard/Account.jsx
import React from 'react';


import UserInfo from './UserAuthInfoTab';
import VerticalTabs from '../../components/InlineTabs';
import UpdatePassword from './UpdatePassword';
import UpdateEmail from './UpdateEmail';
import SettingsShell from '../SettingsShell';
import { useSelector } from 'react-redux';
import { authUserSelector } from '../../features/auth/authSlice';

const Privacy = () => {
  const user = useSelector(authUserSelector);

  // const [email, setEmail] = useState(user?.email || '');
  // const [emailVerified, setEmailVerified] = useState(!!user?.emailVerified);

  // const [sendingVerify, setSendingVerify] = useState(false);
  // const [savingEmail, setSavingEmail] = useState(false);
  // const [savingPass, setSavingPass] = useState(false);

  // const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });


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

  if (!user) return <div>Loading…</div>;

    const rightSlot = (
    <span style={{ fontSize: 12, color: '#6b7280' }}>
      Signed in as <strong>{user.email}</strong>
    </span>
  );

  return (
   <SettingsShell
     title="Privacyand Security"
     description="Manage your account details, password and email preferences."
     tabs={tabs}
     defaultId="user-info"
     rightSlot={rightSlot}
   />
  );
};

export default Privacy;
