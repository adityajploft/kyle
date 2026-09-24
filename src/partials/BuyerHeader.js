import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import DarkMode from "../partials/DarkMode";
import { Dropdown, Image } from "react-bootstrap";
import { generatedToken, messaging } from "../notifications/firebase";
import { onMessage } from "firebase/messaging";

function BuyerHeader() {
  const navigate = useNavigate();
  const { setLogout, getTokenData, getLocalStorageUserdata, setLocalStorageUserdata } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [creditLimit, setCreditLimit] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isNewNotification, setIsNewNotification] = useState('');
  const [notificationData, setNotificationData] = useState({
    deal_notification: [{
      total: 0,
      records: []
    }],
    match_notification: [{
      total: 0,
      records: []
    }],
    new_buyer_notification: [{
      total: 0,
      records: []
    }],
    dm_notification: [{
      total: 0,
      records: []
    }],
    interested_buyer_notification: [{
      total: 0,
      records: []
    }],
    offer_notification: [{
      total: 0,
      records: []
    }]
  });


  console.log(notificationData, "notificationData");
  const playSound = () => {
    const audio = new Audio('./assets/sound/notification.mp3');
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  };

  useEffect(() => {
    const tokenData = getTokenData();
    if (tokenData.access_token) {
      getCurrentLimit();
      let userData = getLocalStorageUserdata();
      if (userData && userData.id) {
        isActiveUser(userData);
      }
      if (userData !== null) {
        if (userData.role === 2) {
          navigate("/");
        }
        setUserDetails(userData);
      }
    }
  }, []);

  const isActiveUser = async (userData) => {
    if (!userData || !userData.id) return;
    const tokenData = getTokenData();
    if (!tokenData.access_token) {
      return;
    }
    try {
      let userId = userData.id;
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + tokenData.access_token,
        "auth-token": tokenData.access_token,
      };
      let url = apiUrl + "is-user-status";
      let response = await axios.post(url, { user_id: userId }, { headers: headers });
      if (response.data.status) {
        if (response.data.user_status) {
          userData.is_verified = response.data.is_buyer_verified;
          setLocalStorageUserdata(userData);
        } else {
          setLogout();
        }
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  }

  const getCurrentLimit = async () => {
    const tokenData = getTokenData();
    if (!tokenData.access_token) {
      return;
    }
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + tokenData.access_token,
        "auth-token": tokenData.access_token,
      };
      let url = apiUrl + "get-current-limit";
      let response = await axios.get(url, { headers: headers });
      if (response.data.status) {
        if (!response.data.is_active) {
          toast.error("Your account has been blocked!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setLogout();
        }
        setCreditLimit(response.data);
        // Also update local storage so other components have fresh data
        let userData = getLocalStorageUserdata();
        if (userData) {
          userData.credit_limit = response.data.credit_limit;
          userData.level_type = response.data.level_type;
          setLocalStorageUserdata(userData);
        }
      }
    } catch (error) {
      console.log("buyer current limit error", error?.response || error);
    }
  }

  useEffect(() => {
    window.addEventListener('creditUpdated', getCurrentLimit);
    return () => {
      window.removeEventListener('creditUpdated', getCurrentLimit);
    };
  }, []);

  const handleToggleSeller = async () => {
    const tokenData = getTokenData();
    if (!tokenData.access_token) {
      return;
    }
    try {
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + tokenData.access_token,
        "auth-token": tokenData.access_token,
      };
      let response = await axios.post(`${apiUrl}update-user-role`, {}, { headers });
      if (response.data.status) {
        setLocalStorageUserdata(response.data.userData);
        navigate('/');
      } else {
        toast.error(response?.data?.message || "Unable to switch role.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

    } catch (error) {
      if (error?.response?.status === 401) {
        setLogout();
      } else {
        toast.error(
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to switch role.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
    }
  }

  useEffect(() => {
    const fetchNotificationData = async () => {
      const tokenData = getTokenData();
      if (!tokenData.access_token) {
        return;
      }
      try {
        let headers = {
          Accept: "application/json",
          Authorization: "Bearer " + tokenData.access_token,
          "auth-token": tokenData.access_token,
        };
        let response = await axios.get(`${apiUrl}get-notifications`, { headers });
        setNotificationData(response.data.notifications);
      } catch (error) {
        console.log("buyer notifications error", error?.response || error);
      }
    }
    fetchNotificationData()
  }, [isNewNotification]);

  useEffect(() => {
    try {
      generatedToken();
      onMessage(messaging, (payload) => {
        if (payload && payload.notification) {
          console.log(payload, "payload data");
          playSound();
          setIsNewNotification(Date.now());
        } else {
          console.warn("No notification in payload:", payload);
        }
      });
    } catch (error) {
      console.log(error, "new error")
    }
  }, []);

  useEffect(() => {
    const handleNotificationsRead = (event) => {
      const notificationKey = event?.detail?.notificationKey;
      if (!notificationKey) {
        return;
      }

      setNotificationData((prev) => {
        const current = prev?.[notificationKey] || {};
        return {
          ...prev,
          [notificationKey]: {
            ...current,
            records: current?.records || [],
            total: 0,
          },
        };
      });
    };

    window.addEventListener("buyerNotificationsRead", handleNotificationsRead);
    return () => {
      window.removeEventListener("buyerNotificationsRead", handleNotificationsRead);
    };
  }, []);

  const markNotificationAsRead = async (notificationKey) => {
    const tokenData = getTokenData();
    if (!tokenData.access_token) {
      return;
    }

    setNotificationData((prev) => {
      const current = prev?.[notificationKey] || {};
      return {
        ...prev,
        [notificationKey]: {
          ...current,
          records: current?.records || [],
          total: 0,
        },
      };
    });

    try {
      const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + tokenData.access_token,
        "auth-token": tokenData.access_token,
      };
      await axios.get(`${apiUrl}mark-as-read-notification/${notificationKey}`, { headers });
    } catch (error) {
      console.log("buyer mark notification read error", error?.response || error);
      setIsNewNotification(Date.now());
    }
  };

  const matchNotificationRecords = notificationData?.match_notification?.records || [];
  const dealNotificationRecords = notificationData?.deal_notification?.records || [];

  return (
    <>
      <header className="dashboard-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-4 col-sm-4 col-md-4 col-lg-5 col-xxl-6">
              <div className="d-flex align-items-center header-left">
                <div className="header-logo">
                  <Link to="/buyer/dashboard">
                    <img
                      src="../../../assets/images/logo.svg"
                      className="img-fluid darkmode-none"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="d-flex ms-4">
                  <Link to="/buyer/additional-credits" className="upload-buyer bg-green d-none d-lg-flex">
                    <span className="upload-buyer-icon d-flex">
                      <img
                        alt="coin"
                        src="/assets/images/coin.svg"
                        className="img-fluid"
                      />
                    </span>
                    <p>Buy Credits</p>
                  </Link>
                  {/* <Link to="/buyer/dashboard" className="upload-buyer d-none d-lg-flex ms-3">
                    <span className="upload-buyer-icon d-flex">
                      <img
                        alt="folder"
                        src="/assets/images/folder.svg"
                        className="img-fluid"
                      />
                    </span>
                    <p>
                      Buyer Database :{" "}
                      <b>
                        {creditLimit !== null ? (
                          creditLimit.total_buyer_uploaded
                        ) : (
                          "..."
                        )}
                      </b>
                    </p>
                  </Link> */}
                  {userDetails !== null && userDetails.level_type !== 1 ? (
                    <>
                      <div className="upload-buyer d-none d-lg-flex me-0 ms-3">
                        <span className="upload-buyer-icon d-flex">
                          <img
                            alt="wallet"
                            src="/assets/images/wallet.svg"
                            className="img-fluid"
                          />
                        </span>
                        <p>
                          Credits :{" "}
                          <b className="credit_limit">
                            {creditLimit !== null ? (
                              creditLimit.credit_limit
                            ) : (
                              "..."
                            )}
                          </b>
                        </p>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="col-8 col-sm-8 col-md-8 col-lg-7 col-xxl-6">
              <div className="block-session">
                <div className="top_icons_list">
                  <ul className="mobile-header-list align-items-center">
                    <li>
                      <Dropdown onToggle={(isOpen) => isOpen && markNotificationAsRead("match_notification")}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" title="Matched Deals" aria-label="Matched Deals">
                          <Image src='../../../assets/images/MatchDeal.svg' alt='' /><span className="list_numbers">{notificationData?.match_notification?.total || 0}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <h5>Matched Deals</h5>
                          <ul>
                            {matchNotificationRecords.length > 0 ? (
                              matchNotificationRecords.map((data, index) => {
                                return (
                                  <li key={index}>
                                    <div className="dropdown_start">
                                      <Image src='../../../assets/images/MatchDeal.svg' alt='' />
                                    </div>
                                    <div className="dropdown_middle">
                                      <h6>{data.data.title}</h6>
                                      <p>{data.data.message}</p>
                                    </div>
                                    <div className="dropdown_end align-self-center">
                                      <Link to="/buyer/matched-deals" onClick={() => markNotificationAsRead("match_notification")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 14 9" fill="none">
                                          <path d="M1 4.5L12.9972 4.5" stroke="#121639" strokeLinecap="round" strokeLinejoin="round" />
                                          <path d="M9.80078 1L13.0003 4.5L9.80078 8" stroke="#121639" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      </Link>
                                    </div>
                                  </li>
                                );
                              })
                            ) : (
                              <li>
                                <div className="dropdown_start">
                                  <Image src='../../../assets/images/notifi-top-icon.svg' alt='' />
                                </div>
                                <div className="dropdown_middle">
                                  <h6>Your Inbox is Empty</h6>
                                </div>
                              </li>
                            )}
                          </ul>

                          {matchNotificationRecords.length > 0 && (
                            <Link to="/buyer/matched-deals" onClick={() => markNotificationAsRead("match_notification")}>View All</Link>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                    <li>
                      <Dropdown onToggle={(isOpen) => isOpen && markNotificationAsRead("deal_notification")}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" title="New Deals" aria-label="New Deals">
                          <Image src='../../../assets/images/home-dollar.svg' alt='' /><span className="list_numbers">{notificationData?.deal_notification?.total || 0}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <h5>New Deals</h5>
                          <ul>
                            {dealNotificationRecords.length > 0 ? (
                              dealNotificationRecords.map((data, index) => {
                                return (
                                  <li key={index}>
                                    <div className="dropdown_start">
                                      <Image src='../../../assets/images/home-dollar-drop-icon.svg' alt='' />
                                    </div>
                                    <div className="dropdown_middle">
                                      <h6>{data.data.title}</h6>
                                      <p>{data.data.message}</p>
                                    </div>
                                    <div className="dropdown_end align-self-center">
                                      <Link to="#" onClick={() => markNotificationAsRead("deal_notification")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9" viewBox="0 0 14 9" fill="none">
                                          <path d="M1 4.5L12.9972 4.5" stroke="#121639" strokeLinecap="round" strokeLinejoin="round" />
                                          <path d="M9.80078 1L13.0003 4.5L9.80078 8" stroke="#121639" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      </Link>
                                    </div>
                                  </li>
                                );
                              })
                            ) : (
                              <li className="text-center py-3">
                                <div className="dropdown_start">
                                  <Image src='../../../assets/images/notifi-top-icon.svg' alt='' />
                                </div>
                                <div className="dropdown_middle">
                                  <h6>Your Inbox is Empty</h6>
                                </div>
                              </li>
                            )}
                          </ul>

                          {dealNotificationRecords.length > 0 && (
                            <Link to="/buyer/deal-notifications" onClick={() => markNotificationAsRead("deal_notification")}>View All</Link>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                    <li>
                      <Dropdown onToggle={(isOpen) => isOpen && markNotificationAsRead("dm_notification")}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" title="New Messages" aria-label="New Messages">
                          <Image src='../../../assets/images/msg-top.svg' alt='' /><span className="list_numbers">{notificationData.dm_notification.total || 0}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <h5>New Messages</h5>
                          <ul>
                            {notificationData?.dm_notification?.total > 0 ? (
                              notificationData?.dm_notification?.records?.map((data, index) => {
                                return (
                                  <li key={index}>
                                    <div className="dropdown_start">
                                      <Image src='../../../assets/images/msg-dropdown-icon.svg' alt='' />
                                    </div>
                                    <div className="dropdown_middle">
                                      <h6>{data.data.title}</h6>
                                      <p>{data.data.message}</p>
                                    </div>
                                    <div className="dropdown_end">{data.created_at}</div>
                                  </li>
                                );
                              })
                            ) : (
                              <li className="text-center py-3">
                                <div className="dropdown_start">
                                  <Image src='../../../assets/images/msg-dropdown-icon.svg' alt='' />
                                </div>
                                <div className="dropdown_middle">
                                  <h6>Your Inbox is Empty</h6>
                                </div>
                              </li>
                            )}
                          </ul>

                          {/* {notificationData?.dm_notification?.total > 0 && ( */}
                          <Link to="/message" onClick={() => markNotificationAsRead("dm_notification")}>View All</Link>
                          {/* )} */}
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                    <li>
                      <Dropdown onToggle={(isOpen) => isOpen && markNotificationAsRead("offer_notification")}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" title="Offer Notifications" aria-label="Offer Notifications">
                          <Image src='../../../assets/images/notifi-top.svg' alt='' /><span className="list_numbers">{notificationData.offer_notification.total || 0}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <h5>Offer Notifications</h5>
                          <ul>
                            {notificationData.offer_notification.total > 0 ?
                              notificationData.offer_notification.records.map((data, index) => {
                                return (
                                  <li key={index}>
                                    <div className="dropdown_start">
                                      <Image src='../../../assets/images/notifi-top-icon.svg' alt='' />
                                    </div>
                                    <div className="dropdown_middle">
                                      <h6>{data.data.title}</h6>
                                      <p>{data.data.message}</p>
                                    </div>
                                    <div className="dropdown_end">{data.created_at}</div>
                                  </li>
                                )
                              }) :
                              <li>
                                <div className="dropdown_start">
                                  <Image src='../../../assets/images/notifi-top-icon.svg' alt='' />
                                </div>
                                <div className="dropdown_middle">
                                  <h6>Your Inbox is Empty</h6>
                                  {/* <h6>No Data Found</h6> */}
                                </div>
                              </li>
                            }
                          </ul>
                          <Link to="/buyer/deal-notifications" onClick={() => markNotificationAsRead("offer_notification")}>View All</Link>
                          {/* <Link to="/message?tab=tab2" onClick={() => markNotificationAsRead("offer_notification")}>View All</Link> */}
                        </Dropdown.Menu>
                      </Dropdown>
                    </li>
                  </ul>
                </div>
                <Link to="/buyer/boost-your-profile" className="upload-buyer boost_btn">
                  <span className="upload-buyer-icon">
                    <img
                      src="../../../assets/images/rocket.svg"
                      className="img-fluid"
                      alt=""
                    />
                  </span>
                  <p>boost your profile</p>
                </Link>
                <div className="dropdown user-dropdown">
                  <button
                    className="btn dropdown-toggle ms-auto"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="dropdown-data">
                      <div className="img-user">
                        <img
                          src={
                            userDetails !== null &&
                              userDetails.profile_image !== ""
                              ? userDetails.profile_image
                              : "../../../assets/images/avtar.png"
                          }
                          className="img-fluid user-profile"
                          alt=""
                        />
                      </div>
                      <div className="welcome-user">
                        <span className="welcome">welcome</span>
                        <span className="user-name-title">
                          {userDetails !== null
                            ? userDetails.first_name +
                            " " +
                            userDetails.last_name
                            : ""}
                        </span>{" "}
                      </div>
                    </div>
                    <span className="arrow-icon">
                      <svg
                        width="14"
                        height="8"
                        viewBox="0 0 14 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.002 7L7.00195 0.999999L1.00195 7"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    {(userDetails?.is_switch_role == 1 || userDetails?.level_type >= 1) && (
                      <div className="buyer_role_tabs_top">
                        <button
                          type="button"
                          className="buyer_role_tab_btn"
                          onClick={handleToggleSeller}
                        >
                          Seller
                        </button>
                        <button
                          type="button"
                          className="buyer_role_tab_btn is-active"
                        >
                          Buyer
                        </button>
                      </div>
                    )}
                    <ul className="list-unstyled mb-0">
                      <li>
                        <Link className="dropdown-item" to="/buyer/pending-offers">
                          <img
                            alt=""
                            src="../../../assets/images/timerr.svg"
                            className="img-fluid"
                          />
                          Pending Offers
                        </Link>
                      </li>
                      <li>
                        <Link to="/buyer/profile" className="dropdown-item">
                          <img
                            src="../../../assets/images/profile.svg"
                            // src="../../../assets/images/user-login.svg"
                            className="img-fluid" alt=""
                          />
                          My Profile
                        </Link>
                      </li>
                      {(userDetails !== null && userDetails.is_verified) ? '' :
                        <li className="active">
                          <Link to="/buyer/profile-verification" className="dropdown-item">
                            <img
                              src="../../../assets/images/search-log.svg"
                              className="img-fluid" alt=""
                            />
                            Profile Verification
                          </Link>
                        </li>
                      }

                      <li>
                        <Link to="/support" className="dropdown-item">
                          <img
                            src="../../../assets/images/24-support.svg"
                            // src="../../../assets/images/messages.svg"
                            className="img-fluid"
                          />
                          Support
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/buyer/proof-of-fund">
                          <img
                            alt=""
                            src="../../../assets/images/ProofOfFund.svg"
                            className="img-fluid"
                          />
                          Proof Of Fund
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/buyer/deal-notifications">
                          <img
                            alt=""
                            src="../../../assets/images/discount-shape.svg"
                            // src="../../../assets/images/setting-1.svg"
                            className="img-fluid"
                          />
                          Offer Notification
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/buyer/viewed-property">
                          <img
                            alt=""
                            src="/assets/images/eyess.svg"
                            // src="/assets/images/view.svg"
                            className="img-fluid"
                          />
                          Viewed Properties
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/settings">
                          <img
                            alt=""
                            src="../../../assets/images/setting-2.svg"
                            className="img-fluid"
                          />
                          Settings
                        </Link>
                      </li>
                      <li>
                        <DarkMode />
                      </li>

                      {/* {(userDetails?.is_switch_role == 1  && userDetails?.level_type > 1 )&& 
                      <li>
                        <Link className="dropdown-item position-relative">
                            <div className="buyer_seller_toggle2">
                              <input type="checkbox" onChange={handleToggleSeller} defaultChecked={true}/>
                              <label>
                                <span>Seller</span>
                              </label>
                            </div>
                        </Link>
                      </li>
                      } */}
                      <li>
                        <a
                          href={void 0}
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                          onClick={setLogout}
                        >
                          <img
                            alt=""
                            src="../../../assets/images/logout.svg"
                            className="img-fluid"
                          />
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default BuyerHeader;
