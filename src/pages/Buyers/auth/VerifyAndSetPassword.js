import React, { useState, useEffect } from "react";
import Layout from "../../../partials/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormError } from "../../../hooks/useFormError";
import ButtonLoader from "../../../partials/MiniLoader";
import { useParams } from "react-router-dom";
import SuccessfullySubmittedPage from "../../../pages/Sellers/SuccessfullySubmittedPage";

const VerifyAndSetPassword = () => {
  const { userId, token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLinkExpire, setIsLinkExpire] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const { setErrors, renderFieldError, setMessage, navigate } = useFormError();
  const [showPassoword, setshowPassoword] = useState(false);
  const togglePasswordVisibility = () => {
    setshowPassoword(!showPassoword);
  };

  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setshowConfirmPassword(!showConfirmPassword);
  };
  const submitSetPasswordForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
      };
      let response = await axios.post(
        apiUrl + "verify-set-password",
        {
          hash: token,
          id: userId,
          password: password,
          password_confirmation: confirmPassword,
        },
        { headers: headers }
      );
      if (response.data.status) {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
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
    }
  };
  const fetchUserEmail = async () => {
    try {
      setLoader(true);
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
      };
      let response = await axios.get(apiUrl + `get-email/${userId}`, {
        headers: headers,
      });
      if (response.data.status) {
        setEmail(response.data.data);
      }
      setTimeout(() => {
        setLoader(false);
      }, 500);

    } catch (error) {
      if (error.response) {
        if(error.response.data.is_verify_email){
          setIsLinkExpire(true);
          setTimeout(() => {
            setLoader(false);
          }, 500);
        }
        
        if (error.response.data.validation_errors) {
          setErrors(error.response.data.validation_errors);
        }
        if (error.response.data.error) {
          // toast.error(error.response.data.error, {
          //   position: toast.POSITION.TOP_RIGHT,
          // });
        }
      }
    }
  };
  useEffect(() => {
    fetchUserEmail();
  }, []);
  return (
    <>
     {loader ? 
      <div className="loader" style={{ textAlign: "center", marginTop:'25%' }}>
        <img alt="loader" src="../../../assets/images/loader.svg" />
      </div> 
      :
      isLinkExpire ? <SuccessfullySubmittedPage isSubmitted={true}/>  :
      <Layout>
        <div className="account-in">
          <div className="center-content">
            <img src="/assets/images/logo.svg" className="img-fluid" alt="" />
            <h2>Verify & Set Password</h2>
          </div>
          <form method="post" onSubmit={submitSetPasswordForm}>
            <div className="row">
              <div className="col-12 col-lg-12">
                <div className="form-group ">
                  <label>Email</label>
                  <div className="form-group-inner">
                    <span className="form-icon">
                      <img
                        src="/assets/images/mail.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </span>
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      name=""
                      value={email}
                      className="form-control"
                      disabled="disabled"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-12">
                <div className="form-group">
                  <label>password</label>
                  <div className="form-group-inner">
                    <span className="form-icon">
                      <img
                        src="/assets/images/password.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </span>
                    <input
                      id="pass_log_id"
                      type={showPassoword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      name="password"
                      className="form-control"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className={`form-icon-password ${
                        showPassoword ? "eye-open" : "eye-close"
                      }`}
                    >
                      <img
                        src="/assets/images/eye.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </span>
                  </div>
                  {renderFieldError("password")}
                </div>
              </div>
              <div className="col-12 col-lg-12">
                <div className="form-group mb-0">
                  <label>Confirm password</label>
                  <div className="form-group-inner">
                    <span className="form-icon">
                      <img
                        src="/assets/images/password.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </span>
                    <input
                      id="conpass_log_id"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter Your Confirm Password"
                      name="password_confirmation"
                      className="form-control"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span
                      onClick={toggleConfirmPasswordVisibility}
                      className={`form-icon-password toggle-password ${
                        showConfirmPassword ? "eye-open" : "eye-close"
                      }`}
                    >
                      <img
                        src="/assets/images/eye.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </span>
                  </div>
                  {renderFieldError("password_confirmation")}
                </div>
              </div>
              <div className="col-12 col-lg-12">
                <div className="form-group-btn mb-0">
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
          </form>
        </div>
      </Layout>
    }
    </>

  );
};
export default VerifyAndSetPassword;
