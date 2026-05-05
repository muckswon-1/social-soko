// src/menu/shared/MediaUploadField.jsx

import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { compressImageFile } from "../utils/imageCompression";
import { compressVideoFile } from "../utils/videoCompression";

/**
 * @typedef {"post" | "comment"} MediaContext
 * @typedef {"image" | "video"} MediaKind
 * @typedef {Object} MediaItem
 * @property {File} file
 * @property {string} previewUrl
 * @property {MediaKind} kind
 */
import { ReactComponent as Close } from "../assets/svg/cross.svg";
import { ReactComponent as UploadIcon } from "../assets/svg/upload.svg";
import "../styles/posts/media-upload.css";

const MAX_SIZE_MB = 100;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const MAX_VIDEO_SIZE_MB = 500;

/**
 * @typedef {Object} MediaUploadHandle
 * @property {() => void} openPicker
 */

/**
 * @param {{
 *   context?: MediaContext;
 *   label?: string;
 *   helperText?: string;
 *   mediaItems: MediaItem[];
 *   onMediaChange: (items: MediaItem[]) => void;
 *   accept?: string;
 *   disabled?: boolean;
 *   className?: string;
 *   maxItems?: number;
 *   showUi?: boolean;
 *   showTrigger?: boolean;
 * }} props
 * @param {React.Ref<MediaUploadHandle>} ref
 */
function MediaUploadFieldInner(
  {
    context = "post",
    label = "Add image or video",
    helperText = "Optional — attach a single image or short clip.",
    mediaItems,
    onMediaChange,
    accept = "image/*,video/*",
    disabled = false,
    className = "",
    maxItems = 1,
    showUi = true,
    showTrigger = true,
  },
  ref
) {
  const [localError, setLocalError] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const hasMedia = Array.isArray(mediaItems) && mediaItems.length > 0;

  useImperativeHandle(ref, () => ({
    openPicker() {
      if (disabled || isCompressing) return;
      inputRef.current?.click();
    },
  }));

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      if (Array.isArray(mediaItems)) {
        mediaItems.forEach((item) => {
          if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateFile = (file) => {
    if (!file) return "Please upload an image or video.";

    const isVideo = file.type.startsWith("video/");

    if (!isVideo && !ACCEPTED_TYPES.includes(file.type)) {
      return "Please choose a PNG, JPG, or WEBP file.";
    }

    if (!isVideo && file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Image size must be less than ${MAX_SIZE_MB} MB.`;
    }

    if (isVideo && !ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      return "Please choose an MP4, WEBM, or OGG video.";
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      return `Video size must be less than ${MAX_VIDEO_SIZE_MB} MB.`;
    }

    return null;
  };

  const processFile = async (file) => {
    const error = validateFile(file);

    if (error) {
      setLocalError(error);

      // Clear existing media on error (keep behavior consistent)
      if (hasMedia) {
        mediaItems.forEach((item) => {
          if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
      }

      onMediaChange([]);
      return;
    }

    setLocalError(null);
    setIsCompressing(true);

    const isVideo = file.type.startsWith("video/");
    const kind = /** @type {MediaKind} */ (isVideo ? "video" : "image");

    try {
      const compressed = isVideo
        ? await compressVideoFile(file)
        : await compressImageFile(file, true);

      const previewUrl = URL.createObjectURL(compressed);

      /** @type {MediaItem} */
      const newItem = { file: compressed, previewUrl, kind };

      let nextItems;

      if (maxItems === 1) {
        if (hasMedia) {
          mediaItems.forEach((item) => {
            if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
          });
        }
        nextItems = [newItem];
      } else {
        const trimmed = (Array.isArray(mediaItems) ? mediaItems : []).slice(
          0,
          maxItems - 1
        );
        nextItems = [...trimmed, newItem];
      }

      onMediaChange(nextItems);
    } catch (err) {
      console.error("Error compressing file", err);
      setLocalError(
        isVideo
          ? "Error compressing video. Please try again."
          : "Error compressing image. Please try again."
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    await processFile(file);
  };

  const handleSelectClick = () => {
    if (disabled || isCompressing) return;
    inputRef.current?.click();
  };

  const handleRemoveIndex = (index) => {
    if (!hasMedia) return;

    const target = mediaItems[index];
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);

    const next = mediaItems.filter((_, i) => i !== index);
    onMediaChange(next);

    if (inputRef.current && next.length === 0) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      className={[
        "media-upload",
        context === "post" ? "media-upload--post" : "media-upload--comment",
        !showUi ? "media-upload--iconOnly" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Hidden input always present so the outer icon can open it */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled || isCompressing}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Preview (still shows even in iconOnly mode) */}
      {hasMedia ? (
        <div className="media-upload__previewGrid">
          {mediaItems.map((item, index) => (
            <div className="media-upload__previewCard" key={`${item.kind}-${index}`}>
              {item.kind === "image" ? (
                <img
                  src={item.previewUrl}
                  alt="Selected"
                  className="media-upload__previewMedia"
                />
              ) : (
                <video
                  src={item.previewUrl}
                  className="media-upload__previewMedia"
                  controls
                />
              )}

              {/* Hover-only remove overlay */}
              <button
                type="button"
                className="media-upload__removeBtn"
                onClick={() => handleRemoveIndex(index)}
                disabled={disabled || isCompressing}
                aria-label="Remove media"
                title="Remove"
              >
                <Close className="media-upload__removeIcon" />
                <span className="media-upload__removeText">Remove</span>
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Optional internal UI (for posts). Hidden for comment icon-only usage. */}
      {showUi ? (
        <div className="media-upload__ui">
          {showTrigger ? (
            <button
              type="button"
              className="media-upload__trigger"
              onClick={handleSelectClick}
              disabled={
                disabled || isCompressing || (mediaItems?.length || 0) >= maxItems
              }
            >
            
            <UploadIcon className="media-upload__triggerIcon icon-svg--lg" />
            </button>
          ) : null}

          {localError ? (
            <p className="form-error media-upload__error">{localError}</p>
          ) : null}

          {isCompressing ? (
            <p className="media-upload__status text-muted">Compressing…</p>
          ) : null}

          {label ? <div className="media-upload__label">{label}</div> : null}
          {helperText ? <div className="media-upload__helper">{helperText}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

const MediaUploadField = forwardRef(MediaUploadFieldInner);
export default MediaUploadField;
