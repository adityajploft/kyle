import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { Button, Col, Container, Form, Image, Modal, Row } from 'react-bootstrap';
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import axios from "axios";
import BuyerHeader from "../../partials/BuyerHeader";
import { toast } from "react-toastify";

const Settings = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { getTokenData, getLocalStorageUserdata, setLogout } = useAuth();
  const [notificationData, setNotificationData] = useState([]);
  const [userRole, setUserRole] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  const handleClose = () => {
    setShow(false);
    setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };
  const handleShow = () => setShow(true);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!passwordForm.old_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      toast.error("All fields are required");
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New password and Confirm password do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${getTokenData().access_token}`,
        "auth-token": getTokenData().access_token,
      };


      const payload = {
        email: userEmail,
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password
      };

      const response = await axios.post(apiUrl + "update-password", payload, {
        headers: headers,
      });

      toast.success(response.data.message || "Password updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });

      handleClose();

    } catch (error) {
      console.error("Error updating password:", error);
      const errorMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationStatus = async (notificationKey, type, isEnabled) => {
    try {
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${getTokenData().access_token}`,
        "auth-token": getTokenData().access_token,
      };

      // Constructing formData with the desired nested structure
      const formData = {
        [notificationKey]: {
          [type]: isEnabled
        }
      };

      // Send formData to the server
      const response = await axios.post(
        `${apiUrl}notification-settings/update`,
        formData,
        { headers }
      );
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      // Update local notification data state after success
      setNotificationData(prevData =>
        prevData.map(data => data.key === notificationKey ? { ...data, [type]: { ...data[type], enabled: isEnabled } } : data)
      );

    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  useEffect(() => {
    const fetchUserSetting = async () => {
      try {
        setIsLoader(true);
        let headers = {
          Accept: "application/json",
          Authorization: "Bearer " + getTokenData().access_token,
          "auth-token": getTokenData().access_token,
        }
        let response = await axios.get(`${apiUrl}notification-settings/`, { headers: headers });
        setIsLoader(false);
        setNotificationData(response.data.data);

      } catch (error) {
        setIsLoader(false);
        if (error.response.status === 401) {
          setLogout();
        }
      }
    }
    fetchUserSetting();
  }, []);

  useEffect(() => {
    if (getTokenData().access_token && userRole == 0) {
      const userData = getLocalStorageUserdata();
      setUserRole(userData.role);
    }
  }, []);



  return (
    <>
      {userRole == 3 && <BuyerHeader />}
      {userRole == 2 && <Header />}
      <section className="main-section position-relative pt-4 pb-120">
        {isLoader ?
          <div className="loader" style={{ textAlign: "center" }}>
            <img src="../../../assets/images/loader.svg" />
          </div> :
          <Container className='position-relative'>
            <div className="back-block">
              <div className="row">
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
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.9 11L1 6L5.9 1"
                        stroke="#0A2540"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Back
                  </Link>
                </div>
                <div className="col-7 col-sm-4 col-md-4 col-lg-4 align-self-center">
                  <h6 className="center-head text-center mb-0">
                    Settings
                  </h6>
                </div>
              </div>
            </div>
            <div className='card-box column_bg_space setting-card'>
              <div className='deal_column setting-card-head'>
                <div className='deal_left_column'>
                  <div className='pro_details'>
                    <h3 className="mb-0">Settings</h3>
                  </div>
                </div>
                <div className="setting-card-head-right">
                  <div className="setting-card-head-title">Push Notifications</div>
                  <div className="setting-card-head-title">Email Notifications</div>
                </div>
              </div>
              <div className="setting-card-body">
                {notificationData.length > 0 ? (
                  notificationData.map((data, index) => (
                    <div key={index} className="deal_column settings">
                      <div className="deal_left_column">
                        <div className="pro_details">
                          <h3>{data.display_name}</h3>
                          <p>Allow notifications for interested property</p>
                        </div>
                      </div>
                      <div className="setting-card-head-right">
                        <div className="buyer_seller_toggle" data-notifications="Push Notifications">
                          <input type="checkbox" checked={data.push.enabled} onChange={(e) => handleNotificationStatus(data.key, 'push', e.target.checked)} />
                          <label></label>
                        </div>
                        <div className="buyer_seller_toggle" data-notifications="Email Notifications">
                          <input type="checkbox" checked={data.email.enabled} onChange={(e) => handleNotificationStatus(data.key, 'email', e.target.checked)} />
                          <label></label>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No notifications found.</p>
                )}
                <div className="deal_column settings">
                  <div class="deal_left_column">
                    <div class="pro_details cursor-pointer" onClick={handleShow}>
                      <h3>Change Password</h3>
                      <p>Secure your account with a new password.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        }
      </section>
      <Footer />

      
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className="radius_30 max-648"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className='space_modal'>
          <div className='modal_inner_content change_password_modal'>
            <h4>Change password</h4>
            <p>Secure your account with a new password.</p>

            <Form onSubmit={handleChangePassword}>
              {/* OLD PASSWORD */}
              <Form.Group className="mb-3 position-relative">
                <span className="before-icon">
                  <img src="./assets/images/lock.svg" className="img-fluid" alt="password-icon" />
                </span>
                <Form.Control
                  type={showOld ? "text" : "password"}
                  placeholder="Old Password"
                  name="old_password"
                  value={passwordForm.old_password}
                  onChange={handleInput}
                />
                <span className={`form-icon-password toggle-password ${showOld ? 'eye-open' : 'eye-close'}`} onClick={() => setShowOld(!showOld)} style={{ cursor: "pointer" }}>
                  <img src="./assets/images/eye.svg" className="img-fluid" alt="password-eye" />
                </span>
              </Form.Group>

              {/* NEW PASSWORD */}
              <Form.Group className="mb-3 position-relative">
                <span className="before-icon">
                  <img src="./assets/images/lock.svg" className="img-fluid" alt="password-icon" />
                </span>
                <Form.Control
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handleInput}
                />
                <span className={`form-icon-password toggle-password ${showNew ? 'eye-open' : 'eye-close'}`} onClick={() => setShowNew(!showNew)} style={{ cursor: "pointer" }}>
                  <img src="./assets/images/eye.svg" className="img-fluid" alt="password-eye" />
                </span>
              </Form.Group>

              {/* CONFIRM PASSWORD */}
              <Form.Group className="mb-3 position-relative">
                <span className="before-icon">
                  <img src="./assets/images/lock.svg" className="img-fluid" alt="password-icon" />
                </span>
                <Form.Control
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handleInput}
                />
                <span className={`form-icon-password toggle-password ${showConfirm ? 'eye-open' : 'eye-close'}`} onClick={() => setShowConfirm(!showConfirm)} style={{ cursor: "pointer" }}>
                  <img src="./assets/images/eye.svg" className="img-fluid" alt="password-eye" />
                </span>
              </Form.Group>

              <Button type="submit" disabled={isSubmitting} className="btn btn-fill btn-primary w-100 mb-0">
                {isSubmitting ? "Updating..." : "Change Password"}
              </Button>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default Settings;
