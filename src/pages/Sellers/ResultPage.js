import React, { useEffect, useState } from "react";
import axios from "axios";

import MyBuyersResult from "./MyBuyersResult";

import { useAuth } from "../../hooks/useAuth";
import Pagination from "../../partials/Pagination";
import Loader from "../../partials/Loader";
import { toast } from "react-toastify";
import { useFormError } from "../../hooks/useFormError";
import { Link } from "react-router-dom";
import { Button, Col, Image, Modal, Row, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ResultPage = ({ setLastSearchedLogId, setIsFiltered, filterFormData, lastSearchedLogId, attachments, size, lotSize, bath, bedroom, address, price, propertyTypeOption }) => {
  const [buyerType, setBuyerType] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my_buyers");
  const { getTokenData, setLogout, getLocalStorageUserdata } = useAuth();
  const [buyerData, setBuyerData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [additionalBuyerCount, setAdditionalBuyerCount] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [currentRecord, setCurrentRecord] = useState(0);
  const [fromRecord, setFromRecord] = useState(0);
  const [toRecord, setToRecord] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [currentBuyerId, setCurrentBuyerId] = useState('');
  const [currentBuyerUserId, setCurrentBuyerUserId] = useState('');

  const [showLoader, setShowLoader] = useState(true);
  const { setErrors, renderFieldError } = useFormError();
  const [sendDealMessage, setSendDealMessage] = useState('');
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [selectedBuyerId, setSelectedBuyerId] = useState([]);
  const [sendDealShow, setSendDealShow] = useState(false);
  const [sendDealBox, setSendDealBox] = useState(false);
  const [featuredDeal, setFeaturedDeal] = useState(false);
  const [isFeatured, setIsFeatured] = useState(0);
  const [isSendingDeal, setIsSendingDeal] = useState(false);
  const [notificationAudience, setNotificationAudience] = useState("selected");
  const sendDealClose = () => {
    setNotificationAudience("selected");
    setSendDealShow(false);
  };
  const apiUrl = process.env.REACT_APP_API_URL;
  const FEATURED_DEAL_CREDITS = 10;


  useEffect(() => {
    getFilterResult();
  }, [activeTab, buyerType, pageNumber]);

  useEffect(() => {
    if (sendDealBox) {
      const timer = setTimeout(() => {
        navigate("/buyer/buybox-criteria");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [sendDealBox]);

  const getFilterResult = async (page = pageNumber, active_tab = activeTab, buyer_type = buyerType) => {
    try {
      setShowLoader(true);
      let searchFields = filterFormData

      if (searchFields.has("active_tab")) {
        searchFields.delete("active_tab");
      }
      if (searchFields.has("buyer_type")) {
        searchFields.delete("buyer_type");
      }
      if (searchFields.has("filterType")) {
        searchFields.delete("filterType");
      }

      let newTab = active_tab == null ? "my_buyers" : activeTab;
      searchFields.append("activeTab", newTab);
      searchFields.append("buyer_type", buyer_type);
      searchFields.append("filterType", "");

      if (searchFields.has("search_log_id")) {
        searchFields.delete("search_log_id");
      }
      searchFields.append("search_log_id", lastSearchedLogId || 0);

      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      let url = apiUrl + "buy-box-search";
      if (page > 1) {
        url = apiUrl + "buy-box-search?page=" + page;
      }
      let response = await axios.post(url, searchFields, { headers: headers });
      if (response) {
        addBuyerDetails(response.data);
      }
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.validation_errors) {
          setErrors(error.response.data.validation_errors);
        }
        if (error.response.errors) {
          setErrors(error.response.errors);
        }
        if (error.response.error) {
          toast.error(error.response.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  const addBuyerDetails = (buyer_data) => {
    setBuyerData(buyer_data.buyers.data);
    setCurrentRecord(buyer_data.buyers.data.length);
    setTotalRecord(buyer_data.total_records);
    setTotalPage(buyer_data.buyers.last_page);
    setCurrentPageNo(buyer_data.buyers.current_page);
    setAdditionalBuyerCount(buyer_data.additional_buyers_count);
    setFromRecord(buyer_data.buyers.from);
    setToRecord(buyer_data.buyers.to);
    setShowLoader(false);
  };

  const handleBackClick = () => {
    if (localStorage.getItem("get_filtered_data") !== null) {
      localStorage.removeItem("get_filtered_data");
    }
    setLastSearchedLogId(0);
    setIsFiltered(false);
  };

  const handlePagination = (page_number) => {
    if (localStorage.getItem("get_filtered_data") !== null) {
      localStorage.removeItem("get_filtered_data");
    }
    setPageNumber(page_number);
  };
  const handleClickMyBuyers = () => {
    setPageNumber(1);
    setBuyerType("");
    setActiveTab("my_buyers");
  };
  const handleClickMoreBuyers = () => {
    setActiveTab("more_buyers");
    setPageNumber(1);
    setBuyerType("");
  };
  const handleClickHedgeFund = () => {
    setPageNumber(1);
    setBuyerType(5);
  };
  const handleClickInvestors = () => {
    setPageNumber(1);
    setBuyerType(11);
  };

  const handleCheckboxChange = (dealId, buyerId) => {
    setSelectedDeals((prevSelectedDeals) => {
      if (prevSelectedDeals.includes(dealId)) {
        return prevSelectedDeals.filter((id) => id !== dealId);
      } else {
        return [...prevSelectedDeals, dealId];
      }
    });

    setSelectedBuyerId((prevSelectedDeals) => {
      if (prevSelectedDeals.includes(buyerId)) {
        return prevSelectedDeals.filter((id) => id !== buyerId);
      } else {
        return [...prevSelectedDeals, buyerId];
      }
    });
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setSelectedDeals(buyerData.map((deal) => deal.buyer_user_id));
      setSelectedBuyerId(buyerData.map((userId) => userId.id));
    } else {
      setSelectedDeals([]);
      setSelectedBuyerId([]);
    }
  };

  const checkSelectedDeals = () => {
    setCurrentBuyerId("");
    setCurrentBuyerUserId("");
    if (selectedDeals.length == 0) {
      Swal.fire({
        title: "No Deal Selected",
        text: "Please select at least one deal to proceed.",
        icon: "warning"
      });
      return false;
    }
    setNotificationAudience("selected");
    setSendDealShow(true)
  }

  const handleSendDealNotification = async (e) => {
    e.preventDefault();
    if (isSendingDeal) {
      return;
    }

    let message = e.target.message.value.trim();
    setIsSendingDeal(true);
    try {
      const selectedBuyerIdsToSend = currentBuyerId
        ? Array.isArray(currentBuyerId) ? currentBuyerId : [currentBuyerId]
        : selectedBuyerId;
      const selectedBuyerUserIdsToSend = currentBuyerUserId
        ? Array.isArray(currentBuyerUserId) ? currentBuyerUserId : [currentBuyerUserId]
        : selectedDeals;

      const unselectedBuyerIds = buyerData
        .filter((buyer) => !selectedBuyerId.includes(buyer.id))
        .map((buyer) => buyer.id);
      const unselectedBuyerUserIds = buyerData
        .filter((buyer) => !selectedDeals.includes(buyer.buyer_user_id))
        .map((buyer) => buyer.buyer_user_id);

      const buyerIdsToSend = notificationAudience === "unselected"
        ? unselectedBuyerIds
        : selectedBuyerIdsToSend;
      const buyerUserIdsToSend = notificationAudience === "unselected"
        ? unselectedBuyerUserIds
        : selectedBuyerUserIdsToSend;

      if (!buyerIdsToSend.length || !buyerUserIdsToSend.length) {
        toast.error(
          notificationAudience === "unselected"
            ? "No unselected buyers found."
            : "No selected buyers found.",
          { position: toast.POSITION.TOP_RIGHT }
        );
        return;
      }

      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      let payload = {
        buyer_id: buyerIdsToSend,
        search_log_id: lastSearchedLogId,
        buyer_user_ids: buyerUserIdsToSend,
        message: message,
        is_featured: isFeatured ? 1 : 0
      }
      let response = await axios.post(`${apiUrl}search-buyers/send-deal`, payload, { headers: headers });
      setSendDealMessage(response.data.message);
      setSelectedDeals([]);
      setSelectedBuyerId([]);
      setIsFeatured(0);
      setNotificationAudience("selected");
      setSendDealShow(false);
      setSendDealBox(true);
      window.dispatchEvent(new Event('creditUpdated'));
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.validation_errors) {
          setErrors(error.response.data.validation_errors);
        }
        if (error.response.errors) {
          setErrors(error.response.errors);
        }
        if (error.response.error) {
          toast.error(error.response.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } finally {
      setIsSendingDeal(false);
    }
  }

  const handleFeaturedDeal = () => {
    if (isFeatured) {
      setIsFeatured(0);
      return;
    }

    const availableCredits = Number(user_data?.credit_limit || 0);
    if (availableCredits < FEATURED_DEAL_CREDITS) {
      toast.error("You don't have enough points to proceed, Please add more points", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    setFeaturedDeal(true);
  }
  const handleFeaturedDealConfirm = () => {
    setIsFeatured(1);
    setFeaturedDeal(false);
  }
  const handleFeaturedDealClose = () => {
    setFeaturedDeal(false);
  }

  const user_data = getLocalStorageUserdata();
  return (
    <>
      <section className="main-section position-relative pt-4 pb-120">
        <div className="container position-relative">
          <div className="back-block">
            <div className="result_topbar">
              <div className="result_topbar_left">
                <a
                  onClick={handleBackClick}
                  style={{ cursor: "pointer" }}
                  className="back"
                >
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
                </a>
              </div>
              <h6 className="center-head text-center mb-0">Result Page</h6>
              <div className="result_topbar_right">
                {(activeTab === 'my_buyers' && user_data.level_type > 1) &&
                  <div className="buyer_top_bar d-flex align-items-center justify-content-end">
                    <div className="buyer_top_select">
                      <span>Select : </span>
                      <label><input type="checkbox" className="all-deal-checkbox" checked={buyerData.length > 0 && selectedDeals.length === buyerData.length} onChange={handleSelectAllChange} /> <span>All</span></label>
                    </div>

                    <Button className="top_buyer_btn" onClick={checkSelectedDeals}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                          <path d="M12.6404 10.5404C12.4409 11.064 12.0207 11.4619 11.4722 11.6435C10.703 11.8948 9.91239 12.0833 9.11466 12.2159C9.03631 12.2299 8.95796 12.2439 8.87961 12.2509C8.7514 12.2718 8.6232 12.2858 8.49499 12.2997C8.33829 12.3207 8.17447 12.3346 8.01065 12.3486C7.56193 12.3835 7.12032 12.4044 6.6716 12.4044C6.21575 12.4044 5.7599 12.3835 5.31118 12.3416C5.11887 12.3276 4.93368 12.3067 4.74849 12.2788C4.64165 12.2648 4.53481 12.2509 4.43509 12.2369C4.35674 12.2229 4.2784 12.2159 4.20005 12.202C3.40944 12.0763 2.62595 11.8878 1.86383 11.6365C1.29402 11.448 0.859536 11.05 0.667225 10.5404C0.474914 10.0377 0.54614 9.45127 0.852413 8.9486L1.65727 7.63608C1.82821 7.34984 1.98491 6.7983 1.98491 6.46319V5.16463C1.98491 2.63034 4.08609 0.570801 6.6716 0.570801C9.24999 0.570801 11.3512 2.63034 11.3512 5.16463V6.46319C11.3512 6.7983 11.5079 7.34984 11.6859 7.63608L12.4908 8.9486C12.7828 9.43731 12.8398 10.0098 12.6404 10.5404Z" fill="#3F53FE" />
                          <path d="M6.65265 6.65221C6.3535 6.65221 6.11133 6.41484 6.11133 6.12162V3.95735C6.11133 3.66413 6.3535 3.42676 6.65265 3.42676C6.9518 3.42676 7.19397 3.66413 7.19397 3.95735V6.12162C7.18684 6.41484 6.94468 6.65221 6.65265 6.65221Z" fill="white" />
                          <path d="M8.32176 13.1519C8.48163 13.1323 8.6021 13.2884 8.52168 13.4279C8.15323 14.0673 7.4546 14.4993 6.65506 14.4993C6.09238 14.4993 5.53681 14.2759 5.14507 13.878C4.98811 13.7337 4.85817 13.5564 4.75991 13.3665C4.7 13.2507 4.80227 13.1199 4.93139 13.1379C5.09521 13.1589 5.26615 13.1798 5.4371 13.1938C5.84308 13.2287 6.2562 13.2496 6.66931 13.2496C7.0753 13.2496 7.48129 13.2287 7.88016 13.1938C8.02973 13.1798 8.17931 13.1728 8.32176 13.1519Z" fill="#3F53FE" />
                          <circle cx="11.2748" cy="10.2138" r="3.46429" fill="#ECECFF" stroke="white" strokeWidth="0.5" />
                          <path d="M12.2062 11.2005C12.0984 11.088 12.0984 10.9018 12.2062 10.7893C12.3075 10.6835 12.2326 10.5079 12.0861 10.5079L9.426 10.5079C9.27254 10.5079 9.14397 10.378 9.14397 10.2135C9.14397 10.049 9.2684 9.91915 9.426 9.91915L12.0861 9.91915C12.2326 9.91915 12.3075 9.74352 12.2062 9.63776C12.0984 9.52521 12.0984 9.33906 12.2062 9.22651C12.314 9.11395 12.4924 9.11395 12.6002 9.22651L13.3467 10.0057C13.3512 10.0104 13.3531 10.0172 13.3572 10.0223C13.3757 10.0457 13.3936 10.0698 13.4048 10.101C13.4214 10.1399 13.4297 10.1746 13.4297 10.2135C13.4297 10.2525 13.4214 10.2871 13.409 10.3261C13.3965 10.3607 13.3758 10.3953 13.3467 10.4213L12.6002 11.2005C12.4924 11.3131 12.314 11.3131 12.2062 11.2005Z" fill="#3F53FE" />
                        </svg>
                      </span> SEND DEAL
                    </Button>
                  </div>
                }
                <p className="page-out mb-0 text-center text-sm-end text-md-end text-lg-end">
                  {currentPageNo} out of {totalPage}
                </p>
              </div>
            </div>
          </div>
          <div className="card-box">
            <div className="row">
              <div className="col-12 col-lg-12">
                <div className="card-box-inner">
                  <div className="custom-divide">
                    <div className="column-3">
                      <div className="buyers-tabs">
                        <ul
                          className="nav nav-pills mb-0"
                          id="pills-tab"
                          role="tablist"
                        >
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link active"
                              id="pills-my-buyers-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-my-buyers"
                              type="button"
                              role="tab"
                              aria-controls="pills-my-buyers"
                              aria-selected="true"
                              onClick={handleClickMyBuyers}
                            >
                              My Buyers
                            </button>
                          </li>
                          {user_data.level_type > 1 ? (
                            <li className="nav-item" role="presentation">
                              <button
                                className="nav-link"
                                id="pills-more-buyers-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#pills-more-buyers"
                                type="button"
                                role="tab"
                                aria-controls="pills-more-buyers"
                                aria-selected="false"
                                onClick={handleClickMoreBuyers}
                              >
                                More Buyers
                              </button>
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="column-6">
                      <div className="inner-page-title text-center">
                        <h3 className="text-center">
                          Property Criteria Match With {totalRecord}{" "}
                          {totalRecord > 1 ? "Buyers" : "Buyer"}
                        </h3>
                        <p className="mb-0">
                          {additionalBuyerCount} Additional{" "}
                          {additionalBuyerCount > 1 ? "Buyers" : "Buyer"}{" "}
                          interested in similar property
                        </p>
                      </div>
                    </div>
                    <div className="column-3">
                      <div className="buyers-tabs">
                        <ul
                          className="nav nav-pills mb-0"
                          id="pills-tab"
                          role="tablist"
                        >
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${buyerType === 5 ? " active" : ""
                                }`}
                              id="pills-hedgefund-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-hedgefund"
                              type="button"
                              role="tab"
                              aria-controls="pills-hedgefund"
                              aria-selected="true"
                              onClick={handleClickHedgeFund}
                            >
                              Hedgefund
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button
                              className={`nav-link ${buyerType === 11 ? " active" : ""
                                }`}
                              id="pills-investors-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-investors"
                              type="button"
                              role="tab"
                              aria-controls="pills-investors"
                              aria-selected="false"
                              onClick={handleClickInvestors}
                            >
                              Investors
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="tab-content" id="pills-tabContent">
                    {showLoader && <div className="buyer-result-loader"><Loader /></div>}
                    {!showLoader && (
                      <div>
                        <MyBuyersResult
                          checkSelectedDeals={checkSelectedDeals}
                          setCurrentBuyerId={setCurrentBuyerId}
                          setCurrentBuyerUserId={setCurrentBuyerUserId}
                          setBuyerData={setBuyerData}
                          buyerData={buyerData}
                          getFilterResult={getFilterResult}
                          pageNumber={pageNumber}
                          activeTab={activeTab}
                          buyerType={buyerType}
                          selectedDeals={selectedDeals}
                          handleCheckboxChange={handleCheckboxChange}
                          setSendDealShow={setSendDealShow}
                          user_data={user_data}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {user_data.level_type === 1 && additionalBuyerCount > 0 ? (
                  <div className="col-12 col-lg-12">
                    <div className="want-to-see">
                      <h3 className="text-center">Want to see more buyer!</h3>
                      <Link className="btn btn-fill" to={"/seller/choose-your-plan"}>
                        Click Here
                      </Link>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="row justify-content-center">
                  {totalPage > 1 ? (
                    <Pagination
                      totalPage={totalPage}
                      currentPage={pageNumber}
                      onPageChange={handlePagination}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal show={sendDealShow} onHide={() => setSendDealShow(false)} centered className='radius_30 max-980'>
        <Modal.Body className=''>
          <div className="send_deal_modal">
            <Row>
              <Col lg={5}>
                <div className="deal_property_img">
                  <Image src={attachments.length > 0 ? attachments[0].preview : '/assets/images/property-img.png'} alt='' />
                </div>
              </Col>
              <Col lg={7} className="align-self-center">
                <div className="deal_property_content">
                  <h2>{address}</h2>
                  <p>{propertyTypeOption?.[0]?.label}</p>
                  <h4 className="green_price">${price}</h4>
                  <ul>
                    <li><span><Image src="/assets/images/bed.svg" alt="" /></span> {bedroom} Bed</li>
                    <li><span><Image src="/assets/images/bathroom.svg" alt="" /></span> {bath} Baths</li>
                    <li><span><Image src="/assets/images/network-1.svg" alt="" /></span> {size} Square Foot</li>
                    <li><span><Image src="/assets/images/full-screen-2.svg" alt="" /></span> {lotSize} ft</li>
                  </ul>
                  <div className="feat_deal">
                    <div className="feat_deal_left">
                      <span className="feat_deal_reward">
                        <img src="/assets/images/reward_icon.svg" alt="" />
                      </span>
                      <div>
                        <h6>Boost this property with Featured Deals</h6>
                        <p>in just 10 Credits</p>
                      </div>
                    </div>
                    <div className="feat_deal_right">
                      <button
                        type="button"
                        className={`feature_deal_btn ${isFeatured ? "is-active" : ""}`}
                        onClick={handleFeaturedDeal}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M12.6152 1.5H5.38523C3.78773 1.5 2.49023 2.805 2.49023 4.395V14.9625C2.49023 16.3125 3.45773 16.8825 4.64273 16.23L8.30273 14.1975C8.69273 13.98 9.32273 13.98 9.70523 14.1975L13.3652 16.23C14.5502 16.89 15.5177 16.32 15.5177 14.9625V4.395C15.5102 2.805 14.2127 1.5 12.6152 1.5Z" fill={isFeatured ? "white" : "none"} stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {isFeatured ? "Remove Featured Deal" : "Featured deal"}
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={12}>
                <Form className="send_deal_form" onSubmit={handleSendDealNotification}>
                  {/* <Form.Group className="m-0 mb-3"> */}
                    {/* <Form.Label>Send Notification To</Form.Label>
                    <div className="d-flex gap-4 flex-wrap">
                      <Form.Check
                        type="radio"
                        id="notification-selected"
                        name="notificationAudience"
                        label="Selected"
                        checked={notificationAudience === "selected"}
                        onChange={() => setNotificationAudience("selected")}
                      />
                      <Form.Check
                        type="radio"
                        id="notification-unselected"
                        name="notificationAudience"
                        label="Unselected"
                        checked={notificationAudience === "unselected"}
                        onChange={() => setNotificationAudience("unselected")}
                      />
                    </div>
                  </Form.Group> */}
                  <Form.Group className="m-0">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" placeholder="enter Message" name="message" />
                  </Form.Group>
                  <Form.Group className="both_btn_group m-0">
                    <Button className="light_bg_btn" onClick={sendDealClose}>
                      Cancel
                    </Button>
                    <Button className="btn btn-fill" type="submit" disabled={isSendingDeal}>
                      {isSendingDeal ? "Submitting..." : "Submit"}
                    </Button>
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>

      {/* <Modal show={sendDealBox} onHide={() => setSendDealBox(false)} centered className='radius_30 max-648'> */}
      <Modal
  show={sendDealBox}
  onHide={() => setSendDealBox(false)}
  backdrop="static"
  keyboard={false}
  centered
  className='radius_30 max-648'
>
        <Modal.Body className=''>
          <div className="send_deal_box">
            <Row>
              <Col lg={12} className="text-center">
                <Image src='/assets/images/green-check.svg' alt='' />
                <h2>{sendDealMessage}</h2>
                <p>Deal notifications have been successfully sent to all the selected buyers.</p>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={featuredDeal} onHide={() => setFeaturedDeal(false)} centered className='radius_30 max-648'>
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className='space_modal'>
          <div className='modal_inner_content FeaturedDealModal'>
            <div className='buy_modal_icon light_gray_bg'>
              <Image src='/assets/images/like-vector.svg' alt='' />
            </div>
            <h4>We’ll deduct 10 Credits from your credit balance</h4>
            <div className="both_btn_group m-0">
              <button type="button" className="btn btn-fill btn-primary" onClick={handleFeaturedDealConfirm}>Yes</button>
              <button type="button" className="light_bg_btn btn btn-primary" onClick={handleFeaturedDealClose}>Cancel</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ResultPage;
