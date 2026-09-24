import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const PropertyAttachments = ({ data }) => {
    const [maxImagesWarning, setMaxImagesWarning] = useState("");
    const [attachmentError, setAttachmentError] = useState("");

    const onDrop = useCallback(
        (acceptedFiles) => {
            const currentAttachmentsCount = data.attachments.length;

            if (currentAttachmentsCount >= 3) {
                setMaxImagesWarning("You can only upload a maximum of 3 images.");
                return;
            }

            const remainingSlots = 3 - currentAttachmentsCount;

            const imagePreviews = acceptedFiles.slice(0, remainingSlots).map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            data.setAttachments((prev) => [...prev, ...imagePreviews]);
            setMaxImagesWarning("");
            setAttachmentError("");
        },
        [data.attachments, data.setAttachments]
    );

    const onDropRejected = useCallback((fileRejections) => {
        if (!fileRejections.length) return;

        const hasInvalidType = fileRejections.some(({ errors }) =>
            errors.some((error) => error.code === "file-invalid-type")
        );

        if (hasInvalidType) {
            setAttachmentError("Each attachment must be a jpeg, png, jpg, or svg file.");
            return;
        }

        setAttachmentError("Unable to upload the selected file.");
    }, []);

    const removeImage = (indexToRemove) => {
        data.setAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
        setMaxImagesWarning("");
        setAttachmentError("");
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "image/svg+xml": [".svg"],
        },
        multiple: true,
    });

    return (
        <>
            <div className="row">
                <div className="col-12 col-lg-12">
                    <div className="form-group">
                        <label>
                            URL<span>*</span>
                        </label>
                        <input
                            type="url"
                            placeholder="Enter URL"
                            className="form-control"
                            value={data.url}
                            name="picture_link"
                            onChange={(e) => data.setUrl(e.target.value)}
                        />
                        {data.renderFieldError("picture_link")}
                    </div>
                </div>

                <div className="col-12 col-lg-12">
                    <div className="form-group">
                        <label>
                            Select Images<span>*</span> <span className="max-image">(Max 3 images allowed)</span>
                        </label>
                        <div className="multiple_files">
                            <div {...getRootProps()} className="dropzone">
                                <input {...getInputProps()} />
                                <p>{isDragActive ? "Drop files here..." : "Drag and drop or click to upload images"}</p>
                            </div>

                           
                            {maxImagesWarning && (
                                <p className="warning-text" style={{ color: "red" }}>
                                    {maxImagesWarning}
                                </p>
                            )}

                            {attachmentError && (
                                <p className="warning-text" style={{ color: "red" }}>
                                    {attachmentError}
                                </p>
                            )}

                       
                            <div className="image-preview">
                                {data.attachments.map((file, index) => (
                                    <div key={index} className="image-container">
                                        <img src={file.preview} alt={`Preview ${index + 1}`} className="preview-image"/>
                                        <button type="button" className="remove-button" onClick={() => removeImage(index)}>✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {data.renderFieldError("attachments")}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PropertyAttachments;
