import React from 'react';
import ImageUploadBase from '../components/ImageUploadBase';
import { useUploadProfilePictureMutation } from '../../services/profileApi';

const ProfileUpload = ({profileId, onSkip, onDone}) => {
    const [uploadProfilePicture, {error, isLoading}] = useUploadProfilePictureMutation();
  
    
    const handleUpload =  async (file) => {
        const result = await uploadProfilePicture({profileId, file}).unwrap();

        return result;
    }

    return (
        <ImageUploadBase
        label='Profile Picture'
        description='Upload a profile picture'
        onUpload={handleUpload}
        onSkip={onSkip}
        onDone={onDone}
        mutationError={error}
        isMutationLoading={isLoading}
        
        />
    );
}

export default ProfileUpload;
