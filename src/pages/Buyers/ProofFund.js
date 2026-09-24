import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Table, Modal, Container, Image } from "react-bootstrap";
import BuyerHeader from "../../partials/BuyerHeader";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

export default function ProofFund() {
  const { getTokenData } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState();
  const [loading, setLoading] = useState(false);


  const handleEdit = (data) => {
    setShowModal(true);
    setSelectedFileName(data.original_file_name);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleVerifiedDocuments = async () => {
    try {
      setLoading(true);
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      let response = await axios.get(`${apiUrl}get-proof-of-funds-pdfs`, { headers: headers });
      const { data, status } = response.data;
      if (status) {
        setDocuments(data);
        setLoading(false);
      }
      console.log(response.data, "response")
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleVerifiedDocuments();
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);
    setSelectedFileName("")
  };

  const handleDeleteDocument = async (fundProofId) => {
    console.log(fundProofId, "fundProofId");

    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      let response = await axios.post(`${apiUrl}delete-proof-of-funds-pdfs`, { fund_proof_id: fundProofId }, { headers: headers });
      const { data, status } = response.data;
      console.log(data, "data");

      if (status) {
        handleVerifiedDocuments()
      }
      console.log(response.data, "response")
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <BuyerHeader />

      <section className='main-section position-relative pt-4 pb-120'>
        {loading ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img alt="loader" src="../../../assets/images/loader.svg" />
          </div>
        ) : (
          <>
            <div className="container position-relative pat-40 mb-4">
              <div className="back-block">
                <div className="row align-items-center">
                  <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                    <Link to="/" className="back">
                      <svg
                        width="16"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 6H1"
                          stroke="#0A2540"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round" />
                        <path
                          d="M5.9 11L1 6L5.9 1"
                          stroke="#0A2540"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round" />
                      </svg>
                      Back
                    </Link>
                  </div>
                  <div className="col-4 col-sm-4 col-md-4 col-lg-4 align-self-center">
                    <h6 className="center-head fs-3 text-center mb-0">Proof Of Fund</h6>
                  </div>
                </div>
              </div>
              <div className="card-box affiliate_program_box">
                <div className="affiliate_program_column">
                  <h3 className="main_inner_title">Verified Documents</h3>
                  <div className="affiliate_table">
                    <div className='table-responsive' style={{ overflowY: "hidden" }}>
                      <Table className="table">
                        <thead>
                          <tr>
                            <th>Sr No.</th>
                            <th>Document Name</th>
                            <th>View</th>
                            {/* <th>Edit</th> */}
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.length > 0 ? (
                            documents.map((data, index) => (
                              <tr key={data.id}>
                                <td>{index + 1}</td>
                                <td className="text-start">
                                  <img
                                    src="/assets/images/pdf-icon.svg"
                                    alt="pdf"
                                    style={{ width: "20px", marginRight: "8px" }} />
                                  {data.original_file_name}
                                </td>
                                <td>
                                  <Button onClick={() => window.open(data.file_url, "_blank")} className="proof_btns">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.9833 9.99993C12.9833 11.6499 11.6499 12.9833 9.99993 12.9833C8.34993 12.9833 7.0166 11.6499 7.0166 9.99993C7.0166 8.34993 8.34993 7.0166 9.99993 7.0166C11.6499 7.0166 12.9833 8.34993 12.9833 9.99993Z" stroke="#121639" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.99987 16.8918C12.9415 16.8918 15.6832 15.1584 17.5915 12.1584C18.3415 10.9834 18.3415 9.00843 17.5915 7.83343C15.6832 4.83343 12.9415 3.1001 9.99987 3.1001C7.0582 3.1001 4.31654 4.83343 2.4082 7.83343C1.6582 9.00843 1.6582 10.9834 2.4082 12.1584C4.31654 15.1584 7.0582 16.8918 9.99987 16.8918Z" stroke="#121639" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                  </Button>
                                </td>
                                <td>
                                  <Button onClick={() => handleDeleteDocument(data.id)} className="proof_btns">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 17 20" fill="none">
                                      <path d="M14.6875 2.5H11.25V1.875C11.25 0.841133 10.4089 0 9.375 0H6.875C5.84113 0 5 0.841133 5 1.875V2.5H1.5625C0.700938 2.5 0 3.20094 0 4.0625V6.25C0 6.59516 0.279844 6.875 0.625 6.875H0.966563L1.50652 18.2142C1.55422 19.2156 2.37687 20 3.37937 20H12.8706C13.8732 20 14.6958 19.2156 14.7435 18.2142L15.2834 6.875H15.625C15.9702 6.875 16.25 6.59516 16.25 6.25V4.0625C16.25 3.20094 15.5491 2.5 14.6875 2.5ZM6.25 1.875C6.25 1.53039 6.53039 1.25 6.875 1.25H9.375C9.71961 1.25 10 1.53039 10 1.875V2.5H6.25V1.875ZM1.25 4.0625C1.25 3.8902 1.3902 3.75 1.5625 3.75H14.6875C14.8598 3.75 15 3.8902 15 4.0625V5.625H1.25V4.0625ZM13.4949 18.1547C13.4874 18.3152 13.4184 18.4667 13.3021 18.5775C13.1858 18.6884 13.0313 18.7502 12.8706 18.75H3.37937C3.21871 18.7502 3.06416 18.6884 2.94789 18.5775C2.83161 18.4667 2.76257 18.3152 2.75512 18.1547L2.21797 6.875H14.032L13.4949 18.1547Z" fill="#D70000"/>
                                      <path opacity="0.4" d="M8.125 17.5C8.47016 17.5 8.75 17.2202 8.75 16.875V8.75C8.75 8.40484 8.47016 8.125 8.125 8.125C7.77984 8.125 7.5 8.40484 7.5 8.75V16.875C7.5 17.2202 7.7798 17.5 8.125 17.5ZM11.25 17.5C11.5952 17.5 11.875 17.2202 11.875 16.875V8.75C11.875 8.40484 11.5952 8.125 11.25 8.125C10.9048 8.125 10.625 8.40484 10.625 8.75V16.875C10.625 17.2202 10.9048 17.5 11.25 17.5ZM5 17.5C5.34516 17.5 5.625 17.2202 5.625 16.875V8.75C5.625 8.40484 5.34516 8.125 5 8.125C4.65484 8.125 4.375 8.40484 4.375 8.75V16.875C4.375 17.2202 4.6548 17.5 5 17.5Z" fill="#D70000"/>
                                    </svg>
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-muted py-4">
                                No Documents Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className='radius_30 max-648'>
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className='space_modal'>
          <div className='modal_inner_content'>
            <div className='buy_modal_icon light_green_bg ps-2'>
              <Image src='/assets/images/home-dollar2.svg' alt='' />
            </div>
            <h3>submit your proof of fund</h3>
            <p className='mb-4 px-md-5'>Please upload your proof of funds to submit your offer. Or select a proof of fund</p>

            <form method='post' onSubmit={handleSubmit} encType="multipart/form-data">
              <div className='upload-document-section'>
                <div className='offer_price_area'>
                  <label className='offer_label'>Upload POF</label>
                </div>
                <div className=''>
                  <span className="browse-files position-relative">
                    <input type='hidden' name="buyer_deal_id" value={"dealId"} />
                    <input type='hidden' name="pof_document" value={"pofDocumentId"} />
                    <input id='formFile' type="file" name="pdf_file" className="default-file-input" ref={fileInputRef} onChange={handleFileChange} />
                    <span className="d-block upload-file">{selectedFileName || "PDF-Name.pdf"}</span>
                    <span className="browse-files-text">Upload POF</span>
                  </span>
                  {/* {errors?.pdf_file !='' && <span className='error'>{errors?.pdf_file}</span>} */}
                </div>
                <button type="submit" className="btn btn-fill btn-fill-green btn btn-primary w-100">Submit</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

    </>
  );
}
