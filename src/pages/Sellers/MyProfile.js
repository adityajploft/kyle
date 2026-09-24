import React, { useEffect, useRef, useState } from "react";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import {  Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFormError } from "../../hooks/useFormError";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "axios";
import PhoneNumberWithOTPVerify from "../../component/PhoneNumberWithOTPVerify";
import EmailWithOTPVerify from "../../component/EmailWithOTPVerify";

const normalizeEmail = (value) =>
  (value || "").toString().trim().toLowerCase();
const normalizePhone = (value) =>
  (value || "").toString().replace(/\D/g, "");

const MyProfile = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const countryCode = process.env.REACT_APP_COUNTRY_CODE;

  const { getTokenData, setLogout, getLocalStorageUserdata, setLocalStorageUserdata } = useAuth();
  const [userData, setUserData] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProfileUpdate, setIsProfileUpdate] = useState("false");
  const [errorMsg, setErrorMsg] = useState("");
  const [border, setBorder] = useState("1px dashed #677AAB");
  const [loader, setLoader] = useState(true);
  const { setErrors, renderFieldError } = useFormError();
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showOldPassoword, setShowOldPassoword] = useState(false);
  const [showNewPassoword, setShowNewPassoword] = useState(false);
  const [showConfirmPassoword, setShowConfirmPassoword] = useState(false);
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVerifiedOTP, setIsVerifiedOTP] = useState(false);
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
  const [verifiedEmailValue, setVerifiedEmailValue] = useState("");
  const [verifiedPhoneValue, setVerifiedPhoneValue] = useState("");
  const prevVerifiedEmailRef = useRef(false);
  const prevVerifiedPhoneRef = useRef(false);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    getValues,
    formState: { errors },
  } = useForm();

  let emailValue = watch("email", "");
  let phoneValue = watch("phone", '');
  let headers = {
    Accept: "application/json",
    Authorization: "Bearer " + getTokenData().access_token,
    "auth-token": getTokenData().access_token,
  };
  useEffect(() => {
    fetchUserData();
  }, [isProfileUpdate]);

  const fetchUserData = async () => {
    try {
      let response = await axios.get(apiUrl + "user-details", {
        headers: headers,
      });
      if (response) {
        let { data } = response.data.data;
        setUserData(response.data.data);
        setFirstName(response.data.data.first_name);
        setLastName(response.data.data.last_name);
        setIsVerifiedEmail(Boolean(response.data.data.email_verified));
        setIsVerifiedOTP(Boolean(response.data.data.phone_verified));
        setVerifiedEmailValue(
          response.data.data.email_verified
            ? normalizeEmail(response.data.data.email)
            : ""
        );
        setVerifiedPhoneValue(
          response.data.data.phone_verified
            ? normalizePhone(response.data.data.phone)
            : ""
        );
       
        let userData = getLocalStorageUserdata();
        userData.first_name = response.data.data.first_name;
        userData.last_name = response.data.data.last_name;
        userData.profile_image =response.data.data.profile_image;
        userData.level_type = response.data.data.level_type;
        userData.role = response.data.data.role;
        userData.total_buyer_uploaded = response.data.data.total_buyer_uploaded;
        setPhoneNumber(response.data.data.phone);
        if (response.data.data.email) {
          setValue("email", response.data.data.email);
        }
        setLocalStorageUserdata(userData);        
        const profileName = document.querySelector(".user-name-title");
        const profilePic = document.querySelector(".user-profile");

        profileName.innerHTML =
          response.data.data.first_name + " " + response.data.data.last_name;
        if (response.data.data.profile_image != "") {
          profilePic.src = response.data.data.profile_image;
        }
      }
      setLoader(false);
    } catch (error) {
      toast.error(error.message, { position: toast.POSITION.TOP_RIGHT });
    }
  };
  const handleFormSubmit = (data, e) => {
    e.preventDefault();
    setIsProfileUpdate("false");
    setErrors("");
    var data = new FormData(e.target);
    let formData = Object.fromEntries(data.entries());

    if (formData.hasOwnProperty("phone")) {
      if(formData.phone != ''){
        let convertedNumber = formData.phone.replace(/\D/g, "")
        formData.phone = convertedNumber;
      }
    }

    // OTP Validation for Email and Phone
    const currentEmail = normalizeEmail(formData.email);
    const originalEmail = normalizeEmail(userData.email);
    const currentPhoneDigits = normalizePhone(formData.phone);
    const originalPhoneDigits = normalizePhone(phoneNumber);
    const savedVerifiedEmail = normalizeEmail(verifiedEmailValue);
    const savedVerifiedPhone = normalizePhone(verifiedPhoneValue);

    if (savedVerifiedEmail) {
      if (currentEmail !== savedVerifiedEmail) {
        toast.error("Please verify your new email address with OTP before submitting", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsProfileUpdate("true");
        return;
      }
    } else if (currentEmail !== originalEmail && !isVerifiedEmail) {
      toast.error("Please verify your new email address with OTP before submitting", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsProfileUpdate("true");
      return;
    }

    if (savedVerifiedPhone) {
      if (currentPhoneDigits !== savedVerifiedPhone) {
        toast.error("Please verify your new phone number with OTP before submitting", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsProfileUpdate("true");
        return;
      }
    } else if (currentPhoneDigits !== originalPhoneDigits && !isVerifiedOTP) {
      toast.error("Please verify your new phone number with OTP before submitting", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsProfileUpdate("true");
      return;
    }

    let headers = {
      Accept: "application/json",
      Authorization: "Bearer " + getTokenData().access_token,
      "auth-token": getTokenData().access_token,
      "Content-Type": "multipart/form-data",
    };
    const maxFileSize = 2 * 1024 * 1024; // 5MB
    const fileSize = formData.profile_image.size;
    const fileType = formData.profile_image.type;
    const fileName = formData.profile_image.name;

    if (
      fileName != "" &&
      fileType != "image/png" &&
      fileType != "image/jpg" &&
      fileType != "image/jpeg"
    ) {
      setErrorMsg("Please add valid file (jpg,jpeg,png)");
      setBorder("1px dashed #ff0018");
      return false;
    } else if (fileSize > maxFileSize) {
      setErrorMsg(
        "File size is too large. Please upload a file that is less than 2MB."
      );
      setBorder("1px dashed #ff0018");
      return false;
    } else {
      setBorder("1px dashed #677AAB");
      setErrorMsg("");
      setLoader(true);
      setPreviewImageUrl("");
    }

    async function fetchData() {
      try {
        const response = await axios.post(apiUrl + "update-profile", formData, {
          headers: headers,
        });

        if (response.data.status) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsProfileUpdate("true");
          //await fetchUserData();
        }
      } catch (error) {
        setLoader(false);
        if (error.response) {
          if (error.response.status === 401) {
            setLogout();
          }
          if (error.response.data.errors) {
            setErrors(error.response.data.errors);
          }
          if (error.response.data.error) {
            toast.error(error.response.data.error, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      }
    }
    fetchData();
  };
  const previewImage = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPreviewImageUrl(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleOldPassword = (e) => {
    setOldPassword(e.target.value);
  };
  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassoword(!showOldPassoword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassoword(!showNewPassoword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassoword(!showConfirmPassoword);
  };

  const formatInput = (input) => {
    console.log(input,"input")
    let cleaned = '';
    if(input){
      cleaned = input.replace(/\D/g, "");
    }

    return cleaned
        .substring(0, 10) 
        .replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, g1, g2, g3) =>
            [g1, g2, g3].filter(Boolean).join("-")
        );
  };


  useEffect(() => {
    const formattedValue = formatInput(phoneNumber);
    setValue("phone", formattedValue);
  }, [phoneNumber, setValue]);

  useEffect(() => {
    if (!prevVerifiedEmailRef.current && isVerifiedEmail) {
      setVerifiedEmailValue(normalizeEmail(emailValue));
    }
    prevVerifiedEmailRef.current = isVerifiedEmail;
  }, [emailValue, isVerifiedEmail]);

  useEffect(() => {
    if (!prevVerifiedPhoneRef.current && isVerifiedOTP) {
      setVerifiedPhoneValue(normalizePhone(phoneValue));
    }
    prevVerifiedPhoneRef.current = isVerifiedOTP;
  }, [phoneValue, isVerifiedOTP]);

  return (
    <>
      <Header />
      <section className="main-section position-relative pt-4 pb-120">
        {loader ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img src="../../../assets/images/loader.svg" />
          </div>
        ) : (
          <div className="container position-relative pat-40">
            <div className="back-block">
              <div className="row align-items-center">
                <div className="col-12 col-sm-4 col-md-4 col-lg-4">
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
              </div>
            </div>
            <div className="card-box">
              <form
                className="profile-account"
                method="post"
                onSubmit={handleSubmit(handleFormSubmit)}
              >
                <div className="row">
                  <div className="col-12 col-lg-8">
                    <div className="card-box-inner">
                      <h3 className="my-profile-title">My Profile</h3>
                      {/* <p>Fill the below form OR send link to the buyer</p> */}
                      <div className="row">
                        <div className="col-12 col-md-6 col-lg-6">
                          <div className="form-group">
                            <label>
                              First Name <span className="error">*</span>
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              className="form-control-form"
                              placeholder="First Name"
                              defaultValue={userData.first_name}
                              {...register("first_name", {
                                required: "First Name is required",
                                validate: {
                                  maxLength: (v) =>
                                    v.length <= 50 ||
                                    "The First Name should have at most 50 characters",
                                  matchPattern: (v) =>
                                    /^[a-zA-Z\s]+$/.test(v) ||
                                    "First Name can not include number or special character",
                                },
                              })}
                            />

                            {errors.first_name && (
                              <p className="error">
                                {errors.first_name?.message}
                              </p>
                            )}

                            {renderFieldError("first_name")}
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-6">
                          <div className="form-group">
                            <label>
                              Last Name <span className="error">*</span>
                            </label>
                            <input
                              type="text"
                              defaultValue={userData.last_name}
                              name="last_name"
                              className="form-control-form"
                              placeholder="Last Name"
                              {...register("last_name", {
                                required: "Last Name is required",
                                validate: {
                                  maxLength: (v) =>
                                    v.length <= 50 ||
                                    "The Last Name should have at most 50 characters",
                                  matchPattern: (v) =>
                                    /^[a-zA-Z\s]+$/.test(v) ||
                                    "Last Name can not include number or special character",
                                },
                              })}
                            />
                            {errors.last_name && (
                              <p className="error">
                                {errors.last_name?.message}
                              </p>
                            )}
                            {renderFieldError("last_name")}
                          </div>
                        </div>
                        <EmailWithOTPVerify
                          register={register}
                          getValues={getValues}
                          watch={watch}
                          errors={errors.email}
                          setIsVerifiedEmail={setIsVerifiedEmail}
                          isVerifiedEmail={isVerifiedEmail}
                          renderFieldError={renderFieldError}
                          initialEmail={userData.email}
                          clearErrors={clearErrors}
                          setFormErrors={setErrors}
                        />
                        <PhoneNumberWithOTPVerify
                          register={register}
                          getValues={getValues}
                          watch={watch}
                          errors={errors.phone}
                          setIsVerifiedOTP={setIsVerifiedOTP}
                          isVerifiedOTP={isVerifiedOTP}
                          renderFieldError={renderFieldError}
                          initialPhone={phoneNumber}
                          clearErrors={clearErrors}
                          setFormErrors={setErrors}
                        />
                      </div>
                      <div className="save-btn my-3">
                        <button className="btn btn-fill">Update</button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4 mt-lg-0 mt-sm-3 mt-2 pt-lg-0 pt-1">
                    <div className="outer-heading text-center">
                      <h3 className="editprofilePic">Edit Profile Picture </h3>
                      {/* <p>Lorem Ipsum is simply dummy text of the printing.</p> */}
                    </div>
                    <div className="upload-photo" style={{ border: border }}>
                      <div className="containers">
                        <div className="imageWrapper">
                          {previewImageUrl == "" ? (
                            <img
                              className="image"
                              src={
                                userData.profile_image != ""
                                  ? userData.profile_image
                                  : "./assets/images/avtar-big.png"
                              }
                            />
                          ) : (
                            <img className="image" src={previewImageUrl} />
                          )}
                        </div>
                      </div>
                      <button className="file-upload">
                        <input
                          type="file"
                          className="file-input"
                          name="profile_image"
                          accept="image/gif, image/jpeg, image/png" 
                          onChange={previewImage}
                        />
                        Change Profile Photo
                      </button>
                    </div>
                    <p
                      style={{
                        padding: "6px",
                        textAlign: "center",
                        fontSize: "13px",
                        color: "red",
                        fontWeight: "700",
                      }}
                    >
                      {errorMsg}
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};
export default MyProfile;
