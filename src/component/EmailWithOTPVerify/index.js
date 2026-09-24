import React, { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import EmailOTPModal from "./EmailOTPModal";
import { useAuth } from "../../hooks/useAuth";

const EmailWithOTPVerify = ({
  register,
  errors = "",
  getValues,
  watch,
  renderFieldError = "",
  setIsVerifiedEmail = "",
  isVerifiedEmail,
  initialEmail,
  clearErrors,
  setFormErrors,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [otpValue, setOtpValue] = useState(0);
  const [validOTP, setValidOTP] = useState("");
  const [showOtpValue, setShowOtpValue] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const { getTokenData } = useAuth();

  const apiUrl = process.env.REACT_APP_API_URL;

  const watchedEmail = watch?.("email", "");
  const currentEmail = (watchedEmail ?? getValues?.("email") ?? "").toString().trim();

  const showSendOtp = useMemo(() => {
    if (isVerifiedEmail) {
      return false;
    }

    if (typeof initialEmail === "undefined") {
      return currentEmail !== "";
    }

    if (!currentEmail) return false;

    const normalizedCurrent = currentEmail.toLowerCase();
    const normalizedInitial = (initialEmail || "").toString().trim().toLowerCase();
    if (normalizedCurrent === normalizedInitial) {
      return false;
    }

    return !isVerifiedEmail;
  }, [currentEmail, initialEmail, isVerifiedEmail]);

  const clearExternalFieldError = (field) => {
    if (typeof setFormErrors !== "function") return;
    setFormErrors((prev) => {
      if (!prev || typeof prev !== "object") return prev;
      if (!Object.prototype.hasOwnProperty.call(prev, field)) return prev;
      const next = { ...prev };
      delete next[field];
      return Object.keys(next).length ? next : null;
    });
  };
  const buildHeaders = () => {
    const headers = { Accept: "application/json" };
    const token = getTokenData()?.access_token;
    if (token) {
      headers.Authorization = "Bearer " + token;
      headers["auth-token"] = token;
    }
    return headers;
  };

  const buildName = () => {
    const first = (getValues("first_name") || "").trim();
    const last = (getValues("last_name") || "").trim();
    const name = `${first} ${last}`.trim();
    return name;
  };

  const handleSendOtp = async () => {
    if (isVerifiedEmail || isSendingOtp) {
      return;
    }

    setIsSendingOtp(true);
    setValidOTP("");
    setShowOtpValue(false);
    try {
      const email = (getValues("email") || "").trim();
      const payload = {
        name: buildName(),
        email,
      };
      let response = await axios.post(`${apiUrl}send-email-otp`, payload, {
        headers: buildHeaders(),
      });
      if (response.data.status) {
        const hasOtpKey = Object.prototype.hasOwnProperty.call(response.data, "otp");
        const receivedOtp = hasOtpKey ? response.data.otp ?? "" : "";
        setShowOtpValue(hasOtpKey);
        setValidOTP(receivedOtp);
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        clearErrors?.("email");
        clearExternalFieldError("email");
      }
      clearInputs();
      setShowModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmitOtp = async () => {
    if (isVerifyingOtp) {
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const email = (getValues("email") || "").trim();
      const payload = {
        email,
        otp: otpValue,
      };
      let response = await axios.post(`${apiUrl}verify-email-otp`, payload, {
        headers: buildHeaders(),
      });
      if (response.data.status) {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        if (setIsVerifiedEmail !== "") {
          setIsVerifiedEmail(true);
          setShowModal(false);
        }
      } else {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const clearInputs = () => {
    const elements = document.getElementsByClassName("email-otpnumb");
    const inputField = document.getElementById("email_otp_value");

    if (!elements || !inputField) return;

    for (const el of elements) {
      el.value = "";
    }
    inputField.value = "";
    setOtpValue("");
  };

  return (
    <>
      <div className="col-12 col-md-6 col-lg-6">
        <label>
          Email Address<span>*</span>
          {showSendOtp && (
            <span
              onClick={handleSendOtp}
              className={`send_otp_right ${isSendingOtp ? "is-disabled" : ""}`}
              aria-disabled={isSendingOtp}
            >
              Send OTP
              {isSendingOtp && <span className="otp-inline-loader" aria-hidden="true" />}
            </span>
          )}
        </label>
        <div className="form-group position-relative">
          <input
            type="text"
            name="email"
            className="form-control-form"
            placeholder="Email Address"
            {...register("email", {
              onChange: () => {
                if (typeof setIsVerifiedEmail === "function") {
                  setIsVerifiedEmail(false);
                }
              },
              required: "Email is required",
              validate: {
                maxLength: (v) =>
                  v.length <= 50 || "The email should have at most 50 characters",
                matchPattern: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  "Email address must be a valid address",
              },
            })}
          />
          {errors && <p className="error">{errors?.message}</p>}
          {renderFieldError && renderFieldError("email")}
          {isVerifiedEmail && (
            <span className="otp_success_check">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z"
                  fill="#19955A"
                />
              </svg>
            </span>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        centered
        className="radius_30 max-648"
      >
        <Modal.Header closeButton className="new_modal_close"></Modal.Header>
        <Modal.Body className="space_modal">
          <EmailOTPModal
            handleSendOtp={handleSendOtp}
            handleSubmitOtp={handleSubmitOtp}
            setOtpValue={setOtpValue}
            validOTP={validOTP}
            showOtpValue={showOtpValue}
            isSendingOtp={isSendingOtp}
            isVerifyingOtp={isVerifyingOtp}
            email={currentEmail}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EmailWithOTPVerify;
