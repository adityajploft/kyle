import React, { useEffect } from "react";
import BuyerHeader from "../../partials/BuyerHeader";
import Footer from "../../partials/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useFormError } from "../../hooks/useFormError";
import { toast } from "react-toastify";
import { Modal, Nav, OverlayTrigger, Tab, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";
import MiniLoader from "../../partials/MiniLoader";
import { useForm, Controller } from "react-hook-form";

const BuyerProfile = () => {
  const { getTokenData, setLogout } = useAuth();
  const [currentBuyerData, setCurrentBuyerData] = useState({});
  const [profileBuyerList, setProfileBuyerList] = useState([]);
  const [currentProfileData, setCurrentProfileData] = useState([]);
  const [profileId, setProfileId] = useState(0);
  const [loader, setLoader] = useState(true);
  const [buttonLoader, setButtonLoader] = useState(false);
  const { setErrors, renderFieldError } = useFormError();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);

  const watchedFile = watch("bank_statement_pdf");

  useEffect(() => {
    if (watchedFile && watchedFile.length > 0) {
      setSelectedFile(watchedFile[0]);
    }
  }, [watchedFile]);

  const apiUrl = process.env.REACT_APP_API_URL;
  let headers = {
    Accept: "application/json",
    Authorization: "Bearer " + getTokenData().access_token,
  };

  const fetchBuyerData = async () => {
    try {
      let response = await axios.get(`${apiUrl}edit-buyer`, {
        headers: headers,
      });
      if (response.data.status) {
        let responseData = response.data.buyer;
        setCurrentBuyerData(responseData);
        setLoader(false);
      }
    } catch (error) {
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
  };

  const profileStatus = async (isChecked) => {
    try {
      let data = isChecked ? 0 : 1;
      let response = await axios.post(
        apiUrl + "update-buyer-search-status",
        { status: data },
        {
          headers: headers,
        }
      );
      if (response.data.status) {
        fetchBuyerData();
        setLoader(false);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
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
  };
  const contactPreferanceUpdate = async (data) => {
    try {
      setButtonLoader(true);
      let response = await axios.post(
        apiUrl + "update-buyer-contact-pref",
        { contact_preference: data },
        {
          headers: headers,
        }
      );
      if (response.data.status) {
        fetchBuyerData();
        setLoader(false);
        setButtonLoader(false);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      if (error.response) {
        setButtonLoader(false);
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
  };
  const getLabelValue = (data) => {
    if (data !== undefined) {
      const selectedBuildingClass = data.map((item) => item.label);
      return selectedBuildingClass.join(", ");
    }
  };

  const getLastAddress = (data) => {
    if (data !== undefined) {
      const selectedBuildingClass = data.map((item) => item.title);
      return selectedBuildingClass[0];
    }
  };

  const profileIcons = {
    1: "/assets/images/buyer-01.svg",
    2: "/assets/images/buyer-03.svg",
    3: "/assets/images/buyer-02.svg",
    4: "/assets/images/buyer-04.svg",
  };
  const handleClickConfirmation = (e) => {
    let isChecked = e.target.checked;
    Swal.fire({
      icon: "warning",
      title: "Do you want to make this change?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        profileStatus(isChecked);
      } else {
        const checkbox = document.getElementById("buyer-status");
        checkbox.checked = isChecked ? 0 : 1;
      }
    });
  };
// const handleProfileUpdateLocked = () => {
//     Swal.fire({
//       icon: "info",
//       title: "Profile Update Locked",
//       text: "Profile Updation can only be done after the Buyer completes verification.",
//       confirmButtonText: "Okay",
//       buttonsStyling: false,
//       customClass: {
//         confirmButton: "btn btn-fill w-auto",
//       },
//       didOpen: () => {
//         const confirmBtn = Swal.getConfirmButton();
//         confirmBtn.style.backgroundColor = "#3f53fe";
//         confirmBtn.style.color = "#fff";
//         confirmBtn.style.borderRadius = "8px";
//         confirmBtn.style.padding = "12px 36px";
//       }
//     });
//   };
  



  const getBuyerProfileList = async () => {
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
      };
      let response = await axios.get(`${apiUrl}get-buyer-properites`, {
        headers: headers,
      });
      setProfileId(response.data.data[0].key);
      setProfileBuyerList(response.data.data);
    } catch (error) {
      console.log(error, "error")
    }
  }

  const getBuyerProfileData = async () => {
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
      };
      let response = await axios.get(`${apiUrl}get-buyer-property-detail/${profileId}`, {
        headers: headers,
      });
      setCurrentProfileData(response.data.data);
    } catch (error) {
      console.log(error, "error")
    }
  }

  useEffect(() => {
    fetchBuyerData();
    getBuyerProfileList();
  }, []);

  useEffect(() => {
    if (profileId > 0) {
      getBuyerProfileData();
    }
  }, [profileId]);

  const formatInput = (input) => {
    if (!input) return "";
    let cleaned = String(input).replace(/\D/g, "");
    return "+1 " + cleaned
      .substring(0, 10)
      .replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, g1, g2, g3) =>
        [g1, g2, g3].filter(Boolean).join("-")
      );
  };


  const [documentsReverify, setDocumentsReverify] = useState(false);
  const handleDocumentsReverify = () => {
    setDocumentsReverify(true);
    setSelectedFile(null);
  }

  const submitSingleBuyerForm = async (data, e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append("bank_statement_pdf", data.bank_statement_pdf[0]);
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "Content-Type": "multipart/form-data",
      };
      let response = await axios.post(`${apiUrl}upload-document`, formData, { headers });
      if (response.data.status) {
        setDocumentsReverify(false);
        setSelectedFile(null);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      <BuyerHeader />
      <section className="main-section position-relative pt-4 pb-120 buyer-proinner">
        {loader ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img src="../../../assets/images/loader.svg" />
          </div>
        ) : (
          <div className="container position-relative pat-40">
            <div className="back-block">
              <div className="row">
                <div className="col-12 col-lg-12">
                  <h6 className="center-head text-center mb-0">Profile</h6>
                </div>
              </div>
            </div>
            <div className="card-box">
              <div className="row">
                <div className="col-12 col-lg-4">
                  <div className="personal-information card-box-inner">
                    <h3 className="text-capitalize">personal information</h3>
                    <div className="contact-update">
                      <div className="contact-update-item">
                        <a href={void 0}>
                          <span className="icon">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 22 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.9993 1.83398C8.46805 1.83398 6.41602 3.88602 6.41602 6.41732C6.41602 8.94862 8.46805 11.0007 10.9993 11.0007C13.5306 11.0007 15.5827 8.94862 15.5827 6.41732C15.5827 3.88602 13.5306 1.83398 10.9993 1.83398Z"
                                fill="url(#paint0_linear_2365_13344)"
                              />
                              <path
                                d="M8.24935 12.834C7.03378 12.834 5.86799 13.3169 5.00845 14.1764C4.1489 15.0359 3.66602 16.2017 3.66602 17.4173V19.2507C3.66602 19.7569 4.07643 20.1673 4.58268 20.1673H17.416C17.9223 20.1673 18.3327 19.7569 18.3327 19.2507V17.4173C18.3327 16.2017 17.8498 15.0359 16.9902 14.1764C16.1308 13.3169 14.9649 12.834 13.7493 12.834H8.24935Z"
                                fill="url(#paint1_linear_2365_13344)"
                              />
                              <defs>
                                <linearGradient
                                  id="paint0_linear_2365_13344"
                                  x1="10.9993"
                                  y1="1.83398"
                                  x2="10.9993"
                                  y2="20.1673"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#9F9FFF" />
                                  <stop offset="1" stopColor="#2222FF" />
                                </linearGradient>
                                <linearGradient
                                  id="paint1_linear_2365_13344"
                                  x1="10.9993"
                                  y1="1.83398"
                                  x2="10.9993"
                                  y2="20.1673"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#9F9FFF" />
                                  <stop offset="1" stopColor="#2222FF" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </span>
                          <span className="contact-title align-self-center">
                            {currentBuyerData.first_name +
                              " " +
                              currentBuyerData.last_name}
                          </span>
                        </a>
                      </div>
                      <div className="contact-update-item">
                        <a href={"tel:+1" + currentBuyerData.phone}>
                          <span className="icon">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_2365_13352)">
                                <path
                                  d="M15.0945 14.7566C15.0476 14.2828 14.7937 13.8595 14.3977 13.5953L11.7131 11.8058C11.0864 11.3881 10.2485 11.4726 9.7165 12.0035L8.85854 12.8687C8.66336 12.9367 7.76061 12.5541 6.59828 11.3912C5.43545 10.2279 5.05798 9.33283 5.10741 9.15465L5.98751 8.27455C6.51897 7.7431 6.60239 6.90314 6.18526 6.27796L4.3957 3.59336C4.1315 3.19732 3.70819 2.94346 3.23442 2.8966C2.7596 2.84921 2.29716 3.01606 1.96085 3.35236L0.633212 4.68C-1.18623 6.49944 1.18323 10.4978 4.33801 13.6531C6.48275 15.7978 11.1762 19.4953 13.3111 17.3579L14.6387 16.0302C14.975 15.6944 15.1413 15.2299 15.0945 14.7566Z"
                                  fill="url(#paint0_linear_2365_13352)"
                                />
                                <path
                                  d="M10.0898 0C9.79836 0 9.5625 0.235863 9.5625 0.527344C9.5625 0.818824 9.79836 1.05469 10.0898 1.05469C13.8698 1.05469 16.9453 4.13016 16.9453 7.91016C16.9453 8.20164 17.1812 8.4375 17.4727 8.4375C17.7641 8.4375 18 8.20164 18 7.91016C18 3.54825 14.4517 0 10.0898 0ZM10.0898 2.10938C9.79836 2.10938 9.5625 2.34524 9.5625 2.63672C9.5625 2.9282 9.79836 3.16406 10.0898 3.16406C12.707 3.16406 14.8359 5.29302 14.8359 7.91016C14.8359 8.20164 15.0718 8.4375 15.3633 8.4375C15.6548 8.4375 15.8906 8.20164 15.8906 7.91016C15.8906 4.71161 13.2884 2.10938 10.0898 2.10938ZM10.0898 4.21875C9.79836 4.21875 9.5625 4.45461 9.5625 4.74609C9.5625 5.03757 9.79836 5.27344 10.0898 5.27344C11.5437 5.27344 12.7266 6.45634 12.7266 7.91016C12.7266 8.20164 12.9624 8.4375 13.2539 8.4375C13.5454 8.4375 13.7812 8.20164 13.7812 7.91016C13.7812 5.87493 12.1251 4.21875 10.0898 4.21875ZM10.0898 6.32812C9.79836 6.32812 9.5625 6.56399 9.5625 6.85547C9.5625 7.14695 9.79836 7.38281 10.0898 7.38281C10.3808 7.38281 10.6172 7.6192 10.6172 7.91016C10.6172 8.20164 10.8531 8.4375 11.1445 8.4375C11.436 8.4375 11.6719 8.20164 11.6719 7.91016C11.6719 7.03779 10.9622 6.32812 10.0898 6.32812Z"
                                  fill="url(#paint1_linear_2365_13352)"
                                />
                              </g>
                              <defs>
                                <linearGradient
                                  id="paint0_linear_2365_13352"
                                  x1="7.55112"
                                  y1="18.0009"
                                  x2="7.55112"
                                  y2="2.88862"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#5558FF" />
                                  <stop offset="1" stopColor="#00C0FF" />
                                </linearGradient>
                                <linearGradient
                                  id="paint1_linear_2365_13352"
                                  x1="13.7812"
                                  y1="8.4375"
                                  x2="13.7812"
                                  y2="0"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stopColor="#ADDCFF" />
                                  <stop offset="0.5028" stopColor="#EAF6FF" />
                                  <stop offset="1" stopColor="#EAF6FF" />
                                </linearGradient>
                                <clipPath id="clip0_2365_13352">
                                  <rect width="18" height="18" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </span>
                          <span className="contact-title align-self-center">
                            {formatInput(currentBuyerData.phone)}
                          </span>
                          {(currentBuyerData.phone_verified) &&
                            <OverlayTrigger
                              placement="top"
                              style={{ backgroundColor: "green" }}
                              overlay={
                                <Tooltip>
                                  Verified
                                </Tooltip>
                              }
                            >
                              <img src='/assets/images/ver-check-blue.svg' className="img-fluid" />
                            </OverlayTrigger>
                          }
                        </a>
                      </div>
                      <div className="contact-update-item">
                        <a href={"mailto:" + currentBuyerData.email}>
                          <span className="icon">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.4346 14.3299L2.91709 8.27314C2.42505 7.94774 2.08048 7.44213 1.95758 6.86517C1.83468 6.28821 1.94329 5.68606 2.26001 5.18839C2.57673 4.69072 3.07622 4.33734 3.65094 4.20434C4.22566 4.07134 4.82961 4.16937 5.33276 4.47732L12.3153 8.92054L18.5846 4.53192C19.0737 4.20046 19.6736 4.07471 20.2547 4.18182C20.8357 4.28893 21.3514 4.62032 21.6902 5.10439C22.0289 5.58847 22.1637 6.18639 22.0654 6.76901C21.9671 7.35162 21.6435 7.87218 21.1646 8.21824L12.4346 14.3299Z"
                                fill="#EA4435"
                              />
                              <path
                                d="M20.625 19.875H17.625V6.375C17.625 5.77826 17.8621 5.20597 18.284 4.78401C18.706 4.36205 19.2783 4.125 19.875 4.125C20.4717 4.125 21.044 4.36205 21.466 4.78401C21.8879 5.20597 22.125 5.77826 22.125 6.375V18.375C22.125 18.7728 21.967 19.1544 21.6857 19.4357C21.4044 19.717 21.0228 19.875 20.625 19.875Z"
                                fill="#00AC47"
                              />
                              <path
                                d="M22.0925 6.04884C22.0859 6.00384 22.0864 5.95787 22.077 5.91294C22.0626 5.84409 22.0358 5.78049 22.0153 5.71404C21.9954 5.63799 21.9714 5.56305 21.9434 5.48957C21.9284 5.45394 21.9053 5.42267 21.8883 5.38802C21.8416 5.28804 21.7876 5.19165 21.7268 5.09964C21.6968 5.05607 21.6593 5.01894 21.6261 4.97769C21.5692 4.90272 21.5077 4.83136 21.442 4.76402C21.3921 4.71549 21.3353 4.67492 21.281 4.63119C21.2234 4.58178 21.1633 4.5353 21.101 4.49192C21.0416 4.45307 20.9765 4.42314 20.9135 4.38999C20.8472 4.35542 20.7823 4.31777 20.7133 4.29017C20.6466 4.26332 20.5755 4.24622 20.5058 4.22574C20.4362 4.20527 20.3669 4.18074 20.2953 4.16747C20.2067 4.15323 20.1173 4.14421 20.0276 4.14047C19.9706 4.13649 19.9142 4.12652 19.8571 4.12697C19.751 4.13006 19.6452 4.14071 19.5407 4.15884C19.4984 4.16514 19.4559 4.16462 19.414 4.17332C19.2725 4.21656 19.1313 4.26106 18.9906 4.30682C18.952 4.32332 18.9182 4.34784 18.8807 4.36644C18.4999 4.54416 18.1786 4.82838 17.9558 5.18476C17.7331 5.54114 17.6182 5.95442 17.6253 6.37464V10.6961L21.1653 8.21792C21.5129 7.98461 21.7855 7.65556 21.95 7.27057C22.1145 6.88559 22.1641 6.46132 22.0925 6.04884Z"
                                fill="#FFBA00"
                              />
                              <path
                                d="M4.125 4.125C4.72174 4.125 5.29403 4.36205 5.71599 4.78401C6.13795 5.20597 6.375 5.77826 6.375 6.375V19.875H3.375C2.97718 19.875 2.59564 19.717 2.31434 19.4357C2.03304 19.1544 1.875 18.7728 1.875 18.375V6.375C1.875 5.77826 2.11205 5.20597 2.53401 4.78401C2.95597 4.36205 3.52826 4.125 4.125 4.125Z"
                                fill="#4285F4"
                              />
                              <path
                                d="M1.90883 6.04937C1.91543 6.00437 1.9149 5.95839 1.92428 5.91347C1.93868 5.84462 1.96545 5.78102 1.986 5.71457C2.00592 5.63854 2.02991 5.56363 2.05785 5.49017C2.07285 5.45454 2.09595 5.42327 2.11305 5.38862C2.15969 5.2886 2.21369 5.19219 2.2746 5.10017C2.3046 5.05659 2.3421 5.01947 2.37525 4.97822C2.43212 4.90325 2.49358 4.83189 2.5593 4.76454C2.60918 4.71602 2.66603 4.67544 2.72033 4.63172C2.77794 4.58229 2.83802 4.5358 2.90033 4.49244C2.9598 4.45359 3.0249 4.42367 3.08783 4.39052C3.15286 4.35374 3.21969 4.32024 3.28808 4.29017C3.35483 4.26332 3.42593 4.24622 3.49553 4.22574C3.56513 4.20527 3.6345 4.18074 3.70605 4.16747C3.7947 4.15323 3.8841 4.14422 3.9738 4.14047C4.0308 4.13649 4.08713 4.12652 4.14428 4.12697C4.25038 4.13006 4.35612 4.14071 4.4607 4.15884C4.50293 4.16514 4.54545 4.16462 4.58745 4.17332C4.66005 4.19182 4.73165 4.21405 4.80195 4.23992C4.87265 4.25871 4.94237 4.28104 5.01083 4.30682C5.04938 4.32332 5.0832 4.34784 5.1207 4.36644C5.21792 4.41212 5.31172 4.46475 5.40135 4.52394C5.70183 4.73026 5.94757 5.00661 6.11736 5.32914C6.28715 5.65167 6.37589 6.01068 6.3759 6.37517V10.6967L2.8359 8.21859C2.48834 7.98522 2.21582 7.65616 2.05129 7.2712C1.88677 6.88624 1.83729 6.46186 1.90883 6.04937Z"
                                fill="#C52528"
                              />
                            </svg>
                          </span>
                          <span className="contact-title align-self-center">
                            {currentBuyerData.email}
                          </span>
                          {(currentBuyerData.email_verified) &&
                            <OverlayTrigger
                              placement="top"
                              style={{ backgroundColor: "green" }}
                              overlay={
                                <Tooltip>
                                  Verified
                                </Tooltip>
                              }
                            >
                              <img src='/assets/images/ver-check-blue.svg' className="img-fluid" />
                            </OverlayTrigger>
                          }
                        </a>
                      </div>
                      <div className="contact-update-item">
                        <a href={void (0)}>
                          <span className="icon">
                            <img src="/assets/images/building-1.svg" />
                          </span>
                          <span className="contact-title align-self-center">
                            {currentBuyerData.company_name}
                          </span>
                        </a>
                      </div>
                      <div className="update-profile">
                        <Link to={`/buyer/edit-profile/${profileId}`} className="btn btn-fill">Edit Profile</Link>
                        <Link href="javascript:void(0);" onClick={() => handleDocumentsReverify()} className="btn btn-outline-gray">Documents Reverify</Link>
                      </div>
                      {/* <div className="update-profile">
                        {(currentBuyerData.is_profile_updatable || currentBuyerData.is_buyer_verified) ? (
                          <Link to={`/buyer/edit-profile/${profileId}`} className="btn btn-fill">Edit Profile</Link>
                        ) : (
                          <button onClick={handleProfileUpdateLocked} className="btn btn-fill">Edit Profile</button>
                        )}
                        <Link href="javascript:void(0);" onClick={() => handleDocumentsReverify()} className="btn btn-outline-gray">Documents Reverify</Link>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-8">
                  <div className="contact-detail">
                    <div className="row align-items-center">
                      <div className="col-12 col-lg-6">
                        <div className="profile-data">
                          <div className="profile-img">
                            <img
                              src={
                                currentBuyerData.profile_image != ""
                                  ? currentBuyerData.profile_image
                                  : "/assets/images/avtar-big.png"
                              }
                              className="img-fluid"
                              alt=""
                              title=""
                            />
                          </div>
                          <div className="profile-data-content">
                            <h3>
                              {currentBuyerData.first_name +
                                " " +
                                currentBuyerData.last_name}
                              {(currentBuyerData.is_buyer_verified) ?
                                <OverlayTrigger placement="top" style={{ backgroundColor: "green" }} overlay={<Tooltip> Profile Verified </Tooltip>}>
                                  <img src="/assets/images/p-verfied.svg" className="img-fluid ms-1" alt="" title="" />
                                </OverlayTrigger>
                                :
                                ''}
                            </h3>
                            <p className="mb-0">
                              {currentBuyerData.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="swittcher-area">
                          <div className="inswittcher">
                            <label>
                              active
                              <input type="checkbox" id="buyer-status" onChange={handleClickConfirmation} defaultChecked={(currentBuyerData.buyer_search_status == 0) ? 'checked' : ''} />
                              <span></span>
                              Inactive
                            </label>
                          </div>
                        </div>
                        <div className="component-group">
                          <div className="premium-quality">
                            {currentBuyerData.profile_tag_name &&
                              <OverlayTrigger
                                placement="top"
                                style={{ backgroundColor: "green" }}
                                overlay={<Tooltip> Profile Tag </Tooltip>}>
                                <div className="town-div">
                                  <span>
                                    {(currentBuyerData.profile_tag_image) && <img
                                      src={currentBuyerData.profile_tag_image}
                                      className="img-fluid profile-tag-image"
                                      alt=""
                                      title=""
                                    />
                                    }
                                  </span>
                                  {currentBuyerData.profile_tag_name}
                                </div>
                              </OverlayTrigger>
                            }
                          </div>
                          <div className="field-box call-darea">
                            <OverlayTrigger
                              placement="top"
                              style={{ backgroundColor: "green" }}
                              overlay={<Tooltip> Contact Preference </Tooltip>}>
                              <div className="inner-call-box">
                                <span>preference</span>
                                <div className="dropdown">
                                  <button
                                    className="btn dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <span className="commentic">
                                      {(buttonLoader) ?
                                        <MiniLoader />
                                        :
                                        <img
                                          src={
                                            profileIcons[
                                            currentBuyerData.contact_value
                                            ]
                                          }
                                        />
                                      }

                                    </span>
                                    <span className="dropdown-arr">
                                      <svg
                                        width="10"
                                        height="6"
                                        viewBox="0 0 10 6"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M1 1L5 5L9 1"
                                          stroke="#464B70"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </span>
                                  </button>
                                  <ul
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton1"
                                  >
                                    <li
                                      className="profile-status"
                                      onClick={() => contactPreferanceUpdate(1)}
                                    >
                                      <a className="dropdown-item" href={void 0}>
                                        Email
                                        {currentBuyerData.contact_value === 1 ? (
                                          <span className="markedChecked">✓</span>
                                        ) : (
                                          ""
                                        )}
                                      </a>
                                    </li>
                                    <li
                                      className="profile-status"
                                      onClick={() => contactPreferanceUpdate(2)}
                                    >
                                      <a className="dropdown-item" href={void 0}>
                                        Text
                                        {currentBuyerData.contact_value === 2 ? (
                                          <span className="markedChecked">✓</span>
                                        ) : (
                                          ""
                                        )}
                                      </a>
                                    </li>
                                    <li
                                      className="profile-status"
                                      onClick={() => contactPreferanceUpdate(3)}
                                    >
                                      <a className="dropdown-item" href={void 0}>
                                        Call
                                        {currentBuyerData.contact_value === 3 ? (
                                          <span className="markedChecked">✓</span>
                                        ) : (
                                          ""
                                        )}
                                      </a>
                                    </li>
                                    <li
                                      className="profile-status"
                                      onClick={() => contactPreferanceUpdate(4)}
                                    >
                                      <a className="dropdown-item" href={void 0}>
                                        No Preference
                                        {currentBuyerData.contact_value === 4 ? (
                                          <span className="markedChecked">✓</span>
                                        ) : (
                                          ""
                                        )}
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </OverlayTrigger>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="contact-desc-box">
                    <Tab.Container defaultActiveKey={`buyer_profile_${profileId}`}>
                      <Nav variant="pills">
                        {profileBuyerList.length > 0 && profileBuyerList.map((data, index) => {
                          return (
                            <Nav.Item key={index} >
                              <Nav.Link eventKey={`buyer_profile_${data.key}`} onClick={() => { setProfileId(data.key) }}>
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                    <path d="M10 0L0 10.7253H3.16419V19H7.93336V13.9079H12.0666V19H16.8358V10.7253H20L10 0Z" fill="url(#paint0_linear_546_7436)" />
                                    <defs>
                                      <linearGradient id="paint0_linear_546_7436" x1="10" y1="0" x2="10" y2="19.3889" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#466AFF" />
                                        <stop offset="1" stopColor="#06ACFF" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </span>
                                {data.value}
                              </Nav.Link>
                            </Nav.Item>
                          )
                        })}
                      </Nav>
                      <Tab.Content>
                         {/* <div className="text-end">
                          {(currentBuyerData.is_profile_updatable || currentBuyerData.is_buyer_verified) ? (
                            <Link to={`/buyer/edit-profile/${profileId}`}>
                              <span className="buyer_multi_profile_edit">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                  <path d="M8.67949 2.08847L1.93867 8.8281C1.67891 9.08782 1.43215 9.59427 1.3802 9.95787L1.01653 12.5291C0.886652 13.464 1.53605 14.1133 2.47119 13.9835L5.0428 13.6199C5.40647 13.5679 5.91304 13.3212 6.1728 13.0615L12.9136 6.32184C14.0695 5.1661 14.628 3.81558 12.9136 2.10145C11.1992 0.37434 9.84841 0.919747 8.67949 2.08847Z" stroke="#292D32" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M7.7207 3.04956C8.29218 5.08833 9.88971 6.69857 11.9418 7.26995" stroke="#292D32" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </Link>
                          ) : (
                            <span className="buyer_multi_profile_edit" onClick={handleProfileUpdateLocked} style={{ cursor: "pointer" }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <path d="M8.67949 2.08847L1.93867 8.8281C1.67891 9.08782 1.43215 9.59427 1.3802 9.95787L1.01653 12.5291C0.886652 13.464 1.53605 14.1133 2.47119 13.9835L5.0428 13.6199C5.40647 13.5679 5.91304 13.3212 6.1728 13.0615L12.9136 6.32184C14.0695 5.1661 14.628 3.81558 12.9136 2.10145C11.1992 0.37434 9.84841 0.919747 8.67949 2.08847Z" stroke="#292D32" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.7207 3.04956C8.29218 5.08833 9.88971 6.69857 11.9418 7.26995" stroke="#292D32" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          )}
                        </div> */}
                        <div className="text-end">
                          <Link to={`/buyer/edit-profile/${profileId}`}>
                            <span className="buyer_multi_profile_edit">
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <path d="M8.67949 2.08847L1.93867 8.8281C1.67891 9.08782 1.43215 9.59427 1.3802 9.95787L1.01653 12.5291C0.886652 13.464 1.53605 14.1133 2.47119 13.9835L5.0428 13.6199C5.40647 13.5679 5.91304 13.3212 6.1728 13.0615L12.9136 6.32184C14.0695 5.1661 14.628 3.81558 12.9136 2.10145C11.1992 0.37434 9.84841 0.919747 8.67949 2.08847Z" stroke="#292D32" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.7207 3.04956C8.29218 5.08833 9.88971 6.69857 11.9418 7.26995" stroke="#292D32" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </Link>
                        </div>
                        <Tab.Pane eventKey={`buyer_profile_${profileId}`}>
                          <ul className="buyer_profile_details">
                            <li>
                              <label>Address</label>
                              <p>{getLastAddress(currentProfileData.address)}</p>
                            </li>
                            <li>
                              <label>Company/LLC</label>
                              <p>{currentProfileData.company_name}</p>
                            </li>
                            <li>
                              <label>MLS Status</label>
                              <p>{getLabelValue(currentProfileData.market_preferance)}</p>
                            </li>
                            <li>
                              <label>Contact Preference</label>
                              <p>{getLabelValue(currentProfileData.contact_preferance)}</p>
                            </li>
                            <li>
                              <label>Property Type</label>
                              <p>{getLabelValue(currentProfileData.property_type)}</p>
                            </li>
                            <li>
                              <label>Purchase Method</label>
                              <p>{getLabelValue(currentProfileData.purchase_method)}</p>
                            </li>
                          </ul>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />


      <Modal show={documentsReverify} onHide={() => setDocumentsReverify(false)} centered className="upload_document">
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className='space_modal'>
          <form method='post' onSubmit={handleSubmit(submitSingleBuyerForm)}
          >
            <div className='documents_reverify_inner'>
              {errors.first_name && (<p className="error">{errors.first_name?.message}</p>)}
              <label className='offer_label mb-3'>Upload Documents</label>
              <div className="documents_upload_box">
                <input type="file" name="bank_statement_pdf" {...register("bank_statement_pdf", {
                  required: "File is required",
                  validate: {
                    size: (files) =>
                      files[0]?.size < 15 * 1024 * 1024 || "File size should be less than 15MB",
                    type: (files) =>
                      ["application/pdf"].includes(files[0]?.type) ||
                      "Only PDF files are allowed",
                  },
                })} />

                {selectedFile ? selectedFile.name : <img src="/assets/images/file-icon.svg" />}
                <button className="btn btn-fill w-auto">Select Documents</button>
              </div>
              {errors.bank_statement_pdf && <p style={{ color: "red" }}>{errors.bank_statement_pdf.message}</p>}
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-fill w-auto">upload</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default BuyerProfile;
