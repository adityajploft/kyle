import React, { useState } from "react";

import Layout from "../../../partials/Layout";
import { useParams } from "react-router-dom";
import ButtonLoader from "../../../partials/MiniLoader";
import { useFormError } from "../../../hooks/useFormError";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {
  const { token, hash } = useParams();

  const [showPassoword, setshowPassoword] = useState(false);
  const togglePasswordVisibility = () => {
    setshowPassoword(!showPassoword);
  };

  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setshowConfirmPassword(!showConfirmPassword);
  };

  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState("");

  const { setErrors, renderFieldError, setMessage, navigate } = useFormError();

  const submitResetPasswordForm = (e) => {
    e.preventDefault();

    setLoading(true);

    setErrors(null);

    setMessage("");

    const apiUrl = process.env.REACT_APP_API_URL;

    let headers = {
      Accept: "application/json",
    };

    axios
      .post(
        apiUrl + "reset-password",
        { token: token, hash: hash, password, password_confirmation },
        { headers: headers }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });

          navigate("/login");
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          console.log(error.response);
          if (error.response.data.validation_errors) {
            setErrors(error.response.data.validation_errors);
          }
          if (error.response.data.errors) {
            setErrors(error.response.data.errors);
          }
        }
      });
  };

  return (
    <Layout>
      <div className="account-in">
        <div className="center-content">
          <img src="/assets/images/logo.svg" className="img-fluid" alt="" />
          <h2>Reset Password</h2>
        </div>
        <form method="post" onSubmit={submitResetPasswordForm}>
          <div className="row">
            <div className="col-12 col-lg-12">
              <div className="form-group">
                <label htmlFor="pass_log_id">Password</label>
                <div className="form-group-inner">
                  <span className="form-icon">
                    <img
                      src="/assets/images/password.svg"
                      className="img-fluid"
                      alt=""
                    />
                  </span>
                  <input
                    type={showPassoword ? "text" : "password"}
                    name="password"
                    id="pass_log_id"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Password"
                    disabled={loading ? "disabled" : ""}
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
                <label htmlFor="conpass_log_id">Confirm password</label>
                <div className="form-group-inner">
                  <span className="form-icon">
                    <img
                      src="/assets/images/password.svg"
                      className="img-fluid"
                      alt=""
                    />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    id="conpass_log_id"
                    className="form-control"
                    value={password_confirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Enter Your Confirm Password"
                    disabled={loading ? "disabled" : ""}
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
                  {" "}
                  Submit {loading ? <ButtonLoader /> : ""}{" "}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default ResetPassword;
