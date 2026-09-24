import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const RepCodeRequestForm = ({ role }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { getTokenData, setLogout } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;

  const roleConfig = useMemo(() => {
    if (role === "seller") {
      return {
        subtitle: "REP code request form",
        backLink: "/seller/home",
        successRedirect: "/seller/home",
      };
    }

    return {
      subtitle: "REP code request form",
      backLink: "/buyer/dashboard",
      successRedirect: "/buyer/dashboard",
    };
  }, [role]);

  // const socialFields = [
  //   { name: "facebook", label: "Facebook", placeholder: "facebook", icon: "/assets/images/greyfacebook.svg" },
  //   { name: "twitter", label: "Twitter", placeholder: "twitter", icon: "/assets/images/gyeytwitter.svg" },
  //   // { name: "website", label: "Website", placeholder: "website" },
  //   { name: "instagram", label: "Instagram", placeholder: "instagram", icon: "/assets/images/greyinstagram.svg" },
  //   { name: "snapchat", label: "Snapchat", placeholder: "snapchat", icon: "/assets/images/greysnapchat.svg" },
  //   { name: "tiktok", label: "TikTok", placeholder: "tiktok", icon: "/assets/images/greytiktok.svg" },
  //   { name: "redit", label: "Reddit", placeholder: "redit", icon: "/assets/images/greyreddit.svg" },
  // ];
  const socialFields = [
    {
      name: "facebook",
      label: "Facebook",
      placeholder: "facebook",
      icon: "/assets/images/greyfacebook.svg",
    },
    {
      name: "twitter",
      label: "Twitter",
      placeholder: "twitter",
      icon: "/assets/images/gyeytwitter.svg",
    },
    {
      name: "instagram",
      label: "Instagram",
      placeholder: "instagram",
      icon: "/assets/images/greyinstagram.svg",
    },
    {
      name: "snapchat",
      label: "Snapchat",
      placeholder: "snapchat",
      icon: "/assets/images/greysnapchat.svg",
    },
    {
      name: "tiktok",
      label: "TikTok",
      placeholder: "tiktok",
      icon: "/assets/images/greytiktok.svg",
    },
    {
      name: "redit",
      label: "Reddit",
      placeholder: "reddit",
      icon: "/assets/images/greyreddit.svg",
    },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: socialFields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {}),
  });

  useEffect(() => {
    const fetchSocialProfile = async () => {
      try {
        setLoading(true);
        const headers = {
          Accept: "application/json",
          Authorization: "Bearer " + getTokenData().access_token,
          "auth-token": getTokenData().access_token,
        };

        // Fetch current social profile data to make the form dynamic
        const response = await axios.get(`${apiUrl}get-user-social-profile`, { headers });

        console.log(response, "sjdaslkl")

        if (response.data.status && response.data.data) {
          const profileData = response.data.data;
          socialFields.forEach(field => {
            if (profileData[field.name]) {
              setValue(field.name, profileData[field.name]);
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch social profile:", error);
        toast.error(error, "error")
        if (error.response?.status === 401) {
          setLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSocialProfile();
  }, []);

  // const onSubmit = async (data) => {
  //   setLoading(true);
  //   try {
  //     const headers = {
  //       Accept: "application/json",
  //       Authorization: "Bearer " + getTokenData().access_token,
  //       "auth-token": getTokenData().access_token,
  //     };

  //     const response = await axios.post(`${apiUrl}update-user-social-profile`, data, { headers });

  //     if (response.data.status) {
  //       toast.success(response.data.message || "Social profile updated successfully.", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       navigate(roleConfig.successRedirect, { replace: true });
  //     } else {
  //       toast.error(response.data.message || "Something went wrong.", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       if (error.response.status === 401) {
  //         setLogout();
  //       }
  //       const errorMessage = error.response.data.message || error.response.data.error || "Failed to update social profile.";
  //       toast.error(errorMessage, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     } else {
  //       toast.error("Network error. Please try again.", {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const token = getTokenData()?.access_token;

      if (!token) {
        toast.error("Session expired. Please login again.");
        setLogout();
        return;
      }

      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "auth-token": token,
      };

      const response = await axios.post(
        `${apiUrl}update-user-social-profile`,
        data,
        {
          headers,
          timeout: 15000, // optional timeout
        }
      );

      // Response success check
      if (response?.status === 200 && response?.data?.status) {
        toast.success(
          response.data.message || "Social profile updated successfully.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );

        navigate(roleConfig.successRedirect, { replace: true });

      } else {
        // API returned failed status
        toast.error(
          response?.data?.message ||
          "Unable to update social profile.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }

    } catch (error) {
      console.error("Update profile error:", error);

      // Unauthorized
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        setLogout();
        return;
      }

      // Validation errors
      if (error.response?.status === 422) {
        const errors = error.response?.data?.errors;

        if (errors) {
          Object.keys(errors).forEach((key) => {
            toast.error(errors[key][0]);
          });
        } else {
          toast.error(
            error.response?.data?.message || "Validation failed."
          );
        }

        return;
      }

      // Server error
      if (error.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
        return;
      }

      // Network / timeout error
      if (error.code === "ECONNABORTED") {
        toast.error("Request timeout. Please try again.");
        return;
      }

      // No internet
      if (!error.response) {
        toast.error("Network error. Check your internet connection.");
        return;
      }

      // Fallback error
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="main-section position-relative pt-5 pb-5">
      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            <div className="seller-dash-card">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <p className="mb-2 text-uppercase" style={{ letterSpacing: "0.12em", color: "#3f53fe", fontWeight: 700 }}>
                    Social Profile
                  </p>
                  <h3 className="mb-2" style={{ color: "#1d2246", fontWeight: 800 }}>
                    Update Your Social Presence
                  </h3>
                  <p className="mb-0" style={{ color: "#6b7280" }}>
                    {roleConfig.subtitle}
                  </p>
                </div>
                <Link to={roleConfig.backLink} className="inner_boost_btn">
                  Back
                </Link>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                  {socialFields.map((field, index) => (
                    <div className="col-12 col-md-6" key={field.name}>
                      <label className="form-label fw-600 mb-2" htmlFor={field.name}>
                        {field.label}
                      </label>
                      <div className="form-group-inner d-flex align-items-center gap-3">
                        <span
                          className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            backgroundColor: "#f6f8fc",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <img
                            src={field.icon}
                            alt={`${field.label} icon`}
                            style={{ width: "20px", height: "20px", objectFit: "contain" }}
                          />
                        </span>
                        {/* <input
                          type="text"
                          id={field.name}
                          className="form-control"
                          placeholder={field.placeholder}
                          disabled={loading}
                          {...register(field.name, {
                            required: index < 2 ? `${field.label} is required` : false,
                          })}
                        /> */}
                        <input
                          type="url"
                          id={field.name}
                          className="form-control"
                          placeholder={`${field.placeholder}`}
                          disabled={loading}
                          {...register(field.name, {
                            required: index < 2 ? `${field.label} link is required` : false,

                            pattern: {
                              value:
                                /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/,
                              message: `Please enter a valid ${field.label} URL`,
                            },

                            validate: (value) => {
                              if (!value) return true;

                              const socialPatterns = {
                                facebook: /facebook\.com/i,
                                twitter: /(twitter|x)\.com/i,
                                instagram: /instagram\.com/i,
                                snapchat: /snapchat\.com/i,
                                tiktok: /tiktok\.com/i,
                                redit: /reddit\.com/i,
                              };

                              return socialPatterns[field.name]?.test(value)
                                ? true
                                : `Please enter a valid ${field.label} profile link`;
                            },
                          })}
                        />
                      </div>
                      {errors[field.name] && (
                        <p className="error mb-0 mt-2">{errors[field.name]?.message}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="d-flex flex-wrap justify-content-end gap-3 mt-4">
                  <button
                    type="submit"
                    className="btn btn-fill"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RepCodeRequestForm;
