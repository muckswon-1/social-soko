// // src/menu/posts/PostComposer.jsx
 import React, { useState } from "react";
import { useCurrentBusiness } from "../../hooks/business/useCurrentBusiness";
import { ReactComponent as CloseIcon }from "../../assets/svg/cross.svg"
import PostForm from "../posts/components/PostForm";
import "../../styles/posts/create-post.css";
import { useNavigate } from "react-router";
// import PostForm from "../posts/components/PostForm";
// import { useIsDesktop } from "../../hooks/useIsDesktop";

// // function PostComposer({
// //   businessId,
// //   className = "",
// //   open,                 // optional controlled open state
// //   onOpenChange,         // optional controlled setter
// //   refetch
// // }) {
//  // const isDesktop = useIsDesktop();

//   //const [internalOpen, setInternalOpen] = useState(false);

//   // const isControlled = typeof open === "boolean";
//   // const isOpen = isControlled ? open : internalOpen;

//   // const setOpen = (next) => {
//   //   if (isControlled) {
//   //     onOpenChange?.(next);
//   //   } else {
//   //     setInternalOpen(next);
//   //   }
//   // };

//   // const handlePostCreated = () => {
//   //   if (isDesktop) {
//   //     setOpen(false);
//   //   }

//   //   refetch()

//   // };

//   // // On mobile/tablet: still render inline form
//   // if (!isDesktop) {
//   //   return (
//   //     <div className={["post-composer-inline-wrapper", className].join(" ")}>
//   //       <PostForm
//   //         businessId={businessId}
//   //         mode="inline"
//   //         onCreated={handlePostCreated}
//   //       />
//   //     </div>
//   //   );
//   // }

//   // // Desktop: modal (+ optional launcher)
//    return (
//   //   <div className={["post-composer-wrapper", className].join(" ")}>
//   //     {/* Launcher card (optional) */}
//   //     {/* {!hideLauncher && (
//   //       <div className="post-composer-launch card">
//   //         <button
//   //           type="button"
//   //           className="post-composer-launch-btn form-control"
//   //           onClick={() => setOpen(true)}
//   //         >
//   //           Share an Update…
//   //         </button>
//   //       </div>
//   //     )} */}

//   //     {/* Modal */}
//   //     {isOpen && (
//   //       <div className="post-modal-backdrop">
//   //         <div className="post-modal-panel card">
//   //           <div className="post-modal-header">
//   //             <h2 className="post-modal-title">Create post</h2>
//   //             <button
//   //               type="button"
//   //               className="link-btn"
//   //               onClick={() => setOpen(false)}
//   //             >
//   //               Close
//   //             </button>
//   //           </div>

//   //           <PostForm
//   //             businessId={businessId}
//   //             mode="modal"
//   //             onCreated={handlePostCreated}
//   //           />
//   //         </div>
//   //       </div>
//   //     )}
//   //   </div>
//   <>
  
//   <p>Create form</p>
//   </>
//   );
// }

function PostComposer(){
  const {businessId} = useCurrentBusiness();
  const navigate = useNavigate();


  return (
    <div className="post-composer__wrapper">
      <div className="post-composer__header">
        <h2 className="post-composer__title">Create post</h2>
        <button
        onClick={() =>  navigate('/')}
  
        
        type="button" className="post-composer__close"><CloseIcon className="icon-svg--lg post-composer__close-icon" /></button>
      </div>
       <PostForm businessId={businessId} onCreated={() => {}}/>
    </div>
  )
}



export default PostComposer;
