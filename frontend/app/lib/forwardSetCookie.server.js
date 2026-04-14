/**
 * Forward backend Set-Cookie headers to the browser.
 *
 * - Backend response may contain multiple Set-Cookie headers
 * - We copy all of them into the outgoing Response headers
 *
 * @param {import("axios").AxiosResponse} axiosResponse
 * @param {Headers} headers - Headers object you will return in your loader/action response
 */
export function forwardSetCookie(axiosResponse, headers){
    if(!axiosResponse?.headers) return;

    const raw = axiosResponse.headers["set-cookie"];

    if(!raw) return;

    const cookies = Array.isArray(raw) ? raw : [raw];

    for (const cookie of cookies){
        if(cookie){
            headers.append("Set-Cookie", cookie);
        }
    }
}