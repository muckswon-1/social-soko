import React from 'react';
import UserProfile from './UserProfileTab';
import SettingsShell from '../SettingsShell';

const Profile = () => {
  

    const tabs = [
        {
            id: "user-profile-info",
            label: "Profile",
            content: (<UserProfile />)
        }
    ];


    return (
       <SettingsShell
        title="Profile"
        description="Manage your profile information"
        tabs={tabs}
        defaultId="user-profile-info"

       />
    );
}

export default Profile;
