import { redirect } from "react-router";
import { createServerApi } from "../lib/api.server";

export async function getAuthenticatedUser(request) {

    const api = createServerApi(request);

    try {
        const {data} = await api.get("auth/verify", {_skipRefresh: false});

      
        const success = data?.success ?? true;
        const user = data?.user;

        if(!success || !user) return null;

        return user

    } catch (error) {
        console.log("Error during session verification: ", error)
        return null
    }
}


export async function requireAuthenticatedAmin(request) {
    const user = await getAuthenticatedUser(request);
    const role = user?.role || "customer"
    //console.log("User in requireAdmin", user)
    //console.log("Role: ",role);

    if(!user || role !== "admin") throw redirect("/login");

    return user;

}