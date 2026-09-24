import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const SellerCurrentPlan = () => {
  const { getTokenData, setLogout } = useAuth();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const accessToken = getTokenData()?.access_token;
  const hasFetchedPlans = useRef(false);

  const [plans, setPlans] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (hasFetchedPlans.current) {
      return;
    }
    hasFetchedPlans.current = true;

    if (!accessToken) {
      setLoader(false);
      return;
    }

    const fetchSellerPlans = async () => {
      try {
        setLoader(true);
        const headers = {
          Accept: "application/json",
          Authorization: "Bearer " + accessToken,
          "auth-token": accessToken,
        };

        const response = await axios.get(`${apiUrl}get-seller-plans`, { headers });
        const sellerPlans = Array.isArray(response.data?.seller_plans)
          ? response.data.seller_plans
          : Array.isArray(response.data?.data?.seller_plans)
            ? response.data.data.seller_plans
            : Array.isArray(response.data?.data?.plans)
              ? response.data.data.plans
              : [];

        setPlans(sellerPlans);
      } catch (error) {
        if (error.response?.status === 401) {
          setLogout();
        }
        if (error.response?.data?.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } finally {
        setLoader(false);
      }
    };

    fetchSellerPlans();
  }, []);

  const currentPlan = plans.find((plan) => plan.current_plan === true);
  if (!currentPlan) {
    return null;
  }
  const displayAmount = currentPlan?.amount ?? 350;
  const displayPosition = currentPlan?.position ?? 2;
  const displayTitle = currentPlan?.title ?? "VIP";
  const displayImage = currentPlan?.image_url || "/assets/images/star-icon.svg";
  const displayDescription = currentPlan?.description || "No description available";
  const displayPlanId = currentPlan?.plan_stripe_id || "seller-plan";
  const displayAutoRenew = !!currentPlan?.is_plan_auto_renew;
  const hasRealPlan = plans.length > 0;

  const handleChangeAutoPayment = async (newValue, planId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: newValue
        ? "Do you want to enable auto renew payment?"
        : "Do you want to stop auto renew payment?",
      html: newValue
        ? "It will auto deduct your payment"
        : "You need to make payment manually next month",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "swal-change-plan",
        confirmButton: "swal2-confirm-btn",
        cancelButton: "swal2-cancel-btn",
      },
      didOpen: () => {
        const popup = Swal.getPopup();
        const titleEl = Swal.getTitle();
        const confirmBtn = Swal.getConfirmButton();
        const cancelBtn = Swal.getCancelButton();

        popup.style.borderRadius = "20px";
        popup.style.padding = "35px 30px";
        popup.style.width = "480px";

        titleEl.style.fontSize = "22px";
        titleEl.style.fontWeight = "600";
        titleEl.style.color = "#111827";

        confirmBtn.style.backgroundColor = "#3f53fe";
        confirmBtn.style.color = "#fff";
        confirmBtn.style.borderRadius = "8px";
        confirmBtn.style.padding = "12px 36px";
        confirmBtn.style.fontSize = "14px";
        confirmBtn.style.marginRight = "12px";

        cancelBtn.style.backgroundColor = "#f3f4f6";
        cancelBtn.style.color = "#111827";
        cancelBtn.style.borderRadius = "8px";
        cancelBtn.style.padding = "12px 36px";
        cancelBtn.style.fontSize = "14px";
      },
    });

    if (!result.isConfirmed) return;

    try {
      const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
      };
      const data = {
        is_plan_auto_renew: newValue ? 1 : 0,
        plan: planId,
        role_id: "2",
      };

      const response = await axios.post(
        `${apiUrl}update-auto-renew-flag`,
        data,
        { headers }
      );

      if (response.data.status) {
        setPlans((previousPlans) =>
          previousPlans.map((plan) =>
            plan.plan_stripe_id === planId
              ? { ...plan, is_plan_auto_renew: newValue }
              : plan
          )
        );

        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setLogout();
      }
      if (error.response?.data?.error) {
        toast.error(error.response.data.error, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  return (
    <div className="card-box already_purchased">
      <div className="purchased_inner">
        <div className="purchased_top">
          <div className="purchased_data">
            <span>
              ${displayAmount}
              <sub>\monthly</sub>
            </span>
            <p>Position: {displayPosition}</p>
          </div>
          <div className="purchased_info position-relative">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="plan-description-tooltip">
                  {displayDescription}
                </Tooltip>
              }
            >
              <span className="purchased_info1" style={{ cursor: "pointer" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="white" />
                  <path d="M12 13.75C12.41 13.75 12.75 13.41 12.75 13V8C12.75 7.59 12.41 7.25 12 7.25C11.59 7.25 11.25 7.59 11.25 8V13C11.25 13.41 11.59 13.75 12 13.75Z" fill="#464B70" />
                  <path d="M12.92 15.6209C12.87 15.5009 12.8 15.3909 12.71 15.2909C12.61 15.2009 12.5 15.1309 12.38 15.0809C12.14 14.9809 11.86 14.9809 11.62 15.0809C11.5 15.1309 11.39 15.2009 11.29 15.2909C11.2 15.3909 11.13 15.5009 11.08 15.6209C11.03 15.7409 11 15.8709 11 16.0009C11 16.1309 11.03 16.2609 11.08 16.3809C11.13 16.5109 11.2 16.6109 11.29 16.7109C11.39 16.8009 11.5 16.8709 11.62 16.9209C11.74 16.9709 11.87 17.0009 12 17.0009C12.13 17.0009 12.26 16.9709 12.38 16.9209C12.5 16.8709 12.61 16.8009 12.71 16.7109C12.8 16.6109 12.87 16.5109 12.92 16.3809C12.97 16.2609 13 16.1309 13 16.0009C13 15.8709 12.97 15.7409 12.92 15.6209Z" fill="#464B70" />
                </svg>
              </span>
            </OverlayTrigger>
            {displayTitle && (
              <span className="top_feat_info">
                <img
                  src={displayImage}
                  alt={displayTitle}
                  style={{
                    width: "28px",
                    height: "28px",
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />
                {displayTitle}
              </span>
            )}
          </div>
        </div>
        <div className="purchased_bottom">
          <div className="purchased_bottom_left">
            {/* <button
              className="btn-fill2 btn-fill2-green"
              onClick={() => navigate("/seller/choose-your-plan")}
            >
              Change Plan
            </button> */}
          </div>
          <div className="purchased_bottom_right">
            <div className="switch_text position-relative">
              <input
                type="checkbox"
                id={`seller-auto-renew-${displayPlanId}`}
                checked={displayAutoRenew}
                disabled={!hasRealPlan}
                onChange={() => handleChangeAutoPayment(!displayAutoRenew, displayPlanId)}
              />
              <label htmlFor={`seller-auto-renew-${displayPlanId}`}>Auto-Renew</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerCurrentPlan;
