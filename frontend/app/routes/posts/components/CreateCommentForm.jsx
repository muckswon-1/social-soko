// src/menu/posts/components/CreateCommentForm.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { selectAuthUser } from "../../../features/auth/authSlice";
import {
  useCreateCommentMutation,
  useUploadCommentImageMutation,
  useUploadCommentVideoMutation,
} from "../../../services/postsApi";
import MediaUploadField from "../../../shared/MediaUpload";
import { getInitials } from "../../../utils/passwordUtils";
import { emptyCreateCommentForm } from "../utils/postTransformers";

import { ReactComponent as UploadIcon } from "../../../assets/svg/upload.svg";

import "../../../styles/posts/create-comment.css";
import useRequireAuthAction from "../../../hooks/useRequireAuthAction";

/**
 * @typedef {import("../../../types/comment").CreateCommentForm} CreateCommentFormType
 * @typedef {import("../../../types/comment").Comment} CommentType
 * @typedef {import("../../../types/post").MediaItem} MediaItem
 */

const getDraftStorageKey = (postId, parentCommentId) =>
  `commentDraft:${postId || "no-post"}:${parentCommentId || "root"}`;

const CreateCommentForm = ({
  postId,
  onSubmit,
  parentCommentId = null,
  onCancel,
  autoFocus = false,
  submitLabel = "Comment",
}) => {
  const user = useSelector(selectAuthUser);
  const requireAuth = useRequireAuthAction();

  const draftKey = useMemo(
    () => getDraftStorageKey(postId, parentCommentId),
    [postId, parentCommentId]
  );

  /** @type {[CreateCommentFormType, React.Dispatch<React.SetStateAction<CreateCommentFormType>>]} */
  const [form, setForm] = useState(() => {
    const base = emptyCreateCommentForm();

    if (typeof window === "undefined") {
      return { ...base, post_id: postId ?? base.post_id };
    }

    try {
      const stored = window.localStorage.getItem(draftKey);
      if (stored) {
        const draft = JSON.parse(stored);
        return {
          ...base,
          ...draft,
          post_id: postId ?? base.post_id ?? draft.post_id,
        };
      }
    } catch (error) {
      console.warn("Failed to load comment draft:", error);
    }

    return { ...base, post_id: postId ?? base.post_id };
  });

  /** @type {[MediaItem[], React.Dispatch<React.SetStateAction<MediaItem[]>>]} */
  const [mediaFiles, setMediaFiles] = useState([]);

  const [isActive, setIsActive] = useState(() => {
    const initialText = (form?.content || "").trim();
    return Boolean(autoFocus || initialText.length > 0);
  });

  const textareaRef = useRef(null);
  const uploaderRef = useRef(null);

  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  const [uploadCommentImage, { isLoading: isUploadingImage }] = useUploadCommentImageMutation();
  const [uploadCommentVideo, { isLoading: isUploadingVideo }] = useUploadCommentVideoMutation();

  const updateForm = useCallback(
    (updates) => {
      setForm((prev) => {
        const next = { ...prev, ...updates };

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(draftKey, JSON.stringify(next));
          } catch (err) {
            console.warn("Failed to persist comment draft:", err);
          }
        }

        return next;
      });
    },
    [draftKey]
  );

  useEffect(() => {
    const base = emptyCreateCommentForm();

    if (typeof window === "undefined") {
      setForm({ ...base, post_id: postId ?? base.post_id });
      return;
    }

    try {
      const stored = window.localStorage.getItem(draftKey);

      if (stored) {
        const draft = JSON.parse(stored);
        const next = {
          ...base,
          ...draft,
          post_id: postId ?? base.post_id ?? draft.post_id,
        };
        setForm(next);

        const hasDraftText = Boolean(String(next?.content || "").trim().length);
        setIsActive(Boolean(autoFocus || hasDraftText));
      } else {
        const next = { ...base, post_id: postId ?? base.post_id };
        setForm(next);
        setIsActive(Boolean(autoFocus));
      }
    } catch (error) {
      console.warn("Failed to reload comment draft:", error);
      setForm({ ...base, post_id: postId ?? base.post_id });
      setIsActive(Boolean(autoFocus));
    }
  }, [draftKey, postId, autoFocus]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [form.content]);

  useEffect(() => {
    if (!autoFocus) return;

    // Only autofocus for logged-in users; otherwise require auth (no auto-open)
    if (!user) return;

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => textareaRef.current?.focus?.());
    }
  }, [autoFocus, user]);

  const userFullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const userInitials = user ? getInitials(userFullName || "Member") : "?";

  const hasMedia = Array.isArray(mediaFiles) && mediaFiles.length > 0;

  const isBusy = isCreatingComment || isUploadingImage || isUploadingVideo;
  const isDisabled = isBusy;

  const trimmedContent = (form.content || "").trim();
  const hasContent = trimmedContent.length > 0;

  const canSubmit = !!user && !isBusy && (hasContent || hasMedia);

  const resolvedSubmitLabel = useMemo(() => {
    if (isCreatingComment) return "Posting...";
    if (isUploadingImage) return "Uploading image...";
    if (isUploadingVideo) return "Uploading video...";
    return submitLabel;
  }, [isCreatingComment, isUploadingImage, isUploadingVideo, submitLabel]);

  const clearDraftAndReset = () => {
    const base = emptyCreateCommentForm();
    const next = { ...base, post_id: postId ?? base.post_id };

    setForm(next);
    setMediaFiles([]);

    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(draftKey);
      } catch (err) {
        console.warn("Failed to clear comment draft:", err);
      }
    }
  };

  const handleCollapse = () => {
    const hasAnything = Boolean((form?.content || "").trim().length) || hasMedia;
    if (hasAnything) return;

    setIsActive(false);
    clearDraftAndReset();
    onCancel?.();
  };

  const handleOpenUploader = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Only open if authed; otherwise trigger requireAuth flow
    requireAuth(
      () => {
        setIsActive(true);
        uploaderRef.current?.openPicker?.();
      },
      {
        title: "Login to upload media",
        message: "You need to be logged in to upload images or videos.",
      }
    )();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please log in to post a comment.");
      return;
    }

    if (!hasContent && !hasMedia) {
      toast.error("Please add text or attach media before posting.");
      return;
    }

    const payload = {
      post_id: postId,
      parent_id: parentCommentId,
      content: trimmedContent,
      imageUrls: form.image_urls || [],
      videoUrls: form.video_urls || [],
    };

    try {
      const result = await createComment(payload).unwrap();
      /** @type {CommentType} */
      let newComment = result.comment;

      if (newComment?.id && hasMedia) {
        const firstImage = mediaFiles.find((m) => m.kind === "image");
        if (firstImage?.file) {
          const uploadCommentImageRes = await uploadCommentImage({
            commentId: newComment.id,
            file: firstImage.file,
          }).unwrap();

          const imageUrls = uploadCommentImageRes?.imageUrls || [];
          newComment = { ...newComment, imageUrls: [...imageUrls] };
        }

        const firstVideo = mediaFiles.find((m) => m.kind === "video");
        if (firstVideo?.file) {
          const uploadCommentVideoRes = await uploadCommentVideo({
            commentId: newComment.id,
            file: firstVideo.file,
          }).unwrap();

          const videoUrls = uploadCommentVideoRes?.videoUrls || [];
          newComment = { ...newComment, videoUrls: [...videoUrls] };
        }
      }

      toast.success("Comment posted successfully!");
      onSubmit?.(newComment);

      clearDraftAndReset();
      setIsActive(false);
    } catch (err) {
      console.error("Failed to create comment:", err);
      toast.error("There was a problem creating your comment. Please try again.");
    }
  };

  // ---- auth-gated "activate composer" handlers ----
  const activateComposer = useCallback(
    () =>
      requireAuth(
        () => {
          setIsActive(true);
          // optional: focus textarea after activating
          if (typeof window !== "undefined") {
            window.requestAnimationFrame(() => textareaRef.current?.focus?.());
          }
        },
        {
          title: "Login to comment",
          message: "You need to be logged in to post a comment.",
        }
      )(),
    [requireAuth]
  );

  const handleTextareaFocus = () => {
    // Only activate if authed; otherwise trigger auth
    if (user) {
      setIsActive(true);
      return;
    }

    // prevent a "flash" of active UI for logged-out users
    if (textareaRef.current) textareaRef.current.blur?.();

    requireAuth(
      () => {
        setIsActive(true);
        if (typeof window !== "undefined") {
          window.requestAnimationFrame(() => textareaRef.current?.focus?.());
        }
      },
      {
        title: "Login to comment",
        message: "You need to be logged in to post a comment.",
      }
    )();
  };

  return (
    <form
      className={[
        "comment-composer",
        isActive ? "comment-composer--active" : "comment-composer--idle",
        parentCommentId ? "comment-composer--reply" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onSubmit={handleSubmit}
    >
      {/* Row: pill input */}
      <div className="comment-composer__row comment-composer__row--input">
        <div
          className={`comment-composer__pill ${
            hasMedia ? "comment-composer__pill--hasMedia" : "comment-composer__pill--hasNoMedia"
          }`}
          // click anywhere on the pill should open composer only if authed
          onClick={() => {
            if (!user) {
              activateComposer();
              return;
            }
            setIsActive(true);
          }}
        >
          <div className="comment-composer__pill__input">
            <button
              type="button"
              className="comment-composer__uploadBtn post-actions__btn has-tooltip post-actions__btn--active"
              onClick={handleOpenUploader}
              disabled={isDisabled}
              aria-label="Upload image or video"
              title="Upload"
            >
              <UploadIcon className="comment-composer__uploadIcon" />
            </button>

            <textarea
              ref={textareaRef}
              autoFocus={autoFocus && !!user}
              className="comment-composer__textarea"
              placeholder={user ? "Add a comment" : "Log in to comment"}
              value={form.content || ""}
              rows={1}
              onFocus={handleTextareaFocus}
              onChange={(e) => updateForm({ content: e.target.value })}
              disabled={isDisabled}
              readOnly={!user} // prevents typing when logged out (but still lets focus trigger auth)
            />
          </div>

          {/* Hidden uploader; picker opened via icon; preview will render below */}
          <MediaUploadField
            ref={uploaderRef}
            context="comment"
            mediaItems={mediaFiles}
            onMediaChange={(next) => {
              setMediaFiles(next);
              if (next?.length && user) setIsActive(true);
            }}
            disabled={isBusy}
            showUi={false}
            showTrigger={false}
          />
        </div>
      </div>

      {/* Controls appear only when active */}
      {isActive ? (
        <div className="comment-composer__row comment-composer__row--actions">
          <div className="comment-composer__rightActions">
            <button
              type="button"
              className="post-actions__btn has-tooltip"
              onClick={() => {
                onCancel?.();
                handleCollapse();
              }}
              disabled={isBusy}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="post-actions__btn has-tooltip post-actions__btn--active"
              disabled={!canSubmit}
            >
              {resolvedSubmitLabel}
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
};

export default CreateCommentForm;
