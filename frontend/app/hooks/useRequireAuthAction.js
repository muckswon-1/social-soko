import { useSelector } from "react-redux";
import { selectAuthUser } from "../features/auth/authSlice";
import { useCallback } from "react";
import  {useAuthGate} from '../routes/components/AuthGateProvider'
export default function useRequireAuthAction(){
    const user = useSelector(selectAuthUser);

    const {open} = useAuthGate()


    return useCallback(
        (action, opts = {}) => {
        
            return (e) => {
                if(e?.preventDefault) e.preventDefault();

                if(!user){
                    open({
                        title: opts.title || "Login to continue",
                        message: opts.message || "You can browse posts as a guest. Log in to react, comment, save, or create posts.",
                    });
                    return;
                }


                action?.();
            }

            
        },[user, open]
    );
}