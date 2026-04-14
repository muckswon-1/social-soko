import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useViewportBucket } from '../../hooks/design/useViewPortBucket';
import { VIEWPORT_BUCKETS } from '../../hooks/design/viewPortUtils';
import "../../styles/posts/post-detail.css";
import "../../styles/posts/post-card.css";

import { ReactComponent as Close } from "../../assets/svg/cross.svg";
import { useDispatch } from 'react-redux';
import { verifySession } from '../../features/auth/authThunk';
/**
 * @typedef {"mobile"|"tablet"|"mdDesktop"|"lgDesktop"} ViewPortBucket
 */

/**
 * @typedef {{
 * bucket: ViewPortBucket;
 * isMobile:boolean;
 * isTablet:boolean;
 * isMdDesktop:boolean;
 * isLgDesktop:boolean;
 * leftRailOpen: boolean;
 * rightRailOpen: boolean;
 * openLeftRail: () => void;
 * closeLeftRail: () => void;
 * toggleLeftRail: () => void;
 * openRightRail: () => void;
 * closeRightRail: () => void;
 * toggleRightRail: () => void;
 * }} ShellLayoutContextValue
 */

/**@type {React.Context<ShellLayoutContextValue>} */
const ShellLayoutContext = createContext((null));


export function useShellLayout() {
    const ctx = useContext(ShellLayoutContext);
    if(!ctx){
        throw new Error("useShellLayout must be used within a <ResponsiveShell />");
    }

    return ctx
}

function Drawer({open, title, onClose, side = "left", children}){
     useEffect(() => {
        if(!open) return;

        const onKeyDown = (e) => {
            if(e.key === "Escape") onClose?.()
        };

        window.addEventListener("keydown",onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
     },[open, onClose]);

     if(!open) return null;


     return (
    <div className="drawer-root" data-open={open ? "true" : "false"}>
      {/* Backdrop */}
      <button
        type="button"
        className="drawer-backdrop"
        aria-label="Close panel"
        onClick={onClose}
      />

      {/* Panel */}
      <section
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title || "Panel"}
        data-side={side}
      >
        <div className="drawer-header">
          <div className="drawer-title">{title}</div>
          <button type="button" className="drawer-close" onClick={onClose}>
            <Close className="icon-svg drawer-close__icon" />
          </button>
        </div>

        <div className="drawer-body">{children}</div>
      </section>
    </div>
  );


}
 


/**
 * Responsive app shell that mimics Reddit layout behavior.
 *
 * Buckets:
 * - mobile (320–480): center only; rails as drawers
 * - tablet (481–768): center only; rails as drawers
 * - mdDesktop (769–1024): left pinned + center; right hidden
 * - lgDesktop (1025+): left pinned + center + right pinned
 *
 * @param {{
 *  header?: React.ReactNode;
 *  leftRail?: React.ReactNode;
 *  rightRail?: React.ReactNode;
 *  children: React.ReactNode;
 *  className?: string;
 * }} props
 */
const ResponsiveShell = ({
    header = null,
    leftRail = null,
    rightRail = null,
    children,
    className = ""
}) => {


   const {bucket, isMobile, isTablet, isMdDesktop, isLgDesktop} = useViewportBucket();
   const dispatch = useDispatch();

   

    const [leftRailOpen, setLeftRailOpen] = useState(false);
    const [rightRailOpen, setRightRailOpen] = useState(false);

    useEffect(() => void dispatch(verifySession()),[dispatch]);

    //when switching into desktop buckers, drawsers should close
    useEffect(() => {
        if(bucket === VIEWPORT_BUCKETS.mdDesktop || bucket === VIEWPORT_BUCKETS.lgDesktop){
            setLeftRailOpen(false);
            setRightRailOpen(false);
        }
    },[bucket]);

    const ctxValue = useMemo(() => {
        return {
            bucket,
            isMobile,
            isTablet,
            isMdDesktop,
            isLgDesktop,
            leftRailOpen,
            rightRailOpen,
            openLeftRail: () => setLeftRailOpen(true),
            closeLeftRail: () => setLeftRailOpen(false),
            toggleLeftRail: () => setLeftRailOpen((v) => !v),
            openRightRail: () => setRightRailOpen(true),
            closeRightRail: () => setRightRailOpen(false),
            toggleRightRail: () => setRightRailOpen((v) => !v),

            
        }
    },[bucket, isMobile, isTablet, isMdDesktop, isLgDesktop, leftRailOpen, rightRailOpen]);

    const showLeftPinned = isLgDesktop || isMdDesktop;
    const showRightPinned = isLgDesktop;
   

    const showLeftDrawer = (isMobile || isTablet) && (!!leftRail || !!rightRail);
   


    const mobileDrawerContent = (
        <>
        {leftRail ? <div className="responsive-shell__left responsive-shell__left--mobile">{leftRail}</div> : null}

        {rightRail ? <div className="responsive-shell__right responsive-shell__right--mobile">{rightRail}</div> : null}
        </>
    )


const mergedRailContent = (
  <>
    {leftRail ? (
      <div className="responsive-shell__left responsive-shell__left--merged">
        {leftRail}
      </div>
    ) : null}

    {rightRail ? (
      <div className="responsive-shell__right responsive-shell__right--merged">
        {rightRail}
      </div>
    ) : null}
  </>
);

   


    return (
        <ShellLayoutContext.Provider value={ctxValue}>
            <div className= {[
                "responsive-shell",
                `responsive-shell--${bucket}`,
                className,
            ].join(" ")}
            data-bucket={bucket}
            >
                {header ? <div className='responsive-shell__header'>{header}</div> : null}

                {/* Pinned Left Rail (mdDesktop+) */}
                {
                    showLeftPinned ? (
                        <aside className='responsive-shell__left' aria-label="Primary navigation">
                            {isMdDesktop ? mergedRailContent :leftRail}
                        </aside>
                    ): null
                }


                {/* Center Stage */}
                <main className='responsive-shell__center' aria-label='Main content'>
                    {children}
                </main>




                {/* Pinned right Rail (lgDesktop+) */}
                {
                    showRightPinned ? (
                        <aside className='responsive-shell__right' aria-label='Secondary Navigation'>
                            {rightRail}
                        </aside>
                    ): null
                }

                {/* Drawers for smaller buckets */}
                {
                    showLeftDrawer ? (
                        <Drawer
                        open={leftRailOpen}
                        title="Menu"
                        side="left"
                        onClose={() => setLeftRailOpen(false)}
                        >
                             <div className="responsive-shell__left responsive-shell__left--mobile">
      {mergedRailContent}
    </div>
    
                        </Drawer>
                    ): null
                }

                   {/* {
                    showRightDrawer ? (
                        <Drawer
                        open={rightRailOpen}
                        title="Discover"
                        side="right"
                        onClose={() => setRightRailOpen(false)}
                        >
                            {rightRail}
                        </Drawer>
                    ): null
                } */}

            

            </div>
        </ShellLayoutContext.Provider>
    );
}

export default ResponsiveShell;
