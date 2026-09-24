import { lazy } from "react";

// Auth Routes
const Login = lazy(() => import("../Login"));
const Register = lazy(() => import("./auth/Register"));
const SellerRepCodeRequest = lazy(() => import("./RepCodeRequest"));
const ResetPassword = lazy(() => import("./auth/ResetPassword"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const VerifyEmail = lazy(() => import("./auth/VerifyEmail"));

// Dashboard
const Home = lazy(() => import("./Home"));

// Buyer Management
const MyBuyers = lazy(() => import("./MyBuyers"));
const AddBuyerDetails = lazy(() => import("./AddBuyerDetails"));
const SellerForm = lazy(() => import("./SellerForm"));
const Support = lazy(() => import("./Support"));
const CopyAddBuyer = lazy(() => import("./CopyAddBuyer"));
const LastSearchResult = lazy(() => import("./LastSearchResult"));
const AffiliateProgram = lazy(() => import("./AffiliateProgram"));
const ChooseYourPlan = lazy(() => import("./ChooseYourPlan"));
const AdditionalCreadits = lazy(() => import("./AdditionalCreadits"));
const AdminMessage = lazy(() => import("./AdminMessage"));
const AdminRequest = lazy(() => import("./AdminRequest"));
const VerifyAndSetPassword = lazy(() => import("../Buyers/auth/VerifyAndSetPassword"));

// Payments & Completion
const Payment = lazy(() => import("./Payment"));
const Completion = lazy(() => import("./Completion"));
const Cancel = lazy(() => import("./Cancel"));

// Profile & Settings
const MyProfile = lazy(() => import("./MyProfile"));
const Settings = lazy(() => import("./Settings"));

// Legal
const PrivacyPolicy = lazy(() => import("./PrivacyPolicy"));
const TermCondition = lazy(() => import("./TermCondition"));

// Property & Deals
const PropertyDealDetails = lazy(() => import("./PropertyDealDetails"));
const PropertyDealResult = lazy(() => import("./PropertyDealResult"));
const NotifiedBuyersDetail = lazy(() => import("./NotifiedBuyersDetail"));
const PropertyRadiusSearch = lazy(() => import("../../component/PropertyRadiusSearch"));

// Messages & Notifications
const Message = lazy(() => import("./Message"));

// Modals
const SentRequest = lazy(() => import("../../modal/SentRequest"));
const EditRequest = lazy(() => import("../../modal/EditRequest"));

const PendingOffer = lazy(() => import("../Sellers/PendingOffer"));
const Crm = lazy(() => import("../Sellers/Crm"));


const sellerRoutes = [
  // Auth Routes
  { path: "/login", Component: Login },
  { path: "/seller/register", Component: Register },
  { path: "/seller/rep-code", Component: SellerRepCodeRequest, protected: true },
  { path: "/reset-password/:token/:hash", Component: ResetPassword },
  { path: "/forget-password", Component: ForgotPassword },
  { path: "/email/verify/:id/:hash", Component: VerifyEmail },
  { path: "/verify-and-setpassword/:userId/:token", Component: VerifyAndSetPassword },
  // Dashboard
  { path: "/", Component: Home, protected: true },
  { path: "/seller/home", Component: Home, protected: true },

  // Buyer Management
  { path: "/seller/affiliate-program", Component: AffiliateProgram, protected: true },
  { path: "/seller/add-buyer/:token", Component: CopyAddBuyer, urlType: "private-buyer", protected: true },
  { path: "/seller/social-share-add-buyer/:token", Component: CopyAddBuyer, urlType: "public-buyer" },
  { path: "/seller/add-buyer-details", Component: AddBuyerDetails, protected: true },
  { path: "/seller/my-buyers", Component: MyBuyers, protected: true },
  { path: "/seller/last-search-data", Component: LastSearchResult, protected: true },
  { path: "/seller/sellers-form", Component: SellerForm, protected: true },
  { path: "/seller/choose-your-plan", Component: ChooseYourPlan, protected: true },
  { path: "/seller/additional-credits", Component: AdditionalCreadits, protected: true },
  { path: "/seller/admin-message", Component: AdminMessage, protected: true },
  { path: "/seller/admin-request", Component: AdminRequest, protected: true },
  {
    path: "/seller/pending-offers",
    Component: PendingOffer,
    protected: true,
  }
  ,
  {
    path: "/seller/cms",
    Component: Crm,
    protected: true,
  }
  ,

  // Other Routes
  { path: "/seller/payment", Component: Payment, protected: true },
  { path: "/seller/edit-modal", Component: EditRequest, protected: true },
  { path: "/seller/submit-modal", Component: SentRequest, protected: true },
  { path: "/completion/:token", Component: Completion, protected: true },
  { path: "/cancel", Component: Cancel, protected: true },
  { path: "/seller/property-deal-result", Component: PropertyDealResult, protected: true },
  { path: "/seller/property-deal-details/:id/:notificationId?", Component: PropertyDealDetails, protected: true },
  { path: "/seller/google-radius", Component: PropertyRadiusSearch, protected: true },
  { path: "/seller/notified-buyer-detail/:id/:logId", Component: NotifiedBuyersDetail, protected: true },
  { path: "/message/:id?/:logId?", Component: Message, protected: true },

  // Settings
  { path: "/seller/my-profile", Component: MyProfile, protected: true },
  { path: "/settings", Component: Settings, protected: true },
  { path: "/support", Component: Support, protected: true },

  // Legal
  { path: "/privacy-policy", Component: PrivacyPolicy, protected: true },
  { path: "/terms-and-condition", Component: TermCondition, protected: true },
];

export default sellerRoutes;
