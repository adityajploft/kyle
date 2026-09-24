import React, { useEffect, useRef, useState } from "react";
import BuyerHeader from "../../partials/BuyerHeader";
import Footer from "../../partials/Footer";
import { Button, Container, Image, Modal, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import Pagination from "../../component/Pagination";
import {
  guardSellerAccepted,
  hasSellerAccepted,
  isSellerAcceptedStatus,
  showSellerApprovalToast,
  shouldShowSellerApprovalStatus,
} from "../../util/buyerChat";

const MatchedDeals = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const {
    getTokenData,
    setLogout,
    getLocalStorageUserdata,
    setLocalStorageUserdata,
  } = useAuth();

  const [dealData, setDealData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoader, setIsLoader] = useState(true);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [isShowFeaturedDeal, setIsShowFeaturedDeal] = useState(false);
  const [featuredDealId, setFeaturedDealId] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [unlockingDealId, setUnlockingDealId] = useState(null);
  const [submitOffer, setSubmitOffer] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [offerPrice, setOfferPrice] = useState(0);
  const [isProofOfFund, setIsProofOfFund] = useState(false);
  const [manualFile, setManualFile] = useState(null);
  const [selectedPofDocument, setSelectedPofDocument] = useState(null);
  const [verifiedDocuments, setVerifiedDocuments] = useState(false);
  const [verifiedData, setVerifiedData] = useState([]);
  const [pofDocumentId, setPofDocumentId] = useState("");
  const [pofDocumentError, setPofDocumentError] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [interestedProperty, setInterestedProperty] = useState(false);
  const [thankyouFeedback, setThankyouFeedback] = useState(false);
  const [dealFeedback, setDealFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);
  const statusErrorToastId = "matched-deal-status-error";

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

  const getHeaders = () => ({
    Accept: "application/json",
    Authorization: "Bearer " + getTokenData().access_token,
    "auth-token": getTokenData().access_token,
  });

  const updateCreditLimitLocally = (creditLimit) => {
    if (creditLimit === undefined || creditLimit === null) {
      return;
    }

    const creditLimitElement = document.querySelector(".credit_limit");
    if (creditLimitElement) {
      creditLimitElement.innerHTML = creditLimit;
    }

    const existingUser = getLocalStorageUserdata();
    if (existingUser) {
      existingUser.credit_limit = creditLimit;
      setLocalStorageUserdata(existingUser);
    }
  };

  const showStatusErrorToast = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 4000,
      toastId: statusErrorToastId,
    });
  };

  const fetchCurrentLimit = async () => {
    try {
      const response = await axios.get(`${apiUrl}get-current-limit`, {
        headers: getHeaders(),
      });

      updateCreditLimitLocally(
        response?.data?.credit_limit ?? response?.data?.data?.credit_limit,
      );
      // window.dispatchEvent(new Event("creditUpdated"));
    } catch (error) {
      if (error?.response?.status === 401) {
        setLogout();
      }
    }
  };

  const fetchDeals = async () => {
    setIsLoader(true);
    try {
      const response = await axios.get(
        `${apiUrl}buyer-matched-deals?page=${page}`,
        {
          headers: getHeaders(),
        },
      );
      const deals = response?.data?.deals || {};
      setDealData(deals.data || []);
      setLimit(deals.per_page || 0);
      setTotal(deals.total || 0);
      setPage(deals.current_page || 1);
    } catch (error) {
      if (error?.response?.status === 401) {
        setLogout();
      }
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [page]);

  useEffect(() => {
    const markReadNotification = async () => {
      try {
        await axios.get(`${apiUrl}mark-as-read-notification/match_notification`, {
          headers: getHeaders(),
        });
        window.dispatchEvent(
          new CustomEvent("buyerNotificationsRead", {
            detail: { notificationKey: "match_notification" },
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

  const updateDealInState = (dealId, updates) => {
    if (!dealId) {
      return;
    }

    setDealData((prev) =>
      prev.map((deal) =>
        String(deal.id) === String(dealId) ? { ...deal, ...updates } : deal,
      ),
    );

    setSelectedDeal((prev) =>
      prev && String(prev.id) === String(dealId)
        ? { ...prev, ...updates }
        : prev,
    );
  };

  const updateFavoriteStatus = async (buyerDealId) => {
    if (isUpdatingFavorite || !buyerDealId) {
      return;
    }

    setIsUpdatingFavorite(true);
    try {
      const response = await axios.post(
        `${apiUrl}buyer-deals/make-favourite`,
        { buyer_deal_id: buyerDealId },
        { headers: getHeaders() },
      );

      if (response?.data?.status) {
        setDealData((prev) =>
          prev.map((deal) =>
            String(deal.buyer_deal_id || deal.id) === String(buyerDealId)
              ? { ...deal, is_favorite: !deal.is_favorite }
              : deal,
          ),
        );
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // fetchCurrentLimit();
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        setLogout();
      }
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  const handleFeaturedDeal = (buyerDealId, status) => {
    if (!buyerDealId) {
      return;
    }

    setFeaturedDealId(buyerDealId);
    setIsFeatured(status);
    setIsShowFeaturedDeal(true);
  };

  const updateFeaturedDealStatus = async () => {
    await updateFavoriteStatus(featuredDealId);
    setIsShowFeaturedDeal(false);
  };

  const styleUnlockPopup = () => {
    const popup = Swal.getPopup();
    const title = Swal.getTitle();
    const confirmButton = Swal.getConfirmButton();
    const cancelButton = Swal.getCancelButton();
    const htmlContainer = Swal.getHtmlContainer();

    if (popup) {
      popup.style.borderRadius = "8px";
      popup.style.padding = "24px 20px 20px";
      popup.style.width = "520px";
    }

    if (title) {
      title.style.fontSize = "28px";
      title.style.fontWeight = "600";
      title.style.color = "#555";
      title.style.lineHeight = "1.3";
      title.style.marginTop = "10px";
      title.style.marginBottom = "18px";
    }

    if (htmlContainer) {
      htmlContainer.style.fontSize = "16px";
      htmlContainer.style.color = "#5B648A";
      htmlContainer.style.marginBottom = "18px";
    }

    if (confirmButton) {
      confirmButton.style.backgroundColor = "#6C63FF";
      confirmButton.style.color = "#fff";
      confirmButton.style.borderRadius = "6px";
      confirmButton.style.padding = "12px 22px";
      confirmButton.style.margin = "10px";
      confirmButton.style.fontSize = "16px";
      confirmButton.style.fontWeight = "600";
      confirmButton.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.2)";
    }

    if (cancelButton) {
      cancelButton.style.backgroundColor = "#6B7280";
      cancelButton.style.color = "#fff";
      cancelButton.style.borderRadius = "6px";
      cancelButton.style.padding = "12px 22px";
      cancelButton.style.fontSize = "16px";
      cancelButton.style.fontWeight = "600";
    }
  };

  const handleUnlockProperty = async (deal) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Do you want to view this record?",
      html: "It will redeem one point from your account",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      didOpen: styleUnlockPopup,
    });

    if (!result.isConfirmed) {
      return;
    }

    setUnlockingDealId(deal.id);

    try {
      const response = await axios.post(
        `${apiUrl}unlock-buyer-match`,
        { buyer_match_id: String(deal.id) },
        { headers: getHeaders() },
      );

      updateCreditLimitLocally(response?.data?.credit_limit);

      if (response?.data?.status) {
        toast.success(
          response?.data?.message || "Property unlocked successfully.",
          {
            position: toast.POSITION.TOP_RIGHT,
          },
        );
        await fetchCurrentLimit();
        await fetchDeals();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Sorry!",
          html:
            response?.data?.message ||
            "You don`t have enough point to view this record.<br/>Please add more points",
        });
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        setLogout();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Sorry!",
          html:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Unable to unlock this record right now.",
        });
      }
    } finally {
      setUnlockingDealId(null);
    }
  };

  const closeSubmitOfferModal = () => {
    setSubmitOffer(false);
    setSelectedDeal(null);
    setOfferPrice(0);
    setIsProofOfFund(false);
    setManualFile(null);
    setSelectedPofDocument(null);
    setPofDocumentId("");
    setPofDocumentError("");
    setVerifiedDocuments(false);
  };

  const handleSubmitOffer = (deal) => {
    setSelectedDeal(deal);
    setOfferPrice(deal?.price || 0);
    setManualFile(null);
    setSelectedPofDocument(null);
    setPofDocumentId("");
    setPofDocumentError("");
    setSubmitOffer(true);
  };

  const handleVerifiedDocuments = async () => {
    try {
      const response = await axios.get(`${apiUrl}get-proof-of-funds-pdfs`, {
        headers: getHeaders(),
      });

      if (response?.data?.status) {
        setSubmitOffer(false);
        setVerifiedDocuments(true);
        setVerifiedData(response?.data?.data || []);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        setLogout();
        return;
      }

      toast.error(
        error?.response?.data?.message ||
        "Unable to load proof of funds documents.",
        { position: toast.POSITION.TOP_RIGHT },
      );
    }
  };

  const handleDeleteDocument = async (fundProofId) => {
    try {
      await axios.post(
        `${apiUrl}delete-proof-of-funds-pdfs`,
        { fund_proof_id: fundProofId },
        { headers: getHeaders() },
      );
      handleVerifiedDocuments();
    } catch (error) {
      if (error?.response?.status === 401) {
        setLogout();
      }
    }
  };

  const handleManualFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setManualFile(file);
      setSelectedPofDocument(null);
      setPofDocumentId("");
      setPofDocumentError("");
    }
  };

  const handleSelectDocument = () => {
    if (!pofDocumentId) {
      setPofDocumentError("Please select atleast one document.");
      return;
    }

    const doc = verifiedData.find(
      (item) => String(item.id) === String(pofDocumentId),
    );
    if (doc) {
      setSelectedPofDocument(doc);
      setManualFile(null);
      setPofDocumentError("");
    }

    setVerifiedDocuments(false);
    setSubmitOffer(true);
  };

  // const updateMatchedDealStatus = async (
  //   deal,
  //   status,
  //   message = "Matche deal",
  //   buyerFeedback = "",
  //   showToast = true,
  // ) => {
  //   const buyerMatchId = deal?.buyer_deal_id ?? deal?.id;

  //   if (!buyerMatchId || isUpdatingStatus) {
  //     return false;
  //   }

  //   // Temporary comment-out for seller accepted flow.
  //   // if (status === "interested" && hasSellerAccepted(deal)) {
  //   //   updateDealInState(deal.id, { status: "interested" });
  //   //   return true;
  //   // }

  //   setIsUpdatingStatus(true);

  //   try {
  //     const payload = new FormData();
  //     payload.append("buyer_match_id", String(buyerMatchId));
  //     payload.append("message", message);
  //     payload.append("status", status);

  //     if (status === "not_interested" && buyerFeedback) {
  //       payload.append("buyer_feedback", buyerFeedback);
  //     }

  //     if (status === "want_to_buy") {
  //       payload.append("offer_price", offerPrice || 0);

  //       const selectedDocumentId = pofDocumentId || selectedPofDocument?.id;

  //       if (selectedDocumentId) {
  //         payload.append("pof_document", selectedDocumentId);
  //       }

  //       if (manualFile) {
  //         payload.append("pdf_file", manualFile);
  //       }

  //       if (isProofOfFund) {
  //         payload.append("current_poof", "1");
  //       }
  //     }

  //     const response = await axios.post(
  //       `${apiUrl}update-matched-deal-status`,
  //       payload,
  //       {
  //         headers: getHeaders(),
  //       },
  //     );

  //     if (response?.data?.status) {
  //       updateDealInState(deal.id, { status });
  //       if (showToast) {
  //         toast.success(
  //           response?.data?.message || "Status updated successfully.",
  //           {
  //             position: toast.POSITION.TOP_RIGHT,
  //           },
  //         );
  //       }
  //       fetchDeals();
  //       return true;
  //     }

  //     const errorMessage =
  //       response?.data?.message || "Unable to update status right now.";

  //     // Temporary comment-out for seller accepted flow.
  //     // if (errorMessage.toLowerCase().includes("already updated")) {
  //     //   if (!guardSellerAccepted(deal)) {
  //     //     return false;
  //     //   }
  //     //   return true;
  //     // }
  //     if (errorMessage.toLowerCase().includes("already updated")) {
  //       return true;
  //     }

  //     toast.error(errorMessage, { position: toast.POSITION.TOP_RIGHT });
  //     return false;
  //   } catch (error) {
  //     const errorMessage =
  //       error?.response?.data?.message ||
  //       error?.response?.data?.error ||
  //       "Unable to update status right now.";

  //     // Temporary comment-out for seller accepted flow.
  //     // if (errorMessage.toLowerCase().includes("already updated")) {
  //     //   if (!guardSellerAccepted(deal)) {
  //     //     return false;
  //     //   }
  //     //   return true;
  //     // }
  //     if (errorMessage.toLowerCase().includes("already updated")) {
  //       return true;
  //     }

  //     toast.error(errorMessage, { position: toast.POSITION.TOP_RIGHT });
  //     return false;
  //   } finally {
  //     setIsUpdatingStatus(false);
  //   }
  // };

  const updateMatchedDealStatus = async (
    deal,
    status,
    message = "Matched deal",
    buyerFeedback = "",
    showToast = true,
  ) => {
    const buyerMatchId = deal?.id;

    if (!buyerMatchId || isUpdatingStatus) {
      return { ok: false, message: "Unable to update status right now." };
    }

    setIsUpdatingStatus(true);

    try {
      const payload = new FormData();

      payload.append("buyer_match_id", String(buyerMatchId));
      payload.append("message", message);
      payload.append("status", status);

      // NOT INTERESTED
      if (status === "not_interested" && buyerFeedback) {
        payload.append("buyer_feedback", buyerFeedback);
      }

      // WANT TO BUY
      if (status === "want_to_buy") {
        payload.append("offer_price", offerPrice || 0);

        const selectedDocumentId =
          pofDocumentId || selectedPofDocument?.id;

        if (selectedDocumentId) {
          payload.append("pof_document", selectedDocumentId);
        }

        if (manualFile) {
          payload.append("pdf_file", manualFile);
        }

        if (isProofOfFund) {
          payload.append("current_poof", "1");
        }
      }

      // DEBUG
      for (let pair of payload.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(
        `${apiUrl}update-matched-deal-status`,
        payload,
        {
          headers: {
            ...getHeaders(),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("API RESPONSE =>", response?.data);

      // SUCCESS
      if (response?.data?.status === true) {
        updateDealInState(deal.id, { status });

        if (showToast) {
          toast.success(
            response?.data?.message ||
            "Status updated successfully.",
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
            },
          );
        }

        fetchDeals();

        return {
          ok: true,
          message: response?.data?.message || "Status updated successfully.",
          status,
        };
      }

      // API FALSE RESPONSE
      const errorMessage =
        response?.data?.message ||
        response?.data?.error ||
        "Unable to update status right now.";

      // HANDLE ALREADY UPDATED
      if (
        errorMessage
          ?.toLowerCase()
          ?.includes("already updated")
      ) {
        showStatusErrorToast(errorMessage);

        return { ok: false, message: errorMessage, alreadyUpdated: true };
      }

      showStatusErrorToast(errorMessage);

      return { ok: false, message: errorMessage };
    } catch (error) {
      console.log("UPDATE STATUS ERROR =>", error);

      let errorMessage =
        "Unable to update status right now.";

      // VALIDATION ERRORS
      if (error?.response?.data?.errors) {
        errorMessage = Object.values(
          error.response.data.errors,
        )
          .flat()
          .join("\n");
      }
      // NORMAL API MESSAGE
      else if (error?.response?.data?.message) {
        errorMessage =
          error.response.data.message;
      }
      // API ERROR FIELD
      else if (error?.response?.data?.error) {
        errorMessage =
          error.response.data.error;
      }
      // AXIOS ERROR
      else if (error?.message) {
        errorMessage = error.message;
      }

      // ALREADY UPDATED
      if (
        errorMessage
          ?.toLowerCase()
          ?.includes("already updated")
      ) {
        showStatusErrorToast(errorMessage);

        return { ok: false, message: errorMessage, alreadyUpdated: true };
      }

      showStatusErrorToast(errorMessage);

      return { ok: false, message: errorMessage };
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  const handleWantToBuySubmit = async (event) => {
    event.preventDefault();

    if (!selectedDeal) {
      return;
    }

    const hasSelectedPof = Boolean(
      pofDocumentId || manualFile || selectedPofDocument,
    );

    if (!hasSelectedPof) {
      setPofDocumentError(
        "Please upload or select a proof of funds document before submitting your offer.",
      );
      return;
    }

    const result = await updateMatchedDealStatus(
      selectedDeal,
      "want_to_buy",
      offerPrice ? `Offer price: ${offerPrice}` : "Matche deal",
    );

    if (result?.ok) {
      closeSubmitOfferModal();
      // navigate("/buyer/buybox-criteria");
      return;
    }

    closeSubmitOfferModal();
  };

  const handleChatWithSeller = async (deal) => {
    const chatSellerId = deal?.sender_by || deal?.sender_id || deal?.seller_id || deal?.user_id;
    const chatDealId = deal?.buyer_deal_id || deal?.id;
    const currentStatus = deal?.status?.toLowerCase()?.trim();
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

    const result = await updateMatchedDealStatus(
      deal,
      "interested",
      "Matche deal",
      "",
      false,
    );
    if (!result?.ok) {
      return;
    }

    showSellerApprovalToast();
  };

  const handleNotInterested = (deal) => {
    setSelectedDeal(deal);
    setDealFeedback("");
    setIsSubmitted(false);
    setInterestedProperty(true);
  };

  const handleSubmitNotInterested = async () => {
    setIsSubmitted(true);
    if (dealFeedback.trim() === "") {
      return;
    }

    const result = await updateMatchedDealStatus(
      selectedDeal,
      "not_interested",
      "Matche deal",
      dealFeedback
    );

    if (result?.ok) {
      setDealFeedback("");
      setInterestedProperty(false);
      setThankyouFeedback(true);
      setIsSubmitted(false);
    }
  };

  const renderActionButtons = (deal) => {
    const isLocked = Boolean(deal.is_masked) && !Boolean(deal.is_unlocked);
    const isNotInterested = deal.status === "not_interested";

    if (isLocked) {
      return (
        <ul
          className="deal_notifications_btn"
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <li>
            <Button
              className="outline_btn"
              onClick={() => handleUnlockProperty(deal)}
              disabled={isNotInterested || unlockingDealId === deal.id}
              style={{
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "600",
                border: "1px solid #22c55e",
                color: "#22c55e",
                background: "#f0fdf4",
              }}
            >
              {unlockingDealId === deal.id ? "Please wait..." : "View Property"}
            </Button>
          </li>
        </ul>
      );
    }

    return (
      <ul
        className="deal_notifications_btn"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <li>
          <Button
            className="outline_btn"
            onClick={() => handleSubmitOffer(deal)}
            disabled={isUpdatingStatus || hasDealStatus(deal?.status) || !deal.id}
            style={{
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
              background: "#f0fdf4",
            }}
          >
            <Image src="/assets/images/want_buy.svg" alt="" /> Want To Buy
            {deal.status === "want_to_buy" && (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z"
                    fill="#19955A"
                  ></path>
                </svg>
              </span>
            )}
          </Button>
        </li>
        <li className="mt-0">
          <Button
            className="outline_btn"
            onClick={() => handleChatWithSeller(deal)}
            disabled={isUpdatingStatus || isNotInterested || !deal.id}
            style={{
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
              background: "#eef2ff",
            }}
          >
            <Image src="/assets/images/chat-seller.svg" alt="" /> Chat With
            Seller
            {deal.status === "interested" && (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z"
                    fill="#19955A"
                  ></path>
                </svg>
              </span>
            )}
          </Button>
        </li>
        <li className="mt-0">
          <Button
            className="text_btn not_interest_btn"
            onClick={() => handleNotInterested(deal)}
            disabled={isUpdatingStatus || hasDealStatus(deal?.status) || !deal.id}
            style={{
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
              color: "#ef4444",
              opacity: "0.5",
            }}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M11 1L1 11"
                  stroke="#E21B1B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 1L11 11"
                  stroke="#E21B1B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {deal.status === "not_interested" && (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.81632 0.133089C10.0421 0.33068 10.0626 0.674907 9.86176 0.897832L4.20761 7.1736C4.00571 7.39769 3.65904 7.41194 3.43943 7.20522L0.167566 4.12504C-0.0364783 3.93294 -0.0560104 3.61286 0.119053 3.39404C0.312223 3.15257 0.671949 3.11934 0.901844 3.32611L3.44037 5.60947C3.66098 5.80791 4.00062 5.79016 4.19938 5.56984L9.06279 0.177574C9.25956 -0.0406347 9.59519 -0.0604144 9.81632 0.133089Z"
                    fill="#19955A"
                  ></path>
                </svg>
              </span>
            )}
          </Button>
        </li>
      </ul>
    );
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
                <h6 className="center-head text-center mb-0">matched deals</h6>
              </div>
            </div>
          </div>

          {isLoader ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <div className="card-box column_bg_space">
                {dealData.length > 0 ? (
                  [...dealData]
                    .sort(
                      (a, b) =>
                        Number(b?.is_featured || 0) - Number(a?.is_featured || 0),
                    )
                    .map((deal) => {
                      const images = Array.isArray(deal.property_images)
                        ? deal.property_images
                        : [];
                      const [firstImage, ...remainingImages] = images;
                      const isFeatured = isDealFeatured(deal);
                      const isSold = Number(deal.mark_as_sold) === 2;
                      const isLocked =
                        Boolean(deal.is_masked) && !Boolean(deal.is_unlocked);
                      const sellerAcceptedStatus = String(
                        deal?.is_seller_accepted ?? "",
                      ).toLowerCase();
                      const isSellerAccepted =
                        isSellerAcceptedStatus(sellerAcceptedStatus);

                      return (
                        <div
                          className={`deal_column ${isFeatured ? "favorite_deal_pro_column new_favorite_deal" : ""}`}
                          key={deal.id}
                        >
                          {isFeatured && (
                            <span className="featured-corner-badge">Featured</span>
                          )}
                          <div className={`deal_left_column notifications_deal_column border-end-0 ${isFeatured ? 'mt-4 mt-lg-3' : ''}`}>
                            <div className="deal_notifications_left flex_1column align-items-center">
                              <div className="pro_img">
                                <div className="pro_img-main">
                                  <Link
                                    to={
                                      deal.search_log_id
                                        ? `/buyer/property-detail/${deal.search_log_id}`
                                        : "#"
                                    }
                                    state={{ isMatchedDeal: true, buyerMatchId: deal.id }}
                                    onClick={(event) => {
                                      if (deal.is_masked && !deal.is_unlocked) {
                                        event.preventDefault();
                                      }
                                    }}
                                  >
                                    <Image
                                      src={
                                        firstImage ||
                                        "/assets/images/property-img.png"
                                      }
                                      alt="Property"
                                      width={200}
                                      height={200}
                                    />
                                  </Link>
                                </div>

                                <div className="deal_img_group">
                                  {remainingImages
                                    .slice(0, 3)
                                    .map((imgUrl, index) => (
                                      <div key={`${deal.id}-${index}`}>
                                        <Image
                                          src={imgUrl}
                                          alt={`Deal ${index + 1}`}
                                          width={100}
                                          height={100}
                                        />
                                      </div>
                                    ))}
                                  <Link
                                    to={
                                      deal.search_log_id
                                        ? `/buyer/property-detail/${deal.search_log_id}`
                                        : "#"
                                    }
                                    state={{ isMatchedDeal: true, buyerMatchId: deal.id }}
                                    onClick={(event) => {
                                      if (deal.is_masked && !deal.is_unlocked) {
                                        event.preventDefault();
                                      }
                                    }}
                                  >
                                    <div className="align-items-center cursor-pointer">
                                      More..
                                    </div>
                                  </Link>
                                </div>
                              </div>

                              <div className="pro_details">
                                <Link
                                  to={
                                    deal.search_log_id
                                      ? `/buyer/property-detail/${deal.search_log_id}`
                                      : "#"
                                  }
                                  state={{ isMatchedDeal: true, buyerMatchId: deal.id }}
                                  onClick={(event) => {
                                    if (deal.is_masked && !deal.is_unlocked) {
                                      event.preventDefault();
                                    }
                                  }}
                                >
                                  <h3>{deal.title}</h3>
                                </Link>
                                <p>{deal.property_type || deal.address}</p>
                                <div className="property-details-Browse-Deal-icons">
                                  <div className="detail">
                                    <div>
                                      <img
                                        src="/assets/images/double-bed.svg"
                                        alt="Bed"
                                      />
                                    </div>
                                    <span>Beds: {deal.bedroom_min || 0}</span>
                                  </div>
                                  <div className="detail">
                                    <div>
                                      <img
                                        src="/assets/images/bath-1.svg"
                                        alt="Bath"
                                      />
                                    </div>
                                    <span>Baths: {deal.bath || 0}</span>
                                  </div>
                                  <div className="detail">
                                    <div>
                                      <img
                                        src="/assets/images/network-1.svg"
                                        alt="Liveable"
                                      />
                                    </div>
                                    <span>
                                      Liveable sq. ft. : {deal.size || 0}
                                    </span>
                                  </div>
                                  <div className="detail">
                                    <div>
                                      <img
                                        src="/assets/images/full-screen-2.svg"
                                        alt="Lot"
                                      />
                                    </div>
                                    <span>
                                      Lot sq. ft. : {deal.lot_size || 0}
                                    </span>
                                  </div>
                                </div>
                                <div className="middle_left_btn_area">
                                  {deal.buyer_deal_id && !isLocked && (
                                    <button
                                      className="view_property_btn"
                                      type="button"
                                      disabled={!deal.buyer_deal_id}
                                      onClick={() =>
                                        navigate(
                                          `/buyer/property-detail/${deal.search_log_id}`,
                                          { state: { isMatchedDeal: true, buyerMatchId: deal.id } }
                                        )
                                      }
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
                                        marginRight: "10px",
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                      </svg>
                                      View Property
                                    </button>
                                  )}
                                  <button
                                    className="fav_btn"
                                    type="button"
                                    onClick={() => {
                                      if (!isLocked && deal.buyer_deal_id) {
                                        handleFeaturedDeal(
                                          deal.buyer_deal_id,
                                          deal.is_favorite,
                                        );
                                      }
                                    }}
                                    disabled={
                                      isUpdatingFavorite ||
                                      isLocked ||
                                      !deal.buyer_deal_id
                                    }
                                    style={
                                      isLocked || !deal.buyer_deal_id
                                        ? {
                                          opacity: "1",
                                          cursor: "not-allowed",
                                          background: "#e5e7eb",
                                          borderColor: "#d1d5db",
                                          color: "#9ca3af",
                                        }
                                        : {}
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="17"
                                      height="17"
                                      viewBox="0 0 17 17"
                                      fill="none"
                                    >
                                      <path
                                        d="M8.93852 14.7404C8.69768 14.8254 8.30102 14.8254 8.06018 14.7404C6.00602 14.0391 1.41602 11.1137 1.41602 6.15538C1.41602 3.96663 3.17977 2.1958 5.35435 2.1958C6.64352 2.1958 7.78393 2.81913 8.49935 3.78247C9.21477 2.81913 10.3623 2.1958 11.6444 2.1958C13.8189 2.1958 15.5827 3.96663 15.5827 6.15538C15.5827 11.1137 10.9927 14.0391 8.93852 14.7404Z"
                                        fill={
                                          isLocked || !deal.buyer_deal_id
                                            ? "none"
                                            : deal.is_favorite
                                              ? "white"
                                              : "none"
                                        }
                                        stroke={
                                          isLocked || !deal.buyer_deal_id
                                            ? "#9ca3af"
                                            : "white"
                                        }
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    {deal.is_favorite
                                      ? "Added to Favorite"
                                      : "Add favorite deal"}
                                  </button>
                                  <p className="mb-0">
                                    Asking Price : <span>${deal.price || 0}</span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="deal_notifications_right flex_auto_column min-w-255">
                              {renderActionButtons(deal)}
                            </div>
                          </div>
                          {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {shouldShowSellerApprovalStatus(deal) && isSellerAccepted && (
                            <span className="status-badge seller-accepted">
                              <Image src="/assets/images/green-check.svg" alt="" />
                              Deal Approval Accepted By Seller
                            </span>
                          )}
                          {shouldShowSellerApprovalStatus(deal) &&
                            !isSellerAccepted &&
                            sellerAcceptedStatus === "pending" && (
                              <span className="status-badge pending">
                                Deal Approval Pending By Seller
                              </span>
                            )}
                          {shouldShowSellerApprovalStatus(deal) &&
                            !isSellerAccepted &&
                            (sellerAcceptedStatus === "reject" ||
                              sellerAcceptedStatus === "rejected") && (
                              <span className="status-badge seller-rejected">
                                Deal Approval Rejected By Seller
                              </span>
                            )}
                        </div> */}
                          {isSold && (
                            <div className="sold_out_deal">
                              <Image
                                src="/assets/images/sold-img.svg"
                                alt="sold-out"
                              />
                              <h6>This property has been sold.</h6>
                              <p>{deal.sold_date}</p>
                            </div>
                          )}
                        </div>
                      );
                    })
                ) : (
                  <div className="deal_column text-center">
                    <p>No Data found</p>
                  </div>
                )}
              </div>

              <Pagination
                page={page}
                setPage={setPage}
                limit={limit}
                total={total}
              />
            </>
          )}
        </Container>
      </section>

      <Modal
        show={submitOffer}
        onHide={closeSubmitOfferModal}
        centered
        className="radius_30 max-648"
      >
        <Modal.Header closeButton className="new_modal_close"></Modal.Header>
        <Modal.Body className="space_modal">
          <div className="modal_inner_content">
            <div className="buy_modal_icon light_green_bg ps-2">
              <Image src="/assets/images/home-dollar2.svg" alt="" />
            </div>
            <h3>submit your offer</h3>
            <p className="mb-4 px-md-5">
              Please upload your proof of funds to submit your offer. Or select
              a proof of fund
            </p>
            <form
              method="post"
              onSubmit={handleWantToBuySubmit}
              encType="multipart/form-data"
            >
              <div className="offer_price_input">
                <label className="offer_label">Offer Your Price</label>
                <div>
                  <input
                    type="text"
                    name="offer_price"
                    placeholder="Enter Offer Price"
                    value={offerPrice}
                    onChange={(event) => setOfferPrice(event.target.value)}
                  />
                </div>
              </div>
              <div className="upload-document-section">
                <div className="offer_price_area">
                  <label className="offer_label">
                    Upload POF
                  </label>
                  <div className="offer_price_select">
                    <Link
                      to="#"
                      onClick={handleVerifiedDocuments}
                      className="open_gallery"
                    >
                      Open Documents Gallery
                    </Link>
                  </div>
                </div>
                <div>
                  <span className="browse-files position-relative">
                    <input
                      type="hidden"
                      name="buyer_match_id"
                      value={selectedDeal?.id || ""}
                    />
                    <input
                      type="hidden"
                      name="pof_document"
                      value={pofDocumentId}
                    />
                    <input
                      id="formFile"
                      type="file"
                      name="pdf_file"
                      className="default-file-input"
                      ref={fileInputRef}
                      onChange={handleManualFileChange}
                    />
                    <span className="d-block upload-file">
                      {manualFile
                        ? manualFile.name
                        : selectedPofDocument
                          ? selectedPofDocument.original_file_name
                          : "No file selected"}
                    </span>
                    <span className="browse-files-text">
                      Upload POF
                    </span>
                  </span>
                </div>
                {pofDocumentError && <p className="error mt-2">{pofDocumentError}</p>}
                {/* {!pofDocumentError && (
                  <p
                    className="mb-0 mt-2"
                    style={{ fontSize: "13px", color: "#6b7280" }}
                  >
                    Proof of funds is required to submit this offer.
                  </p>
                )} */}
                <div className="proof_checkbox position-relative text-start">
                  <label>
                    <input
                      type="checkbox"
                      name="current_poof"
                      checked={isProofOfFund}
                      onChange={(event) =>
                        setIsProofOfFund(event.target.checked)
                      }
                    />
                    <span>Save As Default POF</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-fill btn-fill-green btn btn-primary w-100"
                  disabled={isUpdatingStatus}
                >
                  {isUpdatingStatus ? "Submitting..." : "Submit Your Offer"}
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={verifiedDocuments}
        onHide={() => setVerifiedDocuments(false)}
        centered
        className="radius_20 max-1650 documents_list_modal documents_model"
      >
        <Modal.Header closeButton className="new_modal_close"></Modal.Header>
        <Modal.Body className="space_modal">
          <h6 className="m-0">Verified documents</h6>
          <div className="document-group">
            {verifiedData.length > 0 ? (
              verifiedData.map((data, index) => (
                <div
                  key={index}
                  className={`document-item ${String(pofDocumentId) === String(data.id) ? "active" : ""}`}
                  onClick={() => setPofDocumentId(String(data.id))}
                >
                  <img
                    className="pdf-icon"
                    src="/assets/images/pdf-icon.svg"
                    alt="pdf icon"
                  />
                  <h5 className="doc-name">{data.original_file_name}</h5>
                  <button
                    className="view-btn"
                    onClick={() => window.open(data.file_url, "_blank")}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.4"
                        d="M17.6074 7.65962C15.7081 4.67495 12.929 2.95651 10.0019 2.95651C8.53833 2.95651 7.11588 3.38407 5.81677 4.18162C4.51766 4.9874 3.35011 6.16317 2.39633 7.65962C1.57411 8.9505 1.57411 11.0472 2.39633 12.3381C4.29566 15.3309 7.07477 17.0412 10.0019 17.0412C11.4654 17.0412 12.8879 16.6136 14.187 15.8161C15.4861 15.0103 16.6537 13.8345 17.6074 12.3381C18.4297 11.0554 18.4297 8.9505 17.6074 7.65962ZM10.0019 13.3247C8.16011 13.3247 6.68011 11.8365 6.68011 10.0029C6.68011 8.16939 8.16011 6.68117 10.0019 6.68117C11.8437 6.68117 13.3237 8.16939 13.3237 10.0029C13.3237 11.8365 11.8437 13.3247 10.0019 13.3247Z"
                        fill="#07B89C"
                      />
                      <path
                        d="M10.0023 7.64908C8.71138 7.64908 7.65894 8.70152 7.65894 10.0006C7.65894 11.2915 8.71138 12.344 10.0023 12.344C11.2932 12.344 12.3538 11.2915 12.3538 10.0006C12.3538 8.70975 11.2932 7.64908 10.0023 7.64908Z"
                        fill="#07B89C"
                      />
                    </svg>
                    View
                  </button>
                  <button
                    className="delete-btn delete-margin"
                    onClick={() => handleDeleteDocument(data.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No Data Found</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {pofDocumentError && <p className="error">{pofDocumentError}</p>}
          {verifiedData.length > 0 && (
            <button className="btn btn-fill" onClick={handleSelectDocument}>
              Submit Now!
            </button>
          )}
        </Modal.Footer>
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
              Do you want to {isFeatured ? "remove" : "add"} this to featured
              deal
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
      <Modal
        show={interestedProperty}
        onHide={() => setInterestedProperty(false)}
        centered
        className="radius_30 max-648"
      >
        <Modal.Header closeButton className="new_modal_close"></Modal.Header>
        <Modal.Body className="space_modal">
          <div className="modal_inner_content">
            <div className="buy_modal_icon light_gray_bg">
              <Image src="/assets/images/like-vector.svg" alt="" />
            </div>
            <h3>not interested in this property?</h3>
            <p className="mb-4">
              Would you like to share some feedbacks (optional)
            </p>
            <div className="row">
              <div className="col-12 col-md-12 col-lg-12">
                <div className="form-group">
                  <textarea
                    className="form-control-form h-50"
                    rows="3"
                    onChange={(e) => {
                      setDealFeedback(e.target.value);
                    }}
                    placeholder="Enter Your Feedback"
                    value={dealFeedback}
                  ></textarea>
                  {isSubmitted && dealFeedback.trim() === "" && (
                    <span className="error">This field is required</span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-fill  btn btn-primary w-100"
                  onClick={handleSubmitNotInterested}
                // disabled={isUpdatingStatus}
                >
                  {/* {isUpdatingStatus ? "Sharing..." : "Share Feedback"} */}
                  Share Feedback
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={thankyouFeedback}
        onHide={() => setThankyouFeedback(false)}
        centered
        className="radius_30 max-648"
      >
        <Modal.Header closeButton className="new_modal_close"></Modal.Header>
        <Modal.Body className="space_modal">
          <div className="modal_inner_content">
            <div className="buy_modal_icon light_gray_bg">
              <Image src="/assets/images/like-vector.svg" alt="" />
            </div>
            <h3>Thank you for your feedback</h3>
            <p className="mb-0">
              Please keep an eye out for your next BuyBox match
            </p>
          </div>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default MatchedDeals;
