import React, { useState } from "react";

const CertifiedCloser = ({ register, errors, renderFieldError }) => {
  const [previewBankUrl, setPreviewBankUrl] = useState("");
  const [documentName, setDocumentName] = useState("");
  const previewImage = (e, type) => {
    if (e.target.files[0]) {
      setDocumentName(e.target.files[0].name);
    }
  };

  const validateFileSize = (file) => {
    let extension = ["application/pdf"];
    if (!extension.includes(file[0].type)) {
      return "Please add valid file (pdf)";
    } else if (file[0].size > 5097152) {
      return "File size is too large. Please upload a file that is less than 5MB.";
    }
    return true;
  };

  return (
    <>
      <fieldset>
        <div className="card-box-blocks main-card-area">
          <div className="row">
            <div className="col-12 col-lg-12">
              <div className="lic-detail-area">
                <label>Settlement Statement</label>
                <div className="file-upload-choosen licenses-wrapper">
                  <div className="upload-photo">
                    <div className="containers">
                      <div className="imageWrapper">
                        <img className="image" src="/assets/images/pdf.svg" />
                      </div>
                      <p>{documentName}</p>
                    </div>
                    <button className="file-upload">
                      <input
                        type="file"
                        accept="application/pdf"
                        className="file-input"
                        name="certified_closer_statement_pdf"
                        {...register("certified_closer_statement_pdf", {
                          required: "This field is required",
                          validate: {
                            fileSize: validateFileSize,
                          },
                        })}
                        onChange={(e) => {
                          previewImage(e, "certified_closer_statement_pdf");
                        }}
                      />
                      Certified Closer
                    </button>
                  </div>
                    <div className="upload-btn">
                        <button type="submit" className="btn btn-fill w-auto">
                            Upload
                        </button>
                    </div>
                  {errors.certified_closer_statement_pdf && (
                    <p className="error">
                      {errors.certified_closer_statement_pdf?.message}
                    </p>
                  )}
                  {renderFieldError("certified_closer_statement_pdf")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
};

export default CertifiedCloser;
