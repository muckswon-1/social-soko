import React from 'react';
import CreateBusiness from './CreateBusiness';

import SettingsShell from '../SettingsShell';

const Business = () => {
    

    const tabs = [
        {
            id: 'create-business',
            label: "Create Business",
            content: <CreateBusiness />
        }
    ]


   

    return (
       <SettingsShell
       title="Create a Business"
       description=" Create your business here"
       tabs={tabs}
       defaultId='create-business'
       />
    );
}

export default Business;
