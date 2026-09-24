import React, { useState, useRef, useEffect } from "react";
import EditRequest from "../../modal/EditRequest";
import SentRequest from "../../modal/SentRequest";
import { useFormError } from "../../hooks/useFormError";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import BuyerCardResult from "./Section/BuyerCardResult";

const MyBuyersResult = ({
  buyerData,
  setBuyerData,
  checkSelectedDeals,
  activeTab,
  selectedDeals,
  handleCheckboxChange,
  setCurrentBuyerId,
  setCurrentBuyerUserId,
  setSendDealShow,
  user_data
}) => {
  const { setErrors } = useFormError();

  const [likeCount, setLikeCount] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [sentOpen, setSentOpen] = useState(false);
  const [buyerId, setBuyerId] = useState("");
  const {
    getTokenData,
    getLocalStorageUserdata,
    setLocalStorageUserdata,
    setLogout,
  } = useAuth();
  const ref = useRef(null);
  const handleClickEditFlag = (data, id) => {
    setBuyerId(id);
    if (data) {
      setSentOpen(true);
    } else {
      setEditOpen(true);
    }
  };

  const handleClickConfirmation = (id, index) => {
    let existingUser = getLocalStorageUserdata();
    let checkRemainingCredit = existingUser.credit_limit;
    Swal.fire({
      icon: "warning",
      title: "Do you want to view this record?",
      html: '<p className="popup-text-color">It will redeem one point from your account</p>',
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        unHideBuyer(id, index);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  async function unHideBuyer(id, index = "") {
    try {
      setIsLoader(true);
      document.body.classList.add("nonscroll");
      const creditLimit = document.querySelector(".credit_limit");
      const apiUrl = process.env.REACT_APP_API_URL;
      let headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      const response = await axios.post(
        apiUrl + "unhide-buyer",
        { buyer_id: id },
        { headers: headers }
      );
      if (response.data.status) {
        let CurrentBuyer = buyerData.filter((data) => {
          return data.id === id;
        });
        let purchaseBuyer = response.data.buyer;
        let newBuyerData = buyerData;
        newBuyerData[index] = purchaseBuyer;
        setBuyerData(newBuyerData);
        setLikeCount(likeCount + 1);
        const totalCredit = response.data.credit_limit;
        creditLimit.innerHTML = totalCredit;
        let existingUser = getLocalStorageUserdata();
        existingUser.credit_limit = totalCredit;
        setLocalStorageUserdata(existingUser); window.dispatchEvent(new Event("creditUpdated"));
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        Swal.fire("Success", "", "success");
        setIsLoader(false);
        document.body.classList.remove("nonscroll");
      } else {
        Swal.fire({
          icon: "error",
          title: "Sorry!",
          html: '<p className="popup-text-color">You Don`t have enough point to view this record</p><p className="popup-text-color">Please add more points</p>',
        });
        const totalCredit = response.data.credit_limit;
        creditLimit.innerHTML = totalCredit;
        let existingUser = getLocalStorageUserdata();
        existingUser.credit_limit = totalCredit;
        setLocalStorageUserdata(existingUser); window.dispatchEvent(new Event("creditUpdated"));
      }
      setIsLoader(false);
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
      <div
        className="tab-pane fade show active"
        id="pills-my-buyers"
        role="tabpanel"
        aria-labelledby="pills-my-buyers-tab"
      >
        <div className="property-critera">
          <div className="row">
            {isLoader ? (
              <div className="property_loder">
                <div className="data-loader">
                  <img
                    src="/assets/images/data-loader.svg"
                    className="m-0 w-100 h-100"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            {buyerData.length > 0 ? (
              <>
                {buyerData.map((data, index) => {
                  return (
                    <BuyerCardResult
                      checkSelectedDeals={checkSelectedDeals}
                      setCurrentBuyerId={setCurrentBuyerId}
                      setCurrentBuyerUserId={setCurrentBuyerUserId}
                      key={data.id}
                      data={data}
                      index={index}
                      activeTab={activeTab}
                      handleLikeClick={handleLikeClick}
                      handleDisikeClick={handleDisikeClick}
                      handleClickConfirmation={handleClickConfirmation}
                      handleClickEditFlag={handleClickEditFlag}
                      selectedDeals={selectedDeals}
                      handleCheckboxChange={handleCheckboxChange}
                      setSendDealShow={setSendDealShow}
                      user_data={user_data}
                    />
                  );
                })}
              </>
            ) : (
              <h2 className="mb-0 text-center">There are no buyers</h2>
            )}
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
    </>
  );
};
export default MyBuyersResult;
