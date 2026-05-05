import React from 'react';
import { useUploadBusinessLogoMutation } from '../../services/businessApi';
import ImageUploadBase from '../components/ImageUploadBase';


const BusinessLogoUpload = ({businessId, onSkip, onDone}) => {
    const [uploadLogo, { isLoading, error }] = useUploadBusinessLogoMutation();

    const handleUpload = async (file) => {
        const result = await uploadLogo({businessId,file}).unwrap();

        return result;
    }
       
           
    return (
        <ImageUploadBase
        label={"Business Logo"}
        description={"Upload your business logo"}
        onUpload={handleUpload}
        onSkip={onSkip}
        onDone={onDone}
        mutationError={error}
        isMutationLoading={isLoading}
        />
    );
}

export default BusinessLogoUpload;
