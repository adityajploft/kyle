import React, { useEffect, useState, Fragment } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import PhoneVerification from "./PhoneVerification";
import DriverLicense from "./DriverLicense";
import LLCVerification from "./LLCVerification";
import ProofOfFund from "./ProofOfFund";
import ApplicationProcess from "./ApplicationProcess";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import { useFormError } from "../../../hooks/useFormError";
import axios from "axios";
import { toast } from "react-toastify";
import SuccessPage from "./ApplicationStatusPage/SuccessPage";
import ApprorvedPage from "./ApplicationStatusPage/ApprovedPage";
import PendingPage from "./ApplicationStatusPage/PendingPage";
import RejectedPage from "./ApplicationStatusPage/RejectedPage";
import CertifiedCloser from "./CertifiedCloser";

const steps = [
  "Phone Verification",
  "Proof of Funds",
  "ID/Driver’s License",
  "Business Verification",
  "Certified Closer",
  "Application Process",
];

const stepMessages = [
  "You Are Now Phone Verified! ",
  "You Are Now Proof of Funds Verified!",
  "You Are Now ID/Drivers License Verified!",
  "Your Business is Now Verified!",
  "You Are Now Fully Verified!"
]
const HorizontalLinearStepper = () => {
  const [miniLoader, setMiniLoader] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [profileVerificationStatus, setProfileVerificationStatus] = useState('');
  const [skipped, setSkipped] = useState(new Set());
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerify, setIsOtpVerify] = useState(false);
  const [phoneNumber, setphoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState(process.env.REACT_APP_COUNTRY_CODE);
  const [rejectMessage, setRejectMessage] = useState("");
  const { getTokenData, setLogout } = useAuth();
  const { setErrors, renderFieldError } = useFormError();
  const [loader, setLoader] = useState(true);
  const [otpNumber, setotpNumber] = useState();
  const [stepNameData, setStepNameData] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isStepOptional = (step) => {
    return step === 10;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    setProfileVerificationStatus("");
  };
  const stepperFormSubmit = async (data, e) => {
    e.preventDefault();
    try {
      var data = new FormData(e.target);
      let formObject = Object.fromEntries(data.entries());
      formObject.step = parseInt(activeStep) + 1;
      await stepperForm(formObject);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.validation_errors) {
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
    //handleNext();
  };

  // send otp on phone number
  const sendOtp = async () => {
    try {
      setErrors(null);
      setMiniLoader(true);
      setIsOtpSent(false);
      document.getElementById('otp_value').value = '';
      document.querySelectorAll('.otpnumb').forEach(element => element.value = '');
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      // const extractNumber = phoneNumber.replace(/\D/g, "");
      const extractNumber = phoneNumber.replace(/\D/g, "").slice(-10);
      let response = await axios.post(
        apiUrl + "send-sms",
        { phone: extractNumber, country_code: countryCode },
        {
          headers: headers,
        }
      );
      setotpNumber(response.data.otp ?? "")
      if (response.data.status) {
        setMiniLoader(false);
        setIsOtpSent(true);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      setMiniLoader(false);
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.validation_errors) {
          setErrors(error.response.data.validation_errors);
        }
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        if (error.response.error) {
          toast.error(error.response.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  const stepperForm = async (formObject) => {
    if (formObject.phone !== undefined) {
      const formattedPhoneNumber = formObject.phone.replace(/-/g, '');
      formObject.phone = formattedPhoneNumber;
    }
    const apiUrl = process.env.REACT_APP_API_URL;
    let headers = {
      Accept: "application/json",
      Authorization: "Bearer " + getTokenData().access_token,
      "auth-token": getTokenData().access_token,
      "Content-Type": "multipart/form-data",
    };
    let response = await axios.post(
      apiUrl + "buyer-profile-verification",
      formObject,
      {
        headers: headers,
      }
    );
    if (response.data.status) {
      if (parseInt(response.data.current_step) === 6) {
        let url = response.data.session.url;
        window.location.href = url;
        return false;
      }
      let currentStep = parseInt(response.data.current_step);
      if (currentStep === 1) {
        setActiveStep(1);
      } else {
        setProfileVerificationStatus("pending");
      }
     
      setIsOtpVerify(true);
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    setMiniLoader(false);
  };

  const getLastFormStep = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
    
      let response = await axios.get(apiUrl + "last-form-step",
        {
          headers: headers,
          params: {
            device_type: "web",
          },
        }
      );


      setLoader(false);
      setStepNameData(stepMessages[response.data.lastStepForm - 1]);

      if (response.data.lastStepForm > 1 & response.data.lastStepForm < 6) {
        setActiveStep(response.data.lastStepForm - 1);
        setProfileVerificationStatus(response.data.lastStepStatus);
        setRejectMessage(response.data.reason_content);
      } else {
        setActiveStep(response.data.lastStepForm);
      }
    } catch (error) {
      if (error.response) {
        setLoader(false);
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.validation_errors) {
          setErrors(error.response.data.validation_errors);
        }
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        if (error.response.error) {
          toast.error(error.response.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };
  useEffect(() => {
    getLastFormStep();
  }, []);

  const renderComponent = (condition) => {
    switch (condition) {
      case 'pending':
        return <PendingPage />;
      case 'verified':
        return <ApprorvedPage handleNext={handleNext} stepNameData={stepNameData} />;
      case 'rejected':
        return <RejectedPage setProfileVerificationStatus={setProfileVerificationStatus} rejectMessage={rejectMessage} />;
      default:
        return null;
    }
  }

  return (
    <section className="main-section position-relative pt-4">
      {loader ? (
        <div className="loader" style={{ textAlign: "center" }}>
          <img src="../../../assets/images/loader.svg" />
        </div>
      ) : (
        <div className="container position-relative">
          <Box sx={{ width: "100%" }} className="pat-40">
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepOptional(index)) {
                  labelProps.optional = (
                    <Typography variant="caption">Optional</Typography>
                  );
                }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  <SuccessPage />
                </Typography>
              </Fragment>
            ) : (
              <Fragment>
                <form method="post" onSubmit={handleSubmit(stepperFormSubmit)}>
                  <div className="profile-varification">
                    {renderComponent(profileVerificationStatus)}
                    {!renderComponent(profileVerificationStatus) && (
                      <>
                        {activeStep === 0 && (
                          <PhoneVerification
                            register={register}
                            errors={errors}
                            renderFieldError={renderFieldError}
                            isOtpSent={isOtpSent}
                            sendOtp={sendOtp}
                            setphoneNumber={setphoneNumber}
                            countryCode={countryCode}
                            phoneNumber={phoneNumber}
                            handleSubmit={handleSubmit}
                            isOtpVerify={isOtpVerify}
                            miniLoader={miniLoader}
                            otpNumber={otpNumber}
                          />
                        )}

                        {activeStep === 1 && (
                          <ProofOfFund
                            register={register}
                            errors={errors}
                            renderFieldError={renderFieldError}
                          />
                        )}

                        {activeStep === 2 && (
                          <DriverLicense
                            register={register}
                            errors={errors}
                            renderFieldError={renderFieldError}
                          />
                        )}

                        {activeStep === 3 && (
                          <LLCVerification
                            register={register}
                            errors={errors}
                            renderFieldError={renderFieldError}
                          />
                        )}
                        {activeStep === 4 && (
                          <CertifiedCloser register={register} errors={errors} renderFieldError={renderFieldError} />
                        )}
                        {activeStep === 5 && (
                          <ApplicationProcess miniLoader={miniLoader} />
                        )}
                      </>
                    )}
                  </div>
                </form>
              </Fragment>
            )}
          </Box>
        </div>
      )}
    </section>
  );
};
export default HorizontalLinearStepper;
