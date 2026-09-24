import React, { useState,useEffect } from "react";
import { Routes, Route,useLocation  } from "react-router-dom";

// Import your components for each route

import Login from "../pages/Login";
import Register from "../pages/Sellers/auth/Register";
import ForgotPassword from "../pages/Sellers/auth/ForgotPassword";
import ResetPassword from "../pages/Sellers/auth/ResetPassword";
import VerifyEmail from "../pages/Sellers/auth/VerifyEmail";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { useAuth } from "../hooks/useAuth";
import AuthContext from "../context/authContext";
import Home from "../pages/Sellers/Home";
import AddBuyerDetails from "../pages/Sellers/AddBuyerDetails";
import MyBuyer from "../pages/Sellers/MyBuyers";
import SellerForm from "../pages/Sellers/SellerForm";
import ChooseYourPlan from "../pages/Sellers/ChooseYourPlan";
import AdditionalCreadits from "../pages/Sellers/AdditionalCreadits";
import AdminMessage from "../pages/Sellers/AdminMessage";
import AdminRequest from "../pages/Sellers/AdminRequest";
import MyProfile from "../pages/Sellers/MyProfile";
import PrivacyPolicy from "../pages/Sellers/PrivacyPolicy";
import TermCondition from "../pages/Sellers/TermCondition";
import Protected from "../util/Protected";
import Support from "../pages/Sellers/Support";
import CopyAddBuyer from "../pages/Sellers/CopyAddBuyer";
import EditRequest from "../modal/EditRequest";
import Payment from "../pages/Sellers/Payment";
import Completion from "../pages/Sellers/Completion";
import Cancel from "../pages/Sellers/Cancel";
import LastSearchData from "../pages/Sellers/LastSearchData";
import PropertyDealResult from "../pages/Sellers/PropertyDealResult";
import PropertyDealDetails from "../pages/Sellers/PropertyDealDetails";
import DealNotifications from "../pages/Sellers/DealNotifications";
import Message from "../pages/Sellers/Message";
import Settings from "../pages/Sellers/Settings";
import LastSearchResult from "../pages/Sellers/LastSearchResult";
import PropertyRadiusSearch from "../component/PropertyRadiusSearch";
import AffiliateProgram from "../pages/Sellers/AffiliateProgram";
import NotifiedBuyersDetail from "../pages/Sellers/NotifiedBuyersDetail";

import SentRequest from "../modal/SentRequest";

// import GoogleMap from "../component/GoogleMap";
const Seller = () => {
  const { userData } = useAuth();
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [authData, setAuthData] = useState({
    signedIn: userData.signedIn,
    user: userData.user,
    access_token: userData.access_token,
  });
  const location = useLocation();
  useEffect(() => {
    console.log("first");
    let routeArray = ['/login','/forget-password','/register','/register-buyer'];
    console.log(location.pathname,"sdsadhka");
    if(routeArray.includes(location.pathname)){
      document.body.classList.add('pb-0');
    }else{
      document.body.classList.remove('pb-0');
    }
  }, [location]);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthContext.Provider value={{ authData, setAuthData }}>
        <Routes>
          {/* Auth routes */}
          <Route index path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:token/:hash"
            element={<ResetPassword />}
          />
          <Route path="/email/verify/:id/:hash" element={<VerifyEmail />} />
          <Route path="/support" element={<Support />} />
          <Route path="/affiliate-program" element={<AffiliateProgram />} />
          {/* add buyer link */}
          <Route path="/add-buyer/:token" element={<CopyAddBuyer urlType={'private-buyer'}/>} />
          <Route path="/social-share-add-buyer/:token" element={<CopyAddBuyer urlType={'public-buyer'} />} />
          {/* App routes */}

          <Route path="/" element={<Protected Component={Home} />} />
          <Route
            path="/add-buyer-details"
            element={<Protected Component={AddBuyerDetails} />}
          />
          <Route
            path="/my-buyers"
            element={<Protected Component={MyBuyer} />}
          />
          {/* <Route
            path="/last-search-data"
            element={<Protected Component={LastSearchData} />}
          /> */}
          <Route
            path="/last-search-data"
            element={<Protected Component={LastSearchResult} />}
          />
          <Route
            path="/sellers-form"
            element={<Protected Component={SellerForm} />}
          />
          {/* <Route path="/condo" element={<Protected Component={Condo}/>} /> */}
          {/* <Route path="/development" element={<Protected Component={Development}/>} /> */}
          {/* <Route path="/multifamily-residential" element={<Protected Component={MultiFamilyResidential}/>} /> */}
          <Route
            path="/choose-your-plan"
            element={<Protected Component={ChooseYourPlan} />}
          />
          <Route
            path="/additional-credits"
            element={<Protected Component={AdditionalCreadits} />}
          />
          <Route
            path="/admin-message"
            element={<Protected Component={AdminMessage} />}
          />
          <Route
            path="/admin-request"
            element={<Protected Component={AdminRequest} />}
          />
          
          <Route
            path="/my-profile"
            element={<Protected Component={MyProfile} />}
          />
          <Route
            path="/settings"
            element={<Protected Component={Settings} />}
          />
          {/* <Route path="/result-page" element={<Protected Component={ResultPage} type={'result'}/>} /> */}
          <Route path="/payment" element={<Protected Component={Payment} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-condition" element={<TermCondition />} />

          <Route path="/edit-modal" element={<EditRequest />} />
          <Route path="/submit-modal" element={<SentRequest />} />
          <Route path="/completion/:token" element={<Completion />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/property-deal-result" element={<PropertyDealResult />} />
          <Route path="/property-deal-details/:id/:notificationId?" element={<PropertyDealDetails />} />
          {/* <Route path="/deal-notifications" element={<DealNotifications />} /> */}
          <Route path="/message/:id?" element={<Protected Component={Message} />} />
          <Route path="/google-radius" element={<Protected Component={PropertyRadiusSearch} />} />
          <Route path="/notified-buyer-detail/:id/:logId" element={<Protected Component={NotifiedBuyersDetail} />} />
          
          {/* <Route path="/google-api" element={<GoogleMap />} /> */}
        </Routes>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default Seller;
