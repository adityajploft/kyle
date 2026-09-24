import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { Col, Container, Image, Row, Spinner, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import Pagination from "../../component/Pagination/index";


const PendingOffer = () => {
  const { getTokenData } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [acceptOffer, setAcceptOffer] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [showProofPreview, setShowProofPreview] = useState(false);
  const [selectedProofDocument, setSelectedProofDocument] = useState(null);

  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + getTokenData().access_token,
    "auth-token": getTokenData().access_token,
  };

  useEffect(() => {
    fetchPendingOffers();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const fetchPendingOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}deals/pending-list?page=${currentPage}`,
        { headers }
      );

      const dealsData = response.data.deals;

      setDeals(dealsData.data || []);
      setCurrentPage(dealsData.current_page);
      setTotalPages(dealsData.last_page);

    } catch (error) {
      console.error("Error fetching pending offers:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleMarkSoldClick = (deal) => {

    const isAlreadySold = deal.buyer_deals?.every(b => b.status === 2);
    if (isAlreadySold) return;

    setSelectedDeal(deal);
    setAcceptOffer(true);
  };


  const handleAcceptOfferClose = () => {
    setAcceptOffer(false);
    setSelectedDeal(null);
  };


  const handleConfirmSold = async () => {
    if (!selectedDeal) return;
    setIsProcessing(true);

    try {

      await Promise.all(
        selectedDeal.buyer_deals.map((buyer) =>
          axios.post(
            `${apiUrl}update-buyer-deal/${buyer.deal_id}`,
            {
              search_log_id: "",
              accepted_price: buyer.accepted_price,
              status: 2,
            },
            { headers }
          )
        )
      );


      setDeals((prevDeals) =>
        prevDeals.map((d) =>
          d.id === selectedDeal.id
            ? {
              ...d,
              buyer_deals: d.buyer_deals.map((b) => ({ ...b, status: 2 })),
            }
            : d
        )
      );


      setAcceptOffer(false);
      setSuccessModal(true);

    } catch (error) {
      console.error("Error marking as sold:", error);

    } finally {
      setIsProcessing(false);
    }
  };


  const handleSuccessClose = () => {
    setSuccessModal(false);
    setSelectedDeal(null);
    fetchPendingOffers();
  };

  const getBuyerProfileLink = (buyer) => {
    return buyer?.buyer_id ? `/buyer/profile/${buyer.buyer_id}` : "/buyer/profile";
  };

  const getBuyerMessageLink = (buyer) => {
    if (!buyer?.buyer_id) {
      return "/message";
    }

    return buyer?.deal_id
      ? `/message/${buyer.buyer_id}/${buyer.deal_id}`
      : `/message/${buyer.buyer_id}`;
  };

  const getProofOfFundLink = (buyer) => {
    return (
      buyer?.pof_document?.file_url ||
      buyer?.pof_document?.url ||
      buyer?.pof_document?.path ||
      buyer?.proof_of_fund ||
      buyer?.proof_of_funds ||
      buyer?.proof_of_fund_document ||
      buyer?.proof_of_funds_document ||
      buyer?.bank_statement_pdf ||
      buyer?.document_url ||
      ""
    );
  };

  const hasProofOfFund = (buyer) => {
    return Boolean(
      getProofOfFundLink(buyer) ||
      buyer?.is_proof_of_fund_verified ||
      buyer?.proof_of_fund_verified ||
      buyer?.proof_of_funds_verified
    );
  };

  const handleChatPopupOpen = (buyer, deal) => {
    setSelectedBuyer({
      ...buyer,
      propertyTitle: deal?.title || "",
      property_address: deal?.address || "",
    });
    setShowPopup(true);
  };

  const handleChatPopupClose = () => {
    setShowPopup(false);
    setSelectedBuyer(null);
  };

  const handleChatWithBuyer = (buyer) => {
    navigate(getBuyerMessageLink(buyer));
  };

  const handleProofPreviewOpen = (buyer) => {
    const fileUrl = getProofOfFundLink(buyer);
    if (!fileUrl) return;

    setSelectedProofDocument({
      url: fileUrl,
      name:
        buyer?.pof_document?.original_file_name ||
        buyer?.proof_of_fund_name ||
        "Proof of Fund",
    });
    setShowProofPreview(true);
  };

  const handleProofPreviewClose = () => {
    setShowProofPreview(false);
    setSelectedProofDocument(null);
  };

  const isPdfFile = (fileUrl = "") => fileUrl.toLowerCase().includes(".pdf");

  const capitalizeName = (name) =>
    name?.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  return (
    <>
      <Header />
      <section className="main-section position-relative pt-4 pb-120">
        <Container className="position-relative">
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
                <h6 className="center-head text-center mb-0">Pending offers</h6>
              </div>
            </div>
          </div>

          <div className="card-box column_bg_space">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
              </div>
            ) : deals.length === 0 ? (
              <p className="text-center">No pending offers found</p>
            ) : (
              deals.map((deal) => {
                const isSold = deal.buyer_deals?.length > 0 && deal.buyer_deals.every(b => b.status === 2);

                return (
                  <div className="deal_column" key={deal.id}>
                    <Row className="align-items-center">
                      <Col xl={12}>
                        <div className="property_deal_column">
                          <div className="pro_img">
                            <Image
                              src={deal.property_images?.[0] || "/assets/images/property-img.png"}
                              alt=""
                            />
                          </div>
                          <div className="pro_details">
                            <div className="pro_details_top">
                              <h3>{deal.title}</h3>
                              <p>{deal.address}</p>

                              <div className="pending_offer_top_actions">
                                <button
                                  type="button"
                                  className={`pending_offer_pill_btn pending_offer_mark_btn ${isSold ? "is-sold" : ""}`}
                                  onClick={() => handleMarkSoldClick(deal)}
                                  disabled={isSold}
                                >
                                  {isSold ? "Marked as Sold" : "Mark as Sold"}
                                </button>
                                {deal.buyer_deals?.[0] && (
                                  <button
                                    type="button"
                                    className={`pending_offer_pill_btn pending_offer_pof_btn ${hasProofOfFund(deal.buyer_deals[0]) ? "is-verified" : ""}`}
                                    onClick={() => handleProofPreviewOpen(deal.buyer_deals[0])}
                                    disabled={!getProofOfFundLink(deal.buyer_deals[0])}
                                  >
                                    Proof of Fund
                                  </button>
                                )}
                              </div>
                            </div>

                            {deal.buyer_deals?.map((buyer) => (
                              <div className="pro_content_user" key={buyer.deal_id}>
                                <div className="pro_content_user_left">
                                  <div className="pro_content_user_img">
                                    <Link
                                      onClick={() => handleChatPopupOpen(buyer, deal)}
                                      aria-label={`View profile for ${buyer.buyer_name || "buyer"}`}
                                    >
                                      <Image
                                        src={buyer.buyer_profile_image || "/assets/images/user-img1.png"}
                                        alt={buyer.buyer_name}
                                        onError={(e) => {
                                          e.target.src = "/assets/images/user-img1.png";
                                        }}
                                      />
                                    </Link>
                                  </div>
                                  <div className="pro_content_user_info">
                                    <h6>
                                      <Link
                                        onClick={() => handleChatPopupOpen(buyer, deal)}
                                        aria-label={`View profile for ${buyer.buyer_name || "buyer"}`}
                                      >
                                        {buyer?.buyer_name
                                          .toLowerCase()
                                          .replace(/\b\w/g, char => char.toUpperCase())}
                                      </Link>
                                    </h6>
                                    <p className="mb-0">
                                      Offered Price: <span>{buyer.accepted_price}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="pro_content_user_right">
                                  <button
                                    type="button"
                                    className="pending_offer_icon_btn pending_offer_chat_trigger"
                                    onClick={() => handleChatWithBuyer(buyer)}
                                    aria-label={`Open chat for ${buyer.buyer_name || "buyer"}`}
                                  >
                                    <img
                                      src="/assets/images/chatIcon.svg"
                                      alt="chat"
                                      width="18"
                                      height="18"
                                    />
                                    Chat
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                );
              })
            )}
            {!loading && deals.length > 0 && totalPages > 1 && (
              <div className="row justify-content-center mt-4">
                <Pagination
                  totalPage={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

          </div>
        </Container>
      </section>
      <Modal
        show={acceptOffer}
        onHide={handleAcceptOfferClose}
        centered
        className="radius_30 max-400"
      >
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className='space_modal'>
          <div className="modal_inner_content">
            <h4 className="mb-4">Are you sure you want to mark this property as sold?</h4>
            <div className="FeaturedDealModal">
              <div className="both_btn_group">
                <Button
                  variant="primary"
                  className="btn btn-fill btn-primary"
                  onClick={handleConfirmSold}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Spinner animation="border" size="sm" /> : "Yes"}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="light_bg_btn btn btn-primary"
                  onClick={handleAcceptOfferClose}
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showPopup}
        onHide={handleChatPopupClose}
        centered
        className="radius_30 max-400"
      >
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className="space_modal">
          <div className="pending_offer_popup_card">
            <div className="pending_offer_popup_avatar">
              <Image
                src={selectedBuyer?.buyer_profile_image || "/assets/images/user-img1.png"}
                alt={selectedBuyer?.buyer_name || "Buyer"}
                onError={(e) => {
                  e.target.src = "/assets/images/user-img1.png";
                }}
              />
            </div>
            {/* <h4>{selectedBuyer?.buyer_name || "Buyer"}</h4> */}
            <h4>
              {selectedBuyer?.buyer_name
                ? selectedBuyer.buyer_name
                  .toLowerCase()
                  .replace(/\b\w/g, char => char.toUpperCase())
                : "Buyer"}
            </h4>
            <p className="pending_offer_popup_subtitle">
              {selectedBuyer?.propertyTitle || "-"}
            </p>
            <div className="pending_offer_popup_info">
              <span>Email</span>
              <strong>{selectedBuyer?.buyer_email || "-"}</strong>
            </div>
            {/* <div className="pending_offer_popup_info">
              <span>Phone</span>
              <strong><span>+1 </span>{selectedBuyer?.buyer_phone || "-"}</strong>
            </div> */}
            <div
              className="pending_offer_popup_info"
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <span style={{ fontSize: "13px", color: "#6c757d" }}>
                Phone
              </span>

              <strong
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ color: "#6c757d" }}>+1</span>
                <span style={{ color: "#000" }}>
                  {selectedBuyer?.buyer_phone || "-"}
                </span>
              </strong>
            </div>
            <div className="pending_offer_popup_info">
              <span>Buyer Level</span>
              <strong>{selectedBuyer?.buyer_level_status || "-"}</strong>
            </div>
            <div className="pending_offer_popup_info">
              <span>Verification</span>
              <strong>{selectedBuyer?.buyer_verification ? "Verified" : "Not Verified"}</strong>
            </div>
            <div className="pending_offer_popup_info">
              <span>Address</span>
              <strong>{selectedBuyer?.property_address || "-"}</strong>
            </div>
            <div className="pending_offer_popup_info">
              <span>Offered Price</span>
              <strong>{selectedBuyer?.accepted_price || "-"}</strong>
            </div>
            <div className="pending_offer_popup_info">
              <span>Buyer Score</span>
              <strong>{`${selectedBuyer?.buyer_likes || 0} Likes • ${selectedBuyer?.buyer_unlikes || 0} Unlikes`}</strong>
            </div>
            {/* <div className="pending_offer_popup_actions">
              <Link
                to={getBuyerProfileLink(selectedBuyer)}
                className="btn light_bg_btn btn-primary pending_offer_popup_btn pending_offer_popup_secondary_btn"
                onClick={handleChatPopupClose}
              >
                View User Details
              </Link>
              <Link
                to={getBuyerMessageLink(selectedBuyer)}
                className="btn btn-fill btn-primary pending_offer_popup_btn"
                onClick={handleChatPopupClose}
              >
                Open Chat
              </Link>
            </div> */}
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showProofPreview}
        onHide={handleProofPreviewClose}
        centered
        className="radius_30 pending_offer_preview_modal"
      >
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className="space_modal">
          <div className="pending_offer_preview_card">
            <h4>{selectedProofDocument?.name || "Proof of Fund"}</h4>
            {selectedProofDocument?.url ? (
              isPdfFile(selectedProofDocument.url) ? (
                <iframe
                  title="Proof of Fund Preview"
                  src={selectedProofDocument.url}
                  className="pending_offer_preview_frame"
                />
              ) : (
                <img
                  src={selectedProofDocument.url}
                  alt={selectedProofDocument?.name || "Proof of Fund"}
                  className="pending_offer_preview_image"
                />
              )
            ) : (
              <p className="mb-0">No preview available.</p>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={successModal}
        onHide={handleSuccessClose}
        centered
        className="radius_30 max-400"
      >
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className="space_modal">
          <div className="modal_inner_content">
            <div className="mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h4>Success!</h4>
            <p>Congratulations! The user has successfully sold the property.</p>
            <Button
              variant="primary"
              className="btn-fill mt-3"
              onClick={handleSuccessClose}
            >
              Done
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default PendingOffer;
