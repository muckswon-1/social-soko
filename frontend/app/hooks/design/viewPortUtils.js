
/**
 * Breakpoint buckets (CSS px)
 *  - mobile: 300-480
 * - tablet: 481 - 768
 * - mdDesktop: 769 - 1024
 * - lgDesktop: 1025+
 */
export const VIEWPORT_BUCKETS = ({
    mobile: "mobile",
    tablet: "tablet",
    mdDesktop: "mdDesktop",
    lgDesktop: "lgDesktop",
});

export const VIEWPORT_BREAKPOINTS = ({
    mobileMax: 480,
    tabletMax: 768,
    mdDesktopMax: 1024,
    lgDesktopMax: 1025,
});

/**
 * @param {number} width
 * @returns {"mobile"|"tablet"|"mdDesktop"|"lgDesktop"}
 */
export function getViewportBucket(width) {
    if(width <= VIEWPORT_BREAKPOINTS.mobileMax) return VIEWPORT_BUCKETS.mobile;
    if(width <= VIEWPORT_BREAKPOINTS.tabletMax) return VIEWPORT_BUCKETS.tablet;
    if(width <= VIEWPORT_BREAKPOINTS.mdDesktopMax) return VIEWPORT_BUCKETS.mdDesktop;
    
    return VIEWPORT_BUCKETS.lgDesktop;
}

