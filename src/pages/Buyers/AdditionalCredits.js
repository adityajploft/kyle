import React, { useState, useEffect } from "react";
import BuyerHeader from "../../partials/BuyerHeader";
import Footer from "../../partials/Footer";
import { useAuth } from "../../hooks/useAuth";
import { useFormError } from "../../hooks/useFormError";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AdditionalCredits = () => {
  const [plans, setPlans] = useState([]);
  const [isLoader, setIsLoader] = useState(true);
  const [radioValue, setRadioValue] = useState("");
  const [errorMsg, setErrorsMsg] = useState("");
  const [loaderButton, setLoaderButton] = useState(false);
  const { getTokenData, setLogout } = useAuth();
  const { setErrors, renderFieldError } = useFormError();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getPlans();
  }, []);

  const getPlans = async () => {
    try {
      setIsLoader(true);
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };

      let plans = await axios.get(`${apiUrl}getAddtionalCredits`, {
        headers: headers,
      });
      setPlans(plans.data.data.additional_credits);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(radioValue, "radioValue");
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
          type: "addon",
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
  return (
    <>
      <BuyerHeader />
      <section className="main-section position-relative pt-4 pb-5">
        <div className="container position-relative">
          <div className="back-block">
            <div className="row">
              <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                <Link to="/buyer/dashboard" className="back">
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
              <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                <h6 className="center-head text-center mb-0">Pricing Page</h6>
              </div>
              <div className="col-12 col-lg-4"></div>
            </div>
          </div>
          <div className="card-box">
            <div className="row">
              <div className="col-12 col-lg-12">
                <div className="card-box-inner">
                  <div className="inner-page-title text-center">
                    <h3 className="text-center">Buy Additional Credits</h3>
                    <p className="mb-0">
                      Invest in credits to unlock more opportunities and connect with sellers.
                      <br />
                      Credits will substantially boost your chances of closing deals.
                    </p>
                  </div>
                  <div className="card-box-light">
                    <form method="post" onSubmit={handleSubmit}>
                      <div className="row">
                        {isLoader ? (
                          <div
                            className="loader"
                            style={{ textAlign: "center" }}
                          >
                            <img src="../../../assets/images/loader.svg" />
                          </div>
                        ) : plans.length > 0 ? (
                          plans.map((data, index) => {
                            return (
                              <div
                                className="col-12 col-md-6 col-lg-6"
                                key={index}
                              >
                                <div className="radio-item-features">
                                  <label className="features-items">
                                    <input
                                      type="radio"
                                      name="radio"
                                      onChange={(e) =>
                                        setRadioValue(data.price_stripe_id)
                                      }
                                    />
                                    <div className="feature-item-content">
                                      <div className="feature-item-title">
                                        {data.credit} Credit
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
                        ) : (
                          ""
                        )}

                        <div className="col-12 col-lg-12">
                          {errorMsg && <p className="text-danger">{errorMsg}</p>}
                          <div className="buynow-btn">
                            <button className="btn btn-fill">
                              {loaderButton ? "Processing ... " : "Buy Now!"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default AdditionalCredits;
