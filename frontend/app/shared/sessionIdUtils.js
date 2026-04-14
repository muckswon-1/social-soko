import {v4 as uuidv4} from 'uuid';

const isBrowser = typeof window !== "undefined";

export const SESSION_ID_KEY = "social_soko:sessionId";

/**
 * Returns a stable session id for this browser session
 * 
 * Uses sessionStorage so it resets when the browser/tab session ends
 * 
 */
export const getSessionId = () => {
    if(!isBrowser) return null;

    try {
        const existing  = window.sessionStorage.getItem(SESSION_ID_KEY);
        if (existing) return existing;

        const next = uuidv4();

        window.sessionStorage.setItem(SESSION_ID_KEY, next);
        return next
    } catch (error) {
        return uuidv4();
    }
}


/**
 * Returns a new id for a single client-side event fire
 * 
 * Used for video plays/replays and safety against double fire
 * 
 */
export const createClientEventId = () => {
    if(!isBrowser) return null;

    return uuidv4();
}

/**
 * Helper for. "once per session per post per source"
 */
export const oncePerSession = (key) => {
    if(!isBrowser) return false;

    try {
        if(window.sessionStorage.getItem(key)) return false;
        window.sessionStorage.setItem(key,"1");
        return true
    }catch(e){
        return true
    }

}