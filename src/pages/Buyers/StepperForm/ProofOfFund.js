import React, { useState } from "react";

const ProofOfFund = ({ register, errors, renderFieldError }) => {
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
            <div className="col-12 col-lg-6">
              <div className="lic-detail-area">
                <label>Proof of Funds</label>
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
                        name="bank_statement_pdf"

                        {...register("bank_statement_pdf", {
                          required: "This field is required",
                          validate: {
                            fileSize: validateFileSize,
                          },
                        })}
                        
                        onChange={(e) => {
                          previewImage(e, "bank_statement_pdf");
                        }}
                      />
                      Upload Proof of Funds
                    </button>
                  </div>
                  {errors.bank_statement_pdf && (
                    <p className="error">
                      {errors.bank_statement_pdf?.message}
                    </p>
                  )}
                  {renderFieldError("bank_statement_pdf")}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="lic-detail-area oth-proof-right">
                <label>Proof of Funds Name</label>
                <div className="form-group other-prooff">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Proof of Funds Name"
                    name="other_proof_of_fund"
                    {...register("other_proof_of_fund", {
                      required: "This Field is required",
                      validate: {
                        maxLength: (v) =>
                          v.length <= 50 ||
                          "The field should have at most 50 characters",
                      },
                    })}
                  />
                  {errors.other_proof_of_fund && (
                    <p className="error">
                      {errors.other_proof_of_fund?.message}
                    </p>
                  )}
                  {renderFieldError("other_proof_of_fund")}
                </div>

                <div className="upload-btn">
                  <button type="submit" className="btn btn-fill w-auto">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
};

export default ProofOfFund;
