import React from "react";
import { Routes, Route } from "react-router-dom";
import BuyerProfile from "../pages/Buyers/BuyerProfile";
import ProfileVerification from "../pages/Buyers/ProfileVerification";
import EditBuyerProfile from "../pages/Buyers/EditBuyerProfile";
import Protected from "../util/Protected";
import BoostYourProfile from "../pages/Buyers/BoostYourProfile";
import BoostYourProfilePurchased from "../pages/Buyers/BoostYourProfilePurchased";
// import MultiStepForm from "../pages/Buyers/MultiStepForm";
import PaymentConfirm from "../pages/Buyers/PaymentConfirm";
import DealNotifications from "../pages/Sellers/DealNotifications";
// import Message from "../pages/Sellers/Message";
import Dashboard from "../pages/Buyers/Dashboard";
import PropertyDetails from "../pages/Buyers/PropertyDetail";
import FavoriteDeals from "../pages/Buyers/FavoriteDeals";
import DealChat from "../pages/Buyers/DealChat";
import AdditionalCredits from "../pages/Buyers/AdditionalCredits";
import VerifyAndSetPassword from "../pages/Buyers/auth/VerifyAndSetPassword";
import RegisterBuyer from "../pages/Buyers/auth/RegisterBuyer";
 import ViewedProperty from "../pages/Buyers/ViewedProperty";
//  import MatchedDeals from "../pages/Buyers/matchedDeals";

const Buyers = () => {
  return (
    <Routes>
      <Route path="/register-buyer/:token?" element={<RegisterBuyer/>} />
      <Route
        path="/verify-and-setpassword/:userId/:token"
        element={<VerifyAndSetPassword />}
      />
      <Route path="/profile-verification" element={<ProfileVerification />} />
      <Route
        path="/buyer-profile/:token?"
        element={<Protected Component={BuyerProfile} />}
      />

      <Route
        path="/edit-profile/:id"
        element={<Protected Component={EditBuyerProfile} />}
      />
      <Route
        path="/boost-your-profile"
        element={<Protected Component={BoostYourProfile} />}
      />
      <Route path="/payment-confirm/:token" element={<PaymentConfirm/>} />
      <Route
        path="/boost-your-profile-purchased"
        element={<Protected Component={BoostYourProfilePurchased} />}
      />
      <Route
        path="/deal-notifications"
        element={<Protected Component={DealNotifications} />}
      />
      <Route
        path="/dashboard"
        element={<Protected Component={Dashboard} />}
      />
      <Route
        path="/property-detail/:id"
        element={<Protected Component={PropertyDetails} />}
      />
      <Route
        path="/favorite-deals"
        element={<Protected Component={FavoriteDeals} />}
      />
      <Route
        path="/deal-chat"
        element={<Protected Component={DealChat} />}
      />
      <Route
        path="/additional-credits"
        element={<Protected Component={AdditionalCredits} />}
      />
      <Route
        path="/viewed-property"
        element={<Protected Component={ViewedProperty} />}
      />
      {/* <Route
        path="/matched-deals"
        element={<Protected Component={MatchedDeals} />}
      /> */}
    </Routes>
  );
};
export default Buyers;
