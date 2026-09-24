import { useContext, useState, useEffect } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";
import CryptoJS from "crypto-js";
import axios from "axios";
import { toast } from "react-toastify";

let logoutInProgress = false;

export const useAuth = () => {
  const secretPass = "XkhZG4fW2t2W";
  const tokenStorageKey = "auth_token_data";
  let navigate = useNavigate();
  const [userData, setUserData] = useState(getUserData());
  const [isLogin, setIsLogin] = useState(getTokenData());
  const { setAuthData } = useContext(AuthContext);

  useEffect(() => {
    setAuthData(isLogin);
  }, [isLogin, setAuthData]);

  function getAuthCookieExpiration() {
    let date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000); 
    return date;
  }
  function setAsLogged(access_token, remember_token = "", remember_me_user_data, userData) {
    const cookie = new Cookies();
    cookie.set("is_auth", true, {
      path: "/",
      expires: getAuthCookieExpiration(),
      sameSite: "lax",
      httpOnly: false,
    });
    if (remember_token !== "" && remember_token !== null) {
      cookie.set("remember_me_token", remember_token, {
        path: "/",
        expires: getAuthCookieExpiration(),
        sameSite: "lax",
        httpOnly: false,
      });
    }

    const expires = new Date(Date.now() + 400 * 24 * 60 * 60 * 1000);
    cookie.set("remember_me_user_data", JSON.stringify(remember_me_user_data), {
      path: "/",
      expires: expires,
      sameSite: "lax",
      httpOnly: false,
    });

  
    const twoHoursLater = new Date(Date.now() + 2 * 60 * 60 * 1000); 
    cookie.set("_token", JSON.stringify({ access_token: access_token }), {
      path: "/",
      expires: twoHoursLater,
      sameSite: "lax",
      httpOnly: false,
    });
    localStorage.setItem(tokenStorageKey, JSON.stringify({ access_token }));
    setLocalStorageUserdata(userData);
    setIsLogin({ access_token });
    setAuthData({ access_token });
    if (userData.role === 2) {
      if (userData.is_profile_complete === false) {
        navigate("/seller/my-profile");
      } else {
        navigate("/");
      }
    }else if(userData.role === 3){
      if (userData.is_profile_complete === false) {
        navigate("/buyer/profile-verification");
      } else if (userData.is_verified) {
        navigate("/buyer/dashboard");
      } else {
        navigate("/buyer/profile-verification");
      }
    } else {
      navigate("/login");
    }
  }
  function getUserData() {
    if (localStorage.getItem("user_data") == null) {
      var deft = { signedIn: false, user: null, access_token: null };
      return deft;
    }
    return getLocalStorageUserdata() || { signedIn: false, user: null, access_token: null };
  }
  function getTokenData() {
    const cookie = new Cookies();
    let token = cookie.get("_token");
    const localToken = localStorage.getItem(tokenStorageKey);

    if (token && typeof token === "string") {
      try {
        token = JSON.parse(token);
      } catch (error) {
        token = null;
      }
    }

    if (token && typeof token === "object" && token.access_token) {
      return token;
    }

    if (localToken) {
      try {
        const parsedLocalToken = JSON.parse(localToken);
        if (parsedLocalToken?.access_token) {
          return parsedLocalToken;
        }
      } catch (error) {
        return { access_token: null };
      }
    }

    return { access_token: null };
   
  }

  function clearSession() {
    const cookie = new Cookies();

    cookie.remove("_token", { path: "/" });
    cookie.remove("_token", { path: "/login" });
    cookie.remove("remember_me_token", { path: "/" });
    cookie.remove("remember_me_token", { path: "/login" });
    cookie.remove("remember_me_user_data", { path: "/" });
    cookie.remove("remember_me_user_data", { path: "/login" });
    cookie.remove("is_auth", { path: "/" });
    cookie.remove("is_auth", { path: "/login" });

    document.cookie = "_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login";
    document.cookie = "remember_me_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "remember_me_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login";
    document.cookie = "remember_me_user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "remember_me_user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login";
    document.cookie = "is_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = "is_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login";

    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem("user_data");
    localStorage.removeItem("filter_buyer_fields");
    localStorage.removeItem("get_filtered_data");

    setUserData({ signedIn: false, user: null, access_token: null });
    setIsLogin({ access_token: null });
    setAuthData({ signedIn: false, user: null, access_token: null });
  }
  

  async function setLogout() {
    if (logoutInProgress) {
      return;
    }

    logoutInProgress = true;
    const tokenData = getTokenData();

    try {
      if (tokenData.access_token) {
        const apiUrl = process.env.REACT_APP_API_URL;
        let headers = {
          Accept: "application/json",
          Authorization: "Bearer " + tokenData.access_token,
          "auth-token": tokenData.access_token,
        };
        let url = apiUrl + "logout";
        await axios.post(url, {}, { headers: headers });
      }
    } catch (error) {
      if (error?.response?.status !== 401) {
        toast.error("Something went Wrong! ", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } finally {
      clearSession();
      logoutInProgress = false;
      navigate("/login", { replace: true });
    }
  }
  function loginUserOnStartup() {
    const cookie = new Cookies();
    if (cookie.get("is_auth")) {
      navigate("/");
    } else if (cookie.get("remember_me_token")) {
    } else {
      setIsLogin({ signedIn: false, user: null, access_token: null });
      navigate("/login");
    }
  }

  function getRememberMeData() {
    const cookie = new Cookies();
    return cookie.get("remember_me_user_data");
  }
  function encryptData(text) {
    const data = CryptoJS.AES.encrypt(
      JSON.stringify(text),
      secretPass
    ).toString();
    return data;
  }
  function decryptData(text) {
    const bytes = CryptoJS.AES.decrypt(text, secretPass);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return data;
  }
  function getLocalStorageUserdata() {

    let data = localStorage.getItem("user_data");
    let decryptDatas = "";
    if (data !== null) {
      decryptDatas = decryptData(data);
    }
    return decryptDatas;
  }
  function setLocalStorageUserdata(data) {
    let encryptUserData = encryptData(data);
    localStorage.setItem("user_data", encryptUserData);
    return true;
  }
  return {
    userData,
    isLogin,
    getTokenData,
    setAsLogged,
    setLogout,
    getRememberMeData,
    getLocalStorageUserdata,
    setLocalStorageUserdata,
    loginUserOnStartup,
  };
};
