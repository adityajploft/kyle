import React, { useMemo, useState } from 'react'
import SendOTPModal from './SendOTPModal';
import { Modal } from 'react-bootstrap';
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const PhoneNumberWithOTPVerify = ({
    register,
    errors = '',
    getValues,
    watch,
    renderFieldError = '',
    setIsVerifiedOTP = '',
    isVerifiedOTP,
    initialPhone,
    clearErrors,
    setFormErrors,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [otpValue, setOtpValue] = useState(0);
    const [validOTP, setValidOTP] = useState('');
    const [showOtpValue, setShowOtpValue] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const { getTokenData } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;
    const countryCode = process.env.REACT_APP_COUNTRY_CODE;

    const normalizePhone = (value) => (value || '').toString().replace(/\D/g, '');

    const watchedPhone = watch?.('phone', '');
    const currentPhone = (watchedPhone ?? getValues?.('phone') ?? '').toString();

    const showSendOtp = useMemo(() => {
        if (isVerifiedOTP) {
            return false;
        }

        if (typeof initialPhone === 'undefined') {
            return currentPhone !== '';
        }

        const currentDigits = normalizePhone(currentPhone);
        if (!currentDigits) return false;

        const initialDigits = normalizePhone(initialPhone);
        if (currentDigits === initialDigits) return false;

        return !isVerifiedOTP;
    }, [currentPhone, initialPhone, isVerifiedOTP]);

    const clearExternalFieldError = (field) => {
        if (typeof setFormErrors !== 'function') return;
        setFormErrors((prev) => {
            if (!prev || typeof prev !== 'object') return prev;
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
    const handleSendOtp = async () => {
        if (isVerifiedOTP || isSendingOtp) {
            return;
        }

        setIsSendingOtp(true);
        setValidOTP("");
        setShowOtpValue(false);
        try {
            const phoneNumber = (getValues?.('phone') || '').toString();
            const formattedPhoneNumber = phoneNumber.replace(/-/g, '');
            let payload = {
                country_code:countryCode,
                phone:formattedPhoneNumber
            }
            let response = await axios.post(`${apiUrl}send-otp` , payload,{ headers: buildHeaders() });
            if(response.data.status){
                const hasOtpKey = Object.prototype.hasOwnProperty.call(response.data, "otp");
                const receivedOtp = hasOtpKey ? response.data.otp ?? "" : "";
                setShowOtpValue(hasOtpKey);
                setValidOTP(receivedOtp);
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                clearErrors?.('phone');
                clearExternalFieldError('phone');
            }
            clearInputs();
            setShowModal(true)
        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });       
        } finally {
            setIsSendingOtp(false);
        }
    }
    const handleSubmitOtp = async () => {
        if (isVerifyingOtp) {
            return;
        }

        setIsVerifyingOtp(true);
        try {
            const phoneNumber = getValues('phone'); 
            const formattedPhoneNumber = phoneNumber.replace(/-/g, '');
            const payload = {
                country_code:countryCode,
                phone:formattedPhoneNumber,
                otp:otpValue
            }
            let response = await axios.post(`${apiUrl}verify-otp` , payload,{ headers: buildHeaders() });
                if(response.data.status){
                    toast.success(response.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    if(setIsVerifiedOTP !==''){
                        setIsVerifiedOTP(true);
                        setShowModal(false)
                    }
                }else{

                    toast.error(response.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
        } catch (error) {
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });      
        } finally {
            setIsVerifyingOtp(false);
        }
    }
    const clearInputs = () => {
        const elements = document.getElementsByClassName("otpnumb");
        const inputField = document.getElementById("otp_value");

        if (!elements || !inputField) return; 

        for (const el of elements) {
            el.value = ""; 
        }
        inputField.value = "";
        setOtpValue(""); 
    };
    return(
        <>
            <div className="col-12 col-md-6 col-lg-6">
                <label className='w-100'> Phone Number<span style={{ color: "red" }}>*</span>
                    {showSendOtp && 
                        <span
                            onClick={handleSendOtp}
                            className={`send_otp_right ${isSendingOtp ? 'is-disabled' : ''}`}
                            aria-disabled={isSendingOtp}
                        >
                            Send OTP
                            {isSendingOtp && <span className="otp-inline-loader" aria-hidden="true" />}
                        </span>
                    }
                </label>
                <div className="form-group position-relative phone_number_prefix">
                    <div className="form-group-inner">
                        <span className="form-icon verification_count">(+{countryCode})</span>
                        <input
                        type="text"
                        name="phone"
                        className="form-control-form verification_input"
                        placeholder="Eg. 123-456-7890"
                        maxLength={12}
                        {...register("phone", {
                        onChange: () => {
                            if (typeof setIsVerifiedOTP === 'function') {
                                setIsVerifiedOTP(false);
                            }
                        },
                        required: "Phone Number is required",
                            validate: {
                                matchPattern: (v) =>
                                /^[0-9-]*$/.test(v) || "Please enter a valid phone number",
                                maxLength: (v) =>
                                (v.length <= 12 && v.length >= 1) ||
                                "The phone number should be between 1 to 10 digits",
                            },
                        })}
                    />
                    </div>
                    <input type="hidden" name="country_code" value={countryCode}/>
                    {errors && (
                        <p className="error">
                        {errors?.message}
                        </p>
                    )}
                    {renderFieldError && renderFieldError("phone")}
                    {isVerifiedOTP  && 
                        <span className='otp_success_check'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"/>
                            </svg>
                        </span>
                    }
                </div>
            </div>
            
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false} centered className='radius_30 max-648'>
                <Modal.Header closeButton className='new_modal_close'></Modal.Header>
                <Modal.Body className='space_modal'>
                    <SendOTPModal
                        handleSendOtp={handleSendOtp}
                        handleSubmitOtp={handleSubmitOtp}
                        setOtpValue={setOtpValue}
                        validOTP={validOTP}
                        showOtpValue={showOtpValue}
                        isSendingOtp={isSendingOtp}
                        isVerifyingOtp={isVerifyingOtp}
                        phoneNumber={`(+${countryCode}) ${currentPhone}`}
                    />
                </Modal.Body>
            </Modal>

        </>
    );
}
export default PhoneNumberWithOTPVerify
