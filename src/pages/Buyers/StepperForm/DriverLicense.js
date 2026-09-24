import React, { useState } from "react";

const DriverLicense = ({ register, errors, renderFieldError }) => {
  const [previewFrontUrl, setPreviewFrontUrl] = useState("");
  const [previewBackUrl, setPreviewBackUrl] = useState("");
  const [border, setBorder] = useState("1px dashed #677AAB");

  const previewImage = (e, type) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (type === "driver_license_front_image") {
          setPreviewFrontUrl(reader.result);
        } else {
          setPreviewBackUrl(reader.result);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const validateFileSize = (file) => {
    let extension = ["image/png", "image/jpg", "image/jpeg"];
    if (!extension.includes(file[0].type)) {
      setBorder("1px dashed #ff0000");
      return "Please add valid file (png,jpg,jpeg)";
    } else if (file[0].size > 2097152) {
      setBorder("1px dashed #ff0000");
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
                <label>Front ID Photo</label>
                <div className="file-upload-choosen licenses-wrapper">
                  <div className="upload-photo">
                    <div className="containers">
                      {/* <input type="hidden" value="2" name="step" /> */}
                      <div className="imageWrapper">
                        {previewFrontUrl == "" ? (
                          <img
                            className="image"
                            src="/assets/images/front-licenses.svg"
                          />
                        ) : (
                          <img
                            className="image upload-img"
                            src={previewFrontUrl}
                          />
                        )}
                      </div>
                    </div>
                    <button className="file-upload">
                      <input
                        type="file"
                        className="file-input"
                        accept="image/png, image/jpg, image/jpeg"
                        name="driver_license_front_image"
                        {...register("driver_license_front_image", {
                          onChange: (e) => {
                            previewImage(e, "driver_license_front_image");
                          },
                          required: "This field is required",
                          validate: {
                            fileSize: validateFileSize,
                          },
                        })}
                      />
                      Upload License
                    </button>
                  </div>
                </div>
                {errors.driver_license_front_image && (
                  <p className="error">
                    {errors.driver_license_front_image?.message}
                  </p>
                )}
                {renderFieldError("driver_license_front_image")}
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="lic-detail-area">
                <label>Back ID Photo</label>
                <div className="file-upload-choosen licenses-wrapper">
                  <div className="upload-photo">
                    <div className="containers">
                      <div className="imageWrapper">
                        {previewBackUrl == "" ? (
                          <img
                            className="image"
                            src="/assets/images/back-licenses.svg"
                          />
                        ) : (
                          <img
                            className="image upload-img"
                            src={previewBackUrl}
                          />
                        )}
                      </div>
                    </div>
                    <button className="file-upload">
                      <input
                        type="file"
                        className="file-input"
                        accept="image/png, image/jpg, image/jpeg"
                        name="driver_license_back_image"
                        {...register("driver_license_back_image", {
                          onChange: (e) => {
                            previewImage(e, "driver_license_back_image");
                          },
                          required: "This field is required",
                        })}
                      />
                      Upload License
                    </button>
                  </div>
                  {errors.driver_license_back_image && (
                    <p className="error">
                      {errors.driver_license_back_image?.message}
                    </p>
                  )}
                </div>
                {renderFieldError("driver_license_back_image")}
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

export default DriverLicense;
