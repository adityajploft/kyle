import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props' 
import {useAuth} from "../../hooks/useAuth";
import axios from 'axios';
import { toast } from 'react-toastify';
const FacebookLoginButton = forwardRef(({apiUrl , setLoading, navigate, setErrors, firebaseDeviceToken, roleType}, ref) => { 
    const roleTypeRef = useRef(roleType);

    useEffect(() => {
        roleTypeRef.current = roleType;
    }, [roleType]);

    const {setAsLogged} = useAuth();
    const [fbAutoLoad, setFbAutoLoad] = useState(false);
    const fbButtonRef = useRef(null);

    const responseFacebook = (response) => {
        const profile = response || {};
        const displayName = (profile.name || "").trim();
        const nameParts = displayName ? displayName.split(/\s+/) : [];
        
        const payload = {
            ...profile,
            accessToken: profile.accessToken,
            device_token: firebaseDeviceToken,
            first_name: nameParts[0] || "",
            last_name: nameParts.length > 1 ? nameParts.slice(1).join(" ") : "",
            phone: profile.phoneNumber || null,
            country_code: "+1",
            picture: profile.picture?.data?.url || "",
            role_type: roleTypeRef.current,
            register_type: 3, // 3 = Facebook social login
        };

        if(payload.accessToken !== '' && payload.accessToken !== undefined){
            const handleFacebookLogin = () =>{
                setLoading(true);
                let headers = {
                    "Accept": "application/json", 
                }
                axios.post(apiUrl+'handle-facebook', payload, { headers: headers }).then(response => {
                    setLoading(false);
                    if(response.data.status) {
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
                    if(error.response) {
                        if (error.response.status === 404) {
                            // Status 404: user not found, redirect to register page based on role
                            const registerPath = roleTypeRef.current === 2 ? '/seller/register' : '/buyer/register';
                            navigate(registerPath, {
                                state: {
                                    fromSocialLogin: true,
                                    socialProvider: 'facebook',
                                    socialData: {
                                        first_name: payload.first_name || "",
                                        last_name: payload.last_name || "",
                                        email: payload.email || "",
                                        phone: payload.phone || "",
                                        company_name: payload.company_name || "",
                                    }
                                }
                            });
                            return;
                        }
                        if (error.response.data.errors) {
                            setErrors(error.response.data.errors);
                        }
                    }
                });
            }
            handleFacebookLogin();
        }
    }
    const componentClicked = (data) => {
        setFbAutoLoad(true);
    }

    useImperativeHandle(ref, () => ({
        triggerLogin: () => {
             if (fbButtonRef.current) {
                 fbButtonRef.current.click();
             }
        }
    }));

    return(
    <div style={{ display: 'none' }}>
        <FacebookLogin
            appId="3361367434102708"
            fields="name,email,picture"
            onClick={componentClicked}
            callback={responseFacebook} 
            render={renderProps => (
                <button type="button" ref={fbButtonRef} onClick={renderProps.onClick}>FB</button>
            )}
        />
    </div>
    )
});
export default FacebookLoginButton;
