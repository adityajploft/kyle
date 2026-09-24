import React, { useEffect, useState, useRef } from 'react';
import { Button, Container, Image, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from "../../partials/Footer";
import { useAuth } from "../../hooks/useAuth";

import axios from 'axios';
import BuyerHeader from '../../partials/BuyerHeader';
import { Tooltip as ReactTooltip } from "react-tooltip";
import Pagination from '../../component/Pagination';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import {
    guardSellerAccepted,
    hasSellerAccepted,
    isSellerAcceptedStatus,
    showSellerApprovalToast,
    shouldShowSellerApprovalStatus,
} from "../../util/buyerChat";

const DealNotifications = () => {
    const navigate = useNavigate();

    const { getTokenData, setLogout } = useAuth();
    const [dealConfirmation, setDealConfirmation] = useState(false);
    const [errors, setErrors] = useState([]);
    const [dealData, setDealData] = useState([]);
    const [dealId, setDealId] = useState(0);
    const [pofDocumentId, setPofDocumentId] = useState('');
    const [isDealDocumentVerified, setIsDealDocumentVerified] = useState(false);
    const [dealFeedback, setDealFeedback] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [pofDocumentError, setPofDocumentError] = useState("");
    const fileInputRef = useRef(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(0);
    const [offerPrice, setOfferPrice] = useState(0);
    const [isLoader, setIsLoader] = useState(false);
    const [isProofOfFund, setIsProofOfFund] = useState(false);
    const [isUpdatedStatus, setIsUpdatedStatus] = useState(false);
    const [proofSave, setProofSave] = useState(false);
    const [isConfirmProofOfFund, setIsConfirmProofOfFund] = useState(false);
    const [wantToBuyFormData, setWantToBuyFormData] = useState({});

    const [submitOffer, setSubmitOffer] = useState(false);
    const [interestedProperty, setInterestedProperty] = useState(false);
    const [thankyouFeedback, setThankyouFeedback] = useState(false);
    const [isShowFeaturedDeal, setIsShowFeaturedDeal] = useState(false);
    const [senderId, setSenderId] = useState(0);
    const [propertyId, setPropertyId] = useState(0);
    const [featuredDealId, setFeaturedDealId] = useState(0);
    const [isFeatured, setIsFeatured] = useState(false);
    const [verifiedData, setVerifiedData] = useState([]);
    const [selectedPofDocument, setSelectedPofDocument] = useState(null);
    const [manualFile, setManualFile] = useState(null);
    const [isSubmittingWantToBuy, setIsSubmittingWantToBuy] = useState(false);
    const [isStatusActionLoading, setIsStatusActionLoading] = useState(false);

    const hasDealStatus = (status) => {
        if (status == null) {
            return false;
        }

        const normalizedStatus = String(status).trim().toLowerCase();
        return normalizedStatus !== "" && normalizedStatus !== "null";
    };

    const isDealFeatured = (deal) => {
        const featuredValue = deal?.is_featured;

        return (
            featuredValue === 1 ||
            featuredValue === "1" ||
            featuredValue === true ||
            featuredValue === "true"
        );
    };

    const handleSubmitOffer = (id) => {
        if (isStatusActionLoading || isSubmittingWantToBuy) {
            return;
        }
        setSubmitOffer(true)
        setDealId(id);
    };

    const handleInterestedProperty = (id) => {
        setDealId(id);
        setInterestedProperty(true)
    };
    const handleThankyouFeedback = () => {
        setThankyouFeedback(true);
        setInterestedProperty(false)
    };

    const handleProofHide = () => {
        setProofSave(false);
        setDealConfirmation(true);
        setIsConfirmProofOfFund(false);
        setIsDealDocumentVerified(false);
        setSubmitOffer(false);
        setIsSubmittingWantToBuy(false);
    }
    const apiUrl = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const fetchDeal = async () => {
            setIsLoader(true);
            try {
                let headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };
                let response = await axios.get(`${apiUrl}buyer-deals/list?page=${page}`, { headers: headers });
                setDealData(response.data.deals.data);
                setLimit(response.data.deals.per_page);
                setPage(response.data.deals.current_page);
                setTotal(response.data.deals.total);
                setIsLoader(false);
            } catch (error) {
                if (error.response.status === 401) {
                    setLogout();
                }
                console.log('error', error)
                setIsLoader(false);
            }
        }
        fetchDeal();
    }, [isUpdatedStatus, page]);

    useEffect(() => {
        const markReadNotification = async () => {
            try {
                let headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };

                await axios.get(`${apiUrl}mark-as-read-notification/deal_notification`, { headers: headers });
                window.dispatchEvent(
                    new CustomEvent("buyerNotificationsRead", {
                        detail: { notificationKey: "deal_notification" },
                    }),
                );
            } catch (error) {
                if (error?.response?.status === 401) {
                    setLogout();
                }
            }
        };

        markReadNotification();
    }, []);


    const handleSubmitWantToBuy = async (e) => {
        e.preventDefault();
        if (isSubmittingWantToBuy || isStatusActionLoading) {
            return;
        }
        const hasSelectedPof = Boolean(pofDocumentId || manualFile || selectedPofDocument);

        if (!hasSelectedPof) {
            setErrors({ pdf_file: "Please upload or select a proof of funds document before submitting your offer." });
            return;
        }

        const formData = new FormData(e.target);
        formData.append("buyer_deal_id", dealId);
        formData.append("status", "want_to_buy");
        formData.set("pof_document", pofDocumentId || selectedPofDocument?.id || "");
        const formObject = Object.fromEntries(formData.entries());
        setWantToBuyFormData(formData);
        setProofSave(true);
        setSubmitOffer(false);
        setManualFile(null);
        setSelectedPofDocument(null)
    };

    const handleSubmitInterested = (id, senderId, deal) => {
        const chatSellerId = senderId || deal?.sender_by || deal?.sender_id || deal?.seller_id || deal?.user_id;
        const chatDealId = id || deal?.buyer_deal_id || deal?.id;
        const currentStatus = String(deal?.status ?? "").toLowerCase().trim();

        if (!chatSellerId || !chatDealId) {
            toast.error("Chat session is not available for this deal yet.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        if (["interested", "want_to_buy"].includes(currentStatus)) {
            if (!guardSellerAccepted(deal)) {
                return;
            }

            navigate(`/message/${chatSellerId}/${chatDealId}`);
            return;
        }

        const payload = new FormData();
        payload.append("buyer_deal_id", chatDealId);
        payload.append("status", "interested");
        payload.append("message", "Interested in property");

        const updateStatus = async () => {
            try {
                let headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };

                const response = await axios.post(`${apiUrl}buyer-deals/status`, payload, { headers });
                if (response.data.status) {
                    setIsUpdatedStatus(!isUpdatedStatus);
                    showSellerApprovalToast(response?.data?.message || "Deal status updated successfully");
                } else {
                    toast.error(response?.data?.message || response?.data?.error || "Unable to update status right now.", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            } catch (error) {
                console.error("Error updating deal status", error);
                toast.error(error?.response?.data?.message || error?.response?.data?.error || "Unable to update status right now.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        };

        updateStatus();
    }

    // const handleSubmitNotInterested = async () => {
    //     setIsSubmitted(true);
    //     if (dealFeedback.trim() !== '') {
    //         try {
    //             setIsStatusActionLoading(true);
    //             let headers = {
    //                 Accept: "application/json",
    //                 Authorization: "Bearer " + getTokenData().access_token,
    //                 "auth-token": getTokenData().access_token,
    //             };
    //             let payload = {
    //                 status: "not_interested",
    //                 buyer_deal_id: dealId,
    //                 buyer_feedback: dealFeedback,
    //             }
    //             let response = await axios.post(`${apiUrl}buyer-deals/status`, payload, { headers: headers });
    //             if (response.data.status) {
    //                 toast.success(response.data.message, {
    //                     position: toast.POSITION.TOP_RIGHT,
    //                 });
    //                 setDealFeedback("");
    //                 handleThankyouFeedback();
    //                 setIsSubmitted(false);
    //                 setIsUpdatedStatus(!isUpdatedStatus);
    //             }
    //         } catch (error) {
    //             console.log(error, "new error")
    //             const errorMessage = error?.response?.data?.message || "Something went wrong";
    //             toast.error(errorMessage);
    //             setIsSubmitted(false);
    //         } finally {
    //             setIsStatusActionLoading(false);
    //         }
    //     }
    // };

    const handleSubmitNotInterested = async () => {

        if (dealFeedback.trim() === '') {
            setIsSubmitted(true);
            return;
        }

        setIsSubmitted(false);

        try {
            setIsStatusActionLoading(true);

            let headers = {
                Accept: "application/json",
                Authorization: "Bearer " + getTokenData().access_token,
                "auth-token": getTokenData().access_token,
            };

            let payload = {
                status: "not_interested",
                buyer_deal_id: dealId,
                buyer_feedback: dealFeedback,
            };

            let response = await axios.post(
                `${apiUrl}buyer-deals/status`,
                payload,
                { headers: headers }
            );

            if (response.data.status) {
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });

                setDealFeedback("");
                setInterestedProperty(false);
                setThankyouFeedback(true);
                setIsUpdatedStatus(!isUpdatedStatus);
            }

        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || "Something went wrong";

            toast.error(errorMessage);

        } finally {
            setIsStatusActionLoading(false);
        }
    };

    useEffect(() => {
        const handleDealUpdate = async () => {
            try {
                if (isConfirmProofOfFund) {
                    setIsSubmittingWantToBuy(true);
                    let headers = {
                        Accept: "application/json",
                        Authorization: "Bearer " + getTokenData().access_token,
                        "auth-token": getTokenData().access_token,
                    };
                    let response = await axios.post(`${apiUrl}buyer-deals/status`, wantToBuyFormData, { headers: headers });
                    if (response.data.status) {
                        resetOfferForm();
                        setProofSave(false);
                        setIsConfirmProofOfFund(false);
                        setIsUpdatedStatus(!isUpdatedStatus);
                        toast.success(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        window.location.reload();
                    }
                }
            } catch (error) {
                setSubmitOffer(true);
                setErrors(error.response.data.errors);
            } finally {
                setIsSubmittingWantToBuy(false);
            }
        };
        handleDealUpdate();
    }, [isConfirmProofOfFund, wantToBuyFormData]);

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
                    window.location.reload();
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

    useEffect(() => {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const n = arr.length;
        const k = 2;
        function fetchRequestData() {

        }
        console.log(fetchRequestData());
    }, [])

    const [verifiedDocuments, setVerifiedDocuments] = useState(false);

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
            console.log(response.data, "response")
        } catch (error) {

        }
    }

    const handleSelectDocument = () => {
        if (pofDocumentId == '') {
            setPofDocumentError('Please select atleast one document.');
            return false;
        }
        const doc = verifiedData.find(d => d.id === pofDocumentId);
        if (doc) {
            setSelectedPofDocument(doc);
            setManualFile(null);
        }
        setSubmitOffer(true)
        setVerifiedDocuments(false)
    }

    // useEffect(() => {
    //     if (!submitOffer) {
    //         setPofDocumentId("");
    //     }
    // }, [submitOffer]);

    const handleDeleteDocument = async (fundProofId) => {
        console.log(fundProofId, "fundProofId");

        try {
            let headers = {
                Accept: "application/json",
                Authorization: "Bearer " + getTokenData().access_token,
                "auth-token": getTokenData().access_token,
            };
            let response = await axios.post(`${apiUrl}delete-proof-of-funds-pdfs`, { fund_proof_id: fundProofId }, { headers: headers });
            const { data, status } = response.data;
            console.log(data, "data");

            if (status) {
                handleVerifiedDocuments()
            }
            console.log(response.data, "response")
        } catch (error) {
            console.log(error);
        }
    }

    const handleManualFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setManualFile(file);
            setSelectedPofDocument(null);
            setPofDocumentId("");
            setPofDocumentError("");
            setErrors([]);
        }
    };

    const resetOfferForm = () => {
        setOfferPrice(0);
        setManualFile(null);
        setSelectedPofDocument(null);
        setPofDocumentId("");
        setErrors([]);
        setPofDocumentError("");
        setIsProofOfFund(false);
        setWantToBuyFormData({});
    };

    return (
        <>
            {/* <Header /> */}

            <BuyerHeader />
            <section className='main-section position-relative pt-4 pb-120'>
                {isLoader ? <div className="loader" style={{ textAlign: "center" }}><img src="../../../assets/images/loader.svg" /></div> :
                    <Container className='position-relative'>
                        <div className="back-block">
                            <div className="row">
                                <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                    <Link to="/" className="back">
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
                                            />
                                            <path
                                                d="M5.9 11L1 6L5.9 1"
                                                stroke="#0A2540"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Back
                                    </Link>
                                </div>
                                <div className="col-7 col-sm-4 col-md-4 col-lg-4 align-self-center">
                                    <h6 className="center-head text-center mb-0">
                                        {/* Deal Notifications */}
                                        Browse Deal
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className='card-box column_bg_space'>
                            {dealData.length > 0 ? dealData.map((data, index) => {
                                // Destructure first image and remaining images from data.property_images
                                const [firstImage, ...remainingImages] = data.property_images || [];
                                const isNotInterested = data.status === 'not_interested';
                                // Temporary comment-out for seller accept/reject UI.
                                const sellerAcceptedStatus = String(data.is_seller_accepted || "").toLowerCase();
                                const isSellerAccepted = isSellerAcceptedStatus(sellerAcceptedStatus);
                                const isFeaturedDeal = isDealFeatured(data);
                                return (
                                    <div className={`deal_column ${isFeaturedDeal ? 'favorite_deal_pro_column new_favorite_deal' : ''}`} key={index}>
                                        {isFeaturedDeal && (
                                            <span className="featured-corner-badge">Featured</span>
                                        )}
                                        <div className={`deal_left_column notifications_deal_column border-end-0 ${isFeaturedDeal ? 'mt-4 mt-lg-3' : ''}`}>
                                            <div className='deal_notifications_left flex_1column align-items-center'>
                                                <div className='pro_img'>
                                                    <div className='pro_img-main'>
                                                        {firstImage ? (
                                                            <Image src={firstImage} alt='Property Image' width={200} height={200} />
                                                        ) : (
                                                            <Image src='/assets/images/property-img.png' alt='Default Image' width={200} height={200} />
                                                        )}
                                                    </div>

                                                    <div className='deal_img_group'>
                                                        {remainingImages.map((imgUrl, i) => (
                                                            <div key={i}>
                                                                <Image src={imgUrl} alt={`Deal Image ${i + 1}`} width={100} height={100} />
                                                            </div>
                                                        ))}
                                                        <Link to={data.picture_link}>
                                                            <div className='align-items-center cursor-pointer'>
                                                                More..
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className='pro_details'>
                                                    <Link to={'/buyer/property-detail/' + data.search_log_id}><h3>{data.title}</h3></Link>
                                                    <p>{data.property_type}</p>
                                                    <div className="property-details-Browse-Deal-icons">
                                                        <div className="detail">
                                                            <div>
                                                                <img src='/assets/images/double-bed.svg' />
                                                            </div>
                                                            <span>Beds: {data.bedroom_min || 0}</span>
                                                        </div>
                                                        <div className="detail">
                                                            <div>
                                                                <img src='/assets/images/bath-1.svg' />
                                                            </div>
                                                            <span>Baths: {data.bath || 0}</span>
                                                        </div>
                                                        <div className="detail">
                                                            <div>
                                                                <img src='/assets/images/network-1.svg' />
                                                            </div>
                                                            <span>Liveable sq. ft. : {data.size || 0}</span>
                                                        </div>
                                                        <div className="detail">
                                                            <div>
                                                                <img src='/assets/images/full-screen-2.svg' />
                                                            </div>
                                                            <span>Lot sq. ft. : {data.lot_size || 0}</span>
                                                        </div>
                                                    </div>

                                                    <div className="middle_left_btn_area">
                                                        {(data.id || data.buyer_deal_id) && (
                                                            <button
                                                                className="view_property_btn"
                                                                type="button"
                                                                onClick={() => navigate(`/buyer/property-detail/${data.search_log_id}`)}
                                                                style={{
                                                                    backgroundColor: "#3f53fe",
                                                                    color: "white",
                                                                    border: "none",
                                                                    borderRadius: "8px",
                                                                    padding: "8px 16px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "8px",
                                                                    fontSize: "14px",
                                                                    fontWeight: "600",
                                                                    marginRight: "10px"
                                                                }}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                                    <circle cx="12" cy="12" r="3"></circle>
                                                                </svg>
                                                                View Property
                                                            </button>
                                                        )}
                                                        <button className="fav_btn" onClick={() => handleFeaturedDeal(data.id, data.is_favorite)}>
                                                            {data.is_favorite ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                                    <path d="M8.93852 14.7404C8.69768 14.8254 8.30102 14.8254 8.06018 14.7404C6.00602 14.0391 1.41602 11.1137 1.41602 6.15538C1.41602 3.96663 3.17977 2.1958 5.35435 2.1958C6.64352 2.1958 7.78393 2.81913 8.49935 3.78247C9.21477 2.81913 10.3623 2.1958 11.6444 2.1958C13.8189 2.1958 15.5827 3.96663 15.5827 6.15538C15.5827 11.1137 10.9927 14.0391 8.93852 14.7404Z" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                                    <path d="M8.93852 14.7404C8.69768 14.8254 8.30102 14.8254 8.06018 14.7404C6.00602 14.0391 1.41602 11.1137 1.41602 6.15538C1.41602 3.96663 3.17977 2.1958 5.35435 2.1958C6.64352 2.1958 7.78393 2.81913 8.49935 3.78247C9.21477 2.81913 10.3623 2.1958 11.6443 2.1958C13.8189 2.1958 15.5827 3.96663 15.5827 6.15538C15.5827 11.1137 10.9927 14.0391 8.93852 14.7404Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                            Add favorite deal
                                                        </button>
                                                        <p className='mb-0'>Asking Price : <span>${data.price || 0}</span></p>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='deal_notifications_right flex_auto_column min-w-255'>
                                                <ul className="deal_notifications_btn" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                    <li>
                                                        <Button className='outline_btn' onClick={() => handleSubmitOffer(data.id)} disabled={isStatusActionLoading || isSubmittingWantToBuy || hasDealStatus(data.status) || !(data.id || data.buyer_deal_id)} style={{
                                                            height: "50px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "10px",
                                                            borderRadius: "12px",
                                                            fontSize: "15px",
                                                            fontWeight: "600",
                                                            border: "2px solid #22c55e",
                                                            color: "#22c55e",
                                                            background: "#f0fdf4"
                                                        }}>
                                                            <Image src='/assets/images/want_buy.svg' alt='' /> Want to Buy
                                                            {data.status === 'want_to_buy' &&
                                                                <span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"></path>
                                                                    </svg>
                                                                </span>
                                                            }
                                                        </Button>
                                                    </li>
                                                    <li className='mt-0'>
                                                        <Button className='outline_btn' onClick={() => { handleSubmitInterested(data.id, data.sender_by, data) }} disabled={isNotInterested || !(data.id || data.buyer_deal_id)} style={{
                                                            height: "50px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "10px",
                                                            borderRadius: "12px",
                                                            fontSize: "15px",
                                                            fontWeight: "600",
                                                            border: "2px solid #3f53fe",
                                                            color: "#3f53fe",
                                                            background: "#eef2ff"
                                                        }}>
                                                            <Image src='/assets/images/chat-seller.svg' alt='' /> chat with seller
                                                            {data.status == 'interested' &&
                                                                <span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"></path></svg>
                                                                </span>
                                                            }
                                                        </Button>
                                                    </li>
                                                    <li className='mt-0'>
                                                        <Button className='text_btn not_interest_btn' onClick={() => { handleInterestedProperty(data.id) }} disabled={isStatusActionLoading || hasDealStatus(data.status) || !(data.id || data.buyer_deal_id)} style={{
                                                            height: "36px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            gap: "6px",
                                                            borderRadius: "8px",
                                                            fontSize: "13px",
                                                            fontWeight: "500",
                                                            background: "#f3f4f6",
                                                            border: "1px solid #d1d5db",
                                                            color: "#9ca3af",
                                                            opacity: "0.5"
                                                        }}>
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                    <path d="M11 1L1 11" stroke="#E21B1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M1 1L11 11" stroke="#E21B1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </span>
                                                            {data.status == 'not_interested' &&
                                                                <span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"></path></svg>
                                                                </span>
                                                            }
                                                        </Button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>


                                        {/* Sold Out Option */}
                                        {/* {data.mark_as_sold === 1 &&
                                            <div className='sold_out_deal'>
                                                <Image src='/assets/images/sold-img.svg' alt='pending' style={{ opacity: 0.8 }} />
                                                <h6>This property is pending approval.</h6>
                                            </div>
                                        } */}
                                        {/* {String(data.is_seller_accepted || "").toLowerCase() === "pending" && (
                                            <div style={{ marginBottom: data.mark_as_sold === 1 ? "8px" : "12px", color: "#E21B1B", fontWeight: "600" }}>
                                                Seller Status : Pending
                                            </div>
                                        )} */}

                                        {/* {data.mark_as_sold === 1 && (
                                            <span className="status-badge pending">Pending</span>
                                        )} */}

                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                                            {data.mark_as_sold === 1 && (
                                                <span className="status-badge pending">
                                                    Pending Offer Deal
                                                </span>
                                            )}

                                            {/* {shouldShowSellerApprovalStatus(data) && isSellerAccepted && (
                                                <span className="status-badge seller-accepted">

                                                    Deal Approval Accepted By Seller
                                                </span>
                                            )}
                                            {shouldShowSellerApprovalStatus(data) && !isSellerAccepted && sellerAcceptedStatus === "pending" && (
                                                <span className="status-badge pending">
                                                    Deal Approval Pending By Seller
                                                </span>
                                            )}
                                            {shouldShowSellerApprovalStatus(data) && !isSellerAccepted && (sellerAcceptedStatus === "reject" ||
                                                sellerAcceptedStatus === "rejected") && (
                                                    <span className="status-badge seller-rejected">
                                                        Deal Approval Rejected By Seller
                                                    </span>
                                                )} */}

                                        </div>
                                        {data.mark_as_sold === 2 && (
                                            <div className='sold_out_deal'>
                                                <Image src='/assets/images/sold-img.svg' alt='sold-out' />
                                                <h6>This property has been sold.</h6>
                                                <p>{data.sold_date}</p>
                                            </div>
                                        )}

                                    </div>
                                );
                            }) : <div className='deal_column text-center'><p>No Data found</p></div>}
                        </div>
                        <Pagination page={page} setPage={setPage} limit={limit} total={total} />
                    </Container>
                }
            </section>
            <Footer />
            <Modal show={submitOffer} onHide={() => { setSubmitOffer(false); setManualFile(null); setSelectedPofDocument(null) }} centered className='radius_30 max-648'>
                <Modal.Header closeButton className='new_modal_close'></Modal.Header>
                <Modal.Body className='space_modal'>
                    <div className='modal_inner_content'>
                        <div className='buy_modal_icon light_green_bg ps-2'>
                            <Image src='/assets/images/home-dollar2.svg' alt='' />
                        </div>
                        <h3>submit your offer</h3>
                        <p className='mb-4 px-md-5'>Please upload your proof of funds to submit your offer. Or select a proof of fund</p>
                        {isDealDocumentVerified ?
                            <ul className='deal_notifications_btn'>
                                <li>
                                    <Button className='outline_btn'><Image src='/assets/images/call-preference-green.svg' alt='' /> make an offer</Button>
                                </li>
                                <li>
                                    <Link to='/message'><Button className='outline_btn'><Image src='/assets/images/msg-top.svg' alt='' /> Chat With Seller</Button></Link>
                                </li>
                            </ul>
                            :
                            <form method='post' onSubmit={handleSubmitWantToBuy} encType="multipart/form-data">
                                <div className='offer_price_input'>
                                    <label className='offer_label'>Offer Your Price</label>
                                    <div className=''>
                                        <input type='text' placeholder='Enter Offer Price' value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
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
                                            <input type='hidden' name="buyer_deal_id" value={dealId} />
                                            <input type='hidden' name="pof_document" value={pofDocumentId} />
                                            <input id='formFile' type="file" name="pdf_file" className="default-file-input" ref={fileInputRef} onChange={handleManualFileChange} />
                                            <span className="d-block upload-file">{manualFile ? manualFile.name : selectedPofDocument ? selectedPofDocument.original_file_name : "PDF-Name.pdf"}</span>
                                            <span className="browse-files-text">Upload POF</span>
                                        </span>
                                        {errors?.pdf_file != '' && <span className='error'>{errors?.pdf_file}</span>}
                                    </div>
                                    {/* {!errors?.pdf_file && !pofDocumentError && (
                                        <p className='mb-0 mt-2' style={{ fontSize: "13px", color: "#6b7280" }}>
                                            Proof of funds is required to submit this offer.
                                        </p>
                                    )} */}
                                    <div className='proof_checkbox position-relative text-start'>
                                        <label>
                                            <input type='checkbox' name='current_poof' checked={isProofOfFund} onChange={(e) => { setIsProofOfFund(e.target.checked) }} />
                                            <span>Save as default proof of funds</span>
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-fill btn-fill-green btn btn-primary w-100" disabled={isSubmittingWantToBuy || isStatusActionLoading}>
                                        {isSubmittingWantToBuy ? "Submitting..." : "Submit your offer"}
                                    </button>
                                </div>
                            </form>
                        }
                    </div>
                </Modal.Body>
            </Modal>

            {/* <Modal show={letsConnect} onHide={() => setLetsConnect(false)} centered className='radius_30 max-648'>
            <Modal.Header closeButton className='new_modal_close'></Modal.Header>
            <Modal.Body className='space_modal'>
                <div className='modal_inner_content'>
                    <div className='buy_modal_icon light_blue_bg'>
                        <Image src='/assets/images/home-interested.svg' alt='' />
                    </div>
                    <h3>Let’s Connect With Us</h3>
                    <p className='mb-4 px-md-5'>Please keep an eye on next available options which can match your criteria.</p>
                    <ul className='deal_notifications_btn'>
                        <li><Link to={`/message/${senderId}/${propertyId}`}><Button className='outline_btn'><Image src='/assets/images/msg-top.svg' alt='' /> Chat With Seller</Button></Link></li>
                    </ul>
                </div>
            </Modal.Body>
        </Modal> */}

            <Modal show={verifiedDocuments} onHide={() => setVerifiedDocuments(false)} centered className='radius_20 max-1650 documents_list_modal documents_model'>
                <Modal.Header closeButton className='new_modal_close'></Modal.Header>
                <Modal.Body className='space_modal'>
                    <h6 className='m-0'>Verified documents</h6>
                    <div class="document-group">
                        {verifiedData.length > 0 ? (
                            <>
                                {verifiedData.map((data, index) => (
                                    <div key={index} className={`document-item ${pofDocumentId == data.id && "active"}`} onClick={() => setPofDocumentId(data.id)}>
                                        <img class="pdf-icon" src="/assets/images/pdf-icon.svg" alt="pdf icon" />
                                        <h5 class="doc-name">{data.original_file_name}</h5>
                                        <button class="view-btn" onClick={() => window.open(data.file_url, "_blank")}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.4" d="M17.6074 7.65962C15.7081 4.67495 12.929 2.95651 10.0019 2.95651C8.53833 2.95651 7.11588 3.38407 5.81677 4.18162C4.51766 4.9874 3.35011 6.16317 2.39633 7.65962C1.57411 8.9505 1.57411 11.0472 2.39633 12.3381C4.29566 15.3309 7.07477 17.0412 10.0019 17.0412C11.4654 17.0412 12.8879 16.6136 14.187 15.8161C15.4861 15.0103 16.6537 13.8345 17.6074 12.3381C18.4297 11.0554 18.4297 8.9505 17.6074 7.65962ZM10.0019 13.3247C8.16011 13.3247 6.68011 11.8365 6.68011 10.0029C6.68011 8.16939 8.16011 6.68117 10.0019 6.68117C11.8437 6.68117 13.3237 8.16939 13.3237 10.0029C13.3237 11.8365 11.8437 13.3247 10.0019 13.3247Z" fill="#07B89C" /><path d="M10.0023 7.64908C8.71138 7.64908 7.65894 8.70152 7.65894 10.0006C7.65894 11.2915 8.71138 12.344 10.0023 12.344C11.2932 12.344 12.3538 11.2915 12.3538 10.0006C12.3538 8.70975 11.2932 7.64908 10.0023 7.64908Z" fill="#07B89C" /></svg>
                                            View
                                        </button>
                                        <button class="delete-btn delete-margin" onClick={() => handleDeleteDocument(data.id)}>
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

            <Modal show={interestedProperty} onHide={() => {
                setInterestedProperty(false);
                setDealFeedback("");
                setIsSubmitted(false);
                setErrors([]);
            }} centered className='radius_30 max-648'>
                {/* <Modal show={interestedProperty} onHide={() => { setInterestedProperty(false); setIsSubmitted(false); setIsStatusActionLoading(false); }} centered className='radius_30 max-648'> */}
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
                                {/* <div className="form-group">
                                    <textarea className="form-control-form h-50" rows="3" onChange={(e) => {
                                        setDealFeedback(e.target.value);

                                        if (e.target.value.trim() !== "") {
                                            setIsSubmitted(false);
                                        }
                                    }} placeholder='Enter Your Feedback' value={dealFeedback}></textarea>
                                    {isSubmitted && dealFeedback.trim() == '' && <span className='error'>This field is required</span>}
                                    {errors?.buyer_feedback && <span className='error'>{errors?.buyer_feedback[0]}</span>}
                                </div> */}
                                <div className="form-group">
                                    <textarea className="form-control-form h-50" rows="3" onChange={(e) => { setDealFeedback(e.target.value) }} placeholder='Enter Your Feedback' value={dealFeedback}></textarea>
                                    {isSubmitted && dealFeedback.trim() == '' && <span className='error'>This field is required</span>}
                                    {errors?.buyer_feedback && <span className='error'>{errors?.buyer_feedback[0]}</span>}
                                </div>
                                <button type="button" className="btn btn-fill  btn btn-primary w-100" onClick={handleSubmitNotInterested}>
                                    {/* {isStatusActionLoading || (isSubmitted && dealFeedback.trim() !== "") ? "Sharing..." : "Share Feedback"} */}
                                    {/* {isStatusActionLoading ? "Sharing..." : "Share Feedback"} */}
                                    Share Feedback
                                </button>
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
            <Modal show={proofSave} onHide={handleProofHide} centered className='radius_30 max-340'>
                <Modal.Body className='some_space'>
                    <div className='modal_inner_content proofSave'>
                        <h3>Do you want to save this proof of fund</h3>
                        <div className="both_btn_group m-0">
                            <button type="button" className="light_bg_btn btn btn-primary" onClick={handleProofHide}>No</button>
                            <button type="button" className="btn btn-fill btn-primary" onClick={() => setIsConfirmProofOfFund(true)} disabled={isSubmittingWantToBuy || isStatusActionLoading}>
                                {isSubmittingWantToBuy ? "Submitting..." : "Yes"}
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

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

            {/* <ReactTooltip id="my-tooltip-1" place="top" content="Please verify your proof of funds to enable this feature." /> */}
        </>
    );
};
export default DealNotifications;
