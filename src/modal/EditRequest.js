import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../hooks/useAuth";
import ButtonLoader from "../partials/MiniLoader";
import { toast } from "react-toastify";
import axios from "axios";

const EditRequest = ({
  editOpen,
  setEditOpen,
  buyerId,
  buyerType,
  pageNumber,
  getFilterResult,
  buyerData,
  setBuyerData,
}) => {
  const [loading, setLoading] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");
  const [flagReasons, setFlagReasons] = useState([]);
  const [checkMessageError, setCheckMessageError] = useState(false);
  const messageRef = useRef(null);
  const [currentInfo, setCurrentInfo] = useState({ name: "", email: "", phone: "" });
  const [selectedFlags, setSelectedFlags] = useState({
    name: false,
    email: false,
    phone: false,
    other: false
  });

  useEffect(() => {
    if (editOpen && buyerData && buyerId) {
      const targetBuyer = buyerData.find((b) => b.id == buyerId);
      if (targetBuyer) {
        setCurrentInfo({
          name: targetBuyer.name || "N/A",
          email: targetBuyer.email || "N/A",
          phone: targetBuyer.phone || targetBuyer.mobile || "N/A",
        });
      }

      setSelectedFlags({ name: false, email: false, phone: false, other: false });
      setCheckMessage("");
    }
  }, [editOpen, buyerId, buyerData]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedFlags((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const limitToWords = (value, limit) => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length <= limit) return value;
    return words.slice(0, limit).join(" ");
  };
  
  useEffect(() => {
    let messageParts = [];

    if (selectedFlags.name) {
      messageParts.push(currentInfo.name);
    }
    if (selectedFlags.email) {
      messageParts.push(`${currentInfo.email}`);
    }
    if (selectedFlags.phone) {
      messageParts.push(`${currentInfo.phone}`);
    }
    if (selectedFlags.other) {
      messageParts.push("");
    }


    if (messageParts.length > 0) {
      const nextMessage = `${messageParts.join("\n")}\n`;
      setCheckMessage(nextMessage);
      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.focus();
          messageRef.current.setSelectionRange(nextMessage.length, nextMessage.length);
        }
      }, 0);
    } else {
      setCheckMessage("");
    }
  }, [selectedFlags, currentInfo]);

  const handleClose = () => {
    setEditOpen(false);
    setLoading(false);
    setCheckboxError(false);
    setCheckMessageError(false);
  };
  const { getTokenData, setLogout } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const buyer_id = form.buyer_id.value;
  const reason = checkMessage.trim();

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  let incorrect_info = {};
  let hasChecked = false;

  checkboxes.forEach((checkbox) => {
    incorrect_info[checkbox.name] = checkbox.checked;
    if (checkbox.checked) hasChecked = true;
  });

  
  if (!hasChecked) {
    setCheckboxError(true);
    return;
  } else {
    setCheckboxError(false);
  }

  if (reason === "") {
    setCheckMessageError(true);
    return;
  } else {
    setCheckMessageError(false);
  }

  const payload = {
    buyer_id: Number(buyer_id),
    reason,
    incorrect_info
  };

  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + getTokenData().access_token,
    "Content-Type": "application/json"
  };

  setLoading(true);

  try {
    const response = await axios.post(
      apiUrl + "red-flag-buyer",
      payload,
      { headers }
    );

    if (response.data.status) {
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      handleClose();

      const updatedData = buyerData.map((item) =>
        item.id == buyer_id ? { ...item, redFlag: true } : item
      );
      setBuyerData(updatedData);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    if (error.response?.status === 401) setLogout();

    toast.error(
      error.response?.data?.error ||
      "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
  };
  const handleMessage = (e) => {
    setCheckMessage(e.target.value.trim());
  };
  useEffect(() => {
    const fetchFlagReason = async () => {
      try {
        let headers = {
          Accept: "application/json",
          Authorization: "Bearer " + getTokenData().access_token,
          "auth-token": getTokenData().access_token,
        };
        const response = await axios.get(`${apiUrl}get-reasons`, { headers: headers });
        setFlagReasons(response.data.data);
      } catch (error) {
        console.log(error, "error");
      }
    }
    fetchFlagReason();
  }, []);
  const handleChangeMessage = (e) => {
    const reason = flagReasons.find(reason => reason.id == e.target.value.trim());
    let selectedComment = reason ? reason.description : "";
    setCheckMessage(selectedComment);
  }
  return (
    <div>
      <Modal show={editOpen} onHide={handleClose} className="modal-form-main">
        <button type="button" className="btn-close" onClick={handleClose}>
          <i className="fa fa-times fa-lg"></i>
        </button>
        <Modal.Body>
          <div className="want-to-edit">
            <div className="popup-heading-block text-center">
              <img src="/assets/images/red-flag-bg.svg" className="img-fluid w-25" alt="" />
              <h3>Flag Data</h3>
              <p>Please report the incorrect information</p>
            </div>
            {/* <form className="modal-form modal_inner_form" method="post" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 col-lg-12 mb-4">
                  <div className="row">
                    <label>What Information is incorrect<span className="error"> *</span></label>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="name"
                          value="1"
                          id="flexCheckChecked"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                        >
                          Name
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="email"
                          value="1"
                          id="flexCheckChecked"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                        >
                          {" "}
                          Email{" "}
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="phone"
                          value="1"
                          id="flexCheckChecked"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                        >
                          Phone
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="other"
                          value="1"
                          id="flexCheckChecked"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                        >
                          Other
                        </label>
                      </div>
                    </div>
                  </div>
                  {checkboxError ? (
                    <p className="error">This field is required </p>
                  ) : (
                    ""
                  )}
                </div>
           
                <div className="col-12 col-lg-12 mb-2">
                  <input type="hidden" value={buyerId} name="buyer_id" />
                  <div className="form-group">
                    <label>
                      message Type here <span className="error"> *</span>
                    </label>
                    <textarea
                      placeholder="Enter Your Message"
                      name="reason"
                      onChange={handleMessage}
                      value={checkMessage}
                    ></textarea>
                  </div>
                  {checkMessageError ? (
                    <p className="error">This field is required </p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-12 col-lg-12">
                  <div className="form-group mb-0">
                    <div className="submit-btn">
                      <button
                        type="submit"
                        className="btn btn-fill"
                        disabled={loading ? "disabled" : ""}
                      >
                        Submit {loading ? <ButtonLoader /> : ""}{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form> */}
            <form className="modal-form modal_inner_form" method="post" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 col-lg-12 mb-4">
                  <div className="row">
                    <label>What Information is incorrect<span className="error"> *</span></label>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="name"
                          id="checkName"
                          checked={selectedFlags.name}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="checkName">Name</label>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="email"
                          id="checkEmail"
                          checked={selectedFlags.email}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="checkEmail">Email</label>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="phone"
                          id="checkPhone"
                          checked={selectedFlags.phone}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="checkPhone">Phone</label>
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="other"
                          id="checkOther"
                          checked={selectedFlags.other}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="checkOther">Other</label>
                      </div>
                    </div>

                  </div>
                  {checkboxError ? <p className="error">This field is required </p> : ""}
                </div>

                {/* --- TEXTAREA (Auto-Fills Here) --- */}
                <div className="col-12 col-lg-12 mb-2">
                  <input type="hidden" value={buyerId} name="buyer_id" />
                  <div className="form-group">
                    <label>
                      Message / Correct Details <span className="error"> *</span>
                    </label>
                    <textarea
                      ref={messageRef}
                      placeholder="Select a checkbox to auto-fill details..."
                      name="reason"
                      rows="5"
                      // User manually type bhi kar sakta hai, par checkbox overwite karega
                      onChange={(e) => {
                        const value = selectedFlags.other
                          ? limitToWords(e.target.value, 250)
                          : e.target.value;
                        setCheckMessage(value);
                      }}
                      value={checkMessage}
                    ></textarea>
                  </div>
                  {checkMessageError ? <p className="error">This field is required </p> : ""}
                </div>

                <div className="col-12 col-lg-12">
                  <div className="form-group mb-0">
                    <div className="submit-btn">
                      <button
                        type="submit"
                        className="btn btn-fill"
                        disabled={loading ? "disabled" : ""}
                      >
                        Submit {loading ? <ButtonLoader /> : ""}{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default EditRequest;
