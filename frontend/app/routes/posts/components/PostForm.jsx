// src/menu/posts/components/PostForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import "../../../styles/posts/posts-form.css";
import "../../../styles/forms/forms.css";

import {
  useCreatePostMutation,
  useUploadPostImageMutation,
  useUploadPostVideoMutation,
} from "../../../services/postsApi";
import { emptyCreatePostForm } from "../utils/postTransformers";
import MediaUploadField from "../../../shared/MediaUpload";
import { useListMyBusinessesQuery } from "../../../services/businessMembershipApi";

/** @typedef {import("../../../types/post").CreatePostForm} CreatePostForm */

/**
 * @typedef {Object} MediaItem
 * @property {File} file
 * @property {string} previewUrl
 * @property {"image"|"video"} kind
 */

const MAX_TITLE_LENGTH = 80;

const getDraftStorageKey = (businessId) =>
  `postDraft:${businessId || "no-business"}`;

const PostForm = ({ businessId, onCreated }) => {
  // ---------- FETCH MY BUSINESSES (REAL) ----------
  const {
    data: myBusinesses = [],
    isLoading: isLoadingBusinesses,
    isError: isBusinessesError,
    error: businessesErrorRaw,
  } = useListMyBusinessesQuery();

  const businessesError = useMemo(() => {
    if (!isBusinessesError) return null;
    return (
      businessesErrorRaw?.message ||
      businessesErrorRaw?.data?.message ||
      businessesErrorRaw?.error ||
      "Failed to load your businesses."
    );
  }, [isBusinessesError, businessesErrorRaw]);

  // ---------- SELECTED BUSINESS ----------
  const [selectedBusinessId, setSelectedBusinessId] = useState(businessId || "");

  // If a businessId prop is passed, it should take precedence.
  // If not, default to first business once loaded.
  useEffect(() => {
    if (businessId) {
      setSelectedBusinessId(businessId);
      return;
    }

    if (isLoadingBusinesses) return;

    if (
      !selectedBusinessId &&
      Array.isArray(myBusinesses) &&
      myBusinesses.length > 0
    ) {
      setSelectedBusinessId(myBusinesses[0].id);
    }
  }, [businessId, isLoadingBusinesses, myBusinesses, selectedBusinessId]);

  const effectiveBusinessId = businessId || selectedBusinessId || "";

  const selectedBusiness = useMemo(() => {
    if (!effectiveBusinessId) return null;
    return (
      (Array.isArray(myBusinesses)
        ? myBusinesses.find((b) => b.id === effectiveBusinessId)
        : null) || null
    );
  }, [myBusinesses, effectiveBusinessId]);

  // ---------- INITIAL STATE (load from draft if exists) ----------
  /** @type {[CreatePostForm, React.Dispatch<React.SetStateAction<CreatePostForm>>]} */
  const [createPostForm, setCreatePostForm] = useState(() => {
    const base = emptyCreatePostForm();

    if (typeof window === "undefined") {
      return { ...base, business_id: effectiveBusinessId || base.business_id };
    }

    try {
      const key = getDraftStorageKey(effectiveBusinessId);
      const stored = window.localStorage.getItem(key);
      if (stored) {
        const draft = JSON.parse(stored);
        return {
          ...base,
          ...draft,
          business_id:
            effectiveBusinessId || draft.business_id || base.business_id,
        };
      }
    } catch (err) {
      console.warn("Failed to load post draft:", err);
    }

    return { ...base, business_id: effectiveBusinessId || base.business_id };
  });

  const [createPost, { isLoading, error: createPostError }] =
    useCreatePostMutation();

  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadPostImageMutation();

  const [uploadVideo, { isLoading: isUploadingVideo }] =
    useUploadPostVideoMutation();

  // ---------- BODY TABS ----------
  /** @type {["text" | "media", React.Dispatch<React.SetStateAction<"text"|"media">>]} */
  const [activeBodyTab, setActiveBodyTab] = useState("text");

  /** @type {[MediaItem[], React.Dispatch<React.SetStateAction<MediaItem[]>>]} */
  const [mediaFiles, setMediaFiles] = useState([]);

  // ---------- RELOAD DRAFT WHEN BUSINESS CONTEXT CHANGES ----------
  useEffect(() => {
    const base = emptyCreatePostForm();

    if (typeof window === "undefined") {
      setCreatePostForm({
        ...base,
        business_id: effectiveBusinessId || base.business_id,
      });
      return;
    }

    try {
      const key = getDraftStorageKey(effectiveBusinessId);
      const stored = window.localStorage.getItem(key);

      if (stored) {
        const draft = JSON.parse(stored);
        setCreatePostForm({
          ...base,
          ...draft,
          business_id:
            effectiveBusinessId || draft.business_id || base.business_id,
        });
      } else {
        setCreatePostForm({
          ...base,
          business_id: effectiveBusinessId || base.business_id,
        });
      }
    } catch (err) {
      console.warn("Failed to reload post draft:", err);
      setCreatePostForm({
        ...base,
        business_id: effectiveBusinessId || base.business_id,
      });
    }
  }, [effectiveBusinessId]);

  // ---------- SYNC DRAFT TO LOCALSTORAGE ----------
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const key = getDraftStorageKey(effectiveBusinessId);
      window.localStorage.setItem(key, JSON.stringify(createPostForm));
    } catch (err) {
      console.warn("Failed to save post draft:", err);
    }
  }, [createPostForm, effectiveBusinessId]);

  // ---------- DERIVED STATE ----------
  const titleLength = createPostForm.title?.length || 0;
  const rawTitleRemaining = MAX_TITLE_LENGTH - titleLength;
  const titleRemaining = Math.max(rawTitleRemaining, 0);

  const hasContent =
    typeof createPostForm.content === "string" &&
    createPostForm.content.trim().length > 0;

  const hasMedia = Array.isArray(mediaFiles) && mediaFiles.length > 0;
  const hasAnyBody = hasContent || hasMedia;

  // Require a business from "my businesses" list OR a locked prop businessId.
  const hasBusinessContext = !!effectiveBusinessId;

  const hasRequired =
    hasBusinessContext &&
    !!createPostForm.title?.trim() &&
    !!createPostForm.post_type &&
    !!createPostForm.visibility;

  const isTitleWithinLimit = titleLength <= MAX_TITLE_LENGTH;

  // If there are zero businesses, form should be blocked.
  const canPostToAnyBusiness =
    (Array.isArray(myBusinesses) && myBusinesses.length > 0) || !!businessId;

  const isFormValid =
    hasRequired && hasAnyBody && isTitleWithinLimit && canPostToAnyBusiness;

  const isSubmitDisabled =
    isLoading || isUploadingImage || isUploadingVideo || !isFormValid;

  const titleCounterClassName =
    "post-form__titleCounter" +
    (rawTitleRemaining < 10 ? " post-form__titleCounter--danger" : "");

  // ---------- FIELD CHANGE HANDLERS ----------
  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setCreatePostForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_TITLE_LENGTH) {
      setCreatePostForm((prev) => ({ ...prev, title: value }));
    } else {
      setCreatePostForm((prev) => ({
        ...prev,
        title: value.slice(0, MAX_TITLE_LENGTH),
      }));
    }
  };

  const handleBusinessChange = (e) => {
    const nextBusinessId = e.target.value;
    setSelectedBusinessId(nextBusinessId);
  };

  // ---------- RESET DRAFT ----------
  const handleResetDraft = () => {
    const base = emptyCreatePostForm();
    const next = { ...base, business_id: effectiveBusinessId || base.business_id };

    setCreatePostForm(next);
    setMediaFiles([]);

    if (typeof window !== "undefined") {
      try {
        const key = getDraftStorageKey(effectiveBusinessId);
        window.localStorage.removeItem(key);
      } catch (err) {
        console.warn("Failed to clear post draft:", err);
      }
    }

    toast.info("Draft cleared.");
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, post_type, visibility } = createPostForm;
    const titleTrimmed = title?.trim() || "";

    const hasSubmitContent = hasContent || hasMedia;

    if (isLoadingBusinesses) {
      toast.info("Loading your businesses...");
      return;
    }

    if (!canPostToAnyBusiness) {
      toast.error("You need to join or create a business before posting.");
      return;
    }

    if (!effectiveBusinessId) {
      toast.error("Please select a business before posting.");
      return;
    }

    if (!titleTrimmed) {
      toast.error("Please add a title for your post.");
      return;
    }

    if (titleTrimmed.length > MAX_TITLE_LENGTH) {
      toast.error(
        `Title is too long. Please keep it under ${MAX_TITLE_LENGTH} characters.`
      );
      return;
    }

    if (!post_type) {
      toast.error("Please select what type of post this is.");
      return;
    }

    if (!hasSubmitContent) {
      toast.error("Please add some content or media to your post.");
      return;
    }

    try {
      const payload = {
        ...createPostForm,
        title: titleTrimmed,
        business_id: effectiveBusinessId,
        visibility: visibility || "public",
        image_urls: [],
        video_urls: [],
      };

      const result = await createPost(payload).unwrap();
      const postId = result?.post?.id;

      if (postId && hasMedia) {
        const firstImage = mediaFiles.find((m) => m.kind === "image");
        const firstVideo = mediaFiles.find((m) => m.kind === "video");

        if (firstImage?.file) {
          try {
            await uploadImage({ postId, file: firstImage.file }).unwrap();
          } catch (err) {
            console.error("Image upload failed:", err);
            toast.error("Post created, but image upload failed.");
          }
        }

        if (firstVideo?.file) {
          try {
            await uploadVideo({ postId, file: firstVideo.file }).unwrap();
          } catch (err) {
            console.error("Video upload failed:", err);
            toast.error("Post created, but video upload failed.");
          }
        }
      }

      toast.success("Post created!");
      onCreated?.(result);
      handleResetDraft();
    } catch (error) {
      console.error("Error creating post:", error);

      const status = error?.status || error?.originalStatus;
      if (status === 403) {
        toast.error("You don’t have permission to post in this business.");
        return;
      }

      toast.error("Could not create post. Please try again.");
    }
  };

  const combinedError = createPostError?.error || null;

  const showEmptyState =
    !isLoadingBusinesses &&
    !businessesError &&
    (!Array.isArray(myBusinesses) || myBusinesses.length === 0) &&
    !businessId;

  return (
    <div className="post-form">
      {/* Header */}
      <div className="post-form__header">
        <p className="post-form__hint">
          Let your network know what's new with your business.
        </p>
        <p className="post-form__draftHint">
          Your post is always saved as a draft. Hit <strong>Reset</strong> to
          clear it anytime.
        </p>
      </div>

      {isLoadingBusinesses ? (
        <div className="post-form__hint" style={{ marginBottom: "0.5rem" }}>
          Loading your businesses...
        </div>
      ) : null}

      {combinedError ? (
        <div className="post-form__error" style={{ marginBottom: "0.5rem" }}>
          {combinedError}
        </div>
      ) : null}

      {businessesError ? (
        <div className="post-form__error" style={{ marginBottom: "0.5rem" }}>
          {businessesError}
        </div>
      ) : null}

      {showEmptyState ? (
        <div className="post-form__error" style={{ marginBottom: "0.75rem" }}>
          <strong>No businesses found.</strong> To create posts, you must either{" "}
          <strong>join a business</strong> or <strong>create one</strong>.
          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => toast.info("TODO: open Join Business flow")}
            >
              Join a business
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => toast.info("TODO: open Create Business flow")}
            >
              Create a business
            </button>
          </div>
        </div>
      ) : null}

      <form
        className="post-form__grid form-grid-1"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Business selector (always shown; locked if businessId prop is provided) */}
        <div className="post-form__field form-field form-field-full">
          <label htmlFor="post-business" className="post-form__label form-label">
            Business <span className="form-label-required">*</span>
          </label>

          <select
            id="post-business"
            name="business"
            className="post-form__control form-control"
            value={effectiveBusinessId}
            onChange={handleBusinessChange}
            disabled={
              isLoading ||
              isLoadingBusinesses ||
              !!businessId ||
              (!Array.isArray(myBusinesses) || myBusinesses.length === 0)
            }
          >
            {!effectiveBusinessId ? (
              <option value="">Select a business...</option>
            ) : null}

            {/* If businessId prop is provided but not in list yet, still show it */}
            {businessId &&
            Array.isArray(myBusinesses) &&
            !myBusinesses.some((b) => b.id === businessId) ? (
              <option value={businessId}>Selected business</option>
            ) : null}

            {Array.isArray(myBusinesses)
              ? myBusinesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.role ? `(${b.role})` : ""}
                  </option>
                ))
              : null}
          </select>

          <span className="post-form__hint form-hint">
            You can only post inside businesses you're a member of.{" "}
            {selectedBusiness ? (
              <>
                Posting as: <strong>{selectedBusiness.name}</strong>
              </>
            ) : null}
          </span>
        </div>

        {/* Title */}
        <div className="post-form__field form-field form-field-full">
          <label htmlFor="post-title" className="post-form__label form-label">
            Title <span className="form-label-required">*</span>
          </label>

          <input
            id="post-title"
            name="title"
            type="text"
            className="post-form__control form-control"
            placeholder="e.g. Looking to buy 500 iPhone 13 devices"
            value={createPostForm.title}
            onChange={handleTitleChange}
            disabled={isLoading || isLoadingBusinesses || !canPostToAnyBusiness}
          />

          <div className="post-form__hintRow form-hint-row">
            <span className="post-form__hint form-hint">
              A short, clear headline describing what this post is about.
            </span>
            <span className={titleCounterClassName}>
              {titleRemaining} characters remaining
            </span>
          </div>
        </div>

        {/* Post type */}
        <div className="post-form__field form-field">
          <label htmlFor="post-type" className="post-form__label form-label">
            Post type <span className="form-label-required">*</span>
          </label>

          <select
            id="post-type"
            name="post_type"
            className="post-form__control form-control"
            value={createPostForm.post_type}
            onChange={handleFieldChange("post_type")}
            disabled={isLoading || isLoadingBusinesses || !canPostToAnyBusiness}
          >
            <option value="selling">Selling</option>
            <option value="buying">Buying</option>
            <option value="launching">Launching</option>
            <option value="promoting">Promoting</option>
            <option value="informational">Informational</option>
            <option value="social">Social update</option>
          </select>

          <span className="post-form__hint form-hint">
            This helps other members quickly understand the intent of your post.
          </span>
        </div>

        {/* Visibility */}
        <div className="post-form__field form-field">
          <label htmlFor="post-visibility" className="post-form__label form-label">
            Visibility
          </label>

          <select
            id="post-visibility"
            name="visibility"
            className="post-form__control form-control"
            value={createPostForm.visibility}
            onChange={handleFieldChange("visibility")}
            disabled={isLoading || isLoadingBusinesses || !canPostToAnyBusiness}
          >
            <option value="public">Public (everyone)</option>
            <option value="followers">Followers</option>
            <option value="groups">Groups</option>
            <option value="private">Only me</option>
            <option value="custom">Custom</option>
          </select>

          <span className="post-form__hint form-hint">
            Choose who should be able to see this post.
          </span>
        </div>

        {/* Body */}
        <div className="post-form__field post-form__field--body form-field form-field-full">
          <label htmlFor="post-content" className="post-form__label form-label">
            Post content
          </label>

          {/* Tabs */}
          <div className="post-form__bodyTabs">
            <button
              type="button"
              className={
                "post-form__bodyTab" +
                (activeBodyTab === "text" ? " post-form__bodyTab--active" : "")
              }
              onClick={() => setActiveBodyTab("text")}
              disabled={isLoadingBusinesses || !canPostToAnyBusiness}
            >
              Text
            </button>

            <button
              type="button"
              className={
                "post-form__bodyTab" +
                (activeBodyTab === "media" ? " post-form__bodyTab--active" : "")
              }
              onClick={() => setActiveBodyTab("media")}
              disabled={isLoadingBusinesses || !canPostToAnyBusiness}
            >
              Images &amp; Video
            </button>
          </div>

          <div className="post-form__bodyShell">
            <div
              className={
                "post-form__pane" +
                (activeBodyTab === "text"
                  ? " post-form__pane--active"
                  : " post-form__pane--hidden")
              }
            >
              <textarea
                id="post-content"
                name="content"
                className="post-form__textarea form-control"
                placeholder="Share details, requirements, or context for your post."
                value={createPostForm.content || ""}
                onChange={handleFieldChange("content")}
                disabled={isLoading || isLoadingBusinesses || !canPostToAnyBusiness}
                cols={10}
                rows={10}
                autoFocus
              />
            </div>

            <div
              className={
                "post-form__pane" +
                (activeBodyTab === "media"
                  ? " post-form__pane--active"
                  : " post-form__pane--hidden")
              }
            >
              <MediaUploadField
                context="post"
                mediaItems={mediaFiles}
                onMediaChange={setMediaFiles}
                disabled={isLoading || isLoadingBusinesses || !canPostToAnyBusiness}
                label="Add image or video"
                className="post-form__mediaUpload"
              />
            </div>
          </div>
        </div>

        {/* Actions row */}
        <div
          className="post-form__actions form-actions-right"
          style={{ gap: "0.5rem" }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            disabled={
              isLoading ||
              isUploadingImage ||
              isUploadingVideo ||
              isLoadingBusinesses ||
              !canPostToAnyBusiness
            }
            onClick={handleResetDraft}
          >
            Reset
          </button>

          <button
            type="submit"
            className={`${isSubmitDisabled ? "btn-primary__ghost" : "btn-primary"} btn`}
            disabled={isSubmitDisabled}
          >
            {isLoading || isUploadingImage || isUploadingVideo ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;