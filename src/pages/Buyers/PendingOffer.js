
import React, { useEffect, useState } from "react";
import Footer from "../../partials/Footer";
import { Col, Container, Image, Row, Spinner, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import BuyerHeader from "../../partials/BuyerHeader";
import Pagination from "../../component/Pagination/index";
import { guardSellerAccepted } from "../../util/buyerChat";


const PendingOffer = () => {
    const { getTokenData } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [showProofPreview, setShowProofPreview] = useState(false);
    const [selectedProofDocument, setSelectedProofDocument] = useState(null);


    const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    useEffect(() => {
        fetchPendingOffers();
    }, [currentPage]);

    const fetchPendingOffers = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}buyer-deals/pending-list?page=${currentPage}`,
                { headers }
            );

            const dealData = response?.data?.deals;
            const rows = dealData?.data || [];

            const groupedDeals = rows.reduce((acc, item) => {
                if (!acc[item.deal_id]) {
                    acc[item.deal_id] = {
                        id: item.deal_id,
                        title: item.title,
                        address: item.address,
                        property_images: item.property_images,
                        buyer_deals: [],
                    };
                }

                acc[item.deal_id].buyer_deals.push({
                    deal_id: item.id,
                    buyer_id: item.buyer_id,
                    seller_id: item.seller_id,
                    seller_name: item.seller_name,
                    accepted_price: item.accepted_price,
                    seller_profile_image: item.seller_profile_image,
                    seller_email: item.seller_email,
                    seller_phone: item.seller_phone,
                    seller_level: item.seller_level,
                    seller_verification: item.seller_verification,
                    seller_likes: item.seller_likes,
                    seller_unlikes: item.seller_unlikes,
                    is_sold: item.is_sold,
                    pof_document: item.pof_document,
                    proof_of_fund: item.proof_of_fund,
                    proof_of_funds: item.proof_of_funds,
                    proof_of_fund_document: item.proof_of_fund_document,
                    proof_of_funds_document: item.proof_of_funds_document,
                    bank_statement_pdf: item.bank_statement_pdf,
                    document_url: item.document_url,
                    is_proof_of_fund_verified: item.is_proof_of_fund_verified,
                    proof_of_fund_verified: item.proof_of_fund_verified,
                    proof_of_funds_verified: item.proof_of_funds_verified,
                });

                return acc;
            }, {});

            setDeals(Object.values(groupedDeals));
            setCurrentPage(dealData.current_page);
            setTotalPages(dealData.last_page);
        } catch (error) {
            console.error("Error fetching pending offers:", error);
        } finally {
            setLoading(false);
        }
    };

    const getProofOfFundLink = (seller) => {
        return (
            seller?.pof_document?.file_url ||
            seller?.pof_document?.url ||
            seller?.pof_document?.path ||
            seller?.proof_of_fund ||
            seller?.proof_of_funds ||
            seller?.proof_of_fund_document ||
            seller?.proof_of_funds_document ||
            seller?.bank_statement_pdf ||
            seller?.document_url ||
            ""
        );
    };

    const hasProofOfFund = (seller) => {
        return Boolean(
            getProofOfFundLink(seller) ||
            seller?.is_proof_of_fund_verified ||
            seller?.proof_of_fund_verified ||
            seller?.proof_of_funds_verified
        );
    };

    const handleProofPreviewOpen = (seller) => {
        const fileUrl = getProofOfFundLink(seller);
        if (!fileUrl) return;
        setSelectedProofDocument({
            url: fileUrl,
            name:
                seller?.pof_document?.original_file_name ||
                seller?.proof_of_fund_name ||
                "Proof of Fund",
        });
        setShowProofPreview(true);
    };

    const handleProofPreviewClose = () => {
        setShowProofPreview(false);
        setSelectedProofDocument(null);
    };

    const isPdfFile = (fileUrl = "") => fileUrl.toLowerCase().includes(".pdf");

    const handleProfilePopupOpen = (seller, deal) => {
        setSelectedSeller({
            ...seller,
            propertyTitle: deal?.title || "",
            property_address: deal?.address || "",
        });
        setShowPopup(true);
    };

    const handleProfilePopupClose = () => {
        setShowPopup(false);
        setSelectedSeller(null);
    };

    const handleChatWithSeller = (seller) => {
        // if (!guardSellerAccepted(seller)) {
        //     return;
        // }

        window.location.href = `/message/${seller.seller_id}`;
    };


    return (
        <>
            <BuyerHeader />
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
                                <h6 className="center-head text-center mb-0">Pending  offers</h6>
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
                            deals.map((deal) => (
                                <div className="deal_column" key={deal.id}>
                                    <Row className="align-items-center">
                                        <Col xl={12}>
                                            <div className="property_deal_column">
                                                <div className="pro_img">
                                                    <Image
                                                        src={
                                                            Array.isArray(deal.property_images) && deal.property_images.length > 0
                                                                ? deal.property_images[0]
                                                                : "/assets/images/property-img.png"
                                                        }
                                                        alt="property"
                                                    />

                                                </div>
                                                <div className="pro_details">
                                                    <div className="pro_details_top">
                                                        <h3>{deal.title}</h3>
                                                        <p>{deal.address}</p>

                                                        <div className="pending_offer_top_actions">
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
                                                    {deal?.buyer_deals?.map((seller) => (
                                                        <div className="pro_content_user" key={seller.deal_id}>
                                                            <div className="pro_content_user_left">
                                                                <div className="pro_content_user_img">
                                                                    <Link
                                                                        onClick={() => handleProfilePopupOpen(seller, deal)}
                                                                        aria-label={`View profile for ${seller.seller_name || "seller"}`}
                                                                    >
                                                                        <Image
                                                                            src={seller?.seller_profile_image || "/assets/images/user-img1.png"}
                                                                            alt={seller?.seller_name}
                                                                            onError={(e) => {
                                                                                e.target.src = "/assets/images/user-img1.png";
                                                                            }}
                                                                        />
                                                                    </Link>
                                                                </div>
                                                                <div className="pro_content_user_info">
                                                                    <h6>
                                                                        <Link
                                                                            onClick={() => handleProfilePopupOpen(seller, deal)}
                                                                            aria-label={`View profile for ${seller.seller_name || "seller"}`}
                                                                        >
                                                                            {seller?.seller_name}
                                                                        </Link>
                                                                    </h6>
                                                                    <p className="mb-0">
                                                                        Offered Price: <span>{seller.accepted_price}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="pro_content_user_right">
                                                                <button
                                                                    type="button"
                                                                    className="pending_offer_icon_btn pending_offer_chat_trigger"
                                                                    onClick={() => handleChatWithSeller(seller)}
                                                                    aria-label={`Open chat for ${seller.seller_name || "seller"}`}
                                                                >
                                                                    <img
                                                                        src="/assets/images/chatIcon.svg"
                                                                        alt="chat"
                                                                        width="18"
                                                                        height="18"
                                                                    />
                                                                    Chat
                                                                </button>
                                                                {/* <Link
                                                                    onClick={() => handleProfilePopupOpen(seller, deal)}
                                                                    className="pending_offer_icon_btn pending_offer_detail_btn"
                                                                    aria-label={`View profile for ${seller.seller_name || "seller"}`}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="28"
                                                                        height="28"
                                                                        viewBox="0 0 28 28"
                                                                        fill="none"
                                                                    >
                                                                        <rect width="28" height="28" rx="8" fill="white" />
                                                                        <path
                                                                            d="M11.4258 20.5999L16.8591 15.1666C17.5008 14.5249 17.5008 13.4749 16.8591 12.8332L11.4258 7.3999"
                                                                            stroke="#3F53FE"
                                                                            strokeWidth="1.5"
                                                                            strokeMiterlimit="10"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </Link> */}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            ))
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

            {/* Seller Profile Popup */}
            <Modal
                show={showPopup}
                onHide={handleProfilePopupClose}
                centered
                className="radius_30 max-400"
            >
                <Modal.Header closeButton className='new_modal_close'></Modal.Header>
                <Modal.Body className="space_modal">
                    <div className="pending_offer_popup_card">
                        <div className="pending_offer_popup_avatar">
                            <Image
                                src={selectedSeller?.seller_profile_image || "/assets/images/user-img1.png"}
                                alt={selectedSeller?.seller_name || "Seller"}
                                onError={(e) => {
                                    e.target.src = "/assets/images/user-img1.png";
                                }}
                            />
                        </div>
                        <h4>{selectedSeller?.seller_name || "Seller"}</h4>
                        <p className="pending_offer_popup_subtitle">
                            {selectedSeller?.propertyTitle || "-"}
                        </p>
                        <div className="pending_offer_popup_info">
                            <span>Email</span>
                            <strong>{selectedSeller?.seller_email || "-"}</strong>
                        </div>
                        {/* <div className="pending_offer_popup_info">
                            <span>Phone</span>
                            <strong><span>+1 </span>{selectedSeller?.seller_phone || "-"}</strong>
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
                                    color: "#000",
                                }}
                            >
                                {selectedSeller?.seller_phone
                                    ? `+${selectedSeller.seller_phone}`
                                    : "-"}
                            </strong>
                            {/* <strong
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                <span style={{ color: "#000" }}>+</span>
                                <span style={{ color: "#000" }}>
                                    {selectedSeller?.seller_phone || "-"}
                                </span>
                            </strong> */}
                        </div>
                        <div className="pending_offer_popup_info">
                            <span>Seller Level</span>
                            <strong>{selectedSeller?.seller_level || "-"}</strong>
                        </div>
                        <div className="pending_offer_popup_info">
                            <span>Verification</span>
                            <strong>{selectedSeller?.seller_verification ? "Verified" : "Not Verified"}</strong>
                        </div>
                        <div className="pending_offer_popup_info">
                            <span>Address</span>
                            <strong>{selectedSeller?.property_address || "-"}</strong>
                        </div>
                        <div className="pending_offer_popup_info">
                            <span>Offered Price</span>
                            <strong>{selectedSeller?.accepted_price || "-"}</strong>
                        </div>
                        <div className="pending_offer_popup_info">
                            <span>Seller Score</span>
                            <strong>{`${selectedSeller?.seller_likes || 0} Likes • ${selectedSeller?.seller_unlikes || 0} Unlikes`}</strong>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Proof of Fund Preview Modal */}
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

            <Footer />
        </>
    );
};

export default PendingOffer;
