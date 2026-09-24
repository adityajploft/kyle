import { Link, useNavigate } from "react-router-dom";
import BuyerHeader from "../../partials/BuyerHeader";
import Footer from "../../partials/Footer";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { Accordion, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import AddAddressAndRadius from "../../component/PropertyRadiusSearch";
import AdBanner from "../../component/AdBanner";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, ChartTooltip, Legend);

// Custom plugin (same as your inside text)
const insideTextPlugin = {
    id: "insideText",
    afterDraw(chart) {
        const { ctx } = chart;
        ctx.save();

        const hasPositiveValue = chart?.data?.datasets?.[0]?.rawValues?.some((value) => Number(value) > 0);

        chart.getDatasetMeta(0).data.forEach((el, index) => {
            const value = hasPositiveValue
                ? `${chart.data.datasets[0].rawValues[index]} %`
                : "0 %";
            const position = el.tooltipPosition();

            ctx.fillStyle = "#1D2246";
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(value, position.x, position.y);
        });
    }
};


const Dashboard = () => {
    const percentage = 75;
    const apiUrl = process.env.REACT_APP_API_URL;
    const { getTokenData, setLogout } = useAuth();
    const [dashboardDetails, setDashboardDetails] = useState([]);
    const [repCode, setRepCode] = useState('');
    const [dashActiveTab, setDashActiveTab] = useState('tab02');
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const [plans, setPlans] = useState([]);
    const [advertisementData, setAdvertisementData] = useState([]);
    const [buyerAnalytics, setBuyerAnalytics] = useState({});
    const [repCodeTooltip, setRepCodeTooltip] = useState("Click to copy");

    document.querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach(el => new Tooltip(el));

    useEffect(() => {
        let headers = {
            Accept: "application/json",
            Authorization: "Bearer " + getTokenData().access_token,
            "auth-token": getTokenData().access_token,
        };
        const fetchDashboardData = async () => {
            try {
                let response = await axios.get(`${apiUrl}buyer-dashboard-details`, { headers: headers });
                setDashboardDetails(response.data.data);
                setRepCode(response.data.data.referral_code);
            } catch (error) {
                console.log("dashboard error => ", error)
            }
        }
        fetchDashboardData();
    }, []);

    useEffect(() => {
        const fetchBuyerAnalytics = async () => {
            try {
                const headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };

                const response = await axios.get(
                    `${apiUrl}analytics/buyer-dashboard-analytics`,
                    { headers }
                );

                setBuyerAnalytics(response.data);
                console.log("buyer dashboard analytics =>", response.data);
            } catch (error) {
                console.error("buyer dashboard analytics error =>", error);
            }
        };

        fetchBuyerAnalytics();
    }, []);

    useEffect(() => {
        const getRepCodeDetail = async () => {
            try {
                let headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };

                let response = await axios.get(apiUrl + `get-rep-code-details`, {
                    headers: headers,
                });
                setRepCode(response.data.referral_code);
            } catch (error) {
                console.log(error);
            }
        }
        getRepCodeDetail();
    }, []);

    const fetchBuyerPlans = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL;

            const headers = {
                Accept: "application/json",
                Authorization: "Bearer " + getTokenData().access_token,
                "auth-token": getTokenData().access_token,
            };

            const response = await axios.get(`${apiUrl}get-buyer-plans`, { headers });

            const buyerPlans = Array.isArray(response.data?.buyer_plans)
                ? response.data.buyer_plans
                : [];

            setPlans(buyerPlans);
            setLoader(false);
        } catch (error) {
            setLoader(false);

            if (error.response) {
                if (error.response.data?.error) {
                    toast.error(error.response.data.error, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            }
        }
    };

    useEffect(() => {
        fetchBuyerPlans();
    }, []);

    useEffect(() => {
        const fetchAdvertisementBannerData = async () => {
            try {
                const headers = {
                    Accept: "application/json",
                    Authorization: "Bearer " + getTokenData().access_token,
                    "auth-token": getTokenData().access_token,
                };
                //   const response = await axios.post(`${apiUrl}banner/home`, {}, {
                //                     headers,
                //                 });
                const response = await axios.post(`${apiUrl}banner/home`, {}, {
                    headers,
                });

                setAdvertisementData(response.data.data || []);
            } catch (error) {
                console.log("buyer dashboard advertisement error => ", error);
            }
        };

        fetchAdvertisementBannerData();
    }, []);

    const currentPlan = plans?.find((p) => p.current_plan === true);
    const handleChangeAutoPayment = async (newValue, planId) => {
        const title = newValue
            ? "Do you want to enable auto renew payment?"
            : "Do you want to stop auto renew payment?";

        const html = newValue
            ? "It will auto deduct your payment"
            : "You need to make payment manually next month";

        const result = await Swal.fire({
            icon: "warning",
            title,
            html,
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            buttonsStyling: false,
            customClass: {
                popup: "swal-change-plan",
                confirmButton: "swal2-confirm-btn",
                cancelButton: "swal2-cancel-btn"
            },
            didOpen: () => {
                const popup = Swal.getPopup();
                const titleEl = Swal.getTitle();
                const confirmBtn = Swal.getConfirmButton();
                const cancelBtn = Swal.getCancelButton();

                // Popup styling
                popup.style.borderRadius = "20px";
                popup.style.padding = "35px 30px";
                popup.style.width = "480px";

                // Title styling
                titleEl.style.fontSize = "22px";
                titleEl.style.fontWeight = "600";
                titleEl.style.color = "#111827";

                // Confirm button styling (purple)
                confirmBtn.style.backgroundColor = "#3f53fe";
                confirmBtn.style.color = "#fff";
                confirmBtn.style.borderRadius = "8px";
                confirmBtn.style.padding = "12px 36px";
                confirmBtn.style.fontSize = "14px";
                confirmBtn.style.marginRight = "12px";

                // Cancel button styling (gray)
                cancelBtn.style.backgroundColor = "#f3f4f6";
                cancelBtn.style.color = "#111827";
                cancelBtn.style.borderRadius = "8px";
                cancelBtn.style.padding = "12px 36px";
                cancelBtn.style.fontSize = "14px";
            },
        });

        if (!result.isConfirmed) return;

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const headers = {
                Accept: "application/json",
                Authorization: "Bearer " + getTokenData().access_token,
            };

            const data = {
                is_plan_auto_renew: newValue ? 1 : 0,
                plan: planId,
                role_id: "3",
            };

            const response = await axios.post(
                `${apiUrl}update-auto-renew-flag`,
                data,
                { headers }
            );

            if (response.data.status) {
                setPlans((prev) =>
                    prev.map((plan) =>
                        plan.plan_stripe_id === planId
                            ? { ...plan, is_plan_auto_renew: newValue }
                            : plan
                    )
                );

                // Show success toast
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        } catch (error) {
            console.error(error);

            // Show error toast
            toast.error("Failed to update auto renew", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const isVerified =
        dashboardDetails.buyer_verification?.total_steps > 0 &&
        dashboardDetails.buyer_verification?.completed_steps ===
        dashboardDetails.buyer_verification?.total_steps;

    const handleCopyRepCode = async () => {
        if (!repCode) return;
        try {
            await navigator.clipboard.writeText(repCode);
            setRepCodeTooltip("Copied!");
            setTimeout(() => setRepCodeTooltip("Click to copy"), 1500);
        } catch (error) {
            setRepCodeTooltip("Copy failed");
            setTimeout(() => setRepCodeTooltip("Click to copy"), 1500);
        }
    };

    const buyboxCompletionValue = Math.max(
        0,
        Math.min(
            100,
            Number(
                String(buyerAnalytics?.buybox_completion_status || 0).replace("%", "").trim()
            ) || 0
        )
    );
    const buyboxCompletionText = `${buyboxCompletionValue}%`;

    useEffect(() => {
        if (dashboardDetails.is_profile_updatable && !localStorage.getItem('profile_update_available_notified')) {
            Swal.fire({
                icon: 'success',
                title: 'Congratulations!',
                text: 'Profile updates are now available.',
                confirmButtonText: 'Great!',
                buttonsStyling: false,
                customClass: {
                    popup: "swal-change-plan",
                    confirmButton: 'swal2-confirm-btn'
                },
                didOpen: () => {
                    const popup = Swal.getPopup();
                    const confirmBtn = Swal.getConfirmButton();
                    popup.style.borderRadius = "20px";
                    confirmBtn.style.backgroundColor = "#3f53fe";
                    confirmBtn.style.color = "#fff";
                    confirmBtn.style.borderRadius = "8px";
                    confirmBtn.style.padding = "12px 36px";
                }
            });
            localStorage.setItem('profile_update_available_notified', 'true');
        }
    }, [dashboardDetails.is_profile_updatable]);

    // Collapse
    const [open, setOpen] = useState(1);
    const toggle = (index) => {
        setOpen(open === index ? null : index);
    };
    const chartValues = [
        Number((buyerAnalytics?.deal_activities?.total_interested_deal_rate || 0).toString().replace('%', '')),
        Number((buyerAnalytics?.deal_activities?.total_not_interested_deal_rate || 0).toString().replace('%', '')),
        Number((buyerAnalytics?.deal_activities?.total_want_to_buy_deal_rate || 0).toString().replace('%', '')),
    ];

    const hasValidData = chartValues.some(val => val > 0);

    const data = {
        labels: ["Interested", "Not Interested", "Want To Buy"],
        datasets: [
            {
                data: hasValidData ? chartValues : [1, 1, 1],
                rawValues: chartValues,
                backgroundColor: ["#dcd4e8", "#a8d5ba", "#6c6fdc"],
                borderWidth: 6
            }
        ]
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        }
    };

    const getVerificationImage = (tier) => {
        switch (Number(tier)) {
            case 1: return "/assets/images/Phone-Verification.svg";
            case 2: return "/assets/images/Proof-of-Funds.svg";
            case 3: return "/assets/images/Driver-License.svg";
            case 4: return "/assets/images/LLC.svg";
            case 5: return "/assets/images/certified-closer.svg";
            case 6: return "/assets/images/Application-Process.svg";
            case 0:
            default: return "/assets/images/timerpending.svg";

        }
    };

    return (
        <>
            <BuyerHeader />
            <section className="main-section position-relative pt-4 pb-120">
                <div className="container position-relative">
                    <div className="top_advertisment">
                        {/* <AdBanner adData={advertisementData} /> */}
                    </div>
                    {!advertisementData.is_expired && (
                        <div className="top_advertisment">
                            <Link>
                                {/* <Image src={advertisementData.is_expired ? './assets/images/add.svg' : advertisementData.image} /> */}
                                <AdBanner adData={advertisementData} />
                            </Link>
                        </div>
                    )}

                    <h4 className="topMainTitle mt-4">Dashboard</h4>
                    <div className="row">
                        <div className="col-xl-9">
                            <div className="dash-block">
                                <div className="row">
                                    <div className="col-12 col-sm-6">
                                        <div className="d-flex gap-3 align-items-center dash_boost_profile">
                                            <span className="upload-buyer-icon">
                                                <img src="/assets/images/rocket.svg" className="img-fluid" alt="" />
                                            </span>
                                            <p className="mb-0">boost your profile</p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 text-sm-end align-self-center mt-3 mt-sm-0">
                                        <Link to="/buyer/boost-your-profile" className="inner_boost_btn">
                                            Boost Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 mt-2 mt-xl-0">
                            <div className="REP_Code_block min-height-100 d-flex align-items-center">
                                {!repCode ? <Link to="/buyer/rep-code" className="inner_boost_btn w-100 text-center">Apply for REP code</Link> :
                                    <div className="w-100">
                                        <div className="rep-code-row" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                                            <div className="rep-code-content" style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                        <path d="M8.73792 0.5C4.04412 0.5 0.238281 4.30584 0.238281 8.99964C0.238281 13.6934 4.04412 17.5 8.73792 17.5C13.4317 17.5 17.2383 13.6934 17.2383 8.99964C17.2383 4.30584 13.4317 0.5 8.73792 0.5ZM10.5074 13.6733C10.0699 13.846 9.72158 13.977 9.46038 14.0676C9.19989 14.1583 8.89695 14.2036 8.55227 14.2036C8.02266 14.2036 7.61034 14.0741 7.31676 13.8158C7.02317 13.5574 6.8771 13.23 6.8771 12.8321C6.8771 12.6774 6.88789 12.5191 6.90948 12.3579C6.93178 12.1967 6.96704 12.0154 7.01525 11.8117L7.56285 9.87752C7.61106 9.69187 7.6528 9.51558 7.6859 9.35151C7.719 9.18601 7.73483 9.03418 7.73483 8.89602C7.73483 8.64993 7.68374 8.47723 7.58228 8.38008C7.47938 8.28294 7.28582 8.23545 6.99726 8.23545C6.85623 8.23545 6.71087 8.25632 6.56192 8.30021C6.41441 8.34554 6.28632 8.38656 6.18127 8.42686L6.3259 7.83105C6.68425 7.68497 7.02749 7.55977 7.3549 7.45615C7.6823 7.35109 7.99172 7.29928 8.28315 7.29928C8.80916 7.29928 9.215 7.42737 9.50067 7.68066C9.78491 7.93467 9.9281 8.26495 9.9281 8.67079C9.9281 8.75498 9.91803 8.90322 9.8986 9.11477C9.87917 9.32705 9.84247 9.52061 9.78922 9.69835L9.2445 11.6268C9.19989 11.7815 9.16031 11.9585 9.12433 12.1564C9.08908 12.3543 9.07181 12.5054 9.07181 12.6069C9.07181 12.863 9.12865 13.0379 9.24378 13.1307C9.35748 13.2236 9.5568 13.2703 9.83887 13.2703C9.972 13.2703 10.1209 13.2466 10.2893 13.2005C10.4563 13.1545 10.5772 13.1135 10.6534 13.0782L10.5074 13.6733ZM10.4109 5.84574C10.1569 6.08176 9.85111 6.19977 9.49348 6.19977C9.13657 6.19977 8.82859 6.08176 8.57242 5.84574C8.31769 5.60971 8.18888 5.3226 8.18888 4.98728C8.18888 4.65268 8.31841 4.36485 8.57242 4.12667C8.82859 3.88777 9.13657 3.76904 9.49348 3.76904C9.85111 3.76904 10.1576 3.88777 10.4109 4.12667C10.6649 4.36485 10.7923 4.65268 10.7923 4.98728C10.7923 5.32332 10.6649 5.60971 10.4109 5.84574Z" fill="#464B70" />
                                                    </svg>
                                                </span>
                                                <p className="mb-0 rep-code-value" onClick={handleCopyRepCode}>REP Code <strong>: {repCode ? repCode : 'N/A'} </strong></p>
                                            </div>
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 120, hide: 200 }}
                                                overlay={
                                                    <Tooltip id="button-tooltip">
                                                        {repCodeTooltip}
                                                    </Tooltip>
                                                }>
                                                <button
                                                    type="button"
                                                    className="rep-code-copy-btn"
                                                    onClick={handleCopyRepCode}
                                                    aria-label="Copy REP code"
                                                    style={{ width: "35px", height: "35px", borderRadius: "50%", border: "none", backgroundColor: "#3F53FE", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, cursor: "pointer", lineHeight: 1 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                        <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                                        <rect x="4" y="4" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </button>
                                            </OverlayTrigger>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <ul className="buyer_dash_linkTop">
                            {/* <li>
                                <Link to="/buyer/deal-notifications">
                                    <span className="buyer-dash-icon">
                                        <img src="/assets/images/deal-icon.svg" className="img-fluid" alt="" />
                                    </span>
                                    Deals
                                    <span className="buyer_list_number">{dashboardDetails.total_deals_count || 0}</span>
                                </Link>
                            </li> */}
                            <li>
                                <Link
                                    to="/buyer/deal-notifications"
                                    title="View all deal notifications"
                                >
                                    <span className="buyer-dash-icon">
                                        <img
                                            src="/assets/images/deal-icon.svg"
                                            className="img-fluid"
                                            alt="Deals"
                                        />
                                    </span>

                                    Deals

                                    <span
                                        className="buyer_list_number"
                                        title={`${dashboardDetails.total_deals_count || 0} active deals`}
                                    >
                                        {dashboardDetails.total_deals_count || 0}
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/message">
                                    <span className="buyer-dash-icon">
                                        <img src="/assets/images/chats-icon.svg" className="img-fluid" alt="" />
                                    </span>
                                    Chats
                                    <span className="buyer_list_number">{dashboardDetails.unreadMessageCount || 0}</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/buyer/buybox-criteria">
                                    <span className="buyer-dash-icon">
                                        <img src="/assets/images/buybox-criteria-icon.svg" className="img-fluid" alt="" />
                                    </span>
                                    buybox criteria
                                </Link>
                            </li>
                            <li>
                                <Link to={dashboardDetails.buyer_verification?.completed_steps == 6 ? void (0) : "/buyer/profile-verification"}>
                                    <div style={{ width: 42, height: 42 }} className="verification_graph">
                                        <CircularProgressbar
                                            value={dashboardDetails.buyer_verification?.percentage || '0 %'}
                                            text={`${dashboardDetails.buyer_verification?.percentage || '0 %'}`}
                                            strokeWidth={6}
                                            styles={buildStyles({
                                                rotation: 0,
                                                strokeLinecap: 'butt',
                                                textSize: '30px',
                                                pathTransitionDuration: 0.5,
                                                // pathColor: `rgba(63, 83, 254, 1)`,
                                                pathColor: isVerified ? "#22c55e" : "#ef4444",
                                                textColor: '#1d2246',
                                                trailColor: '#f5f7f9',
                                                backgroundColor: '#f5f7f9',
                                            })}
                                        />
                                    </div>
                                    {dashboardDetails.buyer_verification?.completed_steps === 6 && dashboardDetails.buyer_verification?.total_steps === 6 ? (
                                        "Congratulations! You're fully verified."
                                    ) : (
                                        `${dashboardDetails.buyer_verification?.completed_steps || 0}/${dashboardDetails.buyer_verification?.total_steps || 0} completed verification`
                                    )}
                                </Link>
                            </li>

                        </ul>
                    </div>

                    <div className="verification_box grid_3 mb-30">
                        <div className="veri_box_column">
                            <div className="veri_box_left">
                                <p>
                                    Verification Status (Tier {buyerAnalytics?.buyer_verification_status?.tier}/{buyerAnalytics?.buyer_verification_status?.last_tier})
                                </p>
                                <h3>{buyerAnalytics?.buyer_verification_status?.tier_name}</h3>
                            </div>
                            <div className="veri_box_right">
                                <Image
                                    src={getVerificationImage(buyerAnalytics?.buyer_verification_status?.tier)}
                                    alt="Verification Badge"
                                    className="verification_badge_img"
                                />
                            </div>
                        </div>
                        <div className="veri_box_column">
                            <div className="veri_box_left">
                                <p>BuyBox Completion Status</p>
                                <h3>{buyerAnalytics?.buybox_completion_status}</h3>
                            </div>
                            <div className="veri_box_right">
                                <div style={{ width: 42, height: 42 }} className="verification_graph">
                                    <CircularProgressbar
                                        value={buyboxCompletionValue}
                                        text={buyboxCompletionText}
                                        strokeWidth={6}
                                        styles={buildStyles({
                                            rotation: 0,
                                            strokeLinecap: 'butt',
                                            textSize: '30px',
                                            pathTransitionDuration: 0.5,
                                            pathColor: buyboxCompletionValue === 100 ? "#22c55e" : "#ef4444",
                                            textColor: '#1d2246',
                                            trailColor: '#f5f7f9',
                                            backgroundColor: '#f5f7f9',
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="veri_box_column">
                            <div className="veri_box_left">
                                <p>% of Match Notifications Engaged</p>
                                <h3>{buyerAnalytics?.matched_notification_engaged_rate}</h3>
                            </div>
                            <div className="veri_box_right">
                                <Image src="/assets/images/percentage-symbol.svg" alt="percentage" />
                            </div>
                        </div>
                    </div>

                    <div className="verification_box grid_2 mb-30">
                        <div className="veri_box_column">
                            <div className="veri_box_left">
                                <p>Top Buyer Badge Eligibility</p>
                                <h3>{buyerAnalytics?.top_buyer_badge_eligibility}</h3>
                            </div>
                            <div className="veri_box_right">
                                <Image src="/assets/images/eligibility.svg" alt="Badge Eligibility" />
                            </div>
                        </div>
                        <div className="veri_box_column">
                            <div className="veri_box_left">
                                <p>Response Time to New Deal Notifications</p>
                                <h3>{buyerAnalytics?.response_time_to_new_deal_notification}</h3>
                            </div>
                            <div className="veri_box_right">
                                <Image src="/assets/images/clock_notification.svg" alt="Deal Notifications" />
                            </div>
                        </div>
                    </div>

                    <div className="card-box buyer_dash_deals mb-30">
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Deal Interaction & Activity</Accordion.Header>
                                <Accordion.Body>
                                    <div className="grid_3 mb-24">
                                        <div className="veri_box_column">
                                            <div className="veri_box_left">
                                                <p># of Matched Deals</p>
                                                <h3>{buyerAnalytics?.deal_activities?.total_matched_deals}</h3>
                                            </div>
                                            <div className="veri_box_right">
                                                <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                                            </div>
                                        </div>
                                        <div className="veri_box_column">
                                            <div className="veri_box_left">
                                                <p># of Deals Viewed</p>
                                                <h3>{buyerAnalytics?.deal_activities?.total_deals_viewed}</h3>
                                            </div>
                                            <div className="veri_box_right">
                                                <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                                            </div>
                                        </div>
                                        <div className="veri_box_column">
                                            <div className="veri_box_left">
                                                <p># of Offers Made</p>
                                                <h3>{buyerAnalytics?.deal_activities?.total_offers_made}</h3>
                                            </div>
                                            <div className="veri_box_right">
                                                <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="deals_chart_grid">
                                        <div>
                                            <div className="grid_2 mb-24">
                                                <div className="veri_box_column">
                                                    <div className="veri_box_left">
                                                        <p># of Offers Accepted</p>
                                                        <h3>{buyerAnalytics?.deal_activities?.total_offers_accepted}</h3>
                                                    </div>
                                                    <div className="veri_box_right">
                                                        <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                                                    </div>
                                                </div>
                                                <div className="veri_box_column">
                                                    <div className="veri_box_left">
                                                        <p>Average Offers Made Before Acceptance</p>
                                                        <h3>{buyerAnalytics?.deal_activities?.average_offers_made_before_acceptance}</h3>
                                                    </div>
                                                    <div className="veri_box_right">
                                                        <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid_2 mb-24">
                                                <div className="veri_box_column">
                                                    <div className="veri_box_left">
                                                        <p>Average Time from Offer Made → Offer Accepted</p>
                                                        <h3>{buyerAnalytics?.deal_activities?.average_time_from_offer_made_to_accepted}</h3>
                                                    </div>
                                                    <div className="veri_box_right">
                                                        <Image src="/assets/images/clock_notification.svg" alt="Deals" />
                                                    </div>
                                                </div>
                                                <div className="veri_box_column">
                                                    <div className="veri_box_left">
                                                        <p>Match-to-Offer Conversion Rate</p>
                                                        <h3>{buyerAnalytics?.deal_activities?.match_to_offer_conversion_rate}</h3>
                                                    </div>
                                                    <div className="veri_box_right">
                                                        <Image src="/assets/images/percentage-symbol.svg" alt="percentage" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid_2">
                                                <div className="veri_box_column">
                                                    <div className="veri_box_left">
                                                        <p># of DMs Sent or Replied</p>
                                                        <h3>{buyerAnalytics?.deal_activities?.total_dm_sent}</h3>
                                                    </div>
                                                    <div className="veri_box_right">
                                                        <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                                                    </div>
                                                </div>
                                                <div className="veri_box_column">
                                                    <div className="veri_box_left">
                                                        <p>Total $ Volume of Accepted Offers</p>
                                                        <h3>{buyerAnalytics?.deal_activities?.total_volume_accepted_offer}</h3>
                                                    </div>
                                                    <div className="veri_box_right">
                                                        <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chart_area">
                                            <div className="chart_canvas">
                                                <Pie data={data} options={options} plugins={[insideTextPlugin]} />
                                            </div>
                                            <div className="legend">
                                                <div className="legend-item">
                                                    <span className="dot dot1"></span> Interested
                                                </div>
                                                <div className="legend-item">
                                                    <span className="dot dot2"></span> Not Interested
                                                </div>
                                                <div className="legend-item">
                                                    <span className="dot dot3"></span> Want To Buy
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card-box mt-0 p-0">
                                <div className="buyer_dash_deals accr_data">
                                    <h3 className="accr_title" onClick={() => toggle(1)}>
                                        Favorite deals
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            style={{
                                                transform: open === 1 ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "0.3s"
                                            }}
                                        >
                                            <path d="M6 9L12 15L18 9" stroke="#121639" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </h3>
                                    <AnimatePresence>
                                        {open === 1 && (
                                            <motion.ul
                                                className="featured_deal_card accr_data_content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                {dashboardDetails.favorite_buyer_deals && dashboardDetails.favorite_buyer_deals.length > 0 ?
                                                    dashboardDetails.favorite_buyer_deals.map((data, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <div className="dash_deals_left">
                                                                    <img src={data.property_images[0]} className="img-fluid" alt="" />
                                                                </div>
                                                                <div className="dash_deals_center">
                                                                    <h4>{data.title}</h4>
                                                                    <p>{data.property_type}</p>
                                                                    <ul className="inner_room_details">
                                                                        <li>Beds : <span>{data.bedroom_min}</span></li>
                                                                        <li>Baths : <span>{data.bath}</span></li>
                                                                        <li>Liveable sq. ft. : <span>{data.size}</span></li>
                                                                        <li>Lot sq. ft. : <span>{data.lot_size}</span></li>
                                                                    </ul>
                                                                </div>
                                                                <div className="dash_deals_right">
                                                                    <span>$ {data.price || 0}</span>
                                                                </div>
                                                            </li>
                                                        )
                                                    }) : <p>No data found</p>}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="buyer_dash_deals accr_data">
                                    <h3 className="accr_title" onClick={() => toggle(2)}>
                                        featured deals
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            style={{
                                                transform: open === 2 ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "0.3s"
                                            }}
                                        >
                                            <path d="M6 9L12 15L18 9" stroke="#121639" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </h3>
                                    <AnimatePresence>
                                        {open === 2 && (
                                            <motion.ul
                                                className="featured_deal_card accr_data_content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                {dashboardDetails.featured_buyer_deals && dashboardDetails.featured_buyer_deals.length > 0 ?
                                                    dashboardDetails.featured_buyer_deals.map((data, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <div className="dash_deals_left">
                                                                    <img src={data.property_images[0]} className="img-fluid" alt="" />
                                                                </div>
                                                                <div className="dash_deals_center">
                                                                    <h4>{data.title}</h4>
                                                                    <p>{data.property_type}</p>
                                                                    <ul className="inner_room_details">
                                                                        <li>Beds : <span>{data.bedroom_min}</span></li>
                                                                        <li>Baths : <span>{data.bath}</span></li>
                                                                        <li>Liveable sq. ft. : <span>{data.size}</span></li>
                                                                        <li>Lot sq. ft. : <span>{data.lot_size}</span></li>
                                                                    </ul>
                                                                </div>
                                                                <div className="dash_deals_right">
                                                                    <span>$ {data.price || 0}</span>
                                                                </div>
                                                            </li>
                                                        )
                                                    }) : <p>No data found</p>}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="buyer_dash_deals accr_data">
                                    <h3 className="accr_title" onClick={() => toggle(3)}>
                                        Deals
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            style={{
                                                transform: open === 3 ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "0.3s"
                                            }}
                                        >
                                            <path d="M6 9L12 15L18 9" stroke="#121639" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </h3>
                                    <AnimatePresence>
                                        {open === 3 && (
                                            <motion.ul
                                                className="featured_deal_card accr_data_content"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                {dashboardDetails.latest_buyer_deals && dashboardDetails.latest_buyer_deals.length > 0 ?
                                                    dashboardDetails.latest_buyer_deals.map((data, index) => {
                                                        return (
                                                            <li>
                                                                <div className="dash_deals_left">
                                                                    <img src={data.property_images[0]} className="img-fluid" alt="" />
                                                                </div>
                                                                <div className="dash_deals_center">
                                                                    <h4>{data.address}</h4>
                                                                    <p>{data.property_type}</p>
                                                                    <ul className="inner_room_details">
                                                                        <li>Beds : <span>{data.bedroom_min}</span></li>
                                                                        <li>Baths : <span>{data.bath}</span></li>
                                                                        <li>Liveable sq. ft. : <span>{data.size}</span></li>
                                                                        <li>Lot sq. ft. : <span>{data.lot_size}</span></li>
                                                                    </ul>
                                                                </div>
                                                                <div className="dash_deals_right">
                                                                    <span>$ {data.price}</span>
                                                                </div>
                                                            </li>
                                                        )
                                                    }) : <p>No data found</p>
                                                }
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            {currentPlan && (
                                <div className="card-box already_purchased">
                                    <div className="purchased_inner">
                                        <div className="purchased_top">
                                            <div className="purchased_data">
                                                <span>${currentPlan.amount}<sub>\monthly</sub></span>
                                                <p>Position: {currentPlan.position}</p>
                                            </div>

                                            <div className="purchased_info position-relative">
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="plan-description-tooltip">
                                                            {currentPlan.description || "No description available"}
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

                                                {currentPlan.title && (
                                                    <span className="top_feat_info">
                                                        <img
                                                            src={currentPlan.image_url || "/assets/images/star-icon.svg"}
                                                            className="img-fluid"
                                                            alt={currentPlan.title}
                                                        />{" "}
                                                        {currentPlan.title}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="purchased_bottom">
                                            <div className="purchased_bottom_left">
                                                <button
                                                    className="btn-fill2 btn-fill2-green"
                                                    onClick={() => navigate("/buyer/boost-your-profile")}
                                                >
                                                    Change Plan
                                                </button>
                                            </div>
                                            <div className="purchased_bottom_right">
                                                <div className="switch_text position-relative">
                                                    <input
                                                        type="checkbox"
                                                        id="auto_renew"
                                                        checked={!!currentPlan.is_plan_auto_renew}
                                                        onClick={() =>
                                                            handleChangeAutoPayment(
                                                                !currentPlan.is_plan_auto_renew,
                                                                currentPlan.plan_stripe_id
                                                            )
                                                        }
                                                    />
                                                    <label htmlFor="auto_renew">Auto-Renew</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};
export default Dashboard;
