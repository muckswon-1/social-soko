// create context

import api from "../lib/api";
import { fail, ok, setIfMounted } from "../utils/resHelpers";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const ProfileContext = createContext(null);

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if(!context){
        throw new Error('useProfile must be used within a ProfileProvider')
    }

    return context
}


export const ProfileProvider  = ({children}) => {
    const {user} = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const mounted = useRef(true);
    const navigate = useNavigate();

    

    // Fetch user info from backend
    const fetchUserProfile = useCallback(async (userId) => {
        try {
        const response = await api.get(`/profile/fetch-user-profile/${userId}`);
      
        setIfMounted(() => setProfile(response.data), mounted);
        return ok({profile: response.data})
        } catch (error) {
            setIfMounted(() => setProfile(null), mounted);
            return fail(error,"Failed to fetch user profile")
        }finally {
            setIfMounted(() => setLoading(false), mounted);
        }

    },[]);

    // Update user profile
    const updateUserProfile = useCallback(async (userId, patch) => {
        try {
            const {data}  = await api.post(`/profile/update-user-profile/${userId}`,{patch});
            setIfMounted(() => setProfile(data.updatedUser),mounted);
            return ok({profile: data.updatedUser});
        } catch (error) {
             setIfMounted(() => setProfile(null), mounted);
            return fail(error,"Failed to fetch user profile");
        }finally {
            setIfMounted(() => setLoading(false), mounted);
        }
    },[]);

    //Fetch profile when logged in
    useEffect(() => {
        mounted.current = true;
        if(user?.id){
            fetchUserProfile(user.id)
        }else {
            setLoading(false);
            navigate('/login')
        }
        return () => {
            mounted.current = false;
        }

    },[user, fetchUserProfile, navigate]);



    const value = {
        fetchUserProfile,
        profile,
        updateUserProfile,
        loading
    }

    return (
        <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
    )
}