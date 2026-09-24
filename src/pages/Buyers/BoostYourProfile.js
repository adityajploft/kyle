import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import BuyerHeader from "../../partials/BuyerHeader";
import { useAuth } from "../../hooks/useAuth";
import {Link } from "react-router-dom";
import MiniLoader from "../../partials/MiniLoader";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../../partials/Footer";
import Swal from "sweetalert2";

const BoostYourProfile = () => {
  const { getTokenData, setLogout } = useAuth();
  const [plans, setPlans] = useState("");
  const [loader, setLoader] = useState(true);
  const [miniButtonLoader, setMiniButtonLoader] = useState('');
  const location = useLocation();


  const fetchBuyerPlans = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
      };

      let response = await axios.get(`${apiUrl}get-buyer-plans`, {
        headers: headers,
      });
      setLoader(false);
      setPlans(response.data.buyer_plans);
    } catch (error) {
      setLoader(false);
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };
  useEffect(() => {
    fetchBuyerPlans();
  }, []);

  useEffect(() => {
  const handleBackNavigation = () => {
    setMiniButtonLoader('');
    setLoader(false);
  };

  window.addEventListener("pageshow", handleBackNavigation);

  return () => {
    window.removeEventListener("pageshow", handleBackNavigation);
  };
}, []);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const paymentStatus = params.get("payment");

  if (paymentStatus === "success") {
    fetchBuyerPlans();

    toast.success("Profile boosted successfully!", {
      position: toast.POSITION.TOP_RIGHT,
    });

   
    window.history.replaceState({}, document.title, location.pathname);
  }
}, [location.search]);


  const boostProfilePurchase = async (planId, payment_type) => {
    try {
      setMiniButtonLoader(planId);
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
      };
      let data = {
        plan: planId,
        type: payment_type,
      };
      let response = await axios.post(`${apiUrl}checkout-session`, data, {
        headers: headers,
      });
      if (response.data.session) {
        window.location.href = response.data.session.url;
      }else{
        setMiniButtonLoader('');
      }
    } catch (error) {
      setMiniButtonLoader('');
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  const handleChangeAutoPayment = async (e, planId) => {
    try {
      let is_plan_auto_renew = e.target.checked ? 1 : 0;
      const apiUrl = process.env.REACT_APP_API_URL;
      const data = {
        is_plan_auto_renew: is_plan_auto_renew,
        plan: planId,
        role_id: "3",
      };
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
      };
      let title = "Do you want to make auto renew payment?";
      let html = "It will auto deduct your payment";
      if (!is_plan_auto_renew) {
        title = "Do you want to stop auto renew payment?";
        html = "You need to make payment manually next month";
      }
      Swal.fire({
        icon: "warning",
        title: title,
        html: html,
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let response = await axios.post(
            `${apiUrl}update-auto-renew-flag`,
            data,
            {
              headers: headers,
            }
          );
          if (response.data.status) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        } else {
          const checkbox = document.getElementById("flexSwitchCheckChecked");
          checkbox.checked = is_plan_auto_renew ? 0 : 1;
        }
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };
  return (
    <>
      <BuyerHeader />
      <section className="main-section position-relative pt-4 pb-120">
        {loader ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img src="../../../assets/images/loader.svg" />
          </div>
        ) : (
          <div className="container position-relative pat-40">
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
                    boost your profile
                  </h6>
                </div>
              </div>
            </div>
            <div className="card-box boost-box">
              <h3 className="text-center">Boost Your Profile</h3>
              <p className="text-center">
              Boost your profile rank! Discover more off-market opportunities and gain an edge in securing exclusive investment properties.
              </p>
              <div className="card-box-inner mt-4">
                {plans.length > 0
                  ? plans.map((data, index) => {
                      return (
                        <div className="boost-box-block-item" key={index}>
                          <div className="boost-headingwithicon">
                            <div className="boost-icon">
                              <img src={data.image_url} />
                            </div>
                            <div className="boost-title">
                              {data.title.toUpperCase()}
                            </div>
                          </div>
                          <div className="postion">
                            position : {data.position < 10 ? '0':''}{data.position}
                          </div>
                          <div className="priceby">
                            $ {data.amount} <span>/{data.type}</span>
                          </div>
                          <div className="notify">
                            <img src="../assets/images/info.svg" />
                            <div className="notifyinfo">{data.description}</div>
                          </div>
                          <div className="purchase-btn p-0">
                            {!data.current_plan ?  data.is_user_limit_reached ? 
                                <span className="badge success-btn">
                                       Badge Sold Out
                                </span>
                                    :(
                             
                              <button
                                type="button"
                                className="btn btn-fill"
                                onClick={() =>
                                  boostProfilePurchase(
                                    data.plan_stripe_id,
                                    "boost_your_profile"
                                  )
                                }
                              >
                                 {(miniButtonLoader === data.plan_stripe_id) ?<>Loading... <MiniLoader/></>  : 'Purchase'}
                              </button>
                            ) : (
                              <div className="renew-wrapper">
                                <div className="renew-btnbox">
                                  {data.current_plan ? (
                                    <span className="badge bg-success purchased-profile">
                                      Purchased
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-fill"
                                      onClick={() =>
                                        boostProfilePurchase(
                                          data.plan_stripe_id,
                                          "renew_buyer_profile"
                                        )
                                      }
                                    >
                                      Renew
                                    </button>
                                  )}
                                </div>
                                <div className="auto-renew">
                                  Auto-Renew
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      role="switch"
                                      id="flexSwitchCheckChecked"
                                      onChange={(e) =>
                                        handleChangeAutoPayment(
                                          e,
                                          data.plan_stripe_id
                                        )
                                      }
                                      defaultChecked={
                                        data.is_plan_auto_renew ? "checked" : ""
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="flexSwitchCheckChecked"
                                    ></label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default BoostYourProfile;
