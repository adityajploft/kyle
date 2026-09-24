import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import BuyerHeader from "../../partials/BuyerHeader";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { useNavigate, Link } from "react-router-dom";
import { useFormError } from "../../hooks/useFormError";
import Select from "react-select";
const Support = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { getTokenData, setLogout, getLocalStorageUserdata } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { setErrors, renderFieldError } = useFormError();
  const [contactPreferenceOption, setContactPreferenceOption] = useState([]);
  const isLogin = getLocalStorageUserdata();
  const handleCustum = (e, name) => { };
  // const submitSupportForm = async (data, e) => {
  //   try {
  //     let headers = {
  //       Accept: "application/json",
  //       Authorization: "Bearer " + getTokenData().access_token,
  //       "auth-token": getTokenData().access_token,
  //     };
  //     const apiUrl = process.env.REACT_APP_API_URL;
  //     var formData = new FormData(e.target);
  //     let formObject = Object.fromEntries(formData.entries());
  //     let response = await axios.post(apiUrl + "support", formObject, {
  //       headers: headers,
  //     });
  //     if (response) {
  //       setLoading(false);
  //       if (response.data.status) {
  //         toast.success(response.data.message, {
  //           position: toast.POSITION.TOP_RIGHT,
  //         });
  //         if (isLogin.role === 3) {
  //           navigate("/buyer/profile");
  //         } else {
  //           navigate("/");
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     if (error.response) {
  //       if (error.response.status === 401) {
  //         setLogout();
  //         //navigate('/login');
  //       }
  //       if (error.response.data.validation_errors) {loading
  //         setErrors(error.response.data.validation_errors);
  //       }
  //       if (error.response.data.errors) {
  //         setErrors(error.response.errors);
  //       }
  //       if (error.response.data.error) {
  //         toast.error(error.response.data.error, {
  //           position: toast.POSITION.TOP_RIGHT,
  //         });
  //       }
  //     }
  //   }
  // };

  const submitSupportForm = async (data, e) => {
    try {
      setLoading(true); // ✅ start loading

      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };

      const apiUrl = process.env.REACT_APP_API_URL;

      var formData = new FormData(e.target);
      let formObject = Object.fromEntries(formData.entries());

      // ✅ FIX: send react-select value
      formObject.contact_preferance = data.contact_preferance?.value;

      let response = await axios.post(apiUrl + "support", formObject, {
        headers: headers,
      });

      setLoading(false);

      if (response?.data?.status) {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });

        if (isLogin.role === 3) {
          navigate("/buyer/profile");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);

      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }

        if (error.response.data.validation_errors) {
          setErrors(error.response.data.validation_errors);
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
  // const getContactPreference = async () => {
  //   try {
  //     // setLoading(true);
  //     setPageLoading(true);
  //     let headers = {
  //       Accept: "application/json",
  //       Authorization: "Bearer " + getTokenData().access_token,
  //       "auth-token": getTokenData().access_token,
  //     };
  //     const apiUrl = process.env.REACT_APP_API_URL;
  //     let result = await axios.get(apiUrl + "get-contact-preferance", {
  //       headers: headers,
  //     });
  //     setContactPreferenceOption(result.data.result.contact_preferances);
  //     // setLoading(false);
  //     setPageLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     if (error.response) {
  //       if (error.response.status === 401) {
  //         setLogout();
  //         navigate("/login");
  //       }
  //       if (error.response.data.validation_errors) {
  //         setErrors(error.response.data.validation_errors);
  //       }
  //       if (error.response.data.errors) {
  //         setErrors(error.response.errors);
  //       }
  //       if (error.response.data.error) {
  //         toast.error(error.response.data.error, {
  //           position: toast.POSITION.TOP_RIGHT,
  //         });
  //       }
  //     }
  //   }
  // };

  const getContactPreference = async () => {
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };

      const apiUrl = process.env.REACT_APP_API_URL;

      let result = await axios.get(apiUrl + "get-contact-preferance", {
        headers: headers,
      });

      setContactPreferenceOption(result.data.result.contact_preferances);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
          navigate("/login");
        }

        if (error.response.data.validation_errors) {
          setErrors(error.response.data.validation_errors);
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

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchBuyerData = async () => {
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
      };

      const response = await axios.get(`${apiUrl}edit-buyer`, {
        headers,
      });

      if (response.data.status) {
        const buyer = response.data.buyer;

        setValue("name", buyer.name);
        setValue("email", buyer.email);
        setValue("phone_number", buyer.phone);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setLogout();
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);

      await Promise.all([
        getContactPreference(),
        fetchBuyerData()
      ]);

      setPageLoading(false);
    };

    loadData();
  }, []);

  // const fetchBuyerData = async () => {
  //   try {
  //     let headers = {
  //       Accept: "application/json",
  //       Authorization: "Bearer " + getTokenData().access_token,
  //     };

  //     const response = await axios.get(`${apiUrl}edit-buyer`, {
  //       headers,
  //     });

  //     if (response.data.status) {
  //       const buyer = response.data.buyer;
  //       setValue("name", buyer.name);
  //       setValue("email", buyer.email);
  //       setValue("phone_number", buyer.phone);
  //     }
  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //       setLogout();
  //     }
  //   }
  // };

  // useEffect(() => {
  //   getContactPreference();
  //   fetchBuyerData();
  // }, []);
  // console.log(isLogin, "isLogin");
  return (
    <>
      {isLogin != "" ? isLogin.role === 3 ? <BuyerHeader /> : <Header /> : ""}
      <section className="main-section position-relative pt-4 pb-0">
        {pageLoading ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img alt="loader" src="../../../assets/images/loader.svg" />
          </div>
        ) : (
          <div className="container position-relative pat-40">
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
                <div className="col-4 col-sm-4 col-md-4 col-lg-4 align-self-center">
                  <h6 className="center-head fs-3 text-center mb-0">Support</h6>
                </div>
              </div>
            </div>

            <div className="card-box support-inner">
              <form
                method="post"
                className="support-account"
                autoComplete="off"
                onSubmit={handleSubmit(submitSupportForm)}
              >
                <div className="row align-items-center">
                  <div className="col-12 col-xxl-5 col-lg-6 col-md-8 mx-auto col-sm-9 col-11 mb-lg-0 mb-5">
                    <div className="supportImg pe-xxl-0 pe-xl-5">
                      <img
                        alt="support"
                        src="/assets/images/support.svg"
                        className="img-fluid"
                      />
                    </div>
                  </div>
                  <div className="col-12 ms-xxl-auto col-lg-6">
                    <div className="card-box-inner card-box-blocks bg-white p-0">
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <div className="form-group">
                            <label>
                              Name<span>*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              className="form-control-form"
                              placeholder="Enter Your Name"
                              autoComplete="off"
                              {...register("name", {
                                required: "Name is required",
                                validate: {
                                  maxLength: (v) =>
                                    v.length <= 50 ||
                                    "The Name should have at most 50 characters",
                                  matchPattern: (v) =>
                                    /^[a-zA-Z\s]+$/.test(v) ||
                                    "Name can not include number or special character",
                                },
                              })}
                            />
                            {errors.name && (
                              <p className="error">{errors.name?.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="col-12 col-sm-6">
                          <div className="form-group">
                            <label>
                              Email<span>*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              className="form-control-form"
                              placeholder="Enter Your Email"
                              autoComplete="off"
                              {...register("email", {
                                required: "Email Address is required",
                                validate: {
                                  maxLength: (v) =>
                                    v.length <= 50 ||
                                    "The Email Address should have at most 50 characters",
                                  matchPattern: (v) =>
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                                      v
                                    ) ||
                                    "Email Address must be a valid address",
                                },
                              })}
                            />
                            {errors.email && (
                              <p className="error">{errors.email?.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="col-12 col-sm-6">
                          <div className="form-group">
                            <label>
                              Phone Number<span>*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">+1</span>
                              <input
                                type="text"
                                name="phone_number"
                                className="form-control"
                                placeholder="Enter Contact Number"
                                {...register("phone_number", {
                                  required: "Phone Number is required",
                                  validate: {
                                    matchPattern: (v) =>
                                      /^[0-9]\d*$/.test(v) ||
                                      "Please enter valid phone number",
                                    maxLength: (v) =>
                                      (v.length <= 15 && v.length >= 5) ||
                                      "The phone number should be more than 4 digit and less than equal 15",
                                  },
                                })}
                              />
                              {errors.phone_number && (
                                <p className="error">
                                  {errors.phone_number?.message}
                                </p>
                              )}
                              {renderFieldError("phone_number")}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6">
                          <div className="form-group">
                            <label>
                              Contact Preference<span>*</span>
                            </label>
                            <Controller
                              control={control}
                              name="contact_preferance"
                              rules={{
                                required: "Contact Preference is required",
                              }}
                              render={({
                                field: { value, onChange, name },
                              }) => (
                                <Select
                                  options={contactPreferenceOption}
                                  name={name}
                                  className="select"
                                  placeholder="Select Contact Preference"
                                  isClearable={true}
                                  onChange={(e) => {
                                    onChange(e);
                                    handleCustum(e, "contact_preferance");
                                  }}
                                />
                              )}
                            />
                            {errors.contact_preferance && (
                              <p className="error">
                                {errors.contact_preferance?.message}
                              </p>
                            )}
                            {renderFieldError("contact_preferance")}
                          </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-12">
                          <div className="form-group">
                            <label>
                              Message<span>*</span>
                            </label>
                            <textarea
                              name="message"
                              className="formcontrol form-control-form support-textarea"
                              id="exampleFormControlTextarea6"
                              autoComplete="off"
                              rows="3"
                              placeholder="Write something here..."
                              {...register("message", {
                                required: "Message is required",
                              })}
                            ></textarea>
                            {errors.message && (
                              <p className="error">{errors.message?.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="save-btn mt-3">
                        {/* <button type="submit" className="btn btn-fill">
                          Submit
                        </button> */}
                        <button
                          type="submit"
                          className="btn btn-fill"
                          disabled={loading}
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </button>
                      </div>
                    </div>
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
export default Support;
