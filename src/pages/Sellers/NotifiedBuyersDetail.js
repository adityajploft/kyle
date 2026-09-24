import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Image, Nav } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";
import { useFormError } from "../../hooks/useFormError";
import axios from 'axios';
import { toast } from "react-toastify";
import ChatBodyPanel from '../../component/ChatPanel/ChatBody';
import useChat from "../../hooks/useChat ";

import { ChatProvider } from "../../context/chatContext";
import ChatSidebar from "../../component/ChatPanel/ChatSidebar";
import ChatMessagePanel from "../../component/ChatPanel/ChatMessagePanel";

const NotifiedBuyersDetail = () => {
    const { getTokenData, setLogout, getLocalStorageUserdata } = useAuth();
    const { setErrors } = useFormError();
    const [buyerDetails, setBuyerDetails] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [dealId, setdealId] = useState();
    const { id = '', logId = '' } = useParams();

    const handleChangeSold = (e) => {
        Swal.fire({
            title: "Are you sure want to mark sold?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showDenyButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                handleMarkSold();
            } else {
                setIsChecked(false);
            }
        });
    }
    const handleMarkSold = async () => {
        try {
            let headers = {
                Accept: "application/json",
                Authorization: "Bearer " + getTokenData().access_token,
                "auth-token": getTokenData().access_token,
            };
            let response = await axios.post(
                `${apiUrl}update-buyer-deal/${dealId}`,
                {
                    search_log_id: logId, status: 1,
                },
                { headers }
            );
            setIsChecked(true);
            setBuyerDetails(prev => ({
                ...prev,
                buyers: { ...prev.buyers, mark_as_sold: true }
            }));
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setLogout();
                }
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
                if (error.response.data.error) {
                    toast.error(error.response.data.error, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            }
        }
    }
    useEffect(() => {
        const fetchBuyerDetails = async () => {
            try {
                let headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };
                let response = await axios.post(`${apiUrl}notify-buyer-details`, { user_id: id, search_log_id: logId }, { headers: headers });
                setdealId(response.data.data.buyers.deal_id)
                setBuyerDetails(response.data.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchBuyerDetails();
    }, []);

  
    const { id: chatPartnerId = '' } = useParams();
    const [userRole, setUserRole] = useState(0);
    const messagesEndRef = useRef("chat_box");
    useEffect(() => {
        const userData = getLocalStorageUserdata();
        if (getTokenData().access_token && userRole === 0) {
            setUserRole(userData.role);
        }
    }, []);


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
                                    Notified Buyers Detail
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className='card-box column_bg_space'>
                        <div className='deal_column notified_buyers_deals'>
                            <div className='detail_deal_left flex_1column'>
                                <div className='pro_img'>
                                    <Image src='/assets/images/property-img.png' alt='' />
                                </div>
                                <div className='pro_details'>
                                    <h3>{buyerDetails.address}</h3>
                                    <Nav>
                                        <Nav.Item>
                                            <Nav.Link eventKey="total_buyer">
                                                <div className='list_icon'>
                                                    <Image src='/assets/images/total-buyer.svg' alt='' />
                                                </div>
                                                <div className='list_content'>
                                                    <span>{buyerDetails.total_buyer}</span>
                                                    <p>Total Buyer</p>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="want_to_buy">
                                                <div className='list_icon'>
                                                    <Image src='/assets/images/home_buy.svg' alt='' />
                                                </div>
                                                <div className='list_content'>
                                                    <span>{buyerDetails.want_to_buy_count}</span>
                                                    <p>Want To Buy</p>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="interested">
                                                <div className='list_icon'>
                                                    <Image src='/assets/images/home_check.svg' alt='' />
                                                </div>
                                                <div className='list_content'>
                                                    <span>{buyerDetails.interested_count}</span>
                                                    <p>Interested</p>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="not_interested">
                                                <div className='list_icon'>
                                                    <Image src='/assets/images/home_close.svg' alt='' />
                                                </div>
                                                <div className='list_content'>
                                                    <span>{buyerDetails.not_interested_count}</span>
                                                    <p>Not Interested</p>
                                                </div>
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </div>
                            </div>
                        </div>
                        <div className='notified_buyers_info'>
                            <ul className='notified_buyers_info_list'>
                                <li>
                                    <div className='notified_buyers_user_detail'>
                                        <span className="deal_user_img_block">
                                            <Image src="/assets/images/user-img1.png" alt="" className="deal_user_img" />
                                            <Image src="/assets/images/pcheck.svg" alt="" className="user_verified_check" />
                                        </span>
                                        {buyerDetails.buyers?.buyer_name}
                                    </div>
                                </li>
                                <li>{buyerDetails.buyers?.buyer_phone ? "+1 " + buyerDetails.buyers.buyer_phone : "-"}</li>
                                {buyerDetails.buyers?.want_to_buy_deal_pdf_url &&
                                    <li>
                                        <Link to={buyerDetails.buyers?.want_to_buy_deal_pdf_url}>
                                            <span className='d-flex align-items-center gap-1'>
                                                <Image src="/assets/images/folder-zip.svg" alt="" style={{ marginBottom: '-8px' }} /> Documents.zip
                                            </span>
                                        </Link>
                                    </li>
                                }
                            </ul>                         
                        </div>
                    </div>
                    <ChatProvider>
                        <div className="card-box">
                            <Row>
                                {!chatPartnerId &&
                                    <Col lg="4">
                                        <ChatSidebar />
                                    </Col>
                                }
                                <Col lg={chatPartnerId ? '12' : '8'}>
                                    <div className="message-panel">
                                        <ChatMessagePanel />
                                        <div ref={messagesEndRef} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </ChatProvider>
                </Container>
            </section>
            <Footer />
        </>
    );
};
export default NotifiedBuyersDetail;
