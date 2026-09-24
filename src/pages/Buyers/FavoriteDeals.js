import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Container, Form, Image, Modal, Row, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from '../../partials/Footer';
import { useAuth } from "../../hooks/useAuth";

import axios from 'axios';
import BuyerHeader from '../../partials/BuyerHeader';
import { Tooltip as ReactTooltip } from "react-tooltip";
import Pagination from '../../component/Pagination';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const FavoriteDeals = () => {
    const navigate = useNavigate();
    const { getTokenData, setLogout } = useAuth();
    const [dealConfirmation, setDealConfirmation] = useState(false);
    const [errors, setErrors] = useState([]);
    const [dealData, setDealData] = useState([]);
    const [dealId, setDealId] = useState(0);
    const [isDealDocumentVerified, setIsDealDocumentVerified] = useState(false);
    const [dealFeedback, setDealFeedback] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [attachmentsError, setAttachmentsError] = useState("");
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
    const [isSubmittingWantToBuy, setIsSubmittingWantToBuy] = useState(false);
    const [submitOffer, setSubmitOffer] = useState(false);
    const [letsConnect, setLetsConnect] = useState(false);
    const [interestedProperty, setInterestedProperty] = useState(false);
    const [thankyouFeedback, setThankyouFeedback] = useState(false);
    const [isShowFeaturedDeal, setIsShowFeaturedDeal] = useState(false);
    const [senderId, setSenderId] = useState(0);
    const [featuredDealId, setFeaturedDealId] = useState(0);
    const [isFeatured, setIsFeatured] = useState(false);

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
        if (submitOffer || isSubmittingWantToBuy) {
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


    const handleSubmitWantToBuy = async (e) => {
        e.preventDefault();
        if (isSubmittingWantToBuy) {
            return;
        }
        const formData = new FormData(e.target);
        formData.append("buyer_deal_id", dealId);
        formData.append("status", "want_to_buy");
        const formObject = Object.fromEntries(formData.entries());
        setWantToBuyFormData(formData);
        setProofSave(true);
        setSubmitOffer(false);
    };

    const handleChatWithSeller = (deal) => {
        const chatSellerId = deal?.sender_by || deal?.sender_id || deal?.seller_id || deal?.user_id;
    const chatDealId = deal?.id || deal?.buyer_deal_id;

        if (!chatSellerId || !chatDealId) {
            toast.error("Chat session is not available for this deal yet.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        navigate(`/message/${chatSellerId}/${chatDealId}`);
    }



    //   const handleSubmitInterested = async (id, senderId)=>{
    //     try{
    //         let headers = {
    //             Accept: "application/json",
    //             Authorization: "Bearer " + getTokenData().access_token,
    //             "auth-token": getTokenData().access_token,
    //         };
    //         let payload = {
    //             status:"interested",
    //             buyer_deal_id:id,
    //         }
    //         let response = await axios.post(`${apiUrl}buyer-deals/status`,payload,{headers:headers});
    //         if(response.data.status){
    //             setSenderId(senderId);
    //             setLetsConnect(true);
    //             toast.success(response.data.message, {
    //                 position: toast.POSITION.TOP_RIGHT,
    //             });
    //         }
    //     }catch(error){
    //         console.log(error,"new error")
    //     }
    // }
    const handleSubmitNotInterested = async () => {
        setIsSubmitted(true);
        if (dealFeedback != '') {
            try {
                let headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };
                let payload = {
                    status: "not_interested",
                    buyer_deal_id: dealId,
                    buyer_feedback: dealFeedback,
                }
                let response = await axios.post(`${apiUrl}buyer-deals/status`, payload, { headers: headers });
                if (response.data.status) {
                    toast.success(response.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setDealFeedback("");
                    handleThankyouFeedback()
                    setIsSubmitted(false);
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
                    setIsSubmittingWantToBuy(true);
                    let headers = {
                        Accept: "application/json",
                        Authorization: "Bearer " + getTokenData().access_token,
                        "auth-token": getTokenData().access_token,
                    };
                    let response = await axios.post(`${apiUrl}buyer-deals/status`, wantToBuyFormData, { headers: headers });
                    if (response.data.status) {
                        toast.success(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        // navigate("/buyer/buybox-criteria");
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

                                        Favorite  deals
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className='card-box column_bg_space'>
                            {dealData.length > 0 ? dealData.map((data, index) => {
                                console.log("data.property_images", data);
                                const [firstImage, ...remainingImages] = data.property_images || [];
                                const isFeaturedDeal = isDealFeatured(data);
                                return (
                                    data.is_favorite &&
                                    <div className={`deal_column ${isFeaturedDeal ? 'favorite_deal_pro_column new_favorite_deal' : ''}`} key={index}>
                                        {isFeaturedDeal && (
                                            <span className="featured-corner-badge">Featured</span>
                                        )}
                                        <div className='deal_left_column notifications_deal_column border-end-0'>
                                            <div className='deal_notifications_left flex_1column align-items-center'>
                                                <div className='pro_img'>
                                                    <div className='pro_img-main'>
                                                        {firstImage ? (
                                                            <Image src={firstImage} alt='Property Image' width={200} height={200} />
                                                        ) : (
                                                            <Image src='/assets/images/property-img.png' alt='Default Image' width={200} height={200} />
                                                        )}
                                                    </div>

                                                    {/* Remaining Images Section */}
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

                                                {/* Property Details Section */}
                                                <div className='pro_details'>
                                                    <h3>{data.title}</h3>
                                                    {/* <p>Real Estate Company That Prioritizes Property</p> */}
                                                    <p>{data?.property_details?.property_type}</p>
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
                                                    <div class="middle_left_btn_area">
                                                        <button class="fav_btn">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                                <path d="M8.93852 14.7404C8.69768 14.8254 8.30102 14.8254 8.06018 14.7404C6.00602 14.0391 1.41602 11.1137 1.41602 6.15538C1.41602 3.96663 3.17977 2.1958 5.35435 2.1958C6.64352 2.1958 7.78393 2.81913 8.49935 3.78247C9.21477 2.81913 10.3623 2.1958 11.6444 2.1958C13.8189 2.1958 15.5827 3.96663 15.5827 6.15538C15.5827 11.1137 10.9927 14.0391 8.93852 14.7404Z" fill="white" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                            Add favorite deal
                                                        </button>
                                                        <p className='mb-0'>Asking Price : <span>${data.price || 0}</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Buttons Section */}
                                            <div className='deal_notifications_right flex_auto_column'>
                                                <ul className={`deal_notifications_btn ${hasDealStatus(data.status) ? 'disabled-btn' : ''}`}>
                                                    <li>
                                                        <Button
                                                            className='outline_btn'
                                                            onClick={() => handleSubmitOffer(data.id)}
                                                            disabled={hasDealStatus(data.status) || !data.id}
                                                        >
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
                                                    <li>
                                                        <Button className='outline_btn' onClick={() => { handleChatWithSeller(data) }}>
                                                            {/* <Button className='outline_btn' onClick={()=>{handleSubmitInterested(data.id, data.sender_by)}}></Button> */}
                                                            <Image src='/assets/images/chat-seller.svg' alt='' /> chat with seller
                                                            {data.status == 'interested' &&
                                                                <span>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"></path></svg>
                                                                </span>
                                                            }
                                                        </Button>
                                                    </li>
                                                    <li>
                                                        <Button className='text_btn not_interest_btn' onClick={() => { handleInterestedProperty(data.id) }}>
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
                                    </div>
                                );
                            }) : <div className='deal_column text-center'><p>No Data found</p></div>}
                        </div>
                        <Pagination page={page} setPage={setPage} limit={limit} total={total} />
                    </Container>
                }
            </section>
            <Footer />
            <Modal show={submitOffer} onHide={() => setSubmitOffer(false)} centered className='radius_30 max-648'>
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
                                    {/* <Link to='/message'><Button className='outline_btn'><Image src='/assets/images/msg-top.svg' alt='' /> Chat With Seller</Button></Link> */}
                                    <Button className='outline_btn' onClick={() => {
                                        const currentDeal = dealData.find((item) => item.id === dealId);
                                        if (currentDeal) {
                                            handleChatWithSeller(currentDeal);
                                        }
                                    }}><Image src='/assets/images/msg-top.svg' alt='' /> Chat With Seller</Button>
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
                                            <select name='proof_of_fund_option'>
                                                <option value={1}>verified proof of funds</option>
                                                <option value={2}>verified proof of funds</option>
                                                <option value={3}>verified proof of funds</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className=''>
                                        <span className="browse-files position-relative">
                                            <input type='hidden' name="buyer_deal_id" value={dealId} />
                                            <input id='formFile' type="file" name="pdf_file" className="default-file-input" ref={fileInputRef} />
                                            <span className="d-block upload-file">PDF-Name.pdf</span>
                                            <span className="browse-files-text">Upload POF</span>
                                        </span>
                                        {errors.pdf_file != '' && <span className='error'>{errors.pdf_file}</span>}
                                    </div>
                                    <div className='proof_checkbox position-relative text-start'>
                                        <label>
                                            <input type='checkbox' name='current_poof' checked={isProofOfFund} onChange={(e) => { setIsProofOfFund(e.target.checked) }} />
                                            <span>Save as default proof of funds</span>
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-fill btn-fill-green btn btn-primary w-100" disabled={isSubmittingWantToBuy}>
                                        {isSubmittingWantToBuy ? "Submitting..." : "Submit your offer"}
                                    </button>
                                </div>
                            </form>
                        }
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
                            {/* <li><Link to={`/message/${senderId}`}><Button className='outline_btn'><Image src='/assets/images/msg-top.svg' alt='' /> Chat With Seller</Button></Link></li> */}

                            <li><Button className='outline_btn' onClick={() => {
                                const currentDeal = dealData.find((item) => item.id === dealId || item.buyer_deal_id === dealId);
                                if (currentDeal) {
                                    handleChatWithSeller(currentDeal);
                                }
                            }}><Image src='/assets/images/msg-top.svg' alt='' /> Chat With Seller</Button></li>
                        </ul>
                    </div>
                </Modal.Body>
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
                                    {errors.buyer_feedback && <span className='error'>{errors.buyer_feedback[0]}</span>}
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
            <Modal show={proofSave} onHide={handleProofHide} centered className='radius_30 max-340'>
                <Modal.Body className='some_space'>
                    <div className='modal_inner_content proofSave'>
                        <h3>Do you want to save this proof of fund</h3>
                        <div className="both_btn_group m-0">
                            <button type="button" className="light_bg_btn btn btn-primary" onClick={handleProofHide}>No</button>
                            <button type="submit" className="btn btn-fill btn-primary" onClick={() => setIsConfirmProofOfFund(true)}>Yes</button>
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

            <ReactTooltip
                id="my-tooltip-1"
                place="top"
                content="Please verify your proof of funds to enable this feature." />
        </>
    );
};
export default FavoriteDeals;
