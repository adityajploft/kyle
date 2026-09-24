import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const GoogleReCaptcha = ({setCaptchaVerified,recaptchaError}) => {
    const captchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
    const captchaSecretKey = process.env.REACT_APP_RECAPTCHA_SECRET_KEY;
    function onCaptchaChange(value) {
        if (value) {
            setCaptchaVerified(true);
        } else {
            setCaptchaVerified(false);
        }
    }
    
    return(
        <>
        <div className="col-12 col-lg-12">
            <div className="form-group mb-3 register-recaptcha">
            <ReCAPTCHA sitekey={captchaSiteKey} onChange={onCaptchaChange} />
            {recaptchaError && (
                <span className="invalid-feedback" role="alert">
                <strong>{recaptchaError}</strong>
                </span>
            )}
            </div>
        </div>
        </>

    )
}

export default GoogleReCaptcha;