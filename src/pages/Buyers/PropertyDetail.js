import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useFormError } from "../../hooks/useFormError";
import axios from "axios";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Image, Button } from 'react-bootstrap';
import { Tooltip as ReactTooltip } from "react-tooltip";
import BuyerHeader from "../../partials/BuyerHeader";
import Footer from "../../partials/Footer";
import {
    guardSellerAccepted,
    hasBuyerProofOfFundDocument,
    hasSellerAccepted,
    showSellerApprovalToast,
} from "../../util/buyerChat";


const PropertyDetails = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { getTokenData, setLogout } = useAuth();
    const { setErrors, renderFieldError } = useFormError();
    const [dealDetailsData, setDealDetailsData] = useState('');
    const [featuredDealId, setFeaturedDealId] = useState(0);
    const [isShowFeaturedDeal, setIsShowFeaturedDeal] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isUpdatedStatus, setIsUpdatedStatus] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const isMatchedDeal = location.state?.isMatchedDeal;
    const buyerMatchId = location.state?.buyerMatchId;

    const [submitOffer, setSubmitOffer] = useState(false);
    const [letsConnect, setLetsConnect] = useState(false);
    const [interestedProperty, setInterestedProperty] = useState(false);
    const [thankyouFeedback, setThankyouFeedback] = useState(false);
    const [offerPrice, setOfferPrice] = useState(0);
    const [pofDocumentId, setPofDocumentId] = useState('');
    const [isProofOfFund, setIsProofOfFund] = useState(false);
    const [manualFile, setManualFile] = useState(null);
    const [selectedPofDocument, setSelectedPofDocument] = useState(null);
    const [verifiedData, setVerifiedData] = useState([]);
    const [verifiedDocuments, setVerifiedDocuments] = useState(false);
    const [senderId, setSenderId] = useState(0);
    const [propertyId, setPropertyId] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [proofSave, setProofSave] = useState(false);
    const [isConfirmProofOfFund, setIsConfirmProofOfFund] = useState(false);
    const [wantToBuyFormData, setWantToBuyFormData] = useState({});
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [pofDocumentError, setPofDocumentError] = useState("");
    const [dealFeedback, setDealFeedback] = useState("");
    const [isDealDocumentVerified, setIsDealDocumentVerified] = useState(false);
    const fileInputRef = useRef(null);
    const [errorData, setErrorData] = useState([]);

    const hasDealStatus = (status) => {
        if (status == null) {
            return false;
        }

        const normalizedStatus = String(status).trim().toLowerCase();
        return normalizedStatus !== "" && normalizedStatus !== "null";
    };

    useEffect(() => {
        const getPropertyDetails = async () => {
            try {
                let headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };
                let response = await axios.get(apiUrl + `view-property-details/${id}`, { headers: headers });
                setFavorite(response.data.data.buyer_deal_details);
                setDealDetailsData(response.data.data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        setLogout();
                        navigate("/login");
                    }
                    if (error.response.data.validation_errors) {
                        setErrors(error.response.data.validation_errors);
                    }
                    if (error.response.data.errors) {
                        setErrors(error.response.errors);
                    }
                    if (error.response.data.error) {
                        toast.error(error.response.data.error, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    }
                }
            }
        }
        getPropertyDetails();
    }, [isUpdatedStatus]);

    const updateFeaturedDealStatus = () => {
        try {
            const updateFeaturedDeals = async () => {
                let headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                };
                setIsShowFeaturedDeal(false);
                let response = await axios.post(`${apiUrl}buyer-deals/make-favourite`, { buyer_deal_id: featuredDealId }, { headers: headers });
                if (response.data.status) {
                    setIsUpdatedStatus(!isUpdatedStatus)
                    toast.success(response.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            }
            updateFeaturedDeals();
        } catch (error) {
            console.log(error, "featured deals");
        }
    }

    const handleFeaturedDeal = (id, status) => {
        setFeaturedDealId(id);
        setIsFeatured(status);
        setIsShowFeaturedDeal(true);
    }

    const handleSubmitOffer = (id) => {
        if (isUpdatingStatus) {
            return;
        }
        setSubmitOffer(true);
        setFeaturedDealId(id);
    };

    const handleInterestedProperty = (id) => {
        setFeaturedDealId(id);
        setInterestedProperty(true)
    };

    const propertyDetails = dealDetailsData?.property_details || {};
    const isPropertyActive =
        propertyDetails?.status !== 0 &&
        propertyDetails?.status !== "0" &&
        propertyDetails?.status !== false;
    const hasFavoriteStatus = hasDealStatus(favorite?.status);
    const chatSellerId = favorite?.sender_by || propertyDetails?.user_id;
    const chatDealId = favorite?.id || favorite?.buyer_deal_id;

    const handleChatWithSeller = async () => {
        if (!chatSellerId) {
            toast.error("Seller details are not available for this property.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        if (!chatDealId) {
            toast.error("Chat session is not available for this property yet.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        const currentStatus = String(favorite?.status ?? dealDetailsData?.status ?? "")
            .toLowerCase()
            .trim();

        if (["interested", "want_to_buy"].includes(currentStatus)) {
            if (!guardSellerAccepted(favorite || dealDetailsData)) {
                return;
            }

            navigate(`/message/${chatSellerId}/${chatDealId}`);
            return;
        }

        const payload = new FormData();
        const endpoint = isMatchedDeal ? "update-matched-deal-status" : "buyer-deals/status";
        const buyerIdKey = isMatchedDeal ? "buyer_match_id" : "buyer_deal_id";

        payload.append(buyerIdKey, buyerMatchId || favorite?.id);
        payload.append("status", "interested");
        payload.append("message", "Interested in property");

        try {
            let response = await axios.post(`${apiUrl}${endpoint}`, payload, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                }
            });

            if (response.data.status) {
                setIsUpdatedStatus(!isUpdatedStatus);
            }
        } catch (error) {
            console.error("Error updating deal status", error);
        }

        showSellerApprovalToast();

    };



    //  const handleChatWithSeller = async () => {
    //     if (!chatSellerId) {
    //         toast.error("Seller details are not available for this property.", {
    //             position: toast.POSITION.TOP_RIGHT,
    //         });
    //         return;
    //     }

    //     if (!chatDealId) {
    //         toast.error("Chat session is not available for this property yet.", {
    //             position: toast.POSITION.TOP_RIGHT,
    //         });
    //         return;
    //     }

    //     if (favorite?.status === "interested") {
    //         navigate(`/message/${chatSellerId}/${chatDealId}`);
    //         return;
    //     }

    //     try {
    //         let headers = {
    //             Accept: "application/json",
    //             Authorization: "Bearer " + getTokenData().access_token,
    //             "auth-token": getTokenData().access_token,
    //         };

    //         let payload = {
    //             status: "interested",
    //             buyer_deal_id: chatDealId,
    //         };

    //         let response = await axios.post(`${apiUrl}buyer-deals/status`, payload, { headers: headers });
    //         if (response.data.status) {
    //             setSenderId(chatSellerId);
    //             setPropertyId(chatDealId);
    //             setIsUpdatedStatus(!isUpdatedStatus);
    //             toast.success(response.data.message, {
    //                 position: toast.POSITION.TOP_RIGHT,
    //             });
    //             navigate(`/message/${chatSellerId}/${chatDealId}`);
    //         }
    //     } catch (error) {
    //         console.log(error, "new error");
    //     }
    // };
    const handleThankyouFeedback = () => {
        setThankyouFeedback(true);
        setInterestedProperty(false)
    };

    const handleProofHide = () => {
        setProofSave(false);
        setIsConfirmProofOfFund(false);
        setSubmitOffer(false);
    }

    const handleSubmitWantToBuy = async (e) => {
        e.preventDefault();
        if (isUpdatingStatus) {
            return;
        }
        const hasExistingPof = hasBuyerProofOfFundDocument(favorite);
        const hasSelectedPof = Boolean(pofDocumentId || manualFile || selectedPofDocument);

        if (!hasExistingPof && !hasSelectedPof) {
            setPofDocumentError("Please upload or select a proof of funds document for your first offer.");
            return;
        }

        const formData = new FormData(e.target);
        if (isMatchedDeal) {
            formData.append("buyer_match_id", buyerMatchId || favorite?.id);
            formData.append("message", "Offer submitted");
        } else {
            formData.append("buyer_deal_id", favorite?.id);
        }
        formData.append("status", "want_to_buy");
        formData.set("pof_document", pofDocumentId || selectedPofDocument?.id || "");
        setWantToBuyFormData(formData);
        setProofSave(true);
        setSubmitOffer(false);
        setManualFile(null);
        setSelectedPofDocument(null)
    };

    const handleSubmitNotInterested = async () => {
        setIsSubmitted(true);
        if (dealFeedback != '') {
            try {
                let headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };
                let payload;
                let endpoint;
                if (isMatchedDeal) {
                    payload = new FormData();
                    payload.append("status", "not_interested");
                    payload.append("buyer_match_id", buyerMatchId || favorite?.id);
                    payload.append("buyer_feedback", dealFeedback);
                    endpoint = 'update-matched-deal-status';
                } else {
                    payload = {
                        status: "not_interested",
                        buyer_deal_id: favorite.id,
                        buyer_feedback: dealFeedback,
                    };
                    endpoint = 'buyer-deals/status';
                }
                let response = await axios.post(`${apiUrl}${endpoint}`, payload, { headers: headers });
                if (response.data.status) {
                    toast.success(response.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setDealFeedback("");
                    handleThankyouFeedback()
                    setIsSubmitted(false);
                    setIsUpdatedStatus(!isUpdatedStatus);
                }
            } catch (error) {
                console.log(error, "new error")
            }
        }
    };

    useEffect(() => {
        const handleDealUpdate = async () => {
            try {
                if (isConfirmProofOfFund) {
                    setIsUpdatingStatus(true);
                    let headers = {
                        Accept: "application/json",
                        Authorization: "Bearer " + getTokenData().access_token,
                        "auth-token": getTokenData().access_token,
                    };
                    const endpoint = isMatchedDeal ? 'update-matched-deal-status' : 'buyer-deals/status';
                    let response = await axios.post(`${apiUrl}${endpoint}`, wantToBuyFormData, { headers: headers });
                    if (response.data.status) {
                        setProofSave(false);
                        toast.success(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        setIsUpdatedStatus(!isUpdatedStatus);
                        // navigate("/buyer/buybox-criteria");
                    }
                }
            } catch (error) {
                setSubmitOffer(true);
                setErrorData(error.response.data.errors);
            } finally {
                setIsUpdatingStatus(false);
            }
        };
        handleDealUpdate();
    }, [isConfirmProofOfFund, wantToBuyFormData]);

    const handleVerifiedDocuments = async () => {
        try {
            let headers = {
                Accept: "application/json",
                Authorization: "Bearer " + getTokenData().access_token,
                "auth-token": getTokenData().access_token,
            };
            let response = await axios.get(`${apiUrl}get-proof-of-funds-pdfs`, { headers: headers });
            const { data, status } = response.data;
            if (status) {
                setSubmitOffer(false);
                setVerifiedDocuments(true);
                setVerifiedData(data);
            }
        } catch (error) {

        }
    }

    console.log(handleVerifiedDocuments, "handleVerifiedDocuments")
    const handleSelectDocument = () => {
        if (pofDocumentId == '') {
            setPofDocumentError('Please select atleast one document.');
            return false;
        }
        const doc = verifiedData.find(d => d.id === pofDocumentId);
        if (doc) {
            setSelectedPofDocument(doc);
            setManualFile(null);
            setPofDocumentError("");
        }
        setSubmitOffer(true)
        setVerifiedDocuments(false)
    }

    const handleDeleteDocument = async (fundProofId) => {
        try {
            let headers = {
                Accept: "application/json",
                Authorization: "Bearer " + getTokenData().access_token,
                "auth-token": getTokenData().access_token,
            };
            let response = await axios.post(`${apiUrl}delete-proof-of-funds-pdfs`, { fund_proof_id: fundProofId }, { headers: headers });
            const { status } = response.data;
            if (status) {
                handleVerifiedDocuments()
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleManualFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setManualFile(file);
            setSelectedPofDocument(null);
            setPofDocumentError("");
        }
    };
    const [firstImage, ...remainingImages] = dealDetailsData.property_images || [];


    return (
        <>
            <BuyerHeader />
            <section className="main-section position-relative pt-4 pb-120">
                <div className="container position-relative">
                    <div className="back-block">
                        <div className="row">
                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                <Link to={void (0)} onClick={() => { window.history.back() }} className="back">
                                    <svg
                                        width="16"
                                        height="12"
                                        viewBox="0 0 16 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15 6H1"
                                            stroke="#0A2540"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></path>
                                        <path
                                            d="M5.9 11L1 6L5.9 1"
                                            stroke="#0A2540"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></path>
                                    </svg>
                                    Back
                                </Link>
                            </div>
                            <div className="col-6 col-sm-4 col-md-4 col-lg-4 align-self-center">
                                <h6 className="center-head text-center mb-0">Property Detail</h6>
                            </div>
                        </div>
                    </div>
                    <div className="card-box">
                        <div className="pro_detail_top">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="pro_det_top_left">
                                        {firstImage ? (
                                            <img src={firstImage} alt="property image" className="img-fluid" />
                                        ) : (
                                            <img src="/assets/images/property-img2.jpg" alt="property image" className="img-fluid" />
                                        )}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="pro_det_top_right">
                                        {remainingImages.map((imgUrl, i) => (
                                            <div key={i}>
                                                <img src={imgUrl} alt="property image" className="img-fluid" />
                                            </div>
                                        ))}
                                        <div>
                                            <img src="/assets/images/property-img2.jpg" alt="property image" className="img-fluid" />
                                            <Link to={dealDetailsData.property_details?.picture_link} className="more_images">More Photos</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pro_detail_middle">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="pro_detail_middle_left">
                                        <h4>{dealDetailsData.address}</h4>
                                        <p> <p>{dealDetailsData
                                            ?.property_details?.property_type}</p></p>
                                        <div className="middle_left_btn_area">

                                            {favorite?.id ? (
                                                <button
                                                    className="fav_btn"
                                                    onClick={() => handleFeaturedDeal(favorite.id, favorite.is_favorite)}
                                                    disabled={favorite?.status === 'not_interested'}
                                                    style={favorite?.status === 'not_interested' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                >
                                                    {favorite.is_favorite ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="17"
                                                            height="17"
                                                            viewBox="0 0 17 17"
                                                        >
                                                            <path
                                                                d="M8.93852 14.7404C8.69768 14.8254 8.30102 14.8254 8.06018 14.7404C6.00602 14.0391 1.41602 11.1137 1.41602 6.15538C1.41602 3.96663 3.17977 2.1958 5.35435 2.1958C6.64352 2.1958 7.78393 2.81913 8.49935 3.78247C9.21477 2.81913 10.3623 2.1958 11.6444 2.1958C13.8189 2.1958 15.5827 3.96663 15.5827 6.15538C15.5827 11.1137 10.9927 14.0391 8.93852 14.7404Z"
                                                                fill="white"
                                                                stroke="white"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="17"
                                                            height="17"
                                                            viewBox="0 0 17 17"
                                                        >
                                                            <path
                                                                d="M8.93852 14.7404C8.69768 14.8254 8.30102 14.8254 8.06018 14.7404C6.00602 14.0391 1.41602 11.1137 1.41602 6.15538C1.41602 3.96663 3.17977 2.1958 5.35435 2.1958C6.64352 2.1958 7.78393 2.81913 8.49935 3.78247C9.21477 2.81913 10.3623 2.1958 11.6443 2.1958C13.8189 2.1958 15.5827 3.96663 15.5827 6.15538C15.5827 11.1137 10.9927 14.0391 8.93852 14.7404Z"
                                                                fill="none"
                                                                stroke="white"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    )}
                                                    Add favorite deal
                                                </button>
                                            ) : (
                                                // DISABLED BUTTON (NOT CLICKABLE)
                                                <button
                                                    className="fav_btn"
                                                    disabled
                                                    style={{
                                                        opacity: 1,
                                                        cursor: "not-allowed",
                                                        background: "#e5e7eb",
                                                        borderColor: "#d1d5db",
                                                        color: "#9ca3af",
                                                    }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="17"
                                                        height="17"
                                                        viewBox="0 0 17 17"
                                                    >
                                                        <path
                                                            d="M8.93852 14.7404C8.69768 14.8254 8.30102 14.8254 8.06018 14.7404C6.00602 14.0391 1.41602 11.1137 1.41602 6.15538C1.41602 3.96663 3.17977 2.1958 5.35435 2.1958C6.64352 2.1958 7.78393 2.81913 8.49935 3.78247C9.21477 2.81913 10.3623 2.1958 11.6443 2.1958C13.8189 2.1958 15.5827 3.96663 15.5827 6.15538C15.5827 11.1137 10.9927 14.0391 8.93852 14.7404Z"
                                                            fill="none"
                                                            stroke="#9ca3af"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    Add favorite deal
                                                </button>
                                            )}



                                            <p>Asking Price : <span>$ {dealDetailsData.property_details?.price}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="pro_detail_middle_right">
                                        <ul className="deal_notifications_btn">
                                            <li>
                                                <Button
                                                    className='outline_btn outline_btn_green'
                                                    onClick={() => handleSubmitOffer(favorite?.id)}
                                                    disabled={!isPropertyActive || hasFavoriteStatus}
                                                >
                                                    <Image src='/assets/images/want_buy.svg' alt='' /> Want to Buy
                                                    {favorite?.status === 'want_to_buy' &&
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"></path>
                                                            </svg>
                                                        </span>
                                                    }
                                                </Button>
                                            </li>
                                            <li>
                                                <Button
                                                    className='outline_btn outline_btn_blue'
                                                    onClick={handleChatWithSeller}
                                                    disabled={!isPropertyActive || favorite?.status === 'not_interested'}
                                                >
                                                    <Image src='/assets/images/chat-seller.svg' alt='' /> chat with seller
                                                    {favorite?.status == 'interested' &&
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"></path></svg>
                                                        </span>
                                                    }
                                                </Button>
                                            </li>
                                            <li>
                                                <Button
                                                    className='outline_btn outline_btn_red'
                                                    onClick={() => { handleInterestedProperty(favorite?.id) }}
                                                    disabled={!isPropertyActive || hasFavoriteStatus}
                                                >
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M11 1L1 11" stroke="#E21B1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M1 1L11 11" stroke="#E21B1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </span> Not Interested
                                                    {favorite?.status == 'not_interested' &&
                                                        <span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"></path></svg>
                                                        </span>
                                                    }
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pro_detail_bottom">
                            <h4 className="h4_title">Additional  Information</h4>
                            <ul className="information_list">
                                {/* <li>
                                <label>Company/LLC</label>
                                <span>View Virtual Tour</span>
                            </li> */}
                                <li>
                                    <label>MLS Status</label>
                                    <span>{dealDetailsData.property_details?.market_preferance}</span>
                                </li>
                                <li>
                                    <label>State</label>
                                    <span>{dealDetailsData.property_details?.state}</span>
                                </li>
                                <li>
                                    <label>Property Type</label>
                                    <span>{dealDetailsData.property_details?.property_type}</span>
                                </li>
                                <li>
                                    <label>Purchase Method</label>
                                    <span>{dealDetailsData.property_details?.purchase_method}</span>
                                </li>
                                <li>
                                    <label>Parking (Multi-Select)</label>
                                    <span>{dealDetailsData.property_details?.parking}</span>
                                </li>
                                <li>
                                    <label>Bedroom</label>
                                    <span>{dealDetailsData.property_details?.bedroom}</span>
                                </li>
                                <li>
                                    <label>Bath</label>
                                    <span>{dealDetailsData.property_details?.bath}</span>
                                </li>
                                <li>
                                    <label>Sq Ft</label>
                                    <span>{dealDetailsData.property_details?.size} Sq Ft</span>
                                </li>
                                <li>
                                    <label>Lot Size Sq Ft</label>
                                    <span>{dealDetailsData.property_details?.lot_size} Sq Ft</span>
                                </li>
                                <li>
                                    <label>Year Built</label>
                                    <span>{dealDetailsData.property_details?.build_year}</span>
                                </li>
                                <li>
                                    <label>Stories</label>
                                    <span>{dealDetailsData.property_details?.stories}</span>
                                </li>
                                <li>
                                    <label>Solar</label>
                                    <span>{dealDetailsData.property_details?.solar == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Pool</label>
                                    <span>{dealDetailsData.property_details?.pool == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Septic</label>
                                    <span>{dealDetailsData.property_details?.septic == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Well</label>
                                    <span>{dealDetailsData.property_details?.well == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>HOA</label>
                                    <span>{dealDetailsData.property_details?.hoa == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Age restriction</label>
                                    <span>{dealDetailsData.property_details?.age_restriction == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Rental Restriction</label>
                                    <span>{dealDetailsData.property_details?.rental_restriction == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Post-Possession</label>
                                    <span>{dealDetailsData.property_details?.post_possession == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Tenant Conveys</label>
                                    <span>{dealDetailsData.property_details?.tenant == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Squatters</label>
                                    <span>{dealDetailsData.property_details?.squatters == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Building Required</label>
                                    <span>{dealDetailsData.property_details?.building_required == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Rebuild</label>
                                    <span>{dealDetailsData.property_details?.rebuild == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Foundation Issues</label>
                                    <span>{dealDetailsData.property_details?.foundation_issues == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                <li>
                                    <label>Mold</label>
                                    <span>{dealDetailsData.property_details?.mold == 1 ? 'Yes' : 'No'}</span>
                                </li>
                                {/* <li>
                                <label>Has Fireplace</label>
                                <span></span>
                            </li> */}
                                <li>
                                    <label>Fire Damaged</label>
                                    <span>{dealDetailsData.property_details?.fire_damaged == 1 ? 'Yes' : 'No'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />

            {/* confirmation modal for featured deal*/}
            <Modal show={isShowFeaturedDeal} onHide={() => setIsShowFeaturedDeal(false)} centered className='radius_30 max-340'>
                <Modal.Body className='some_space'>
                    <div className='modal_inner_content proofSave'>
                        <h3>Do you want to {isFeatured ? 'remove' : 'add'} this to featured deal</h3>
                        <div className="both_btn_group m-0">
                            <button type="button" className="light_bg_btn btn btn-primary" onClick={() => setIsShowFeaturedDeal(false)}>No</button>
                            <button type="submit" className="btn btn-fill btn-primary" onClick={updateFeaturedDealStatus}>Yes</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={submitOffer} onHide={() => { setSubmitOffer(false); setManualFile(null); setSelectedPofDocument(null) }} centered className='radius_30 max-648'>
                <Modal.Header closeButton className='new_modal_close'></Modal.Header>
                <Modal.Body className='space_modal'>
                    <div className='modal_inner_content'>
                        <div className='buy_modal_icon light_green_bg ps-2'>
                            <Image src='/assets/images/home-dollar2.svg' alt='' />
                        </div>
                        <h3>submit your offer</h3>
                        <p className='mb-4 px-md-5'>Please upload your proof of funds to submit your offer. Or select a proof of fund</p>
                        <form method='post' onSubmit={handleSubmitWantToBuy} encType="multipart/form-data">
                            <div className='offer_price_input'>
                                <label className='offer_label'>Offer Your Price</label>
                                <div className=''>
                                    <input type='text' name="offer_price" placeholder='Enter Offer Price' value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
                                </div>
                            </div>
                            <div className='upload-document-section'>
                                <div className='offer_price_area'>
                                    <label className='offer_label'>Upload POF</label>
                                    <div className='offer_price_select'>
                                        <Link href="javascript:void(0);" onClick={handleVerifiedDocuments} className="open_gallery">Open Documents Gallery</Link>

                                    </div>
                                </div>
                                <div className=''>
                                    <span className="browse-files position-relative">
                                        <input type='hidden' name="buyer_deal_id" value={favorite?.id} />
                                        <input type='hidden' name="pof_document" value={pofDocumentId} />
                                        <input id='formFile' type="file" name="pdf_file" className="default-file-input" ref={fileInputRef} onChange={handleManualFileChange} />
                                        <span className="d-block upload-file">{manualFile ? manualFile.name : selectedPofDocument ? selectedPofDocument.original_file_name : "PDF-Name.pdf"}</span>
                                        <span className="browse-files-text">Upload POF</span>
                                    </span>
                                    {errorData?.pdf_file != '' && <span className='error'>{errorData?.pdf_file}</span>}
                                </div>
                                {!hasBuyerProofOfFundDocument(favorite) && (
                                    <p className='mb-0 mt-2' style={{ fontSize: "13px", color: "#6b7280" }}>
                                        Proof of funds is required for the first offer only.
                                    </p>
                                )}
                                <div className='proof_checkbox position-relative text-start'>
                                    <label>
                                        <input type='checkbox' name='current_poof' checked={isProofOfFund} onChange={(e) => { setIsProofOfFund(e.target.checked) }} />
                                        <span>Save as default proof of funds</span>
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-fill btn-fill-green btn btn-primary w-100" disabled={isUpdatingStatus}>
                                    {isUpdatingStatus ? "Submitting..." : "Submit your offer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={letsConnect} onHide={() => setLetsConnect(false)} centered className='radius_30 max-648'>
                <Modal.Header closeButton className='new_modal_close'></Modal.Header>
                <Modal.Body className='space_modal'>
                    <div className='modal_inner_content'>
                        <div className='buy_modal_icon light_blue_bg'>
                            <Image src='/assets/images/home-interested.svg' alt='' />
                        </div>
                        <h3>Let’s Connect With Us</h3>
                        <p className='mb-4 px-md-5'>Please keep an eye on next available options which can match your criteria.</p>
                        <ul className='deal_notifications_btn'>
                            <li><Button className='outline_btn' onClick={handleChatWithSeller}><Image src='/assets/images/msg-top.svg' alt='' /> Chat With Seller</Button></li>
                        </ul>
                    </div>
                </Modal.Body>
            </Modal>


            <Modal show={verifiedDocuments} onHide={() => setVerifiedDocuments(false)} centered className='radius_20 max-1650 documents_list_modal documents_model'>
                <Modal.Header closeButton className='new_modal_close'></Modal.Header>
                <Modal.Body className='space_modal'>
                    <h6 className='m-0'>Verified documents</h6>
                    <div className="document-group">
                        {verifiedData.length > 0 ? (
                            <>
                                {verifiedData.map((data, index) => (
                                    <div key={index} className={`document-item ${pofDocumentId == data.id && "active"}`} onClick={() => setPofDocumentId(data.id)}>
                                        <img className="pdf-icon" src="/assets/images/pdf-icon.svg" alt="pdf icon" />
                                        <h5 className="doc-name">{data.original_file_name}</h5>
                                        <button className="view-btn" onClick={() => window.open(data.file_url, "_blank")}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" d="M17.6074 7.65962C15.7081 4.67495 12.929 2.95651 10.0019 2.95651C8.53833 2.95651 7.11588 3.38407 5.81677 4.18162C4.51766 4.9874 3.35011 6.16317 2.39633 7.65962C1.57411 8.9505 1.57411 11.0472 2.39633 12.3381C4.29566 15.3309 7.07477 17.0412 10.0019 17.0412C11.4654 17.0412 12.8879 16.6136 14.187 15.8161C15.4861 15.0103 16.6537 13.8345 17.6074 12.3381C18.4297 11.0554 18.4297 8.9505 17.6074 7.65962ZM10.0019 13.3247C8.16011 13.3247 6.68011 11.8365 6.68011 10.0029C6.68011 8.16939 8.16011 6.68117 10.0019 6.68117C11.8437 6.68117 13.3237 8.16939 13.3237 10.0029C13.3237 11.8365 11.8437 13.3247 10.0019 13.3247Z" fill="#07B89C" /><path d="M10.0023 7.64908C8.71138 7.64908 7.65894 8.70152 7.65894 10.0006C7.65894 11.2915 8.71138 12.344 10.0023 12.344C11.2932 12.344 12.3538 11.2915 12.3538 10.0006C12.3538 8.70975 11.2932 7.64908 10.0023 7.64908Z" fill="#07B89C" /></svg>
                                            View
                                        </button>
                                        <button className="delete-btn delete-margin" onClick={() => handleDeleteDocument(data.id)}>
                                            Delete
                                        </button>

                                    </div>
                                ))}
                            </>
                        ) : (
                            <p>No Data Found</p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {pofDocumentError && <p className='error'>{pofDocumentError}</p>}
                    {verifiedData.length > 0 && <button className="btn btn-fill" onClick={handleSelectDocument}>Submit Now!</button>}
                </Modal.Footer>
            </Modal>

            <Modal show={interestedProperty} onHide={() => setInterestedProperty(false)} centered className='radius_30 max-648'>
                <Modal.Header closeButton className='new_modal_close'></Modal.Header>
                <Modal.Body className='space_modal'>
                    <div className='modal_inner_content'>
                        <div className='buy_modal_icon light_gray_bg'>
                            <Image src='/assets/images/like-vector.svg' alt='' />
                        </div>
                        <h3>not interested in this property?</h3>
                        <p className='mb-4'>Would you like to share some feedbacks (optional)</p>
                        <div className='row'>
                            <div className="col-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <textarea className="form-control-form h-50" rows="3" onChange={(e) => { setDealFeedback(e.target.value) }} placeholder='Enter Your Feedback'>{dealFeedback}</textarea>
                                    {isSubmitted && dealFeedback.trim() == '' && <span className='error'>This field is required</span>}
                                    {errorData?.buyer_feedback && <span className='error'>{errorData?.buyer_feedback[0]}</span>}
                                </div>
                                <button type="button" className="btn btn-fill  btn btn-primary w-100" onClick={handleSubmitNotInterested}>Share Feedback</button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={thankyouFeedback} onHide={() => setThankyouFeedback(false)} centered className='radius_30 max-648'>
                <Modal.Header closeButton className='new_modal_close'></Modal.Header>
                <Modal.Body className='space_modal'>
                    <div className='modal_inner_content'>
                        <div className='buy_modal_icon light_gray_bg'>
                            <Image src='/assets/images/like-vector.svg' alt='' />
                        </div>
                        <h3>Thank you for your feedback</h3>
                        <p className='mb-0'>Please keep an eye out for your next BuyBox match</p>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Save Proof of fund */}
            {/* <Modal show={proofSave} onHide={handleProofHide} centered className='radius_30 max-340'>
                <Modal.Body className='some_space'>
                    <div className='modal_inner_content proofSave'>
                        <h3>Do you want to save this proof of fund</h3>
                        <div className="both_btn_group m-0">
                            <button type="button" className="light_bg_btn btn btn-primary" onClick={handleProofHide}>No</button>
                            <button type="submit" className="btn btn-fill btn-primary" onClick={() => setIsConfirmProofOfFund(true)}>Yes</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal> */}
            <Modal show={proofSave} onHide={handleProofHide} centered className='radius_30 max-340'>
                <Modal.Body className='some_space'>
                    <div className='modal_inner_content proofSave'>
                        <h3>Are you sure you want to submit your offer?</h3>
                        <div className="both_btn_group m-0">
                            <button type="button" className="light_bg_btn btn btn-primary" onClick={handleProofHide}>No</button>
                            <button type="submit" className="btn btn-fill btn-primary" onClick={() => { setIsConfirmProofOfFund(true) }}>Yes</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {/* <ReactTooltip id="my-tooltip-1" place="top" content="Please verify your proof of funds to enable this feature." /> */}
        </>
    );
};
export default PropertyDetails;
