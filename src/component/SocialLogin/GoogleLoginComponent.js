import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../hooks/useAuth";
import axios from 'axios';
import { toast } from 'react-toastify';

const GoogleLoginComponent = forwardRef(({ apiUrl, setLoading, navigate, setErrors, firebaseDeviceToken, roleType }, ref) => {
    
    const roleTypeRef = useRef(roleType);

    useEffect(() => {
        roleTypeRef.current = roleType;
    }, [roleType]);

    const { setAsLogged } = useAuth();

    const googleLogin = (data) => {
        data.device_token = firebaseDeviceToken;
        let headers = {
            "Accept": "application/json",
        }
        axios.post(apiUrl + 'handle-google', data, { headers: headers }).then(response => {
            setLoading(false);
            if (response.data.status) {
                // Status 200: user found, direct login
                toast.success('Login successfully!', {
                    position: toast.POSITION.TOP_RIGHT
                });
                let userData = response.data.userData || {};
                // is_profile_complete may come at root level or inside userData
                if (response.data.hasOwnProperty('is_profile_complete')) {
                    userData.is_profile_complete = response.data.is_profile_complete;
                }
                setAsLogged(response.data.access_token, '', '', userData);
            }
        }).catch(error => {
            setLoading(false);
            if (error.response) {
                if (error.response.status === 404) {
                    // Status 404: user not found, redirect to register page based on role
                    const registerPath = roleTypeRef.current === 2 ? '/seller/register' : '/buyer/register';
                    navigate(registerPath, {
                        state: {
                            fromSocialLogin: true,
                            socialProvider: 'google',
                            socialData: {
                                first_name: data.first_name || "",
                                last_name: data.last_name || "",
                                email: data.email || "",
                                phone: data.phone || "",
                                company_name: data.company_name || "",
                            }
                        }
                    });
                    return;
                }
                if (error.response.data.validation_errors) {
                    setErrors(error.response.data.validation_errors);
                }
                if (error.response.data.error) {
                    toast.error(error.response.data.error, { position: toast.POSITION.TOP_RIGHT });
                }
            }
        });
    }

    const triggerGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `https://www.googleapis.com/oauth2/v3/userinfo`,
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );
                
                const user = res.data;
                const displayName = (user.name || "").trim();
                const nameParts = displayName ? displayName.split(/\s+/) : [];

                const payload = {
                    aud: "238504024175-538jodt49rf9va605un1anqjcgs9mu02.apps.googleusercontent.com",
                    azp: "238504024175-538jodt49rf9va605un1anqjcgs9mu02.apps.googleusercontent.com",
                    device_token: firebaseDeviceToken,
                    email: user.email,
                    email_verified: user.email_verified,
                    exp: Math.floor(Date.now() / 1000) + 3600,
                    iat: Math.floor(Date.now() / 1000),
                    nbf: Math.floor(Date.now() / 1000),
                    iss: "https://accounts.google.com",
                    jti: user.sub,
                    name: displayName,
                    given_name: user.given_name || displayName,
                    picture: user.picture || "",
                    sub: user.sub,
                    first_name: nameParts[0] || "",
                    last_name: nameParts.length > 1 ? nameParts.slice(1).join(" ") : "",
                    phone: null,
                    country_code: "+1",
                    role_type: roleTypeRef.current,
                    register_type: 2, // 2 = Google social login
                    isGoogleLogin: true
                };

                googleLogin(payload);
            } catch (err) {
                setLoading(false);
                toast.error('Failed to get Google User Profile', { position: toast.POSITION.TOP_RIGHT });
            }
        },
        onError: () => {
            console.log('Login Failed');
        }
    });

    useImperativeHandle(ref, () => ({
        triggerLogin: () => {
            triggerGoogleLogin();
        }
    }));

    return null;
});

export default GoogleLoginComponent;
