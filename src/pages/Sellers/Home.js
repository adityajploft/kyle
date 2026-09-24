// import React, { useEffect, useState } from "react";
import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useFormError } from "../../hooks/useFormError";
import { toast } from "react-toastify";
// import Header from "../../partials/Header";
// import Footer from "../../partials/Footer";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
// import UploadMultipleBuyersOnChange from "../../component/UploadMultipleBuyersOnChange";
// import WatchVideo from "../../modal/WatchVideo";
// import Notification from "./Notification/Notification";
// import AdBanner from "../../component/AdBanner";

import { OverlayTrigger, Tooltip } from "react-bootstrap";

// lazy load 

const Header = lazy(() => import("../../partials/Header"));
const Footer = lazy(() => import("../../partials/Footer"));
const UploadMultipleBuyersOnChange = lazy(() =>
  import("../../component/UploadMultipleBuyersOnChange")
);
const WatchVideo = lazy(() => import("../../modal/WatchVideo"));
const Notification = lazy(() =>
  import("./Notification/Notification")
);
const AdBanner = lazy(() => import("../../component/AdBanner"));
const SellerDashboardAnalytics = lazy(() =>
  import("./SellerDashboardAnalytics")
);

function Home({ userDetails }) {
  const { getTokenData, setLogout } = useAuth();
  const { setErrors } = useFormError();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoSubTitle, setVideoSubTitle] = useState("");
  const [isActiveVideo, setIsActiveVideo] = useState("");
  const [isLoader, setIsloader] = useState(true);
  const [openVideoModal, SetOpenVideoModal] = useState(false);
  const [dealData, setDealData] = useState([]);
  const [advertisementData, setAdvertisementData] = useState([]);
  const [repCode, setRepCode] = useState('');
  const [repCodeTooltip, setRepCodeTooltip] = useState("Click to copy");
  const [shouldRenderAnalytics, setShouldRenderAnalytics] = useState(false);
  const analyticsSectionRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !shouldRenderAnalytics) {
        setShouldRenderAnalytics(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    
    // Check initially in case page is reloaded halfway down
    if (window.scrollY > 100) {
      setShouldRenderAnalytics(true);
    } else {
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldRenderAnalytics]);

  useEffect(() => {
    const fetchAdvertisementBannerData = async () => {
      try {
        let headers = {
          Accept: "application/json",
          Authorization: "Bearer " + getTokenData().access_token,
          "auth-token": getTokenData().access_token,
        };

        let response = await axios.post(apiUrl + `banner/home`, {}, {
          headers: headers,
        });
        setAdvertisementData(response.data.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchAdvertisementBannerData();
  }, [])

  useEffect(() => {
    getVideoUrl();
  }, []);



  const getVideoUrl = async () => {
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };

      let response = await axios.get(apiUrl + "getVideo/upload_buyer_video", {
        headers: headers,
      });

      if (response) {
        let videoLink = response.data.videoDetails.video.video_link;
        let videoText = response.data.videoDetails.video.title;
        setVideoUrl(videoLink);
        setVideoTitle(videoText);
        setVideoSubTitle(response.data.videoDetails.video.sub_title);
        setIsActiveVideo(response.data.videoDetails.is_active);
        //setIsPlaying(true)
      }
      setIsloader(false);
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
    }
  };

  const handleOpenModal = () => {
    SetOpenVideoModal(true);
  };

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

  useEffect(() => {
    let headers = {
      Accept: "application/json",
      Authorization: "Bearer " + getTokenData().access_token,
      "auth-token": getTokenData().access_token,
    };
    const fetchData = async () => {
      let response = await axios.get(`${apiUrl}deals/result-list`, { headers: headers });
      setDealData(response.data.deals.data)
    }
    fetchData();
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



  return (
    <>
      {/* <Header /> */}
      <Suspense fallback={<div>Loading Header...</div>}>
        <Header />
      </Suspense>
      <section className="main-section pt-4 pb-5 position-relative">
        <div className="container position-relative">
          <div className="row mb-50">
            <div className="col-12 col-lg-9">
              {/* <AdBanner adData={advertisementData} /> */}
              <Suspense fallback={<div>Loading Ads...</div>}>
                <AdBanner adData={advertisementData} />
              </Suspense>
            </div>
            <div className="col-12 col-lg-3">
              {isActiveVideo ? (
                <div className="watch-video home-video">
                  <p>{videoTitle}</p>
                  <a onClick={handleOpenModal} className="title">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="#121639"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 8L16 12L10 16V8Z"
                        stroke="#121639"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Watch The Video!
                  </a>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="row justify-content-center align-items-center mobile-row-gap mb-50">
            <div className="col-12 col-xl-9">
              <div className="heading-title">
                <h2>Select The option below!</h2>
                <p>
                  Upload your buyer’s criteria and use the Buybox Search to find
                  the right buyers for your deals.
                </p>
              </div>
            </div>
            <div className="col-12 col-xl-3">
              <div className="REP_Code_block">
                {repCode == '' ? <Link to="/seller/rep-code" className="btn-fill2 w-100 d-flex align-items-center justify-content-center">Apply for REP code</Link> :
                  <div className="rep-code-row" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <div className="rep-code-content" style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M8.73792 0.5C4.04412 0.5 0.238281 4.30584 0.238281 8.99964C0.238281 13.6934 4.04412 17.5 8.73792 17.5C13.4317 17.5 17.2383 13.6934 17.2383 8.99964C17.2383 4.30584 13.4317 0.5 8.73792 0.5ZM10.5074 13.6733C10.0699 13.846 9.72158 13.977 9.46038 14.0676C9.19989 14.1583 8.89695 14.2036 8.55227 14.2036C8.02266 14.2036 7.61034 14.0741 7.31676 13.8158C7.02317 13.5574 6.8771 13.23 6.8771 12.8321C6.8771 12.6774 6.88789 12.5191 6.90948 12.3579C6.93178 12.1967 6.96704 12.0154 7.01525 11.8117L7.56285 9.87752C7.61106 9.69187 7.6528 9.51558 7.6859 9.35151C7.719 9.18601 7.73483 9.03418 7.73483 8.89602C7.73483 8.64993 7.68374 8.47723 7.58228 8.38008C7.47938 8.28294 7.28582 8.23545 6.99726 8.23545C6.85623 8.23545 6.71087 8.25632 6.56192 8.30021C6.41441 8.34554 6.28632 8.38656 6.18127 8.42686L6.3259 7.83105C6.68425 7.68497 7.02749 7.55977 7.3549 7.45615C7.6823 7.35109 7.99172 7.29928 8.28315 7.29928C8.80916 7.29928 9.215 7.42737 9.50067 7.68066C9.78491 7.93467 9.9281 8.26495 9.9281 8.67079C9.9281 8.75498 9.91803 8.90322 9.8986 9.11477C9.87917 9.32705 9.84247 9.52061 9.78922 9.69835L9.2445 11.6268C9.19989 11.7815 9.16031 11.9585 9.12433 12.1564C9.08908 12.3543 9.07181 12.5054 9.07181 12.6069C9.07181 12.863 9.12865 13.0379 9.24378 13.1307C9.35748 13.2236 9.5568 13.2703 9.83887 13.2703C9.972 13.2703 10.1209 13.2466 10.2893 13.2005C10.4563 13.1545 10.5772 13.1135 10.6534 13.0782L10.5074 13.6733ZM10.4109 5.84574C10.1569 6.08176 9.85111 6.19977 9.49348 6.19977C9.13657 6.19977 8.82859 6.08176 8.57242 5.84574C8.31769 5.60971 8.18888 5.3226 8.18888 4.98728C8.18888 4.65268 8.31841 4.36485 8.57242 4.12667C8.82859 3.88777 9.13657 3.76904 9.49348 3.76904C9.85111 3.76904 10.1576 3.88777 10.4109 4.12667C10.6649 4.36485 10.7923 4.65268 10.7923 4.98728C10.7923 5.32332 10.6649 5.60971 10.4109 5.84574Z" fill="#464B70" />
                        </svg>
                      </span>
                      <p className="mb-0 rep-code-value" onClick={handleCopyRepCode}>REP Code <strong>: {repCode} </strong></p>
                    </div>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 120, hide: 200 }}
                      overlay={
                        <Tooltip id="button-tooltip">{repCodeTooltip}</Tooltip>
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
                }
              </div>
            </div>
          </div>
          <div className="row row-gap">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              <Link to="/seller/add-buyer-details" className="grid-block-view">
                <div className="grid-block-icon">
                  <img
                    src="./assets/images/upload-buyer.svg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <h3>Upload Buyers</h3>
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              <Link to="/seller/sellers-form" className="grid-block-view">
                <div className="grid-block-icon">
                  <img
                    src="./assets/images/buybox-search.svg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <h3>Buybox Search</h3>
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              <Link to="/seller/my-buyers" className="grid-block-view">
                <div className="grid-block-icon">
                  <img
                    src="./assets/images/my-buyers.svg"
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <h3>My Buyers</h3>
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3">
              {/* <UploadMultipleBuyersOnChange /> */}
              <Suspense fallback={<div>Loading Upload...</div>}>
                <UploadMultipleBuyersOnChange />
              </Suspense>
            </div>
          </div>

          {/* <Notification dealData={dealData} /> */}
          <Suspense fallback={<div>Loading Notifications...</div>}>
            <Notification dealData={dealData} />
          </Suspense>
          <div ref={analyticsSectionRef} style={{ minHeight: "100px" }}>
            {shouldRenderAnalytics && (
              <Suspense fallback={<div>Loading Analytics...</div>}>
                <SellerDashboardAnalytics />
              </Suspense>
            )}
          </div>

        </div>
      </section>
      {/* <Footer /> */}
      <Suspense fallback={<div>Loading Footer...</div>}>
        <Footer />
      </Suspense>

      {/* modal box for video */}
      {/* <WatchVideo
          isLoader={isLoader}
          videoUrl={videoUrl}
          videoSubTitle={videoSubTitle}
          SetOpenVideoModal={SetOpenVideoModal}
          openVideoModal={openVideoModal}
        /> */}

      {openVideoModal && (
        <Suspense fallback={<div>Loading Video...</div>}>
          <WatchVideo
            isLoader={isLoader}
            videoUrl={videoUrl}
            videoSubTitle={videoSubTitle}
            SetOpenVideoModal={SetOpenVideoModal}
            openVideoModal={openVideoModal}
          />
        </Suspense>
      )}

    </>
  );
}

export default Home;
