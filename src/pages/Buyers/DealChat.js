import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Figure, Image, Modal, Nav, Row, Tab, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from '../../partials/Footer';
import BuyerHeader from '../../partials/BuyerHeader';
import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const DealChat = () => {
    const { getLocalStorageUserdata } = useAuth();
    const { dealId, buyerId } = useParams();
    const userData = getLocalStorageUserdata();
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get("tab") || "tab2";
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);
    const [acceptOffer, setAcceptOffer] = useState(false);
    

    const handleAcceptOffer = () => {
        setAcceptOffer(true);
    }
    const handleAcceptOfferClose = () => {
        setAcceptOffer(false);
    }
  return (
    <>
        <BuyerHeader />
            <section className='main-section position-relative pt-4 pb-120'>
                <Container className='position-relative'>
                    <div className="back-block">
                        <div className="row">
                            <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                                <Link to={void(0)} onClick={()=>{window.history.back()}} className="back">
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
                                    Deal
                                </h6>
                            </div>
                        </div>
                    </div>
                    <div className='card-box column_bg_space'>
                        <div className='deal_column mb-4'>
                            <div className='deal_left_column notifications_deal_column border-end-0'>
                                <div className='deal_notifications_left flex_1column align-items-center'>
                                    <div className='pro_img'>
                                        <div className='pro_img-main'>
                                            <Image src='/assets/images/property-img.png' alt='Default Image' width={200} height={200} />
                                        </div>
                                        <div className='deal_img_group'>
                                            <div>
                                                <Image src='/assets/images/property-img.png' alt="" width={100} height={100} />
                                            </div>
                                            <div>
                                                <Image src='/assets/images/property-img.png' alt="" width={100} height={100} />
                                            </div>
                                            <div>
                                                <Image src='/assets/images/property-img.png' alt="" width={100} height={100} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='pro_details'>
                                        <h3>4517 Washington Ave. Manchester, Kentucky 39495..</h3>
                                        <p>Real Estate Company That Prioritizes Property</p>
                                        <div className="property-details-Browse-Deal-icons">
                                            <div className="detail">
                                                <div>
                                                    <img src='/assets/images/double-bed.svg'/>
                                                </div>
                                                <span>Beds: 2</span>
                                            </div>
                                            <div className="detail">
                                                <div>
                                                    <img src='/assets/images/bath-1.svg'/>
                                                </div>
                                                <span>Baths: 2</span>
                                            </div>
                                            <div className="detail">
                                                <div>
                                                    <img src='/assets/images/network-1.svg'/>
                                                </div>
                                                <span>Liveable sq. ft. : 1000</span>
                                            </div>
                                            <div className="detail">
                                                <div>
                                                    <img src='/assets/images/full-screen-2.svg'/>
                                                </div>
                                                <span>Lot sq. ft. : 800</span>
                                            </div>
                                        </div>
                                        <div class="middle_left_btn_area">
                                            <button class="fav_btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                    <path d="M8.93852 14.7404C8.69768 14.8254 8.30102 14.8254 8.06018 14.7404C6.00602 14.0391 1.41602 11.1137 1.41602 6.15538C1.41602 3.96663 3.17977 2.1958 5.35435 2.1958C6.64352 2.1958 7.78393 2.81913 8.49935 3.78247C9.21477 2.81913 10.3623 2.1958 11.6443 2.1958C13.8189 2.1958 15.5827 3.96663 15.5827 6.15538C15.5827 11.1137 10.9927 14.0391 8.93852 14.7404Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                Add favorite deal
                                            </button>
                                            <p className='mb-0'>Asking Price : <span>$200.00</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='chat_box'>
                            <div className='chat_header d-flex flex-wrap align-items-center'>
                                <div className='chat_header_user d-flex flex-wrap align-items-center'>
                                    <Figure>
                                        <Image src='/assets/images/property-img.png' alt='' />
                                        <span className='active_status'></span>
                                    </Figure>
                                    <div>
                                        <div className='d-flex chat_user_name_area'>
                                            <span>Brooklyn Simmons</span><span>Level 1</span>
                                        </div>
                                        <div className='d-flex align-items-center chat_user_name_below gap-2'>
                                            <p>Online</p>
                                            <p className='d-flex gap-1'>
                                                <span><Image src='/assets/images/coin.svg' alt='' /></span>
                                                VIP
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='chat_header_action d-flex'>
                                    <div className='fav-icons-start'><img src='/assets/images/vector.svg'/></div>
                                    <Dropdown>
                                        <Dropdown.Toggle>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="20" viewBox="0 0 4 20" fill="none">
                                            <path d="M2 4C3.10457 4 4 3.10457 4 2C4 0.895431 3.10457 0 2 0C0.895431 0 0 0.895431 0 2C0 3.10457 0.895431 4 2 4Z" fill="#464B70"/>
                                            <path d="M2 11.9999C3.10457 11.9999 4 11.1044 4 9.99988C4 8.89531 3.10457 7.99988 2 7.99988C0.895431 7.99988 0 8.89531 0 9.99988C0 11.1044 0.895431 11.9999 2 11.9999Z" fill="#464B70"/>
                                            <path d="M2 19.9998C3.10457 19.9998 4 19.1043 4 17.9998C4 16.8952 3.10457 15.9998 2 15.9998C0.895431 15.9998 0 16.8952 0 17.9998C0 19.1043 0.895431 19.9998 2 19.9998Z" fill="#464B70"/>
                                            </svg>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                            <Dropdown.Item href="javascript:void(0)">Unblock</Dropdown.Item>
                                            <Dropdown.Item href="javascript:void(0)">Block</Dropdown.Item>
                                            <Dropdown.Item href="javascript:void(0)" className='text-danger'><strong>Report</strong></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className='chat_body'>
                                <div className='whole_messages scrollbar_design'>
                                    {activeTab === "tab1" && 
                                        <>
                                            <div>
                                                <div class="day-header line-with-text"><span>08-01-2025</span></div>
                                                <div class="msg_item false">
                                                    <div class="msg_content">111111111111111</div>
                                                    <p class="msg_time">12:14 PM</p>
                                                </div>
                                                <div class="msg_item outgoing_msg">
                                                    <div class="msg_content">1qzxsedcr</div>
                                                    <p class="msg_time">12:14 PM</p>
                                                </div>
                                                <div class="msg_item false">
                                                    <div class="msg_content">1ws</div>
                                                    <p class="msg_time">12:15 PM</p>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="day-header line-with-text">
                                                    <span>23-01-2025</span>
                                                </div>
                                                <div class="msg_item outgoing_msg">
                                                    <div class="msg_content">hiii</div>
                                                    <p class="msg_time">11:26 AM</p>
                                                </div>
                                                <div class="msg_item outgoing_msg">
                                                    <div class="msg_content">hello</div>
                                                    <p class="msg_time">11:26 AM</p>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {activeTab === "tab2" && 
                                        <>
                                            <div>
                                                <div class="day-header line-with-text"><span>08-01-2025</span></div>
                                                <div class="msg_item offer_item false">
                                                    <div class="msg_content">
                                                        <span>Buyer Offer</span>
                                                        <h4>$16,00,000/-</h4>
                                                        <div className='offer_chat_bothBtn'>
                                                            <Link href="#" className='offer_chat_fillBtn' onClick={()=> handleAcceptOffer()}>Accept Offer</Link>
                                                            <Link href="#" className='offer_chat_outlineBtn'>Counter Offer</Link>
                                                        </div>
                                                    </div>
                                                    <p class="msg_time">12:14 PM</p>
                                                </div>
                                                <div class="msg_item offer_item outgoing_msg">
                                                    <div class="msg_content">
                                                        <span>Buyer Offer</span>
                                                        <h4>$16,00,000/-</h4>
                                                    </div>
                                                    <p class="msg_time">11:26 AM</p>
                                                </div>
                                                <div class="msg_item offer_item false">
                                                    <div class="msg_content">
                                                        <span>Buyer Offer</span>
                                                        <h4>$18,00,000/-</h4>
                                                        <div className='offer_chat_bothBtn'>
                                                            <Link href="#" className='offer_chat_fillBtn' onClick={()=> handleAcceptOffer()}>Accept Offer</Link>
                                                            <Link href="#" className='offer_chat_outlineBtn'>Counter Offer</Link>
                                                        </div>
                                                    </div>
                                                    <p class="msg_time">12:14 PM</p>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className='chat_footer noti_buyer_chat_foot'>
                                <div className='chat_footBoth_btn'>
                                    <ul>
                                        <li>
                                            <Button className={activeTab === "tab1" ? "active foot_fill_btn" : "foot_fill_btn"} onClick={() => setActiveTab("tab1")}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path d="M12.75 13.8226H9.75L6.41249 16.0425C5.91749 16.3725 5.25 16.0201 5.25 15.4201V13.8226C3 13.8226 1.5 12.3226 1.5 10.0726V5.57251C1.5 3.32251 3 1.82251 5.25 1.82251H12.75C15 1.82251 16.5 3.32251 16.5 5.57251V10.0726C16.5 12.3226 15 13.8226 12.75 13.8226Z" stroke="#3F53FE" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M8.99986 8.52002V8.36255C8.99986 7.85255 9.31488 7.58254 9.62988 7.36504C9.93738 7.15504 10.2448 6.88505 10.2448 6.39005C10.2448 5.70005 9.68986 5.14502 8.99986 5.14502C8.30986 5.14502 7.75488 5.70005 7.75488 6.39005" stroke="#3F53FE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M8.99662 10.3125H9.00337" stroke="#3F53FE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>Questions
                                            </Button>
                                        </li>
                                        <li>
                                            <Button 
                                                className={activeTab === "tab2" ? "active foot_outline_btn" : "foot_outline_btn"} 
                                                onClick={() => setActiveTab("tab2")}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                                    <path d="M3.71177 11.6448L7.11556 15.0423C8.51314 16.4373 10.7823 16.4373 12.1874 15.0423L15.486 11.7498C16.8836 10.3548 16.8836 8.08978 15.486 6.68728L12.0747 3.29728C11.3609 2.58478 10.3766 2.20228 9.36973 2.25478L5.61278 2.43478C4.11 2.50228 2.9153 3.69478 2.84016 5.18728L2.65982 8.93727C2.61474 9.94977 2.99795 10.9323 3.71177 11.6448Z" stroke="#07B89C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M7.71636 9.16992C8.75381 9.16992 9.59484 8.33046 9.59484 7.29492C9.59484 6.25939 8.75381 5.41992 7.71636 5.41992C6.67891 5.41992 5.83789 6.25939 5.83789 7.29492C5.83789 8.33046 6.67891 9.16992 7.71636 9.16992Z" stroke="#07B89C" stroke-width="1.5" stroke-linecap="round"/>
                                                    <path d="M10.3467 12.9199L13.3522 9.91992" stroke="#07B89C" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>Make Offer
                                            </Button>
                                        </li>
                                    </ul>
                                </div>
                                <form className='msg_send_footer'>
                                    <input type='text' placeholder='Message Here...' />
                                    <button type='button' className='msg_send_btn'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        <Footer />

        <Modal show={acceptOffer} onHide={() => setAcceptOffer(false)} centered className='radius_30 max-648'>
            <Modal.Header closeButton className='new_modal_close'></Modal.Header>
            <Modal.Body className='space_modal'>
                <div className='modal_inner_content AcceptOfferModal'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="99" viewBox="0 0 100 99" fill="none">
                        <path d="M49.9998 94.05C25.6623 94.05 5.8623 73.8375 5.8623 49.5C5.8623 25.1625 25.6623 5.36255 49.9998 5.36255C74.3373 5.36255 94.5498 25.1625 94.5498 49.5C94.5498 73.8375 74.3373 94.05 49.9998 94.05ZM49.9998 11.55C28.9623 11.55 11.6373 28.4626 11.6373 49.9125C11.6373 71.3625 28.5498 88.275 49.9998 88.275C71.4498 88.275 88.3623 71.3625 88.3623 49.9125C88.3623 28.4626 71.0373 11.55 49.9998 11.55Z" fill="#07B89C"/>
                        <path d="M50 70.125C52.2782 70.125 54.125 68.2782 54.125 66C54.125 63.7218 52.2782 61.875 50 61.875C47.7218 61.875 45.875 63.7218 45.875 66C45.875 68.2782 47.7218 70.125 50 70.125Z" fill="#07B89C"/>
                        <path d="M50.0002 56.925C48.3502 56.925 46.7002 55.6875 46.7002 53.625V28.875C46.7002 27.225 47.9377 25.575 50.0002 25.575C52.0627 25.575 53.3002 26.8125 53.3002 28.875V53.625C53.3002 55.275 51.6502 56.925 50.0002 56.925Z" fill="#07B89C"/>
                    </svg>
                    <h4>Are you sure?</h4>
                    <p>Do you really want to accept this offer and mark this property as sold!</p>
                    <div className='FeaturedDealModal'>
                        <div className="both_btn_group m-0">
                            <button type="button" className="btn btn-fill btn-primary">Yes</button>
                            <button type="button" className="light_bg_btn btn btn-primary" onClick={handleAcceptOfferClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </>
  );
};
export default DealChat;