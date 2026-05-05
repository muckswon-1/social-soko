import React, { useRef, useState } from 'react';
import { compressImageFile } from '../../utils/imageCompression';
import { toast } from 'react-toastify';
import { ImageUp } from 'lucide-react';

const MAX_SIZE_MB = 100;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];


const ImageUploadBase = ({label = "Image", description = "Upload an image", onUpload, onSkip, onDone, mutationError, isMutationLoading}) => {

    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [localError, setLocalError] = useState("");
    const [isCompressing, setIsCompressing] = useState(false);

    const isBusy = isMutationLoading || isCompressing;


 const validateFile = (f) => {
        if (!f)  return "Please choose an image file";

        if(!ACCEPTED_TYPES.includes(f.type)) return "Please choose a PNG, JPG, or WEBP file";

        // const sizeInMB = f.size / (1024 * 1024);
        // if (sizeInMB > MAX_SIZE_MB) return `File size must be less than ${MAX_SIZE_MB}MB`;

        return ""

    }


    const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    await handleFile(f);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    await handleFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleClickDropzone = () => {
    if (isBusy) return;
    fileInputRef.current?.click();
  };

    const handleFile = async (f) => {
        const error = validateFile(f);
        if (error) {
            setLocalError(error);
            setFile(null);
            if(preview) URL.revokeObjectURL(preview);
            setPreview(null);
            return;
        }

        setLocalError("");
        setIsCompressing(true);

        try {
            const compressed = await compressImageFile(f, true);
            if(preview) URL.revokeObjectURL(preview);
            setFile(compressed);
            setPreview(URL.createObjectURL(compressed));
        } catch (error) {
            console.error("Error compressing image:", error);
            setLocalError("Error compressing image. Please try again.");
            setFile(null);
            if(preview) URL.revokeObjectURL(preview);
            setPreview(null);
        } finally {
            setIsCompressing(false);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!file){
            setLocalError("Please select an image to continue.");
            return;
        }

        if(!onUpload) return;

        try {
            const result = await onUpload(file);
            toast.success(`${label} uploaded successfully!`)
            onDone?.(result);
        } catch (error) {
            console.error("Error uploading image:", error);

        }
    }

    const combinedError = localError || mutationError || "";

    return (
           <form className="form-grid-2 logo-step" onSubmit={handleSubmit}>
      {/* Intro */}
      <div className="form-field logo-step-intro">
        <span className="form-label">Business Logo</span>
        <p className="form-hint">
          {/* Upload a clean, square picure (ideally 400x400 or 512x512). This will
          appear on your public profile, search results, and messages. */}
          {description}
        </p>
      </div>

      {/* Dropzone */}
      <div
        className={
          "logo-dropzone" + (dragActive ? " logo-dropzone--active" : "")
        }
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickDropzone}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={isBusy}
        />

        <div className="logo-dropzone__icon">
          <ImageUp
            className="logo-dropzone__icon-svg"
            aria-hidden="true"
          />
        </div>

        <div>
          <div className="logo-dropzone__title">Drag &amp; drop your logo</div>
          <div className="logo-dropzone__subtitle">
            or <span>browse files</span>
          </div>
        </div>

        <div className="logo-dropzone__meta">
          PNG, JPG, or WEBP • Max {MAX_SIZE_MB}MB (compressed client-side)
        </div>
      </div>

      {/* Preview + file meta */}
      <div className="form-field logo-preview">
        <span className="form-label">Preview</span>

        <div className="logo-preview-row">
          <div className="logo-preview-avatar">
            {preview ? (
              <img src={preview} alt="Logo preview" />
            ) : (
              <div className="logo-preview-empty">No logo yet</div>
            )}
          </div>

          <div className="logo-preview-meta">
            {file ? (
              <>
                <div className="logo-preview-meta__name">{file.name}</div>
                <div className="logo-preview-meta__size">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </>
            ) : (
              <div className="logo-preview-meta__size">
                Select a logo to see details here.
              </div>
            )}
          </div>
        </div>

        {/* Change image link */}
        {preview && (
          <button
            type="button"
            className="logo-preview-change"
            onClick={handleClickDropzone}
            disabled={isBusy}
          >
            Choose a different image
          </button>
        )}

        {combinedError && (
          <div className="form-error" style={{ marginTop: "0.25rem" }}>
            {combinedError}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="inline-actions create-business-actions logo-step-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onSkip}
          disabled={isBusy}
        >
          Skip for now
        </button>
        <button className="btn" disabled={isBusy || !file}>
          {isMutationLoading ? "Uploading…" : isCompressing ? "Processing…" : "Finish"}
        </button>
      </div>
    </form>
    );
}

export default ImageUploadBase;
