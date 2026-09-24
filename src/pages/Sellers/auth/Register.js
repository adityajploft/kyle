import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import ButtonLoader from "../../../partials/MiniLoader";
import Layout from "../../../partials/Layout";
import ReCAPTCHA from "react-google-recaptcha";
import { useFormError } from "../../../hooks/useFormError";
import GoogleFacebookLogin from "../../../component/GoogleFacebookLogin";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import PhoneNumberWithOTPVerify from "../../../component/PhoneNumberWithOTPVerify";
import EmailWithOTPVerify from "../../../component/EmailWithOTPVerify";

const Register = () => {
  const location = useLocation();
  const { getTokenData, setAsLogged } = useAuth();
  const { setErrors, renderFieldError, navigate } = useFormError();
  const hideSocialButtons = Boolean(location.state?.fromSocialLogin);
  const socialData = location.state?.socialData || {};
  const isSocialRegister = Boolean(location.state?.fromSocialLogin);
  const socialProvider = location.state?.socialProvider;
  const isGoogleSocialLogin = isSocialRegister && socialProvider === "google";
  const needsPhoneOTP =
    !isSocialRegister || isGoogleSocialLogin || (isSocialRegister && !socialData.email);
  const needsEmailOTP =
    isSocialRegister && !isGoogleSocialLogin && Boolean(socialData.email);
  const isSocialEmailLocked = isSocialRegister && Boolean(socialData.email);
  const registerType = location.state?.fromSocialLogin
    ? socialProvider === "facebook"
      ? 3
      : 2
    : 1;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm();

  const phoneValue = watch("phone", "");
  const [isVerifiedOTP, setIsVerifiedOTP] = useState(false);
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);

  useEffect(() => {
    let login = getTokenData();
    if (login?.access_token) {
      navigate("/", { replace: true });
    }
  }, [getTokenData, navigate]);

  useEffect(() => {
    localStorage.setItem("user_role", "2");
  }, []);

  useEffect(() => {
    if (!location.state?.fromSocialLogin) return;

    if (socialData.first_name) {
      setValue("first_name", socialData.first_name);
    }
    if (socialData.last_name) {
      setValue("last_name", socialData.last_name);
    }
    if (socialData.email) {
      setValue("email", socialData.email);
    }
    if (socialData.phone) {
      setValue("phone", formatInput(socialData.phone));
    }
    if (socialData.company_name) {
      setValue("company_name", socialData.company_name);
    }
  }, [location.state, setValue, socialData]);

  const apiUrl = process.env.REACT_APP_API_URL;
  const capchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const [showPassoword, setshowPassoword] = useState(false);
  const countryCode = process.env.REACT_APP_COUNTRY_CODE;

  const togglePasswordVisibility = () => {
    setshowPassoword(!showPassoword);
  };

  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setshowConfirmPassword(!showConfirmPassword);
  };

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState("");
  const [privacyLink, setPrivacyLink] = useState({});

  const [loading, setLoading] = useState(false);
  function onCaptchaChange(value) {
    if (value) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  }

  const submitRegisterForm = (data, e) => {
    e.preventDefault();
    setErrors(null);
    setRecaptchaError("");
    setLoading(true);
    if (captchaVerified) {

      const formData = new FormData(e.target);
      let payload = Object.fromEntries(formData.entries());
      payload.role_type = 2;
      payload.register_type = registerType;

      if (payload.phone) {
        payload.phone = payload.phone.replace(/-/g, "");
      }



      if (needsPhoneOTP && !isVerifiedOTP) {
        setLoading(false);
        toast.error("Please verify your phone number with OTP before submitting.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      if (needsEmailOTP && !isVerifiedEmail) {
        setLoading(false);
        toast.error("Please verify your email with OTP before submitting.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }

      if (isSocialRegister) {
        delete payload.password;
        delete payload.password_confirmation;
      }

      let headers = {
        Accept: "application/json",
      };

      axios
        .post(apiUrl + "register", payload, { headers: headers })
        .then((response) => {
          setLoading(false);
          if (response.data.status) {
            toast.success(
              response.data.message || "Registration successful. Please check your email for verification.",
              {
                position: toast.POSITION.TOP_RIGHT,
              }
            );

            if (isSocialRegister && response.data.access_token) {
              const userData = response.data.userData || {
                first_name: payload.first_name,
                last_name: payload.last_name,
                email: payload.email,
                role: 2,
                is_profile_complete: true
              };
              setAsLogged(
                response.data.access_token,
                response.data.remember_token || "",
                null,
                userData
              );
            } else {
              navigate("/login");
            }
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
    } else {
      setLoading(false);
      setRecaptchaError("Please complete reCAPTCHA verification.");
    }
  };

  const getPrivacyLink = async () => {
    try {
      let headers = {
        Accept: "application/json",
      };
      let response = await axios.get(`${apiUrl}get-links`, { headers: headers });
      console.log(response.data.result.links, "response")
      setPrivacyLink(response.data.result.links);
    } catch (error) {
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
  }


  useEffect(() => {
    getPrivacyLink();
  }, [])

  const formatInput = (input) => {
    let cleaned = String(input || "").replace(/\D/g, "");
    return cleaned
      .substring(0, 10)
      .replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, g1, g2, g3) =>
        [g1, g2, g3].filter(Boolean).join("-")
      );
  };

  useEffect(() => {
    const formattedValue = formatInput(phoneValue);
    setValue("phone", formattedValue);
  }, [phoneValue, setValue]);


  return (
    <Layout>
      <div className="account-in">
        {!isSocialRegister && (
          <>
            <div className="center-content">
              <img src="./assets/images/logo.svg" className="img-fluid" alt="" />
              <h3 className="fw-700 color2 mb-4">Register as a Wholesaler for BuyBoxBot</h3>
            </div>
            <GoogleFacebookLogin hideButtons={hideSocialButtons} />

            {/* <ul className="account-with-social list-unstyled mb-0 social-login-link spacing-above">
              <li>
                <Link to="https://google.com">
                  <img
                    src="../../../assets/images/google.svg"
                    className="img-fluid"
                    alt="google-icon"
                  />{" "}
                  Register With Google
                </Link>
                <GoogleOAuthProvider clientId={googleClientId}>
                  <GoogleLoginComponent
                    apiUrl={apiUrl}
                    setLoading={setLoading}
                    navigate={navigate}
                    setErrors={setErrors}
                  />
                </GoogleOAuthProvider>
              </li>
              <li>
                  <Link to="https://facebook.com"><img src="../../../assets/images/facebook.svg" className="img-fluid" />Register With Facebook</Link>
                  <FacebookLoginButton
                  apiUrl={apiUrl}
                  setLoading={setLoading}
                  navigate={navigate}
                  setErrors={setErrors}
                  roleType={2}
                  />
              </li>
            </ul> */}
            <div className="or">
              <span>OR</span>
            </div>
          </>
        )}
        <form
          method="POST"
          action="#"
          onSubmit={handleSubmit(submitRegisterForm)}
        >
          <div className="row main-login-form">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <div className="form-group">
                <label htmlFor="first_name">
                  First Name <span style={{ color: "red" }}>*</span>
                </label>
                <div className="form-group-inner">
                  <span className="form-icon">
                    <img
                      src="../../../assets/images/user.svg"
                      className="img-fluid"
                      alt=""
                    />
                  </span>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    className="form-control"
                    autoComplete="off"
                    placeholder="First Name"
                    disabled={loading ? "disabled" : ""}
                    {...register("first_name", {
                      required: "First Name is required",
                      validate: {
                        maxLength: (v) =>
                          v.length <= 50 ||
                          "The first name should have at most 50 characters",
                        matchPattern: (v) =>
                          /^[a-zA-Z\s]+$/.test(v) ||
                          "First Name can not include number or special character",
                      },
                    })}
                  />
                </div>

                {errors.first_name && (
                  <p className="error">{errors.first_name?.message}</p>
                )}
                {renderFieldError("first_name")}
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <div className="form-group">
                <label htmlFor="last_name">
                  Last Name <span style={{ color: "red" }}>*</span>
                </label>
                <div className="form-group-inner">
                  <span className="form-icon">
                    <img
                      src="../../../assets/images/user.svg"
                      className="img-fluid"
                      alt=""
                    />
                  </span>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    className="form-control"
                    autoComplete="off"
                    placeholder="Last Name"
                    disabled={loading ? "disabled" : ""}
                    {...register("last_name", {
                      required: "Last Name is required",
                      validate: {
                        maxLength: (v) =>
                          v.length <= 50 ||
                          "The last name should have at most 50 characters",
                        matchPattern: (v) =>
                          /^[a-zA-Z\s]+$/.test(v) ||
                          "Last Name can not include number or special character",
                      },
                    })}
                  />
                </div>
                {errors.last_name && (
                  <p className="error">{errors.last_name?.message}</p>
                )}
                {renderFieldError("last_name")}
              </div>
            </div>
            {isSocialRegister && socialData.email && !isGoogleSocialLogin ? (
              <EmailWithOTPVerify
                register={register}
                getValues={getValues}
                watch={watch}
                errors={errors.email}
                setIsVerifiedEmail={setIsVerifiedEmail}
                isVerifiedEmail={isVerifiedEmail}
                renderFieldError={renderFieldError}
                clearErrors={clearErrors}
                setFormErrors={setErrors}
                initialEmail={socialData.email}
              />
            ) : (
              <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="form-group-inner">
                    <span className="form-icon">
                      <img
                        src="../../../assets/images/mail.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </span>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      autoComplete="no-email"
                      placeholder="Enter Your Email"
                      readOnly={isSocialEmailLocked}
                      aria-disabled={isSocialEmailLocked}
                      disabled={loading ? "disabled" : ""}
                      {...register("email", {
                        required: "Email is required",
                        validate: {
                          maxLength: (v) =>
                            v.length <= 50 ||
                            "The email should have at most 50 characters",
                          matchPattern: (v) =>
                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                              v
                            ) || "Email address must be a valid address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="error">{errors.email?.message}</p>
                  )}
                  {renderFieldError("email")}
                </div>
              </div>
            )}

            {!isSocialRegister || isGoogleSocialLogin || (isSocialRegister && !socialData.email) ? (
              <PhoneNumberWithOTPVerify
                register={register}
                getValues={getValues}
                watch={watch}
                errors={errors.phone}
                setIsVerifiedOTP={setIsVerifiedOTP}
                isVerifiedOTP={isVerifiedOTP}
                renderFieldError={renderFieldError}
                clearErrors={clearErrors}
                setFormErrors={setErrors}
                initialPhone={socialData.phone}
              />
            ) : (
              <div className="col-12 col-sm-6 col-md-6 col-lg-6">
                <div className="form-group">
                  <label htmlFor="phone">
                    Mobile Number <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="form-group-inner">
                    <span className="form-icon">
                      <img
                        src="../../../assets/images/phone.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </span>
                    <span className="form-icon  counts_icon">(+{countryCode})</span>
                    <input type="hidden" name="country_code" value={countryCode} />
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      className="form-control phone_input"
                      autoComplete="off"
                      disabled={loading ? "disabled" : ""}
                      placeholder="123-456-7890"
                      {...register("phone", {
                        required: "Phone Number is required",
                        validate: {
                          matchPattern: (v) =>
                            /^[0-9-]*$/.test(v) || "Please enter a valid phone number",
                          maxLength: (v) =>
                            (v.length <= 13 && v.length >= 1) || "The phone number should be between 1 to 10 characters",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="error">{errors.phone?.message}</p>
                  )}
                  {renderFieldError("phone")}
                </div>
              </div>
            )}
            <div className="col-12 col-lg-12">
              <div className="form-group">
                <label htmlFor="company_name">
                  Company Name
                </label>
                <div className="form-group-inner">
                  <span className="form-icon">
                    <img
                      src="../../../assets/images/map-pin.svg"
                      className="img-fluid"
                      alt=""
                    />
                  </span>
                  <input
                    type="text"
                    name="company_name"
                    id="company_name"
                    className="form-control"
                    autoComplete="off"
                    placeholder="Enter Company Name"
                    disabled={loading ? "disabled" : ""}
                    {...register("company_name"
                    )}
                  />
                </div>

              </div>
            </div>
            <div className="col-12 col-lg-12">
              <div className="form-group">
                <label htmlFor="rep_code">
                 REP Code 
                </label>
                <div className="form-group-inner">
                  <span className="form-icon">
                    <img
                      src="/assets/images/rep_code_icon.svg"
                      className="img-fluid"
                      alt=""
                    />
                  </span>
                  <input
                    type="text"
                    name="rep_code"
                    id="rep_code"
                    className="form-control"
                    autoComplete="off"
                    placeholder="Enter REP Code"
                    disabled={loading ? "disabled" : ""}
                    {...register("rep_code")}
                  />
                </div>
              </div>
            </div>
            {!isSocialRegister && (
              <>
                <div className="col-12 col-lg-12">
                  <div className="form-group">
                    <label htmlFor="pass_log_id">
                      Password <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="form-group-inner">
                      <span className="form-icon">
                        <img
                          src="../../../assets/images/password.svg"
                          className="img-fluid"
                          alt=""
                        />
                      </span>
                      <input
                        type={showPassoword ? "text" : "password"}
                        name="password"
                        id="pass_log_id"
                        className="form-control"
                        placeholder="Enter Your Password"
                        autoComplete="off"
                        disabled={loading ? "disabled" : ""}
                        {...register("password", {
                          required: "Password is required",
                        })}
                      />
                      <span
                        onClick={togglePasswordVisibility}
                        className={`form-icon-password ${showPassoword ? "eye-open" : "eye-close"
                          }`}
                      >
                        <img
                          src="../../../assets/images/eye.svg"
                          className="img-fluid"
                          alt=""
                        />
                      </span>
                    </div>
                    {errors.password && (
                      <p className="error">{errors.password?.message}</p>
                    )}
                    {renderFieldError("password")}
                  </div>
                </div>
                <div className="col-12 col-lg-12">
                  <div className="form-group">
                    <label htmlFor="conpass_log_id">
                      Confirm password <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="form-group-inner">
                      <span className="form-icon">
                        <img
                          src="../../../assets/images/password.svg"
                          className="img-fluid"
                          alt=""
                        />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirmation"
                        id="conpass_log_id"
                        className="form-control"
                        autoComplete="off"
                        placeholder="Enter Your Confirm Password"
                        disabled={loading ? "disabled" : ""}
                        {...register("password_confirmation", {
                          required: "Confirm password is required",
                        })}
                      />
                      <span
                        onClick={toggleConfirmPasswordVisibility}
                        className={`form-icon-password toggle-password ${showConfirmPassword ? "eye-open" : "eye-close"
                          }`}
                      >
                        <img
                          src="../../../assets/images/eye.svg"
                          className="img-fluid"
                          alt=""
                        />
                      </span>
                    </div>
                    {errors.password_confirmation && (
                      <p className="error">
                        {errors.password_confirmation?.message}
                      </p>
                    )}
                    {renderFieldError("password_confirmation")}
                  </div>
                </div>
              </>
            )}
            <div className="col-12 col-lg-12">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" name="terms_accepted" value="1" id="privacy-policy" {...register("terms_accepted", {
                  required: "This field is required",
                })} />
                <label className="form-check-label text-transform-none" htmlFor="privacy-policy">
                  <p>I have read and agree to the <Link target="_blank" to={privacyLink.privacy_policy_link !== undefined ? privacyLink.privacy_policy_link : ''}>Privacy Policy </Link>
                    and <Link target="_blank" to={privacyLink.terms_services_link !== undefined ? privacyLink.terms_services_link : ''}> Terms or Service </Link></p>
                </label>
                {errors.terms_accepted && (
                  <p className="error error_space">{errors.terms_accepted?.message}</p>
                )}
              </div>
            </div>
            <div className="col-12 col-lg-12">
              <div className="form-group mb-0 register-recaptcha">
                <ReCAPTCHA sitekey={capchaSiteKey} onChange={onCaptchaChange} />
                {recaptchaError && (
                  <span className="invalid-feedback" role="alert">
                    <strong>{recaptchaError}</strong>
                  </span>
                )}
              </div>
            </div>
            <div className="col-12 col-lg-12">
              <div className="form-group-btn">
                <button
                  type="submit"
                  className="btn btn-fill"
                  disabled={loading ||
                    (needsPhoneOTP && !isVerifiedOTP) ||
                    (needsEmailOTP && !isVerifiedEmail) ? "disabled" : ""}
                >
                  Register Now!
                  {loading ? <ButtonLoader /> : ""}
                </button>
              </div>
            </div>
            <div className="col-12 col-lg-12">
              <p className="account-now">
                Already Have an account? <Link to="/login">Login Now!</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
