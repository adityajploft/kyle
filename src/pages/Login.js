import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
import { useFormError } from "../hooks/useFormError";
import { useAuth } from "../hooks/useAuth";

import ButtonLoader from "../partials/MiniLoader";
import GoogleLoginComponent from "../component/SocialLogin/GoogleLoginComponent";
import { GoogleOAuthProvider } from "@react-oauth/google";
import FacebookLoginButton from "../component/SocialLogin/FacebookLoginButton";
import Layout from "../partials/Layout";
import { generatedToken } from "../notifications/firebase";
import { Modal } from 'react-bootstrap';

function Login(props) {
  const { setAsLogged, getRememberMeData, getTokenData, getLocalStorageUserdata } = useAuth();
  const { setErrors, renderFieldError, setMessage, navigate } = useFormError();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firebaseDeviceToken, setFirebaseDeviceToken] = useState("");

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingProvider, setPendingProvider] = useState("");
  const [roleType, setRoleType] = useState(3); // 3 = Buyer, 2 = Wholesaler

  const googleRef = useRef(null);
  const facebookRef = useRef(null);

  useEffect(() => {
    let login = getTokenData();
    let userData = getRememberMeData();
    let loggedInUser = getLocalStorageUserdata();
    if (userData != "" && userData != undefined) {
      setEmail(userData.username);
      setPassword(userData.password);
      setRemember(userData.isRemember);
    }
    if (login?.access_token && loggedInUser) {
      if (loggedInUser.role === 2) {
        navigate(
          loggedInUser.is_profile_complete === false ? "/seller/my-profile" : "/",
          { replace: true }
        );
      } else if (loggedInUser.role === 3) {
        navigate(
          loggedInUser.is_profile_complete === false || !loggedInUser.is_verified
            ? "/buyer/profile-verification"
            : "/buyer/dashboard",
          { replace: true }
        );
      }
    }
  }, []);

  const [showPassoword, setshowPassoword] = useState(false);
  const togglePasswordVisibility = () => {
    setshowPassoword(!showPassoword);
  };

  const apiUrl = process.env.REACT_APP_API_URL;
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const submitLoginForm = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    setMessage("");
    let payload = { email, password };
    payload.device_token = firebaseDeviceToken;

    if (remember) {
      payload.remember = true;
    }
    let headers = {
      Accept: "application/json",
    };
    axios
      .post(apiUrl + "login", payload, { headers: headers })
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          // for buyer login
          var access_token = response.data.access_token;
          var remember_me_token = response.data.remember_me_token;
          let remember_me_user_data = {
            username: "",
            password: "",
            isRemember: false,
          };
          if (payload.remember) {
            remember_me_user_data = {
              username: email,
              password: password,
              isRemember: true,
            };
          }
          setAsLogged(
            access_token,
            remember_me_token,
            remember_me_user_data,
            response.data.userData
          );

          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          if (error.response.data.validation_errors) {
            setErrors(error.response.data.validation_errors);
          }
          if (error.response.data.error) {
            toast.error(error.response.data.error, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      });
  };

  const handleSocialRoleSubmit = () => {
    setShowRoleModal(false);
    if (pendingProvider === "google") {
      googleRef.current?.triggerLogin();
    } else if (pendingProvider === "facebook") {
      facebookRef.current?.triggerLogin();
    }
  };
  useState(() => {
    const getToken = async () => {
      let deviceToken = await generatedToken();
      setFirebaseDeviceToken(deviceToken);
    }
    getToken();
  }, [])

  return (
    <Layout>
      <div className="account-in">
        <div className="center-content">
          <img
            src="./assets/images/logo.svg"
            className="img-fluid"
            alt="logo"
          />
          <h2>Welcome Back!</h2>
        </div>
        <form
          className="main-login-form"
          method="post"
          onSubmit={submitLoginForm}
        >
          <div className="row">
            <div className="col-12 col-lg-12">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="form-group-inner">
                  <span className="form-icon">
                    <img
                      src="./assets/images/mail.svg"
                      className="img-fluid"
                      alt="mail-icon"
                    />
                  </span>
                  <input
                    disabled={loading ? "disabled" : ""}
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    autoComplete="no-email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                {renderFieldError("email")}
              </div>
            </div>
            <div className="col-12 col-lg-12">
              <div className="form-group">
                <label htmlFor="pass_log_id">password</label>
                <div className="form-group-inner">
                  <span className="form-icon">
                    <img
                      src="./assets/images/password.svg"
                      className="img-fluid"
                      alt="password-icon"
                    />
                  </span>
                  <input
                    disabled={loading ? "disabled" : ""}
                    id="pass_log_id"
                    name="password"
                    type={showPassoword ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="no-password"
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className={`form-icon-password toggle-password ${showPassoword ? "eye-open" : "eye-close"
                      }`}
                  >
                    <img
                      src="./assets/images/eye.svg"
                      className="img-fluid"
                      alt="eye-icon"
                    />
                  </span>
                </div>
                {renderFieldError("password")}
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <div className="form-group-switch">
                <label className="switch">
                  <input
                    type="checkbox"
                    name="remember"
                    onChange={(e) => {
                      setRemember(e.target.checked ? 1 : 0);
                    }}
                    disabled={loading ? "disabled" : ""}
                    checked={remember ? "checked" : ""}
                  />
                  <span className="slider round"></span>
                </label>
                <span className="toggle-heading">Remember me</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <Link to="/forget-password" className="link-pass">
                Forgot Password?
              </Link>
            </div>
            <div className="col-12 col-lg-12">
              <div className="form-group-btn mt-30">
                <button
                  type="submit"
                  className="btn btn-fill"
                  disabled={loading ? "disabled" : ""}
                >
                  Login Now! {loading ? <ButtonLoader /> : ""}{" "}
                </button>
              </div>
            </div>
            <div className="col-12 col-lg-12">
              {/* <p className="account-now"> Or Register as:</p> */}
              <div className="line-with-text">Or Register As</div>
              <br></br>
              <div className="row">
                <div className="col-md-6">
                  <button
                    type="button"
                    className="btn btn-fill btn-white buyer-hover w-100"
                    onClick={() => navigate("/buyer/register")}
                  >
                    Buyer
                  </button>
                </div>
                <div className="col-md-6 mt-2 mt-md-0">
                  <button
                    type="button"
                    className="btn btn-fill w-100"
                    onClick={() => navigate("/seller/register")}
                  >
                    Wholesaler
                  </button>
                </div>
              </div>
              <div className="or">
                <span>OR</span>
              </div>
              <ul className="account-with-social social-login-link list-unstyled mb-0">
                <li>
                  <a 
                    style={{ cursor: "pointer" }}
                    onClick={(e) => { e.preventDefault(); setPendingProvider('google'); setShowRoleModal(true); }}
                  >
                    <img
                      src="./assets/images/google.svg"
                      className="img-fluid"
                      alt="google-icon"
                    />{" "}
                    Login With Google
                  </a>
                  <GoogleOAuthProvider clientId={googleClientId}>
                    <GoogleLoginComponent
                      ref={googleRef}
                      firebaseDeviceToken={firebaseDeviceToken}
                      apiUrl={apiUrl}
                      setLoading={setLoading}
                      navigate={navigate}
                      setErrors={setErrors}
                      roleType={roleType}
                    />
                  </GoogleOAuthProvider>
                </li>
                <li>
                  <a 
                    style={{ cursor: "pointer" }}
                    onClick={(e) => { e.preventDefault(); setPendingProvider('facebook'); setShowRoleModal(true); }}
                  >
                    <img 
                      src="./assets/images/facebook.svg" 
                      className="img-fluid" 
                      alt='fb-icon' 
                    />{" "}
                    Login With Facebook
                  </a>
                  <FacebookLoginButton
                    ref={facebookRef}
                    firebaseDeviceToken={firebaseDeviceToken}
                    apiUrl={apiUrl}
                    setLoading={setLoading}
                    navigate={navigate}
                    setErrors={setErrors}
                    roleType={roleType}
                  />
                </li>
              </ul>
            </div>
          </div>
        </form>
        {/* <p className="support-text mt-4">
          Want to get in touch? We'd love to hear from you.{" "}
          <Link to="/support" style={{ color: "#3F53FE" }}>
            click here
          </Link>
        </p> */}
      </div>

      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "none" }}></Modal.Header>
        <Modal.Body className="text-center pb-5 px-4 pt-0">
          <h4 className="fw-700 mb-2" style={{ fontWeight: 700, color: "#1a164b" }}>Select Your Role</h4>
          <p className="text-muted mb-4" style={{ fontSize: "14px" }}>How Would You Like To Continue?</p>
          
          <div className="role-options text-start mb-4 px-2">
            <div 
              style={{ border: `1px solid ${roleType === 3 ? '#3f53fe' : '#e0e0e0'}`, borderRadius: '8px', padding: '12px 15px', marginBottom: '15px', cursor: 'pointer' }} 
              onClick={() => setRoleType(3)}
            >
              <div className="form-check m-0 d-flex align-items-center">
                <input className="form-check-input me-3" type="radio" checked={roleType === 3} readOnly style={{ cursor: 'pointer', marginTop: 0 }} />
                <label className="form-check-label mb-0" style={{ cursor: 'pointer', fontWeight: 600, color: '#1a164b' }}>Buyer</label>
              </div>
            </div>
            
            <div 
              style={{ border: `1px solid ${roleType === 2 ? '#3f53fe' : '#e0e0e0'}`, borderRadius: '8px', padding: '12px 15px', cursor: 'pointer' }}
              onClick={() => setRoleType(2)}
            >
              <div className="form-check m-0 d-flex align-items-center">
                <input className="form-check-input me-3" type="radio" checked={roleType === 2} readOnly style={{ cursor: 'pointer', marginTop: 0 }} />
                <label className="form-check-label mb-0" style={{ cursor: 'pointer', fontWeight: 600, color: '#1a164b' }}>Wholesaler</label>
              </div>
            </div>
          </div>
          
          <div className="px-2">
            <button type="button" className="btn btn-fill w-100" onClick={handleSocialRoleSubmit}>
              Continue
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </Layout>
  );
}

export default Login;
