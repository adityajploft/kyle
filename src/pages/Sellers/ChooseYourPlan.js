import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useFormError } from "../../hooks/useFormError";
import { toast } from "react-toastify";
import axios from "axios";
import Payment from "./Payment";

const ChooseYourPlan = () => {
  const [plans, setPlans] = useState([]);
  const [isLoader, setIsLoader] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [loaderButton, setLoaderButton] = useState(false);
  const [radioValue, setRadioValue] = useState("");
  const [errorMsg, setErrorsMsg] = useState("");
  const { getTokenData, setLogout } = useAuth();
  const navigate = useNavigate();
  const { setErrors, renderFieldError } = useFormError();

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (radioValue == "") {
        setErrorsMsg("Please choose any plan");
      } else {
        setLoaderButton(true);
        const apiUrl = process.env.REACT_APP_API_URL;
        let headers = {
          Accept: "application/json",
          Authorization: "Bearer " + getTokenData().access_token,
          "auth-token": getTokenData().access_token,
        };
        let data = {
          plan: radioValue,
          type: "normal",
        };
        const response = await axios.post(apiUrl + "checkout-session", data, {
          headers: headers,
        });
        if (response.data.session) {
          console.log("true");
          window.location.href = response.data.session.url;
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.errors) {
          setErrors(error.response.errors);
        }
        if (error.response.error) {
          toast.error(error.response.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
    setLoaderButton(false);
  };
  const getPlans = async () => {
    try {
      setIsLoader(true);
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };

      let plans = await axios.get(`${apiUrl}getPlans`, { headers: headers });
      setPlans(plans.data.data.plans);
      setIsLoader(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.errors) {
          toast.error(error.response.data.errors, {
            position: toast.POSITION.TOP_RIGHT,
          });
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
      <Header />
      <section className="main-section position-relative pt-4 pb-5">
        <div className="container position-relative">
          <div className="back-block">
            <div className="row">
              <div className="col-12 col-lg-4">
                <Link to="/seller/sellers-form?search" className="back">
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
              <div className="col-12 col-lg-4">
                <h6 className="center-head text-center mb-0">Pricing Page</h6>
              </div>
              <div className="col-12 col-lg-4"></div>
            </div>
          </div>
          <div className="card-box">
            <div className="row">
              <div className="col-12 col-lg-12">
                {clientSecret == "" ? (
                  <div className="card-box-inner">
                    <div className="inner-page-title text-center">
                      <h3 className="text-center">Choose Your Plan</h3>
                      <p className="mb-0">
                        You can purchase it accordingly Monthly, Yearly or
                        require more data then here is another plan for you.
                      </p>
                    </div>
                    <div className="card-box-light">
                      {isLoader ? (
                        <div className="loader" style={{ textAlign: "center" }}>
                          <img src="../../../assets/images/loader.svg" />
                        </div>
                      ) : (
                        <form method="post" onSubmit={handleSubmit}>
                          <div className="row">
                            {plans.length > 0
                              ? plans.map((data, index) => {
                                  return (
                                    <div
                                      className="col-12 col-lg-6"
                                      key={index}
                                    >
                                      <div className="radio-item-features">
                                        <div className="package-plan">
                                          {data.type}
                                        </div>
                                        <label className="features-items">
                                          <input
                                            type="radio"
                                            name="radio"
                                            onChange={(e) =>
                                              setRadioValue(data.plan_stripe_id)
                                            }
                                          />
                                          <div className="feature-item-content">
                                            <div className="feature-item-title">
                                              {data.credits} Credit Plans
                                              <span className="small-text">
                                                {" "}
                                                /{data.type}
                                              </span>
                                            </div>
                                            <span className="price-pc">
                                              ${data.price}
                                            </span>
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })
                              : ""}

                            <div className="col-12 col-lg-12">
                              <p
                                style={{
                                  textAlign: "center",
                                  fontSize: "15px",
                                  color: "#ff0000",
                                }}
                              >
                                {errorMsg}
                              </p>
                              <div className="buynow-btn">
                                <button className="btn btn-fill">
                                  {loaderButton
                                    ? "Processing ... "
                                    : "Buy Now!"}
                                </button>
                              </div>
                              <div className="note">
                                Note : 1 Credit is 1 Buyer
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                ) : (
                  <Payment
                    clientSecret={clientSecret}
                    setClientSecret={setClientSecret}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default ChooseYourPlan;
