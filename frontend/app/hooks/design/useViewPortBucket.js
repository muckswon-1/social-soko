import { useEffect, useMemo, useState } from "react";
import { getViewportBucket, VIEWPORT_BUCKETS, VIEWPORT_BREAKPOINTS } from "./viewPortUtils";

/**
 * SSR-safe viewport bucket hook.
 * - On server: returns "lgDesktop" by default (avoid rendering mobile-only UI during SSR).
 * - On client: updates immediately on mount and on resize.
 *
 * @param {{
 *  ssrDefaultBucket?: "mobile"|"tablet"|"mdDesktop"|"lgDesktop";
 * }} [options]
 */
export function useViewportBucket(options = {}) {

    const ssrDefaultBucket = options.ssrDefaultBucket || VIEWPORT_BUCKETS.lgDesktop;
    
    const [bucket, setBucket] = useState(() => {
        if(typeof window === "undefined") return ssrDefaultBucket;

        return getViewportBucket(window.innerWidth);
    });


    useEffect(() => {
        if(typeof window === "undefined") return;

        let rafId = 0;
        const update = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const next = getViewportBucket(window.innerWidth);
                setBucket((prev) => prev !== next ? next : prev)
            })
        }

                 const mqlMobile = window.matchMedia(`(max-width: ${VIEWPORT_BREAKPOINTS.mobileMax}px)`);
         const mqlTablet = window.matchMedia(`(min-width: ${VIEWPORT_BREAKPOINTS.mobileMax + 1}px) and (max-width: ${VIEWPORT_BREAKPOINTS.tabletMax}px)`);
         const mqlMdDesktop = window.matchMedia(`(min-width: ${VIEWPORT_BREAKPOINTS.tabletMax + 1}px) and (max-width: ${VIEWPORT_BREAKPOINTS.mdDesktopMax}px)`);
         const mqlLgDesktop = window.matchMedia (`(min-width: ${VIEWPORT_BREAKPOINTS.mdDesktopMax + 1}px)`);


         update();


            //subscribe
         const onChange = () => update();

         //Modern browsers
         mqlMobile.addEventListener?.("change", onChange);
         mqlTablet.addEventListener?.("change",onChange);
         mqlMdDesktop.addEventListener?.("change",onChange);
         mqlLgDesktop.addEventListener?.("change",onChange);

         //fallback
         window.addEventListener("resize", update);

         return () => {
            cancelAnimationFrame(rafId);

            //unsubscribe
            mqlMobile.removeEventListener?.("change",onChange);
            mqlTablet.removeEventListener?.("change",onChange);
            mqlMdDesktop.removeEventListener?.("change", onChange);
            mqlLgDesktop.removeEventListener?.("change", onChange);
            window.removeEventListener("resize", update);
         }

    },[ssrDefaultBucket])


        const flags = useMemo(() => {
        return {
            isMobile: bucket === VIEWPORT_BUCKETS.mobile,
            isTablet: bucket === VIEWPORT_BUCKETS.tablet,
            isMdDesktop: bucket === VIEWPORT_BUCKETS.mdDesktop,
            isLgDesktop: bucket === VIEWPORT_BUCKETS.lgDesktop
        }
    },[bucket]);


    return {
        bucket,
        ...flags
    }
    
}