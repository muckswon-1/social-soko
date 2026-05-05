import { useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";
import { useGetBusinessQuery } from "../../services/businessApi";

/**@typedef {import("../../types/business").Business} Business */


export function useCurrentBusiness(){
    const user = useSelector(selectAuthUser);
    
    const userId = user?.id || null;

    const query = useGetBusinessQuery(userId, {
        skip: !userId,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    })

    /** @type {Business} */
    const bussiness = query.data?.business || null;

    const businessId = bussiness?.id || null;

    return {
        ...query,
        bussiness,
        businessId
    }


}