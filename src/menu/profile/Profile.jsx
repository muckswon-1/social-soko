import React from 'react';
import VerticalTabs from '../../components/VerticalTabs';
import { useAuth } from '../../hooks/useAuth';
import UserProfile from './UserProfileTab';

const Profile = () => {
    const {loading} = useAuth();

    const tabs = [
        {
            id: "user-profile-info",
            label: "Profile",
            content: (<UserProfile />)
        }
    ];


    if(loading) return <div>Loading...</div>


    return (
       <VerticalTabs tabs={tabs} />
    );
}

export default Profile;
