import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import Pagination from "../../partials/Pagination";
import EditRequest from "../../modal/EditRequest";
import SentRequest from "../../modal/SentRequest";
import { toast } from "react-toastify";
import axios from "axios";
import BuyerCard from "./Section/BuyerCard";

const MyBuyer = () => {
  const { getTokenData, setLogout, getLocalStorageUserdata } = useAuth();
  const [buyerData, setBuyerData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoader, setIsLoader] = useState(true);
  const [totalRecord, setTotalRecord] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);
  const [buyerId, setBuyerId] = useState("");
  const [likeCount, setLikeCount] = useState(50);
  const [sendDealShow, setSendDealShow] = useState(false);

  const sendDealClose = () => setSendDealShow(false);

  useEffect(() => {
    getBuyerLists();
  }, []);

  const getBuyerLists = async (page = "") => {
    try {
      setIsLoader(true);
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      let url = apiUrl + "my-buyers";
      if (page > 1) {
        url = apiUrl + "my-buyers?page=" + page;
      }
      let response = await axios.post(url, {}, { headers: headers });
      setIsLoader(false);
      if (response.data.status) {
        setBuyerData(response.data.buyers.data);
        setTotalRecord(response.data.buyers.total);
        setTotalPage(response.data.buyers.last_page);
        setCurrentPageNo(response.data.buyers.current_page);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.error) {
          toast.error(error.response.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  const handlePagination = (page_number) => {
    setIsLoader(true);

    setPageNumber(page_number);

    getBuyerLists(page_number);
  };

  const handleClickEditFlag = (data, id) => {
    setBuyerId(id);
    if (data) {
      setSentOpen(true);
    } else {
      setEditOpen(true);
    }
  };

  async function likeUnlikeBuyer(id, like, unlike, index) {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      const response = await axios.post(
        apiUrl + "like-unlike-buyer",
        { buyer_id: id, like: like, unlike: unlike },
        { headers: headers }
      );

      if (response.data.status) {
        const addLoaderParent = document.querySelectorAll(
          `.property-critera-block`
        )[index];
        const likeCount = addLoaderParent.querySelectorAll(".like-span")[0];
        const unLikeCount = addLoaderParent.querySelectorAll(".unlike-span")[0];
        likeCount.innerHTML = response.data.data.totalBuyerLikes;
        unLikeCount.innerHTML = response.data.data.totalBuyerUnlikes;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.errors) {
          toast.error(error.response.data.errors, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  }

  const handleLikeClick = (id, ind) => {
    let index = ind;
    let CurrentBuyer = buyerData.filter((data) => {
      return data.id === id;
    });

    if (!CurrentBuyer[0].liked) {
      CurrentBuyer[0].totalBuyerLikes = CurrentBuyer[0].totalBuyerLikes + 1;
      CurrentBuyer[0].liked = true;
      if (CurrentBuyer[0].disliked) {
        CurrentBuyer[0].totalBuyerUnlikes =
          CurrentBuyer[0].totalBuyerUnlikes - 1;
        CurrentBuyer[0].disliked = false;
      }
      likeUnlikeBuyer(id, 1, 0, index);
    } else {
      CurrentBuyer[0].totalBuyerLikes = CurrentBuyer[0].totalBuyerLikes - 1;
      CurrentBuyer[0].liked = false;
      handleDoubleClick(id);
    }
    let newBuyerData = buyerData;
    newBuyerData[index] = CurrentBuyer[0];
    setBuyerData(newBuyerData);
    setLikeCount(likeCount + 1);
  };

  const handleDisikeClick = (id, ind) => {
    let index = ind;
    let CurrentBuyer = buyerData.filter((data) => {
      return data.id === id;
    });

    if (!CurrentBuyer[0].disliked) {
      CurrentBuyer[0].totalBuyerUnlikes = CurrentBuyer[0].totalBuyerUnlikes + 1;
      CurrentBuyer[0].disliked = true;
      if (CurrentBuyer[0].liked) {
        CurrentBuyer[0].totalBuyerLikes = CurrentBuyer[0].totalBuyerLikes - 1;
        CurrentBuyer[0].liked = false;
      }
      likeUnlikeBuyer(id, 0, 1, index);
    } else {
      CurrentBuyer[0].totalBuyerUnlikes = CurrentBuyer[0].totalBuyerUnlikes - 1;
      CurrentBuyer[0].disliked = false;
      handleDoubleClick(id);
    }
    let newBuyerData = buyerData;
    console.log(newBuyerData,'newBuyerData');
    newBuyerData[index] = CurrentBuyer[0];
    setBuyerData(newBuyerData);
    setLikeCount(likeCount + 1);
  };

  const handleDoubleClick = async (buyerid) => {
    try {
      let userId = getLocalStorageUserdata().id;
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      const response = await axios.delete(
        apiUrl + `del-like-unlike-buyer/${userId}/${buyerid}`,
        { headers: headers }
      );
      if (response.data.status) {
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.errors) {
          toast.error(error.response.data.errors, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  useEffect(()=>{
      const markReadNotification = async () => {
          const apiUrl = process.env.REACT_APP_API_URL;
          let headers = {
              Accept: "application/json",
              Authorization: "Bearer " + getTokenData().access_token,
              "auth-token": getTokenData().access_token,
          };
          try {
              let response = await axios.get(`${apiUrl}mark-as-read-notification/deal_notification`,{headers:headers});
          } catch (error) {
              if (error.response.data.error) {
                  toast.error(error.response.data.error, {
                    position: toast.POSITION.TOP_RIGHT,
                  });
                }
          }
      }
      markReadNotification();
  },[]);

  return (
    <>
      <Header />
      <section className="main-section position-relative pt-4">
        {isLoader ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img alt="" src="../../../assets/images/loader.svg" />
          </div>
        ) : (
          <div className="container position-relative pat-40">
            <div className="back-block">
              <div className="row align-items-center">
                <div className="col-12 col-sm-4 col-md-4 col-lg-4">
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
                <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                  <h6 className="center-head fs-3 text-center mb-0">
                    My Buyers
                  </h6>
                </div>
              </div>
            </div>
            <div className="card-box bg-white-gradient pt-0">
              <div className="row">
                <div className="col-12 col-lg-12">
                  {totalRecord === 0 ? (
                    <div className="card-box-inner">
                      {" "}
                      <h5>No Data Found</h5>{" "}
                    </div>
                  ) : (
                    <div className="card-box-inner">
                      <div className="property-critera">
                        <div className="row cust-row">
                          {buyerData.map((data, index) => {
                            return (
                              <BuyerCard
                                data={data}
                                key={data.id}
                                handleLikeClick={handleLikeClick}
                                handleDisikeClick={handleDisikeClick}
                                handleClickEditFlag={handleClickEditFlag}
                                index={index}
                              />
                            );
                          })}
                        </div>
                        <div className="row justify-content-center">
                          {totalPage > 1 ? (
                            <Pagination
                              totalPage={totalPage}
                              currentPage={pageNumber}
                              onPageChange={handlePagination}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <EditRequest
                  setEditOpen={setEditOpen}
                  setBuyerData={setBuyerData}
                  editOpen={editOpen}
                  buyerId={buyerId}
                  buyerData={buyerData}
                />
                <SentRequest
                  setSentOpen={setSentOpen}
                  sentOpen={sentOpen}
                  buyerId={buyerId}
                />
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};
export default MyBuyer;
