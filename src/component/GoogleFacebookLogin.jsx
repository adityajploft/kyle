import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useState, useRef, useEffect } from 'react'
import GoogleLoginComponent from './SocialLogin/GoogleLoginComponent';
import { useFormError } from '../hooks/useFormError';
import FacebookLoginButton from './SocialLogin/FacebookLoginButton';
import { generatedToken } from '../notifications/firebase';
import { useLocation } from 'react-router-dom';

const GoogleFacebookLogin = ({ hideButtons = false }) => {
    const location = useLocation();
    const apiUrl = process.env.REACT_APP_API_URL;
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const { setErrors, navigate } = useFormError();
   
    const [loading, setLoading] = useState(false);
    const [firebaseDeviceToken, setFirebaseDeviceToken] = useState("");
    
    // Determine role from path: seller -> 2, buyer -> 3
    const roleType = location.pathname.includes('/seller/') ? 2 : 3;

    const googleRef = useRef(null);
    const facebookRef = useRef(null);

    useEffect(() => {
        const getToken = async () => {
            let deviceToken = await generatedToken();
            setFirebaseDeviceToken(deviceToken);
        }
        getToken();
    }, []);

    const handleProviderClick = (e, provider) => {
        e.preventDefault();
        if (provider === "google") {
            googleRef.current?.triggerLogin();
        } else if (provider === "facebook") {
            facebookRef.current?.triggerLogin();
        }
    };

    return (
        <>
            {/* Social login buttons — hidden on register pages (hideButtons=true), shown on login pages */}
            {!hideButtons && (
                <ul className="account-with-social social-login-link list-unstyled mb-0 justify-content-start justify-content-lg-end">
                    <li>
                        <a 
                            href="#"
                            onClick={(e) => handleProviderClick(e, 'google')}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src="/assets/images/google.svg"
                                className="img-fluid"
                                alt="google-icon"
                            />{" "}
                            Register With Google
                        </a>
                        <GoogleOAuthProvider clientId={googleClientId}>
                            <GoogleLoginComponent
                                ref={googleRef}
                                firebaseDeviceToken={firebaseDeviceToken}
                                apiUrl={apiUrl}
                                setLoading={setLoading}
                                navigate={navigate}
                                setErrors={setErrors}
                                roleType={roleType}
                            />
                        </GoogleOAuthProvider>
                    </li>
                    <li>
                        <a 
                            href="#"
                            onClick={(e) => handleProviderClick(e, 'facebook')}
                            style={{ cursor: "pointer" }}
                        >
                            <img 
                                src="/assets/images/facebook.svg" 
                                className="img-fluid" 
                                alt='fb-icon'
                            />{" "}
                            Register With Facebook
                        </a>
                        <FacebookLoginButton
                            ref={facebookRef}
                            firebaseDeviceToken={firebaseDeviceToken}
                            apiUrl={apiUrl}
                            setLoading={setLoading}
                            navigate={navigate}
                            setErrors={setErrors}
                            roleType={roleType}
                        />
                    </li>
                </ul>
            )}
        </>
    )
}

export default GoogleFacebookLogin
