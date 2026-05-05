/**@typedef {import("../../types/post").PostDetail} PostDetail*/

import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isPostComposerOpen: false,

    detail: {
        /**@type {boolean} */
        isPostDetailOpen: false,
        /**@type {PostDetail | null} */
        selectedPost: null
    }
};


export const postUiSlice = createSlice({
    name: 'postsUi',
    initialState,
    reducers: {
        // composer
        openPostComposer(state) {
            state.isPostComposerOpen = true
        },
        closePostComposer(state) {
            state.isPostComposerOpen = false;
        },
        setPostComposerOpen(state, action) {
            // trace who is opening composer
            state.isPostComposerOpen = Boolean(action.payload);
        },

        openPostDetail(state, action) {
            console.trace('You opened  me: ');
            state.detail.isPostDetailOpen = true,
            state.detail.selectedPost = action.payload || null
        },
        closePostDetail(state, action) {
            state.detail.isPostDetailOpen = false,
            state.detail.selectedPost = null
        },
        setSelectedPost(state, action) {
            
            state.detail.selectedPost = action.payload || null;
        }
    }
});

export const  {
    openPostComposer,
    closePostComposer,
    setPostComposerOpen,
    openPostDetail,
    closePostDetail,
    setSelectedPost
} = postUiSlice.actions


export default postUiSlice.reducer;



export const selectPostComposerOpen = (state) => state.postsUi.isPostComposerOpen;
export const selectedPostDetailOpen = (state) => state.postsUi.detail.isPostDetailOpen;
export const selectedPostDetailSelectedPost = (state) => state.postsUi.detail.selectedPost;


