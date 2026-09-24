import React, { useEffect, useRef, useState } from 'react';
import BuyerHeader from "../../partials/BuyerHeader";
import Footer from "../../partials/Footer";
import { Button, Container, Image, Spinner, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import Pagination from "../../component/Pagination/index";


const ViewedProperty = () => {
  const navigate = useNavigate();
  const { getTokenData, setLogout } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [dealData, setDealData] = useState([]);
  const [limit, setLimit] = useState(0);
  const [dealId, setDealId] = useState(0);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const [isLoader, setIsLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredDealId, setFeaturedDealId] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isShowFeaturedDeal, setIsShowFeaturedDeal] = useState(false);
  const [interestedProperty, setInterestedProperty] = useState(false);
  const [isUpdatedStatus, setIsUpdatedStatus] = useState(false);
  const [submitOffer, setSubmitOffer] = useState(false);
  const [proofSave, setProofSave] = useState(false);
  const [isConfirmProofOfFund, setIsConfirmProofOfFund] = useState(false);
  const [wantToBuyFormData, setWantToBuyFormData] = useState({});
  const [offerPrice, setOfferPrice] = useState(0);
  const [isProofOfFund, setIsProofOfFund] = useState(false);


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

  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + getTokenData().access_token,
    "auth-token": getTokenData().access_token,
  };

  useEffect(() => {
    fetchDeal();
  }, [currentPage, isUpdatedStatus]);


  const fetchDeal = async () => {
    setIsLoader(true);
    try {
      const response = await axios.get(
        `${apiUrl}buyer-deals/list?page=${currentPage}&viewed_properties=1`,
        { headers }
      );

      const deals = response.data.deals;

      setDealData(deals.data || []);
      setLimit(deals.per_page);
      setCurrentPage(deals.current_page);
      setTotalPages(deals.last_page);

    } catch (error) {
      if (error.response?.status === 401) {
        setLogout();
      }
    } finally {
      setIsLoader(false);
    }
  };
  
  const handleNotInterestedClick = (id) => {
    setDealId(id);
    setInterestedProperty(true);
  };

  const handleSubmitOffer = (id, price = 0) => {
    setErrors([]);
    setDealId(id);
    setOfferPrice(price || 0);
    setSubmitOffer(true);
  };

  const handleProofHide = () => {
    setProofSave(false);
    setIsConfirmProofOfFund(false);
    setSubmitOffer(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFeaturedDeal = (id, status) => {
    setFeaturedDealId(id);
    setIsFeatured(status);
    setIsShowFeaturedDeal(true);
  };

  const handleChatWithSeller = (deal) => {
    const chatSellerId = deal?.sender_by || deal?.sender_id || deal?.seller_id || deal?.user_id;
    const chatDealId = deal?.id || deal?.buyer_deal_id;

    if (!chatSellerId || !chatDealId) {
      toast.error("Chat session is not available for this property yet.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    navigate(`/message/${chatSellerId}/${chatDealId}`);
  };

  const handleSubmitWantToBuy = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("buyer_deal_id", dealId);
    formData.append("status", "want_to_buy");
    formData.set("current_poof", isProofOfFund ? "true" : "false");
    setWantToBuyFormData(formData);
    setProofSave(true);
    setSubmitOffer(false);
  };

  useEffect(() => {
    const updateDealStatus = async () => {
      if (!isConfirmProofOfFund) {
        return;
      }

      try {
        const response = await axios.post(
          `${apiUrl}buyer-deals/status`,
          wantToBuyFormData,
          { headers },
        );

        if (response.data.status) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsUpdatedStatus((prev) => !prev);
          setProofSave(false);
          setIsConfirmProofOfFund(false);
        }
      } catch (error) {
        setSubmitOffer(true);
        setProofSave(false);
        setErrors(error?.response?.data?.errors || {});
      }
    };

    updateDealStatus();
  }, [isConfirmProofOfFund, wantToBuyFormData]);

  const updateFeaturedDealStatus = async () => {
    try {
      const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
      };

      setIsShowFeaturedDeal(false);

      const response = await axios.post(
        `${apiUrl}buyer-deals/make-favourite`,
        { buyer_deal_id: featuredDealId },
        { headers }
      );

      if (response.data.status) {
        toast.success(response.data.message);
        setIsUpdatedStatus(!isUpdatedStatus);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error("Favorite deal error", error);
    }
  };



  return (
    <>
      <BuyerHeader />
      <section className='main-section position-relative pt-4 pb-120'>
        <Container className='position-relative'>
          <div className="back-block">
            <div className="row">
              <div className="col-4">
                <Link to="/" className="back">
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 6H1" stroke="#0A2540" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.9 11L1 6L5.9 1" stroke="#0A2540" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </Link>
              </div>
              <div className="col-7 col-sm-4 col-md-4 col-lg-4 align-self-center">
                <h6 className="center-head text-center mb-0">Viewed Properties</h6>
              </div>
            </div>
          </div>

          {isLoader ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : dealData.length === 0 ? (
            <div className='deal_column text-center pt-4'><p>No viewed properties found</p></div>
          ) : (
            <div className='card-box column_bg_space'>
              {dealData.map((deal) => {
                const isFeaturedDeal = isDealFeatured(deal);

                return (
                  <div className={`deal_column ${isFeaturedDeal ? 'favorite_deal_pro_column new_favorite_deal' : ''}`} key={deal.id}>
                    {isFeaturedDeal && (
                      <span className="featured-corner-badge">Featured</span>
                    )}
                    <div className='deal_left_column notifications_deal_column border-end-0'>
                      <div className='deal_notifications_left flex_1column align-items-center'>
                        <div className='pro_img'>
                          <div className='pro_img-main'>
                            <Link to={'/buyer/property-detail/' + deal.search_log_id}>
                              <Image
                                src={deal.property_images?.[0] || '/assets/images/property-img.png'}
                                alt='Property'
                                width={200}
                                height={200}
                              />
                            </Link>
                          </div>
                          <div className='deal_img_group'>
                            {deal.property_images?.slice(1, 4).map((img, idx) => (
                              <div key={idx}>
                                <Image src={img || '/assets/images/property-img.png'} alt='' width={100} height={100} />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className='pro_details'>
                          <Link to={'/buyer/property-detail/' + deal.search_log_id}>
                            <h3>{deal.title}</h3>
                          </Link>
                          <p>{deal.address}</p>

                          <div className="property-details-Browse-Deal-icons">
                            <div className="detail">
                              <div><img src='/assets/images/double-bed.svg' alt='Bed' /></div>
                              <span>Beds: {deal.bedroom_min || 0}</span>
                            </div>
                            <div className="detail">
                              <div><img src='/assets/images/bath-1.svg' alt='Bath' /></div>
                              <span>Baths: {deal.bath || 0}</span>
                            </div>
                            <div className="detail">
                              <div><img src='/assets/images/network-1.svg' alt='Liveable sq ft' /></div>
                              <span>Liveable sq. ft.: {deal.size || 0}</span>
                            </div>
                            <div className="detail">
                              <div><img src='/assets/images/full-screen-2.svg' alt='Lot sq ft' /></div>
                              <span>Lot sq. ft.: {deal.lot_size || 0}</span>
                            </div>
                          </div>

                          <div className="middle_left_btn_area">
                            <button
                              className="fav_btn"
                              onClick={() => handleFeaturedDeal(deal.id, deal.is_favorite)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                <path
                                  d="M8.93852 14.7404C8.69768 14.8254 8.30102 14.8254 8.06018 14.7404C6.00602 14.0391 1.41602 11.1137 1.41602 6.15538C1.41602 3.96663 3.17977 2.1958 5.35435 2.1958C6.64352 2.1958 7.78393 2.81913 8.49935 3.78247C9.21477 2.81913 10.3623 2.1958 11.6443 2.1958C13.8189 2.1958 15.5827 3.96663 15.5827 6.15538C15.5827 11.1137 10.9927 14.0391 8.93852 14.7404Z"

                                  fill={deal.is_favorite ? "white" : "none"}
                                  stroke={deal.is_favorite ? "none" : "white"}
                                  strokeWidth="1.5"
                                />
                              </svg>

                              {deal.is_favorite ? "Added to Favorite" : "Add favorite deal"}
                            </button>

                            <p className='mb-0'>Asking Price: <span>${deal.price || 0}</span></p>
                          </div>
                        </div>
                      </div>

                      <div className='deal_notifications_right flex_auto_column'>
                        <ul className={`deal_notifications_btn ${hasDealStatus(deal.status) ? 'disabled-btn' : ''}`}>
                          <li>
                            <Button
                              className='outline_btn'
                              onClick={() => handleSubmitOffer(deal.id, deal.price)}
                              disabled={hasDealStatus(deal.status) || !deal.id}
                            >
                              <Image src='/assets/images/want_buy.svg' alt='' /> Want to Buy
                            </Button>
                          </li>
                          <li>
                            <Button
                              className='outline_btn'
                              onClick={() => handleChatWithSeller(deal)}
                              disabled={deal.status === 'not_interested' || !deal.id}
                            >
                              <Image src='/assets/images/chat-seller.svg' alt='' /> Chat with seller
                            </Button>
                          </li>

                          <li>

                            <Button
                              className='text_btn not_interest_btn'
                              onClick={() => handleNotInterestedClick(deal.id)}
                              style={{
                                pointerEvents: deal.status === 'not_interested' ? 'none' : 'auto'
                              }}
                            >
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M11 1L1 11" stroke="#E21B1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M1 1L11 11" stroke="#E21B1B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>

                              {deal.status === 'not_interested' &&
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"></path>
                                  </svg>
                                </span>
                              }
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {totalPages > 1 && (
            <div className="row justify-content-center mt-4">
              <Pagination
                totalPage={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Container>
      </section>
      <Modal
        show={submitOffer}
        onHide={() => setSubmitOffer(false)}
        centered
        className="radius_30 max-648"
      >
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
                <div>
                  <input type='text' name="offer_price" placeholder='Enter Offer Price' value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
                </div>
              </div>
              <div className='upload-document-section'>
                <div className=''>
                  <span className="browse-files position-relative">
                    <input type='hidden' name="buyer_deal_id" value={dealId} />
                    <input id='formFile' type="file" name="pdf_file" className="default-file-input" ref={fileInputRef} />
                    <span className="d-block upload-file">PDF-Name.pdf</span>
                    <span className="browse-files-text">Upload POF</span>
                  </span>
                  {errors?.pdf_file && <span className='error'>{errors.pdf_file}</span>}
                </div>
                <div className='proof_checkbox position-relative text-start'>
                  <label>
                    <input type='checkbox' name='current_poof' checked={isProofOfFund} onChange={(e) => { setIsProofOfFund(e.target.checked) }} />
                    <span>Save as default proof of funds</span>
                  </label>
                </div>
                <button type="submit" className="btn btn-fill btn-fill-green btn btn-primary w-100">Submit your offer</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={proofSave}
        onHide={handleProofHide}
        centered
        className="radius_30 max-340"
      >
        <Modal.Body className="some_space">
          <div className="modal_inner_content proofSave">
            <h3>Do you want to save this proof of fund</h3>

            <div className="both_btn_group m-0">
              <button
                type="button"
                className="light_bg_btn btn btn-primary"
                onClick={handleProofHide}
              >
                No
              </button>

              <button
                type="button"
                className="btn btn-fill btn-primary"
                onClick={() => setIsConfirmProofOfFund(true)}
              >
                Yes
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={isShowFeaturedDeal}
        onHide={() => setIsShowFeaturedDeal(false)}
        centered
        className="radius_30 max-340"
      >
        <Modal.Body className="some_space">
          <div className="modal_inner_content proofSave">
            <h3>
              Do you want to {isFeatured ? "remove" : "add"} this to featured deal?
            </h3>

            <div className="both_btn_group m-0">
              <button
                type="button"
                className="light_bg_btn btn btn-primary"
                onClick={() => setIsShowFeaturedDeal(false)}
              >
                No
              </button>

              <button
                type="button"
                className="btn btn-fill btn-primary"
                onClick={updateFeaturedDealStatus}
              >
                Yes
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default ViewedProperty;
