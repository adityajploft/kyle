import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import MiniLoader from "../partials/MiniLoader";
import { Link } from "react-router-dom";
const BuyerProfilePayment = ({ setModalOpen, modalOpen }) => {
  const [buttonLoader, setButtonLoader] = useState(false);
  const { getTokenData, setLogout, setLocalStorageUserdata } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleClose = () => {
    setModalOpen(false);
  };
  const ProfilePayment = async () => {
    try {
      setButtonLoader(true);
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
      };
      let response = await axios.post(
        `${apiUrl}create-upgrade-buyer-session`,
        {},
        {
          headers: headers,
        }
      );
      setButtonLoader(false);
      let url = response.data.session.url;
      window.location.href = url;
    } catch (error) {
      setButtonLoader(false);
      console.log(error.response);
    }
  };
  console.log(buttonLoader ,"buttonLoader")
  return (
    <>
      <Modal show={modalOpen} onHide={handleClose} className="modal-form-main">
        <button type="button" className="btn-close" onClick={handleClose}>
          <i className="fa fa-times fa-lg"></i>
        </button>
        <Modal.Body>
          <div className="application-process">
            <h3>Please complete your profile verification to upload image</h3>
            <p className="mb-0">
              To unlock this feature, complete your phone verification, proof of funds verification, and ID verification. Make your profile stand out from the crowd! <br/>
            </p>
            <div className="process-payment-btn">
              <Link to="/buyer/profile-verification">
                <button type="button" className="btn btn-fill" >
                  Complete verification {buttonLoader ? <MiniLoader /> : ""}
                </button> 
              </Link>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BuyerProfilePayment;
