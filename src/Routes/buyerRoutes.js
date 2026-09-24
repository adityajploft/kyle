import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Protected from "../util/Protected";

// Lazy load components
const BuyerLogin = lazy(() => import("../pages/Login"));
const BuyerRegister = lazy(() => import("../pages/Buyers/auth/RegisterBuyer"));
const BuyerRepCodeRequest = lazy(() => import("../pages/Buyers/RepCodeRequest"));
const ProofFund = lazy(()=>import("../pages/Buyers/ProofFund"));

const Dashboard = lazy(() => import("../pages/Buyers/Dashboard"));
const BuyerProfile = lazy(() => import("../pages/Buyers/BuyerProfile"));
const ProfileVerification = lazy(() => import("../pages/Buyers/ProfileVerification"));
const EditBuyerProfile = lazy(() => import("../pages/Buyers/EditBuyerProfile"));

const BoostYourProfile = lazy(() => import("../pages/Buyers/BoostYourProfile"));
const PaymentConfirm = lazy(() => import("../pages/Buyers/PaymentConfirm"));

const BoostYourProfilePurchased = lazy(() => import("../pages/Buyers/BoostYourProfilePurchased"));
const PropertyDetails = lazy(() => import("../pages/Buyers/PropertyDetail"));
const DealChat = lazy(() => import("../pages/Buyers/DealChat"));
const DealNotifications = lazy(() => import("../pages/Sellers/DealNotifications"));
const FavoriteDeals = lazy(() => import("../pages/Buyers/FavoriteDeals"));
const NotFound = lazy(() => import("../pages/404"));
const BuyboxCriteria = lazy(() => import("../pages/Buyers/BuyboxCriteria"))
const ViewedProperty = lazy(() => import("../pages/Buyers/ViewedProperty"))
const MatchedDeals = lazy(() => import("../pages/Buyers/MatchedDeals"))

const PendingOffer = lazy(() => import("../pages/Buyers/PendingOffer"))
const AdditionalCredits = lazy(() => import("../pages/Buyers/AdditionalCredits"))

const buyerRoutes = [
  // Auth Routes
  { path: "/login", Component: BuyerLogin },
  // { path: "/buyer/register", Component: BuyerRegister },
    { path: "/buyer/register/:token?", Component: BuyerRegister },
  { path: "/buyer/rep-code", Component: BuyerRepCodeRequest, protected: true },

  // Dashboard (Protected Routes)
  { path: "/buyer/dashboard", Component: Dashboard, protected: true },
  { path: "/buyer/buyer-profile", Component: BuyerProfile, protected: true },
  { path: "/buyer/profile/:token?", Component: BuyerProfile, protected: true },
  { path: "/buyer/profile-verification", Component: ProfileVerification, protected: true },
  { path: "/buyer/edit-profile/:id", Component: EditBuyerProfile, protected: true },



  // Settings (Protected Routes)
  { path: "/buyer/boost-your-profile", Component: BoostYourProfile, protected: true },
  { path: "/buyer/payment-confirm/:token", Component: PaymentConfirm, protected: true },

  // Other Protected Routes
  { path: "/buyer/boost-your-profile-purchased", Component: BoostYourProfilePurchased, protected: true },
  { path: "/buyer/deal-notifications", Component: DealNotifications, protected: true },
  { path: "/buyer/proof-of-fund", Component: ProofFund, protected: true },
  { path: "/buyer/property-detail/:id", Component: PropertyDetails, protected: true },
  { path: "/buyer/favorite-deal", Component: FavoriteDeals, protected: true },
  { path: "/buyer/deal-chat", Component: DealChat, protected: true },
  { path: "/deal-chat/:dealId/:buyerId", Component: DealChat, protected: true },
  
  { path: "/buyer/buybox-criteria", Component: BuyboxCriteria ,protected: true },
   { path: "/buyer/viewed-property", Component: ViewedProperty, protected: true },
   { path: "/buyer/matched-deals", Component: MatchedDeals, protected: true },
   { path: "/buyer/pending-offers", Component:PendingOffer , protected: true },
   { path: "/buyer/additional-credits", Component: AdditionalCredits, protected: true },
   { path: "/not-found", Component: NotFound, protected: true },

  // Catch-all for undefined routes (optional)
  { path: "*", Component: () => <Navigate to="/not-found" replace /> },
];

export default buyerRoutes;
