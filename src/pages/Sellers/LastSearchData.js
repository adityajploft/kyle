import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import Pagination from "../../partials/Pagination";
import EditRequest from "../../modal/EditRequest";
import SentRequest from "../../modal/SentRequest";
import { useFormError } from "../../hooks/useFormError";
import { toast } from "react-toastify";
import axios from "axios";
import BuyerCard from "./Section/BuyerCard";
import Select from "react-select";

const LastSearchData = () => {
  const { getTokenData, setLogout, getLocalStorageUserdata } = useAuth();
  const [buyerData, setBuyerData] = useState([]);
  const [addressValue, setAddressValue] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoader, setIsLoader] = useState(true);
  const [totalRecord, setTotalRecord] = useState(0);
  const [currentRecord, setCurrentRecord] = useState(0);
  const [fromRecord, setFromRecord] = useState(0);
  const [toRecord, setToRecord] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);
  const [buyerId, setBuyerId] = useState("");
  const [recentSearchedAddress, setRecentSearchedAddress] = useState([]);
  const [dealStatus, setDealStatus] = useState([]);
  const [searchLog, setSearchLog] = useState("");
  const [status, setStatus] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const { setErrors, renderFieldError } = useFormError();

  const [likeCount, setLikeCount] = useState(50);

  useEffect(() => {
    getBuyerLists();
  }, [isFilter]);

  const getBuyerLists = async (page = "") => {
    try {
      setIsLoader(true);
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      let logId = '';
      let statusId = '';
      if(searchLog){
        logId = searchLog.value
      }
      if(status){
        statusId = status.value
      }
      let url = `${apiUrl}last-search-buyer?search_log_id=${logId}&status=${statusId}`;
      if (page > 1) {
        url = `${url}&page=${page}`;
      }
      let response = await axios.post(url, {}, { headers: headers });
      setIsLoader(false);
      if (response.data.status) {
        setBuyerData(response.data.buyers.data);
        setAddressValue(response.data.address_value);
        setCurrentRecord(response.data.buyers.data.length);
        setTotalRecord(response.data.buyers.total);
        setTotalPage(response.data.buyers.last_page);
        setCurrentPageNo(response.data.buyers.current_page);
        setFromRecord(response.data.buyers.from);
        setToRecord(response.data.buyers.to);
        setRecentSearchedAddress(response.data.last_searches);
        setDealStatus(response.data.deal_status);
      }
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
        if (error.response.data.validation_errors) {
          setErrors(error.response.data.validation_errors);
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
        if (error.response.data.validation_errors) {
          setErrors(error.response.data.validation_errors);
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  return (
    <>
      <Header />
      <section className="main-section position-relative pt-4">
        {isLoader ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img src="../../../assets/images/loader.svg" />
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
                    My Recent Search {addressValue ? `(${addressValue})` : ''}
                  </h6>
                </div>
                <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                  <p className="page-out mb-0 text-center text-sm-end text-md-end text-lg-end">
                    {currentPageNo} out of {totalPage}
                  </p>
                </div>
              </div>
            </div>
            <div className="card-box bg-white-gradient pt-0">
              <div className="row">
                <div className="filter">
                  <div className="row">
                      <div className="col-12 col-sm-6 col-md-5 col-lg-5 col-xl-5">
                        <label>Search Log</label>
                        <div className="form-group">
                        <Select
                          name="property_type"
                          defaultValue=""
                          options={recentSearchedAddress}
                          onChange={(item) =>
                            setSearchLog(item)
                          }
                          className="select"
                          isClearable={true}
                          isSearchable={true}
                          isDisabled={false}
                          isLoading={false}
                          value={searchLog}
                          isRtl={false}
                          placeholder="Select Property Type"
                          closeMenuOnSelect={true}
                        />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-5 col-lg-5 col-xl-5">
                      <label>Status</label>
                        <Select
                          name="property_type"
                          defaultValue=""
                          options={dealStatus}
                          onChange={(item) =>
                            setStatus(item)
                          }
                          className="select"
                          isClearable={true}
                          isSearchable={true}
                          isDisabled={false}
                          isLoading={false}
                          value={status}
                          isRtl={false}
                          placeholder="Select Property Type"
                          closeMenuOnSelect={true}
                        />
                        
                      </div>
                      <div className="col-12 col-sm-2 col-md-2 col-lg-2 col-xl-2">
                        <label>&nbsp;</label>
                        <div className="form-group">
                          <button className="btn btn-primary" onClick={(e)=>{setIsFilter(!isFilter)}}>Submit</button>
                        </div>
                      </div>
                  </div>
                </div>
                <div className="col-12 col-lg-12">
                  {totalRecord == 0 ? (
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
export default LastSearchData;
