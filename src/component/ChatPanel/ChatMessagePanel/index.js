import React, { useEffect, useState, useRef } from 'react'
import { Button, Dropdown, Figure, Image, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from 'react-toastify';
import ReportModal from '../ReportModal';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useChatContext } from '../../../context/chatContext';

const ChatMessagePanel = ({ showNoChatInitiatedMessage = false }) => {
  const { messages, message, setMessage, sendMessage, activeUserData, handleConfirmBox, conversationUuid, currentUserId, setIsSubmitted, isSubmitted, chatPartnerId, messageType, setMessageType, inputValue, setInputValue, handleSendMessage, priceMessages, setPriceMessages, scrollToBottom, setCounterOfferInput, counterOfferInput, attachment, setAttachment, dealId, setDealId, setIsCounterOffer, selectedPofDocument, setSelectedPofDocument, manualFile, setManualFile, pofDocumentId, setPofDocumentId, isUploading, isSending, setIsUploading, preview, setPreview, handleMarkSold, congratulationPopup, setCongratulationPopup, acceptOffer, setAcceptOffer, onlineUsers, isLoader } = useChatContext();
  const isOnline = onlineUsers.has(Number(activeUserData?.id));
  const { getTokenData, getLocalStorageUserdata } = useAuth();
  const userData = getLocalStorageUserdata();
  const [isShowReportModal, setIsShowReportModal] = useState(false);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [reportReasons, setReportReasons] = useState([]);
  const [verifiedData, setVerifiedData] = useState([]);
  const [openGallery, setopenGallery] = useState(false);
  const [pofDocumentError, setPofDocumentError] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const toBooleanFlag = (value) => {
    if (typeof value === "string") {
      return ["true", "1", "yes"].includes(value.toLowerCase().trim());
    }
    return Boolean(value);
  };

  const getOfferStatusLabel = (dealStatus) => {
    if (dealStatus === "Accepted") return "Accepted";
    if (dealStatus === "Pending") return "Pending";
    return null;
  };

  useEffect(() => {
    if (getTokenData().access_token !== null) {
      let userData = getLocalStorageUserdata();
      if (userData.role === 3) {
        setopenGallery(true);
      }
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isSending) {
        return;
      }

      if (counterOffer) {
        handleSendMessageFromCounter();
        return;
      }

      if (e.shiftKey) {
        setMessage((prevMessage) => `${prevMessage}\n`);
      }
      else if (message.trim()) {
        sendMessage();
      } else if (messageType == "offer" && inputValue) {
        handlePrimaryOfferSend();
      }
    }
  };
  const openSidebar = () => {
    document.body.classList.add("msg-sidebar-open");
  };

  const getAuthHeaders = () => ({
    Accept: "application/json",
    Authorization: `Bearer ${getTokenData().access_token}`,
  });

  const handleAddWishList = (status) => {
    const addToWishList = async () => {
      try {
        const response = await axios.post(`${apiUrl}wishlist/add`, { wishlist_user_id: currentUserId }, { headers: getAuthHeaders() });
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsSubmitted(!isSubmitted);
      } catch (error) {
        console.error("Error fetching messages:", error.response?.data?.message || error.message);
      }
    }
    addToWishList();
  }

  const handleRemoveWishList = (status) => {
    const addToWishList = async () => {
      try {
        const response = await axios.post(`${apiUrl}wishlist/remove`, { wishlist_user_id: currentUserId }, { headers: getAuthHeaders() });
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsSubmitted(!isSubmitted);
      } catch (error) {
        console.error("Error fetching messages:", error.response?.data?.message || error.message);
      }
    }
    addToWishList();
  }

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reason) {
      setError("Reason for Report is required.");
      return;
    }
    setError("");
    const formData = {
      reason,
      comment,
    };

    const addToWishList = async () => {
      try {
        const response = await axios.post(`${apiUrl}conversations/${conversationUuid}/add-to-report`, formData, { headers: getAuthHeaders() });
        if (response.data.status) {
          setIsShowReportModal(false);
        }
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        setError(error.response?.data?.message)
      }
    }
    addToWishList();
  };

  const handleChangeReason = (e) => {
    const reason = reportReasons.find(reason => reason.id == e.target.value);
    let selectedComment = reason ? reason.description : "";
    setReason(e.target.value);
    setComment(selectedComment);
    setError("");
  }

  useEffect(() => {
    const fetchReportReason = async () => {
      try {
        const response = await axios.get(`${apiUrl}get-reasons`, { headers: getAuthHeaders() });
        setReportReasons(response.data.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchReportReason();
  }, []);

  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "tab1";
  //  const initialTab = searchParams.get("tab") || "tab2";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  const [counterOffer, setCounterOffer] = useState(false);
  const currentDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState([]);
  const [verifiedDocuments, setVerifiedDocuments] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isProofOfFundSubmit, setisProofOfFundSubmit] = useState(false);
  const [hasSubmittedProofOfFunds, setHasSubmittedProofOfFunds] = useState(false);
  const [isSubmittingCounterOffer, setIsSubmittingCounterOffer] = useState(false);
  const isCounterOfferRestricted = toBooleanFlag(activeUserData?.is_counter_offer_restricted);
  const hasUploadedProofOfFunds = toBooleanFlag(activeUserData?.is_pof_uploaded);
  const isBuyerUser = Number(userData?.role) === 3;
  const hasChatStarted = Boolean(
    activeUserData?.conversation_uuid ||
    activeUserData?.conversation_id ||
    activeUserData?.chat_uuid ||
    activeUserData?.chat_conversation_uuid ||
    activeUserData?.message_started ||
    activeUserData?.chat_started
  );

  const handleAcceptOffer = (msg) => {
    setCounterOfferInput(msg.content);
    setAcceptOffer(true);
  }
  const handleAcceptOfferClose = () => {
    setAcceptOffer(false);
  }

  const closeOfferModal = () => {
    setCounterOffer(false);
    setSelectedOffer(null);
    setErrors([]);
    setSelectedPofDocument(null);
    setManualFile(null);
    setPofDocumentId("");
  };

  useEffect(() => {
    setMessageType(activeTab == 'tab1' ? 'normal' : 'offer');
    scrollToBottom();
    setMessage("")
    setInputValue(100);
  }, [activeTab]);

  const filterMessagesByType = (messages, messageType) => {
    const filteredMessages = {};

    for (const date in messages) {
      filteredMessages[date] = messages[date].filter((msg) => msg.message_type === messageType);
    }
    return filteredMessages;
  };

  const normalMessages = filterMessagesByType(messages, "normal") || [];
  const offerMessages = filterMessagesByType(messages, "offer") || [];

  useEffect(() => {

    const offerMessages = Object.values(filterMessagesByType(messages, "offer")).flat();
    setPriceMessages(offerMessages);
  }, [messages]);
  const proofOfFundsRequired = Number(userData?.role) === 3 && !hasUploadedProofOfFunds && !hasSubmittedProofOfFunds;
  const counterOfferDisabledMessage = "Counter offer is disabled for this deal.";
  const makeOfferDisabledMessage = "Make offer is disabled for this deal.";

  const checkProofOfFundsStatus = async () => {
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };

      const formData = new FormData();
      formData.append("buyer_deal_id", dealId);
      let response = await axios.post(`${apiUrl}check-proof-of-funds`, formData, { headers: headers });

      const { status } = response.data;

      if (status) {
        setisProofOfFundSubmit(true);
        setHasSubmittedProofOfFunds(true);
        return true;
      }
    } catch (error) {
      console.log("err", error);
    }
    setisProofOfFundSubmit(false);
    return false;
  };

  const inputRef = useRef(null);
  const counterinputRef = useRef(null);
  const handleClickInput = async (e, msg) => {
    if (isCounterOfferRestricted) {
      return;
    }
    console.log(msg.deal_status, "msg");
    e.preventDefault();
    setErrors([]);
    setSelectedPofDocument(null);
    setManualFile(null);
    setCounterOffer(true);
    setSelectedOffer(msg);
    setCounterOfferInput(msg.content);
    setTimeout(() => {
      counterinputRef.current?.focus();
      counterinputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  };

  const handleSendMessageFromCounter = async () => {
    if (isCounterOfferRestricted || isSubmittingCounterOffer) {
      return;
    }

    if (proofOfFundsRequired && !selectedPofDocument && !manualFile) {
      setErrors({
        pdf_file: "Please upload or select Proof of Funds before submitting your counter offer."
      });
      return;
    }

    setErrors([]);
    setIsSubmittingCounterOffer(true);

    try {
      const isSent = await sendMessage();
      if (!isSent) {
        return;
      }

      if (selectedPofDocument || manualFile) {
        setHasSubmittedProofOfFunds(true);
        setisProofOfFundSubmit(true);
      }

      setCounterOffer(false);
      setSelectedOffer(null);
      setSelectedPofDocument(null);
      setManualFile(null);
      setPofDocumentId("");
    } finally {
      setIsSubmittingCounterOffer(false);
    }
  };

  const handleVerifiedDocuments = async () => {
    setVerifiedDocuments(true)
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      let response = await axios.get(`${apiUrl}get-proof-of-funds-pdfs`, { headers: headers });
      const { data, status } = response.data;

      if (status) {
        setVerifiedDocuments(true);
        setVerifiedData(data);
      }
    } catch (error) {
      console.log("err", error);

    }
  }

  const handleSelectDocument = async () => {
    const doc = verifiedData.find(d => d.id === pofDocumentId);
    if (doc) {
      setSelectedPofDocument(doc);
      setManualFile(null);
      setIsCounterOffer(1);
      setErrors([]);
    }
    setVerifiedDocuments(false)
  }

  const handleManualFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setManualFile(file);
      setSelectedPofDocument(null);
      setIsCounterOffer(1);
      setErrors([]);
    }
  };

  const handleCounterOffer = () => {
    setCounterOffer(true);
  }

  const handlePrimaryOfferSend = async () => {
    if (isCounterOfferRestricted) {
      return;
    }

    if (userData?.role !== 3) {
      await sendMessage();
      return;
    }

    setErrors([]);
    setIsCounterOffer(0);
    setSelectedOffer(null);
    setCounterOfferInput(inputValue);
    setCounterOffer(true);
    if (!proofOfFundsRequired) {
      setSelectedPofDocument(null);
      setManualFile(null);
      setPofDocumentId("");
    }
    return;
  };

  useEffect(() => {
    if (userData?.role === 3 && dealId) {
      checkProofOfFundsStatus();
    }
  }, [dealId]);



  const handleSold = () => {
    navigate(`/buyer/deal-notifications`);
  }

  const handleAttachment = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAttachment(file);
    const fileType = file.type.toLowerCase();

    if (fileType.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({ type: "image", url: reader.result, name: file.name });
        setError("")
      };
      reader.readAsDataURL(file);
    }
    else if (fileType === "application/pdf") {
      setPreview({ type: "pdf", url: URL.createObjectURL(file), name: file.name });
      setError("")
    }
    else if (fileType.startsWith("video/")) {
      setPreview({ type: "video", url: URL.createObjectURL(file), name: file.name });
      setError("")
    }
    else if (
      fileType === "application/vnd.ms-excel" ||
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "text/csv"
    ) {
      setPreview({ type: "excel", url: URL.createObjectURL(file), name: file.name });
      setError("")
    }
    else {
      setError("Please upload an image, PDF, video, or Excel file.");
      setPreview(null);
      setAttachment(null)
    }
    e.target.value = "";
  };


  const [rawValue, setRawValue] = useState("");

  // const shouldRestrictSellerChat =
  //   Number(userData?.role) === 2 &&
  //   (activeUserData?.is_chat_restricted != null
  //     ? toBooleanFlag(activeUserData?.is_chat_restricted)
  //     : !Boolean(
  //         activeUserData?.conversation_uuid ||
  //         activeUserData?.conversation_id ||
  //         activeUserData?.chat_uuid ||
  //         activeUserData?.chat_conversation_uuid ||
  //         activeUserData?.message_started ||
  //         activeUserData?.chat_started
  //       ));

  const shouldRestrictSellerChat =
    Number(userData?.role) === 2 &&
    toBooleanFlag(activeUserData?.is_chat_restricted);
  const formatWithCommas = (value) => {
    if (!value) return "";
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e) => {
    let digitsOnly = e.target.value.replace(/\D/g, "");
    setRawValue(digitsOnly);
    setInputValue(formatWithCommas(digitsOnly));
    console.log(digitsOnly, "digitsOnly");
  };


  const handleCounterOfferInput = (e) => {
    let digitsOnly = e.target.value.replace(/\D/g, "");
    setRawValue(digitsOnly);
    setCounterOfferInput(formatWithCommas(digitsOnly));
  };


  return (
    <>
      <div className='chat_box'>
        {Array.isArray(activeUserData) && activeUserData.length === 0 ?
          <p className='text-center'>No chat found</p>
          :
          <>
            <div className='chat_header d-flex flex-wrap align-items-center'>
              <div className='chat_header_user d-flex flex-wrap align-items-center'>
                <div className='mobile_hamburger d-lg-none' onClick={openSidebar}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="29" viewBox="0 0 19 29" fill="none">
                    <path d="M0.448867 9.64138C0.360065 9.55261 0.299584 9.4395 0.275075 9.31635C0.250566 9.1932 0.263129 9.06555 0.311177 8.94955C0.359224 8.83354 0.440596 8.73439 0.545001 8.66464C0.649406 8.59489 0.772152 8.55766 0.897714 8.55768L17.4871 8.55768C17.6555 8.55768 17.817 8.62457 17.936 8.74362C18.0551 8.86268 18.122 9.02416 18.122 9.19253C18.122 9.3609 18.0551 9.52238 17.936 9.64144C17.817 9.7605 17.6555 9.82738 17.4871 9.82738L0.897714 9.82738C0.814336 9.82747 0.731761 9.81108 0.654734 9.77916C0.577707 9.74724 0.507745 9.70041 0.448867 9.64138Z" fill="#121639" />
                    <path d="M17.936 14.6412C17.8772 14.7003 17.8072 14.7471 17.7302 14.779C17.6532 14.8109 17.5706 14.8273 17.4872 14.8272L0.897813 14.8272C0.72944 14.8272 0.567964 14.7603 0.448906 14.6413C0.329849 14.5222 0.262963 14.3608 0.262963 14.1924C0.262963 14.024 0.329849 13.8625 0.448906 13.7435C0.567964 13.6244 0.72944 13.5575 0.897813 13.5575L17.4872 13.5575C17.6128 13.5575 17.7355 13.5947 17.8399 13.6645C17.9443 13.7342 18.0257 13.8334 18.0737 13.9494C18.1218 14.0654 18.1343 14.1931 18.1098 14.3162C18.0853 14.4393 18.0249 14.5525 17.936 14.6412Z" fill="#121639" />
                    <path d="M17.936 19.6412C17.8772 19.7003 17.8072 19.7471 17.7302 19.779C17.6532 19.8109 17.5706 19.8273 17.4872 19.8272L0.897813 19.8272C0.72944 19.8272 0.567964 19.7603 0.448906 19.6413C0.329849 19.5222 0.262963 19.3608 0.262963 19.1924C0.262963 19.024 0.329849 18.8625 0.448906 18.7435C0.567964 18.6244 0.72944 18.5575 0.897813 18.5575L17.4872 18.5575C17.6128 18.5575 17.7355 18.5947 17.8399 18.6645C17.9443 18.7342 18.0257 18.8334 18.0737 18.9494C18.1218 19.0654 18.1343 19.1931 18.1098 19.3162C18.0853 19.4393 18.0249 19.5525 17.936 19.6412Z" fill="#121639" />
                  </svg>
                </div>
                <Figure>
                  <Image src={activeUserData.profile_image || '/assets/images/property-img.png'} alt='' />
                  <span className={isOnline ? 'active_status' : 'inactive_status'}></span>
                </Figure>
                <div>
                  <div className='d-flex chat_user_name_area'><span>{activeUserData.name}</span><span>Level {activeUserData.level_type}</span></div>
                  <div className='d-flex align-items-center chat_user_name_below gap-2'>
                    <p>{isOnline ? 'Online' : 'Offline'}</p>
                    {activeUserData.profile_tag_image &&
                      <p className='d-flex gap-1'>
                        <span><Image src={activeUserData?.profile_tag_image} alt='' /></span>
                        {activeUserData?.profile_tag_name}
                      </p>
                    }
                  </div>
                </div>
              </div>

              <div className='chat_header_action d-flex'>
                {activeUserData.wishlisted ? <div className='fav-icons-start' onClick={handleRemoveWishList}><img src={`${process.env.PUBLIC_URL}/assets/images/vector-yellow.svg`} /></div> : <div className='fav-icons-start' onClick={handleAddWishList}><img src={`${process.env.PUBLIC_URL}/assets/images/vector.svg`} /></div>}

                <Dropdown>
                  <Dropdown.Toggle>
                    <svg xmlns="http://www.w3.org/2000/svg" width="4" height="20" viewBox="0 0 4 20" fill="none">
                      <path d="M2 4C3.10457 4 4 3.10457 4 2C4 0.895431 3.10457 0 2 0C0.895431 0 0 0.895431 0 2C0 3.10457 0.895431 4 2 4Z" fill="#464B70" />
                      <path d="M2 11.9999C3.10457 11.9999 4 11.1044 4 9.99988C4 8.89531 3.10457 7.99988 2 7.99988C0.895431 7.99988 0 8.89531 0 9.99988C0 11.1044 0.895431 11.9999 2 11.9999Z" fill="#464B70" />
                      <path d="M2 19.9998C3.10457 19.9998 4 19.1043 4 17.9998C4 16.8952 3.10457 15.9998 2 15.9998C0.895431 15.9998 0 16.8952 0 17.9998C0 19.1043 0.895431 19.9998 2 19.9998Z" fill="#464B70" />
                    </svg>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    {activeUserData.is_block ?
                      <Dropdown.Item href="javascript:void(0)" onClick={() => handleConfirmBox(activeUserData.id, 0)}>Unblock</Dropdown.Item>
                      :
                      <Dropdown.Item href="javascript:void(0)" onClick={() => handleConfirmBox(activeUserData.id, 1)}>Block</Dropdown.Item>
                    }
                    <Dropdown.Item href="javascript:void(0)" className='text-danger' onClick={() => { setIsShowReportModal(true) }}><strong>Report</strong></Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            {showNoChatInitiatedMessage && (
              <div className='chat_body'>
                <div className='whole_messages scrollbar_design'>
                  <div
                    className="d-flex flex-column justify-content-center align-items-center text-center"
                    style={{ minHeight: "300px", color: "#6B7280", padding: "32px 20px" }}
                  >
                    <Image
                      src="/assets/images/msg-top.svg"
                      alt="chat not initiated"
                      style={{ width: "42px", height: "42px", opacity: 0.7, marginBottom: "14px" }}
                    />
                    <h6 style={{ color: "#121639", fontSize: "22px", fontWeight: 600, marginBottom: "8px" }}>
                      Chat not initiated yet
                    </h6>
                    <p className="mb-0" style={{ maxWidth: "420px" }}>
                      Chat will appear here once it is initiated from the buyer side.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!showNoChatInitiatedMessage && activeTab === "tab1" &&
              <>
                <div className='chat_body'>
                  <div className='whole_messages scrollbar_design'>
                    {Object.entries(normalMessages).map(([day, dayMessages], index) => (
                      <div key={index}>
                        <div className="day-header line-with-text"><span>{day}</span></div>
                        {dayMessages.map((data, i) => (
                          <div className={`msg_item ${data.sender_id !== activeUserData.id ? "outgoing_msg" : ""}`} key={i}>
                            <div className="">
                              {data?.chat_uploads && data.chat_uploads.length > 0 ? (
                                data.chat_uploads.map((file, j) => {
                                  const fileType = file.file_type ? file.file_type.toLowerCase() : "";

                                  if (fileType.startsWith("image/")) {
                                    return (
                                      <div key={j} className="file-container">
                                        <img
                                          key={j}
                                          src={file.file_url}
                                          alt={file.original_file_name}
                                          style={{
                                            maxWidth: "200px",
                                            maxHeight: "200px",
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                            marginBottom: "5px",
                                            cursor: "pointer",
                                          }}
                                        />
                                        <Dropdown>
                                          <Dropdown.Toggle variant="secondary" size="sm">:</Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Item
                                              as="a"
                                              href={file.file_url}
                                              download={file.original_file_name}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              Download
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                    );
                                  } else if (fileType === "application/pdf") {
                                    return (
                                      <div key={j} className="file-preview">
                                        📄 {file.original_file_name}
                                        <Dropdown>
                                          <Dropdown.Toggle variant="secondary" size="sm">:</Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Item
                                              as="a"
                                              href={file.file_url}
                                              download={file.original_file_name}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              Download
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                    );
                                  } else if (fileType.startsWith("video/")) {
                                    return (
                                      <div key={j} className="file-container">
                                        <video
                                          key={j}
                                          controls
                                          style={{ maxWidth: "200px", borderRadius: "8px", marginBottom: "5px" }}
                                        >
                                          <source src={file.file_url} type={file.file_type} />
                                          Your browser does not support the video tag.
                                        </video>
                                        <Dropdown>
                                          <Dropdown.Toggle variant="secondary" size="sm">:</Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Item
                                              as="a"
                                              href={file.file_url}
                                              download={file.original_file_name}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              Download
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                    );
                                  }
                                  else if (fileType === "application/vnd.ms-excel" ||
                                    fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                                    fileType === "text/csv") {
                                    return (
                                      <div key={j} className="file-preview">
                                        📄 {file.original_file_name}
                                        <Dropdown>
                                          <Dropdown.Toggle variant="secondary" size="sm">:</Dropdown.Toggle>
                                          <Dropdown.Menu>
                                            <Dropdown.Item
                                              as="a"
                                              href={file.file_url}
                                              download={file.original_file_name}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              Download
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>
                                      </div>
                                    );
                                  }
                                  else {
                                    return <span key={j} className="msg_content">{data.content}</span>;
                                  }
                                })
                              ) : (
                                <span className="msg_content">{data.content}</span>
                              )}
                            </div>
                            <p className="msg_time">{data?.created_time}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }
            {!showNoChatInitiatedMessage && activeTab === "tab2" &&
              <>
                <div className='chat_body'>
                  <div className='whole_messages scrollbar_design'>
                    {false && shouldRestrictSellerChat ? (
                      <div
                        className="d-flex flex-column justify-content-center align-items-center text-center"
                        style={{ minHeight: "300px", color: "#6B7280", padding: "32px 20px" }}
                      >
                        <Image
                          src="/assets/images/msg-top.svg"
                          alt="offer pending"
                          style={{ width: "42px", height: "42px", opacity: 0.7, marginBottom: "14px" }}
                        />
                        <h6 style={{ color: "#121639", fontSize: "22px", fontWeight: 600, marginBottom: "8px" }}>
                          Chat is not available for this buyer right now.
                        </h6>
                        <p className="mb-0" style={{ maxWidth: "420px" }}>
                          Once it’s accepted, the chat will be automatically initiated and you’ll be able to start the conversation. We’ll notify you as soon as it’s approved.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="day-header line-with-text"><span>{currentDate}</span></div>
                        {priceMessages.map((msg, index) => {
                          const offerStatusLabel = getOfferStatusLabel(msg.deal_status);
                          const canRespondToOffer = msg.type !== 'outgoing' && offerStatusLabel === null && !isCounterOfferRestricted;

                          return (
                            <React.Fragment key={index}>
                              <div className={`msg_item offer_item ${msg.sender_id !== activeUserData.id && 'outgoing_msg'}`}>

                                {msg.sender_id !== activeUserData.id && (
                                  <>
                                    <div className="msg_content">
                                      {offerStatusLabel && (
                                        <span className={`sold_status ${msg.deal_status === "Accepted" ? 'complete_status' : ''}`}>{offerStatusLabel}</span>
                                      )}
                                      <span>My Offer</span>
                                      <h4>${msg.content}</h4>
                                    </div>
                                    <p>{msg.date_time_label} {msg.created_time}</p>
                                  </>
                                )}

                                {msg.sender_id == activeUserData.id && (
                                  <>
                                    <div className="msg_content">
                                      {offerStatusLabel && (
                                        <span className={`sold_status ${msg.deal_status === "Accepted" ? 'complete_status' : ''}`}>{offerStatusLabel}</span>
                                      )}
                                      <span>Buyer Offer</span>
                                      <h4>${msg.content}</h4>

                                      {canRespondToOffer && (
                                        <div className="offer_chat_bothBtn">
                                          <Link
                                            href="javascript:void(0)"
                                            className="offer_chat_fillBtn"
                                            onClick={() => handleAcceptOffer(msg)}
                                          >
                                            Accept Offer
                                          </Link>

                                          <Link
                                            href="javascript:void(0)"
                                            onClick={isCounterOfferRestricted ? undefined : (e) => handleClickInput(e, msg)}
                                            className={`offer_chat_outlineBtn ${isCounterOfferRestricted ? '' : ''}`}
                                            // className={`offer_chat_outlineBtn ${isCounterOfferRestricted ? 'disabled' : ''}`}
                                            aria-disabled={isCounterOfferRestricted}
                                          >
                                            Counter Offer
                                          </Link>
                                        </div>
                                      )}
                                    </div>

                                    <p className="msg_time">
                                      {msg.date_time_label} {msg.created_time}
                                    </p>
                                  </>
                                )}

                              </div>
                            </React.Fragment>
                          );
                        })}
                      </>
                    )}

                  </div>
                </div>
              </>
            }
            {!showNoChatInitiatedMessage && (activeUserData.is_block == 1 ? <p className='user_block_content'>This user is blocked.<button className='unlock_btn' onClick={() => handleConfirmBox(activeUserData.id, 0)}>Tap to unblock</button></p> :
              <div className='chat_footer noti_buyer_chat_foot'>
                {/* {chatPartnerId &&  */}
                <div className='chat_footBoth_btn'>
                  <ul>
                    <li>
                                            {/* <Button className={activeTab === "tab1" ? "active foot_fill_btn" : "foot_fill_btn"} onClick={() => setActiveTab("tab1")} disabled={shouldRestrictSellerChat}> */}

                      <Button className={activeTab === "tab1" ? "active foot_fill_btn" : "foot_fill_btn"} onClick={() => setActiveTab("tab1")} disabled={false}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M12.75 13.8226H9.75L6.41249 16.0425C5.91749 16.3725 5.25 16.0201 5.25 15.4201V13.8226C3 13.8226 1.5 12.3226 1.5 10.0726V5.57251C1.5 3.32251 3 1.82251 5.25 1.82251H12.75C15 1.82251 16.5 3.32251 16.5 5.57251V10.0726C16.5 12.3226 15 13.8226 12.75 13.8226Z" stroke="#3F53FE" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.99986 8.52002V8.36255C8.99986 7.85255 9.31488 7.58254 9.62988 7.36504C9.93738 7.15504 10.2448 6.88505 10.2448 6.39005C10.2448 5.70005 9.68986 5.14502 8.99986 5.14502C8.30986 5.14502 7.75488 5.70005 7.75488 6.39005" stroke="#3F53FE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8.99662 10.3125H9.00337" stroke="#3F53FE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>Chat
                      </Button>
                    </li>
                    <li>
                      {isCounterOfferRestricted ? (
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="make-offer-disabled-tooltip">{makeOfferDisabledMessage}</Tooltip>}
                        >
                          <span className="d-inline-block w-100">
                            <Button
                              className={activeTab === "tab2" ? "active foot_outline_btn" : "foot_outline_btn"}
                              onClick={() => setActiveTab("tab2")}
                              disabled
                              style={{ opacity: "0.5" }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                                <path d="M3.71177 11.6448L7.11556 15.0423C8.51314 16.4373 10.7823 16.4373 12.1874 15.0423L15.486 11.7498C16.8836 10.3548 16.8836 8.08978 15.486 6.68728L12.0747 3.29728C11.3609 2.58478 10.3766 2.20228 9.36973 2.25478L5.61278 2.43478C4.11 2.50228 2.9153 3.69478 2.84016 5.18728L2.65982 8.93727C2.61474 9.94977 2.99795 10.9323 3.71177 11.6448Z" stroke="#07B89C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.71636 9.16992C8.75381 9.16992 9.59484 8.33046 9.59484 7.29492C9.59484 6.25939 8.75381 5.41992 7.71636 5.41992C6.67891 5.41992 5.83789 6.25939 5.83789 7.29492C5.83789 8.33046 6.67891 9.16992 7.71636 9.16992Z" stroke="#07B89C" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M10.3467 12.9199L13.3522 9.91992" stroke="#07B89C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>Make Offer
                            </Button>
                          </span>
                        </OverlayTrigger>
                      ) : (
                        <Button
                          className={activeTab === "tab2" ? "active foot_outline_btn" : "foot_outline_btn"}
                          onClick={() => setActiveTab("tab2")}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
                            <path d="M3.71177 11.6448L7.11556 15.0423C8.51314 16.4373 10.7823 16.4373 12.1874 15.0423L15.486 11.7498C16.8836 10.3548 16.8836 8.08978 15.486 6.68728L12.0747 3.29728C11.3609 2.58478 10.3766 2.20228 9.36973 2.25478L5.61278 2.43478C4.11 2.50228 2.9153 3.69478 2.84016 5.18728L2.65982 8.93727C2.61474 9.94977 2.99795 10.9323 3.71177 11.6448Z" stroke="#07B89C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.71636 9.16992C8.75381 9.16992 9.59484 8.33046 9.59484 7.29492C9.59484 6.25939 8.75381 5.41992 7.71636 5.41992C6.67891 5.41992 5.83789 6.25939 5.83789 7.29492C5.83789 8.33046 6.67891 9.16992 7.71636 9.16992Z" stroke="#07B89C" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M10.3467 12.9199L13.3522 9.91992" stroke="#07B89C" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>Make Offer
                        </Button>
                      )}
                    </li>
                  </ul>
                </div>
                {/* } */}
                <form className='msg_send_footer notified_chat_footer'>
                  {activeTab === "tab1" &&
                    <>
                      <input
                        type="file"
                        id="attachment"
                        style={{ display: "none" }}
                        onChange={handleAttachment}
                      />
                      <label
                        htmlFor="attachment"
                        className="cursor-pointer p-2 bg-gray-200 rounded-full"
                      >
                        <img src="/assets/images/attachment.png" alt="attachment" width={30} />
                      </label>
                      {preview ?
                        <div className="attachment-preview">
                          {preview.type === "image" && (
                            <div className="file-container">
                              <img
                                src={preview.url}
                                alt={preview.name}
                                style={{ maxWidth: "200px", borderRadius: "8px" }}
                              />
                              {isUploading && (
                                <div className="overlay-top-right">
                                  <div className="spinner-small"></div>
                                </div>
                              )}
                            </div>
                          )}

                          {preview.type === "pdf" && (
                            <div className="file-container">
                              <a href={preview.url} target="_blank" rel="noopener noreferrer">
                                📄 {preview.name}
                              </a>
                              {isUploading && (
                                <div className="overlay-top-right">
                                  <div className="spinner-small"></div>
                                </div>
                              )}
                            </div>
                          )}

                          {preview.type === "video" && (
                            <div className="file-container">
                              <video controls style={{ maxWidth: "200px" }}>
                                <source src={preview.url} type="video/mp4" />
                              </video>
                              {isUploading && (
                                <div className="overlay-top-right">
                                  <div className="spinner-small"></div>
                                </div>
                              )}
                            </div>
                          )}
                          {preview.type === "excel" && (
                            <div className="file-container">
                              <a href={preview.url} target="_blank" rel="noopener noreferrer">
                                {preview.name}
                              </a>
                              {isUploading && (
                                <div className="overlay-top-right">
                                  <div className="spinner-small"></div>
                                </div>
                              )}
                            </div>
                          )}
                          <button type="button" onClick={() => { setAttachment(null); setPreview(null); }}>❌</button>
                        </div>
                        :
                                                // <input type='text' placeholder='Message Here...' value={message} onChange={(e) => { setMessage(e.target.value); setError("") }} onKeyDown={handleKeyDown} disabled={shouldRestrictSellerChat} />

                        <input type='text' placeholder='Message Here...' value={message} onChange={(e) => { setMessage(e.target.value); setError("") }} onKeyDown={handleKeyDown} disabled={activeUserData.is_block == 1} />
                      }
                                            {/* <button type='button' className='msg_send_btn' onClick={() => { sendMessage(); }} disabled={shouldRestrictSellerChat || isSending}> */}

                      <button type='button' className='msg_send_btn' onClick={() => { sendMessage(); }} disabled={activeUserData.is_block == 1 || isSending || isUploading}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </>
                  }
                  {activeTab === "tab2" &&
                    <>
                      {!shouldRestrictSellerChat && (
                        <>
                          <input type='text' ref={inputRef} value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isCounterOfferRestricted} />
                          <span className='offer_symbols'>$</span>
                          {isCounterOfferRestricted ? (
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip id="make-offer-send-disabled-tooltip">{makeOfferDisabledMessage}</Tooltip>}
                            >
                              <button
                                type='button'
                                className='msg_send_btn'
                                onClick={handlePrimaryOfferSend}
                                disabled
                                style={{ opacity: "0.5" }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </OverlayTrigger>
                          ) : (
                            <button type='button' className='msg_send_btn' onClick={handlePrimaryOfferSend} disabled={isSending || isUploading}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </>
                  }
                </form>
                {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
              </div>
            )}
          </>
        }
      </div>
      <ReportModal
        setIsShowReportModal={setIsShowReportModal}
        isShowReportModal={isShowReportModal}
        handleSubmitReport={handleSubmitReport}
        reason={reason}
        handleChangeReason={handleChangeReason}
        reportReasons={reportReasons}
        setComment={setComment}
        comment={comment}
        error={error}
      />

      <Modal show={acceptOffer} onHide={() => setAcceptOffer(false)} centered backdrop="static" keyboard={false} className='radius_30 max-648'>
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className='space_modal'>
          <div className='modal_inner_content AcceptOfferModal'>
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="99" viewBox="0 0 100 99" fill="none">
              <path d="M49.9998 94.05C25.6623 94.05 5.8623 73.8375 5.8623 49.5C5.8623 25.1625 25.6623 5.36255 49.9998 5.36255C74.3373 5.36255 94.5498 25.1625 94.5498 49.5C94.5498 73.8375 74.3373 94.05 49.9998 94.05ZM49.9998 11.55C28.9623 11.55 11.6373 28.4626 11.6373 49.9125C11.6373 71.3625 28.5498 88.275 49.9998 88.275C71.4498 88.275 88.3623 71.3625 88.3623 49.9125C88.3623 28.4626 71.0373 11.55 49.9998 11.55Z" fill="#07B89C" />
              <path d="M50 70.125C52.2782 70.125 54.125 68.2782 54.125 66C54.125 63.7218 52.2782 61.875 50 61.875C47.7218 61.875 45.875 63.7218 45.875 66C45.875 68.2782 47.7218 70.125 50 70.125Z" fill="#07B89C" />
              <path d="M50.0002 56.925C48.3502 56.925 46.7002 55.6875 46.7002 53.625V28.875C46.7002 27.225 47.9377 25.575 50.0002 25.575C52.0627 25.575 53.3002 26.8125 53.3002 28.875V53.625C53.3002 55.275 51.6502 56.925 50.0002 56.925Z" fill="#07B89C" />
            </svg>
            <h4>Are you sure?</h4>
            <p>Do you really want to accept this offer? Once accepted, the offer will move to the Pending Approval stage.</p>
            <div className='FeaturedDealModal'>
              <div className="both_btn_group m-0">
                <button type="button" className="btn btn-fill btn-primary" onClick={handleMarkSold}>Yes</button>
                <button type="button" className="light_bg_btn btn btn-primary" onClick={handleAcceptOfferClose}>Cancel</button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={counterOffer}
        onHide={closeOfferModal}
        centered
        className='radius_30 max-648'
      >
        <Modal.Header closeButton className='new_modal_close' />
        <Modal.Body className='space_modal'>
          <div className='modal_inner_content AcceptOfferModal'>
            <div class="buy_modal_icon light_green_bg">
              <Image src="/assets/images/counter-offer.svg" alt='' />
            </div>
            <h3 className="mb-2">Counter Offer</h3>
            <p>Enter your counter offer amount below:</p>
            {/* <h3 className="mb-2">{selectedOffer ? "Counter Offer" : "Make Offer"}</h3>
            <p>{selectedOffer ? "Enter your counter offer amount below:" : "Enter your offer amount below:"}</p> */}

            {/* Counter Offer Form */}
            <form className='msg_send_footer notified_chat_footer flex items-center gap-2'>
              <div className='offer_price_input w-100 chat-panel-counter-off'>
                <span className="offer_symbols absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="text"
                  ref={counterinputRef}
                  value={counterOfferInput}
                  onChange={
                    handleCounterOfferInput
                  }
                  onKeyDown={handleKeyDown}
                  className=""
                  placeholder="Enter amount"
                />
                <button type='button' className='msg_send_btn' onClick={handleSendMessageFromCounter} disabled={isSending || isUploading || isSubmittingCounterOffer || isCounterOfferRestricted}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Proof of Funds Section */}
            {isBuyerUser && (
            <div className='upload-document-section mt-3'>
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
                {proofOfFundsRequired && !selectedPofDocument && !manualFile && errors?.pdf_file != '' && <span className='error'>{errors?.pdf_file}</span>}
                {!proofOfFundsRequired && (
                  <p className='mb-0 mt-2' style={{ fontSize: "13px", color: "#6b7280" }}>
                    POF is optional for this deal.
                  </p>
                )}
              </div>
            </div>
            )}


          </div>
        </Modal.Body>
      </Modal>

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

      {/* Congratulation Modal */}
      <Modal show={congratulationPopup} onHide={() => setCongratulationPopup(false)} centered className='radius_30 max-648'>
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className='space_modal'>
          <div className='modal_inner_content AcceptOfferModal accept_offer_modal'>
            <img src="/assets/images/congratulations.gif" alt="congratulations" className='congrats_stripes' />
            <img src="/assets/images/congrats.svg" alt="congratulations" style={{ opacity: 0, marginBottom: "50px" }} />
            <h3>Congratulations !</h3>
            <p>The property has been successfully marked as pending</p>
            <div className='FeaturedDealModal'>
              <div className="both_btn_group m-0">
                <button class="btn btn-fill mt-0" type='button' onClick={handleSold}>Okay</button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </>
  );
};
export default ChatMessagePanel;
