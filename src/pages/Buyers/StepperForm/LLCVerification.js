import React, { useState } from "react";

const LLCVerification = ({ register, errors }) => {
  const [LLCPreviewFrontUrl, setLLCPreviewFrontUrl] = useState("");
  const [LLCPreviewBackUrl, setLLCPreviewBackUrl] = useState("");
  const previewImage = (e, type) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (type === "llc_front_image") {
          setLLCPreviewFrontUrl(reader.result);
        } else {
          setLLCPreviewBackUrl(reader.result);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const validateFileSize = (file) => {
    let extension = ["image/png", "image/jpg", "image/jpeg"];
    if (!extension.includes(file[0].type)) {
      return "Please add valid file (jpg,jpeg)";
    } else if (file[0].size > 2097152) {
      return "File size is too large. Please upload a file that is less than 2MB.";
    }
    return true;
  };
  return (
    <>
      <fieldset>
        <div className="card-box-blocks main-card-area">
          <div className="row align-items-end">
            <div className="col-12 col-lg-6">
              <div className="lic-detail-area">
                <label>Articles of Organization</label>
                <div className="file-upload-choosen licenses-wrapper">
                  <div className="upload-photo">
                    <div className="containers">
                      <div className="imageWrapper">
                        {LLCPreviewFrontUrl == "" ? (
                          <img
                            className="image"
                            src="/assets/images/doc-file.svg"
                          />
                        ) : (
                          <img
                            className="image upload-img"
                            src={LLCPreviewFrontUrl}
                          />
                        )}
                      </div>
                    </div>
                    <button className="file-upload">
                      <input
                        type="file"
                        className="file-input"
                        accept="image/png, image/jpg, image/jpeg"
                        name="llc_front_image"
                        {...register("llc_front_image", {
                          required: "This field is required",
                          validate: {
                            fileSize: validateFileSize,
                          },
                        })}
                        onChange={(e) => {
                          previewImage(e, "llc_front_image");
                        }}
                      />
                      Upload Articles of Organization
                    </button>
                  </div>
                  {errors.llc_front_image && (
                    <p className="error">{errors.llc_front_image?.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="lic-detail-area">
                <label>Operating Agreement</label>
                <div className="file-upload-choosen licenses-wrapper">
                  <div className="upload-photo">
                    <div className="containers">
                      <div className="imageWrapper">
                        {LLCPreviewBackUrl == "" ? (
                          <img
                            className="image"
                            src="/assets/images/doc-file.svg"
                          />
                        ) : (
                          <img
                            className="image upload-img"
                            src={LLCPreviewBackUrl}
                          />
                        )}
                      </div>
                    </div>
                    <button className="file-upload">
                      <input
                        type="file"
                        className="file-input"
                        accept="image/png, image/jpg, image/jpeg"
                        name="llc_back_image"
                        {...register("llc_back_image", {
                          required: "This field is required",
                          validate: {
                            fileSize: validateFileSize,
                          },
                        })}
                        onChange={(e) => {
                          previewImage(e, "llc_back_image");
                        }}
                      />
                     Upload Operating Agreement
                    </button>
                  </div>
                  {errors.llc_back_image && (
                    <p className="error">{errors.llc_back_image?.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-12">
              <div className="upload-btn text-end">
                <button type="submit" className="btn btn-fill w-auto">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
};

export default LLCVerification;
