import { createCookie } from "react-router";

export const prefsCookie = createCookie('prefs', {
    maxAge: 30 * 24 * 60 * 60
})