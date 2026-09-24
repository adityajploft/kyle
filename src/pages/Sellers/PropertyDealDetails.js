import React, { useEffect, useState } from 'react';
import { Col, Container, Image, Modal, Nav, OverlayTrigger, Row, Tab, Table, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { useAuth } from "../../hooks/useAuth";
import axios from 'axios';
import { useParams } from "react-router-dom";
import Pagination from '../../component/Pagination';
import { toast } from "react-toastify";

const PropertyDealDetails = () => {
    const { getTokenData, setLogout } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [dealDetailsData, setDealDetailsData] = useState('');
    const [currentTab, setCurrentTab] = useState('total_buyer');
    const [dealData, setDealData] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(0);
    const [isUpdatingApproval, setIsUpdatingApproval] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const { id, notificationId = '' } = useParams();
    const tableColumnCount = (currentTab == 'total_buyer' || currentTab == 'want_to_buy') ? 8 : 7;

    const getHeaders = () => ({
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
    });

    const fetchData = async () => {
        try {
            let status = '';
            if (currentTab !== 'total_buyer') {
                status = currentTab;
            }
            let response = await axios.post(`${apiUrl}deals/show/${id}`, { status: status, notification_id: notificationId }, { headers: getHeaders() });
            setDealDetailsData(response.data.data);
            setLimit(response.data.data.buyers.per_page);
            setPage(response.data.data.buyers.current_page);
            setTotal(response.data.data.buyers.total);
            setDealData(response.data.data.buyers.data)
        } catch (error) {
            if (error?.response?.status === 401) {
                setLogout();
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentTab, page]);

    const getSellerApprovalStatus = (buyer) =>
        String(buyer?.is_seller_accepted || "").toLowerCase();

    const isSellerAccepted = (buyer) => getSellerApprovalStatus(buyer) === "accepted";
    const isSellerPending = (buyer) => getSellerApprovalStatus(buyer) === "pending";
    const isSellerRejected = (buyer) => {
        const status = getSellerApprovalStatus(buyer);
        return status && status !== "pending" && status !== "accepted";
    };

    const isChatInitiated = (buyer) => {
        const value = buyer?.is_chat_initiated;
        if (typeof value === "string") {
            return ["true", "1", "yes"].includes(value.toLowerCase().trim());
        }
        return Boolean(value);
    };

    const isChatEnabled = (buyer) => {
        const value = buyer?.is_chat_enabled ?? buyer?.is_chat_enable;
        if (typeof value === "string") {
            return ["true", "1", "yes"].includes(value.toLowerCase().trim());
        }
        return Boolean(value);
    };

    const getBuyerDealStatus = (buyer) =>
        String(buyer?.status || "").toLowerCase().trim();

    const canActOnBuyerDeal = (buyer) => {
        const status = getBuyerDealStatus(buyer);
        return ["want to buy", "want_to_buy", "interested"].includes(status);
    };

    const hasBuyerStartedChat = (buyer) =>
        Boolean(
            buyer?.conversation_uuid ||
            buyer?.conversation_id ||
            buyer?.chat_uuid ||
            buyer?.chat_conversation_uuid ||
            buyer?.message_started ||
            buyer?.chat_started
        );


    //       const getBuyerChatLink = (buyer) => {
    //     const buyerId = buyer?.buyer_user_id || buyer?.buyer_id || buyer?.sender_by;
    //     const buyerDealId = buyer?.deal_id || buyer?.id || buyer?.buyer_deal_id;

    //     if (!buyerId) {
    //         return "";
    //     }

    //     return buyerDealId ? `/message/${buyerId}/${buyerDealId}` : `/message/${buyerId}`;
    // };

    const getBuyerChatLink = (buyer) => {
        const buyerId = buyer?.buyer_user_id || buyer?.buyer_id || buyer?.sender_by;
        const buyerDealId = buyer?.buyer_deal_id || buyer?.deal_id || buyer?.id || buyer?.search_log_id;

        if (!buyerId) {
            return "";
        }

        return buyerDealId ? `/message/${buyerId}/${buyerDealId}` : `/message/${buyerId}`;
    };

    const getProofOfFundLabel = (buyer) => {
        const pofFile = getBuyerProofOfFundFile(buyer);
        if (pofFile?.name) {
            return pofFile.name;
        }

        const fileUrl = pofFile?.url || buyer?.want_to_buy_deal_pdf_url || "";
        if (!fileUrl) return "-";

        const fileName = fileUrl.split("?")[0].split("/").pop();
        if (!fileName) return "-";

        try {
            return decodeURIComponent(fileName);
        } catch (error) {
            return fileName;
        }
    };

    const getBuyerProofOfFundFile = (buyer) => {
        const firstPof = Array.isArray(buyer?.buyer_pof) ? buyer.buyer_pof[0] : null;

        if (firstPof) {
            return {
                url: firstPof.file_path || firstPof.file_url || "",
                name: firstPof.original_file_name || firstPof.name || firstPof.file_name || "",
            };
        }

        const fallbackUrl = buyer?.want_to_buy_deal_pdf_url || "";
        return {
            url: fallbackUrl,
            name: fallbackUrl ? fallbackUrl.split("?")[0].split("/").pop() : "",
        };
    };

    const renderViewAction = (buyer) => {
        const chatEnabled = isChatEnabled(buyer);
        const chatInitiated = isChatInitiated(buyer);
        const chatRestricted = !isSellerAccepted(buyer) || (!chatInitiated && !chatEnabled);
        const viewLink = `/seller/notified-buyer-detail/${buyer.buyer_user_id}/${buyer.search_log_id}`;
        const tooltipMessage = chatRestricted ? "Chat restricted" : "Open buyer chat details";

        const icon = (
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", opacity: chatRestricted ? 0.45 : 1, cursor: chatRestricted ? "not-allowed" : "pointer" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.9833 9.99993C12.9833 11.6499 11.6499 12.9833 9.99993 12.9833C8.34993 12.9833 7.0166 11.6499 7.0166 9.99993C7.0166 8.34993 8.34993 7.0166 9.99993 7.0166C11.6499 7.0166 12.9833 8.34993 12.9833 9.99993Z" stroke="#121639" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.99987 16.8918C12.9415 16.8918 15.6832 15.1584 17.5915 12.1584C18.3415 10.9834 18.3415 9.00843 17.5915 7.83343C15.6832 4.83343 12.9415 3.1001 9.99987 3.1001C7.0582 3.1001 4.31654 4.83343 2.4082 7.83343C1.6582 9.00843 1.6582 10.9834 2.4082 12.1584C4.31654 15.1584 7.0582 16.8918 9.99987 16.8918Z" stroke="#121639" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        );

        if (chatRestricted) {
            return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <OverlayTrigger placement="top" overlay={<Tooltip id={`chat-not-started-${buyer.search_log_id}`}>{tooltipMessage}</Tooltip>}>
                        <span>{icon}</span>
                    </OverlayTrigger>
                </div>
            );
        }

        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Link to={viewLink}>
                    {icon}
                </Link>
            </div>
        );
    };

    const handleSellerApproval = (buyer, approvalStatus) => {
        if (!buyer?.deal_id || isUpdatingApproval || !isSellerPending(buyer) || !canActOnBuyerDeal(buyer)) return;
        setPendingAction({ buyer, status: approvalStatus });
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        if (!pendingAction) return;
        const { buyer, status } = pendingAction;

        setShowConfirmModal(false);
        setIsUpdatingApproval(true);

        try {
            const response = await axios.post(
                `${apiUrl}deals/seller-accept-reject-offer`,
                {
                    buyer_deal_id: buyer.deal_id,
                    status: status,
                },
                { headers: getHeaders() }
            );

            toast.success(response?.data?.message || `Offer ${status} successfully.`, {
                position: toast.POSITION.TOP_RIGHT,
            });

            setDealData((prev) =>
                prev.map((item) =>
                    item.deal_id === buyer.deal_id
                        ? { ...item, is_seller_accepted: status }
                        : item
                )
            );
            setDealDetailsData((prev) => ({
                ...prev,
                buyers: {
                    ...prev.buyers,
                    data: (prev?.buyers?.data || []).map((item) =>
                        item.deal_id === buyer.deal_id
                            ? { ...item, is_seller_accepted: status }
                            : item
                    ),
                },
            }));
        } catch (error) {
            if (error?.response?.status === 401) {
                setLogout();
            } else {
                toast.error(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Unable to update offer status.",
                    { position: toast.POSITION.TOP_RIGHT }
                );
            }
        } finally {
            setIsUpdatingApproval(false);
            setPendingAction(null);
        }
    };

    const renderApprovalActions = (buyer) => {
        if (isSellerAccepted(buyer)) {
            return (
                <span className='status interested' style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    Accepted
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z" fill="#19955A"></path>
                    </svg>
                </span>
            );
        }

        if (isSellerPending(buyer)) {
            const approvalDisabled = isUpdatingApproval || !canActOnBuyerDeal(buyer);
            return (
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <button
                        type="button"
                        className="btn btn-sm btn-success"
                        disabled={approvalDisabled}
                        onClick={() => handleSellerApproval(buyer, "accepted")}
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={approvalDisabled}
                        onClick={() => handleSellerApproval(buyer, "rejected")}
                    >
                        Reject
                    </button>
                </div>
            );
        }

        if (isSellerRejected(buyer)) {
            return (
                <span className='status not-interested' style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    Rejected
                </span>
            );
        }

        return (
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", opacity: 0.5 }}>
                <button type="button" className="btn btn-sm btn-success" disabled>
                    Accept
                </button>
                <button type="button" className="btn btn-sm btn-outline-danger" disabled>
                    Reject
                </button>
            </div>
        );
    };

    const renderChatAction = (buyer) => {
        const chatLink = getBuyerChatLink(buyer);
        const chatInitiated = isChatInitiated(buyer);
        const chatEnabled = isChatEnabled(buyer);
        const chatRestricted = !isSellerAccepted(buyer) || (!chatInitiated && !chatEnabled);
        const chatButtonContent = (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Image src='/assets/images/chat-icon.svg' alt='' /> Chat With Buyer
            </span>
        );

        if (chatRestricted || !chatLink) {
            return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <button
                        type="button"
                        disabled
                        style={{ border: "none", background: "transparent", opacity: 0.55, cursor: "not-allowed" }}
                    >
                        {chatButtonContent}
                    </button>
                    <small style={{ color: "#7A809B", fontSize: "12px", lineHeight: 1.2 }}>
                        {!chatInitiated && !chatEnabled ? "No chat initiated yet" : "Chat restricted"}
                    </small>
                </div>
            );
        }

        return (
            <Link to={chatLink}>
                {chatButtonContent}
            </Link>
        );
    };

    return (
        <>
            <Header />
            <section className='main-section position-relative pt-4 pb-120'>
                <Container className='position-relative'>
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
                                    Property Deal Detail
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className='card-box column_bg_space'>
                        <Tab.Container defaultActiveKey="total_buyer">
                            <div className='deal_column radius-b-0'>
                                <div className='deal_left_column border-end-0 detail_deal_column position-relative'>
                                    <div className='detail_deal_left flex_1column'>
                                        <div className='pro_img'>
                                            <Image src={dealDetailsData != '' ? dealDetailsData.property_images[0] : '/assets/images/property-img.png'} alt='' />
                                        </div>
                                        <div className='pro_details'>
                                            <h3>{dealDetailsData.title}</h3>
                                            <Nav variant="pills">
                                                <Nav.Item onClick={() => setCurrentTab('total_buyer')}>
                                                    <Nav.Link eventKey="total_buyer">
                                                        <div className='list_icon'>
                                                            <Image src='/assets/images/total-buyer.svg' alt='' />
                                                        </div>
                                                        <div className='list_content'>
                                                            <span>{dealDetailsData.total_buyer}</span>
                                                            <p>Total Buyer</p>
                                                        </div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item onClick={() => setCurrentTab('want_to_buy')}>
                                                    <Nav.Link eventKey="want_to_buy">
                                                        <div className='list_icon'>
                                                            <Image src='/assets/images/home_buy.svg' alt='' />
                                                        </div>
                                                        <div className='list_content'>
                                                            <span>{dealDetailsData.want_to_buy_count}</span>
                                                            <p>Want To Buy</p>
                                                        </div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item onClick={() => setCurrentTab('interested')}>
                                                    <Nav.Link eventKey="interested">
                                                        <div className='list_icon'>
                                                            <Image src='/assets/images/home_check.svg' alt='' />
                                                        </div>
                                                        <div className='list_content'>
                                                            <span>{dealDetailsData.interested_count}</span>
                                                            <p>Interested</p>
                                                        </div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item onClick={() => setCurrentTab('not_interested')}>
                                                    <Nav.Link eventKey="not_interested">
                                                        <div className='list_icon'>
                                                            <Image src='/assets/images/home_close.svg' alt='' />
                                                        </div>
                                                        <div className='list_content'>
                                                            <span>{dealDetailsData.not_interested_count}</span>
                                                            <p>Not Interested</p>
                                                        </div>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </div>
                                    </div>

                                    {dealDetailsData.is_sold ?
                                        <div className='pro_sold'>
                                            <Image src="/assets/images/sold-img.svg" />
                                        </div>
                                        : <div className='total_notified'><p>Total Notified Buyers <span>: {dealDetailsData?.total_buyer}</span></p></div>
                                    }
                                </div>
                            </div>
                            <div className='pro_deal_table'>
                                <Tab.Content>
                                    <Tab.Pane eventKey={currentTab}>
                                        <div className='table-responsive' style={{ overflowY: "hidden" }}>
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>BUYER NAME</th>
                                                        <th>PHONE NUMBER</th>
                                                        <th>EMAIL ADDRESS</th>
                                                        {(currentTab == 'total_buyer' || currentTab == 'want_to_buy') &&
                                                            <th>PROOF OF FUND</th>
                                                        }
                                                        <th>STATUS</th>
                                                        {/* <th>APPROVAL</th> */}
                                                        <th>CHAT</th>
                                                        <th>View</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr><td colSpan={tableColumnCount}></td></tr>
                                                    {dealData.length > 0 ? (
                                                        dealData.map((data, index) => {
                                                            return (
                                                                <React.Fragment key={index}>
                                                                    <tr className={!data.mark_as_sold && dealDetailsData.is_sold && 'assign_property_disabled'}>
                                                                        <td>
                                                                            <span>
                                                                                <span className='deal_user_img_block'>
                                                                                    <Image src={data.profile_image || '/assets/images/user-img1.png'} className='deal_user_img' alt='' />
                                                                                    <Image src='/assets/images/pcheck.svg' className='user_verified_check' alt='' />
                                                                                </span>
                                                                                {data.buyer_name}
                                                                            </span>
                                                                        </td>
                                                                        <td>{data.buyer_phone ? "+1 " + data.buyer_phone : "-"}</td>
                                                                        <td>{data.buyer_email}</td>
                                                                        {(currentTab == 'total_buyer' || currentTab == 'want_to_buy') &&
                                                                            <td>
                                                                                {(() => {
                                                                                    const proofOfFund = getBuyerProofOfFundFile(data);
                                                                                    if (!proofOfFund.url) {
                                                                                        return <span className='justify-content-center'>-</span>;
                                                                                    }

                                                                                    return (
                                                                                        <a
                                                                                            href={proofOfFund.url}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            style={{ display: "inline-flex", alignItems: "center", gap: "6px", maxWidth: "100%", minWidth: 0 }}
                                                                                            title={proofOfFund.name || getProofOfFundLabel(data)}
                                                                                        >
                                                                                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", minWidth: 0, maxWidth: "100%" }}>
                                                                                                <Image src="/assets/images/folder-zip.svg" alt="" />
                                                                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "220px" }}>
                                                                                                    {proofOfFund.name || getProofOfFundLabel(data)}
                                                                                                </span>
                                                                                        </span>
                                                                                        </a>
                                                                                    );
                                                                                })()}
                                                                            </td>
                                                                        }
                                                                        <td>
                                                                            {data.status == 'Interested' && <span className='status interested'>Interested</span>}
                                                                            {data.status == 'Want to Buy' && <span className='status want-by'>Want To Buy</span>}
                                                                            {data.status == 'Not Interested' && <span className='status not-interested'>Not Interested</span>}
                                                                            {data.status == '' && <span className='justify-content-center'>N/A</span>}
                                                                        </td>
                                                                        {/* <td>
                                                                            {renderApprovalActions(data)}
                                                                        </td> */}
                                                                        <td>
                                                                            {renderChatAction(data)}
                                                                        </td>
                                                                        <td>
                                                                            {renderViewAction(data)}
                                                                        </td>
                                                                    </tr>
                                                                </React.Fragment>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={tableColumnCount} style={{ textAlign: 'center' }} className='not_found_data'>No data found</td>

                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                                <Pagination page={page} setPage={setPage} limit={limit} total={total} />
                            </div>
                        </Tab.Container>
                    </div>
                </Container>
            </section>
            <Footer />
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: 'none' }}></Modal.Header>
                <Modal.Body className="text-center pb-4 px-4 pt-0">
                    <div style={{ marginBottom: '16px' }}>
                        {pendingAction?.status === 'accepted' ? (
                            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="26" cy="26" r="26" fill="#E8F5EE" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M38.5 18.5L22 35L13.5 26.5L15.5 24.5L22 31L36.5 16.5L38.5 18.5Z" fill="#19955A" />
                            </svg>
                        ) : (
                            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="26" cy="26" r="26" fill="#FEE8E8" />
                                <path d="M34 18L18 34M18 18L34 34" stroke="#DC3545" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>
                    <h5 style={{ fontWeight: 700, color: '#1a164b', marginBottom: '8px' }}>
                        {pendingAction?.status === 'accepted' ? 'Accept Offer?' : 'Reject Offer?'}
                    </h5>
                    <p className="text-muted" style={{ fontSize: '14px', marginBottom: '24px' }}>
                        {pendingAction?.status === 'accepted'
                            ? 'Are you sure you want to accept this offer?'
                            : 'Are you sure you want to reject this offer?'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            style={{ minWidth: '100px' }}
                            onClick={() => { setShowConfirmModal(false); setPendingAction(null); }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={pendingAction?.status === 'accepted' ? 'btn btn-success' : 'btn btn-danger'}
                            style={{ minWidth: '100px' }}
                            onClick={handleConfirmAction}
                            disabled={isUpdatingApproval}
                        >
                            {pendingAction?.status === 'accepted' ? 'Yes, Accept' : 'Yes, Reject'}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default PropertyDealDetails;
