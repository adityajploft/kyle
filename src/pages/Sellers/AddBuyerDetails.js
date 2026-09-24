import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import MultiSelect from "../../partials/Select2/MultiSelect";
import { useAuth } from "../../hooks/useAuth";
import Select from "react-select";
import { useFormError } from "../../hooks/useFormError";
import axios from "axios";
import MiniLoader from "../../partials/MiniLoader";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import UploadMultipleBuyers from "../../component/UploadMultipleBuyers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WatchVideo from "../../modal/WatchVideo";
import SocialShare from "../../modal/SocialShare";
import GoogleReCaptcha from "../../component/SocialLogin/GoogleReCaptcha";
import AdBanner from "../../component/AdBanner";
import { Button, Image, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import AddAddressAndRadius from "../../component/GoogleMapAutoAddress/index";

function AddBuyerDetails() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm();

  const phoneValue = watch("phone", "");
  const emailValue = watch("email", "");
  const [showAttachConfirmModal, setShowAttachConfirmModal] = useState(false);
  const [attachBuyerEmail, setAttachBuyerEmail] = useState("");
  const [attachBuyerMessage, setAttachBuyerMessage] = useState("");
  const [attachCheckboxChecked, setAttachCheckboxChecked] = useState(false);

  const { getTokenData, setLogout } = useAuth();
  const navigate = useNavigate();
  const [isLoader, setIsLoader] = useState(true);
  const [repCodeUrl, setRepCodeUrl] = useState('');
  const [repCode, setRepCode] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [openVideoModal, SetOpenVideoModal] = useState(false);
  const [openSocialShareModal, SetOpenSocialShareModal] = useState(false);
  const { setErrors, renderFieldError } = useFormError();

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState("");

  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoSubTitle, setVideoSubTitle] = useState("");
  const [isActiveVideo, setIsActiveVideo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState([]);
  const [radius, setRadius] = useState();
  const [purchaseMethodsOption, setPurchaseMethodsOption] = useState([]);
  const [buildingClassNamesOption, setBuildingClassNamesOption] = useState([]);
  const [propertyTypeOption, setPropertyTypeOption] = useState([]);
  const [parkingOption, setParkingOption] = useState([]);
  const [locationFlawsOption, setLocationFlawsOption] = useState([]);
  const [buyerTypeOption, setbuyerTypeOption] = useState([]);
  const [marketPreferanceOption, setMarketPreferanceOption] = useState([]);
  const [contactPreferanceOption, setContactPreferanceOption] = useState([]);
  const [zoningOption, setZoningOption] = useState([]);
  const [sewerOption, setSewerOption] = useState([]);
  const [utilitiesOption, setUtilitiesOption] = useState([]);

  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [parkOption, setParkOption] = useState([]);

  const [showCreativeFinancing, setShowCreativeFinancing] = useState(false);
  const [multiFamilyBuyerSelected, setMultiFamilyBuyerSelected] =
    useState(false);
  const [isLandSelected, setIsLandSelected] = useState(false);
  const [manufactureSelected, setManufacturedSelected] = useState(false);
  const [mobileHomeParkSelected, setMobileHomeParkSelected] = useState(false);
  const [hotelMotelSelected, setHotelMotelSelected] = useState(false);

  const [parkingValue, setParkingValue] = useState([]);
  const [parkingDefaultValue, setParkingDefaultValue] = useState([]);
  const [propertyTypeValue, setPropertyTypeValue] = useState([]);
  const [locationFlawsValue, setLocationFlawsValue] = useState([]);
  const [buyerTypeValue, setBuyerTypeValue] = useState([]);
  const [purchaseMethodsValue, setPurchaseMethodsValue] = useState([]);
  const [buildingClassNamesValue, setBuildingClassNamesValue] = useState([]);
  const [marketPreferanceValue, setMarketPreferanceValue] = useState([]);
  const [zoningValue, setZoningValue] = useState([]);
  const [stateValue, setStatevalue] = useState([]);
  const [cityValue, setCityvalue] = useState([]);

  /* min max value states start */
  const [bedRoomMin, setBedRoomMin] = useState("");
  const [bedRoomMax, setBedRoomMax] = useState("");
  const [bathMin, setBathMin] = useState("");
  const [bathMax, setBathMax] = useState("");
  const [sqFtMin, setSqFtMin] = useState("");
  const [sqFtMax, setSqFtMax] = useState("");
  const [lotSizesqFtMin, setlotSizesqFtMin] = useState("");
  const [lotSizesqFtMax, setlotSizesqFtMax] = useState("");
  const [storiesMin, setStoriesMin] = useState("");
  const [storiesMax, setStoriesMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  /* min max value states end */

  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [copySocialLoading, setCopySocialLoading] = useState(false);
  const [advertisementData, setAdvertisementData] = useState([]);
  const countryCode = process.env.REACT_APP_COUNTRY_CODE;
  const baseURL = window.location.origin;
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    getOptionsValues();
    getVideoUrl();
  }, [navigate /*authData*/]);

  const apiUrl = process.env.REACT_APP_API_URL;

  let headers = {
    Accept: "application/json",
    Authorization: "Bearer " + getTokenData().access_token,
    "auth-token": getTokenData().access_token,
  };
  const getOptionsValues = () => {
    try {
      axios
        .get(apiUrl + "single-buyer-form-details", {
          headers: headers,
        })
        .then((response) => {
          if (response.data.status) {
            let result = response.data.result;
            setPurchaseMethodsOption(result.purchase_methods);
            setBuildingClassNamesOption(result.building_class_values);
            setPropertyTypeOption(result.property_types);
            setLocationFlawsOption(result.location_flaws);
            setParkingOption(result.parking_values);
            setParkingDefaultValue(result.parking_values);
            setParkOption(result.park);
            setStateOptions(result.states);
            const selectedParkingValue = result.parking_values.map((item) => item.value);
            setValue('parking', selectedParkingValue)
            setParkingValue(selectedParkingValue);
            setbuyerTypeOption(result.buyer_types);
            setMarketPreferanceOption(result.market_preferances);
            setContactPreferanceOption(result.contact_preferances);
            setZoningOption(result.zonings);
            setSewerOption(result.sewers);
            setUtilitiesOption(result.utilities);
            setIsLoader(false);
          }
        });
    } catch {
      setLogout();
      navigate("/login");
    }
  };

  const getVideoUrl = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
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
        setIsActiveVideo(response.data.videoDetails.is_active);
        setVideoSubTitle(response.data.videoDetails.video.sub_title);
        setVideoUrl(videoLink);
        setVideoTitle(videoText);
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
  const getStates = (country_id) => {
    setCityOptions([]);
    if (country_id == null) {
      setCountry([]);
      setState([]);
      setCity([]);
      setStateOptions([]);
      setCityOptions([]);
    } else {
      axios
        .post(
          apiUrl + "getStates",
          { country_id: country_id },
          { headers: headers }
        )
        .then((response) => {
          let result = response.data.options;
          setCountry([]);
          setState([]);
          setCity([]);
          setCityOptions([]);
          setCountry(country_id);
          setStateOptions(result);
        });
    }
  };

  const getCities = (state_id) => {
    if (state_id == null) {
      setState([]);
      setCity([]);

      setCityOptions([]);
    } else {
      const selectedStates = state_id.map((item) => item.value);
      setStatevalue(selectedStates);
      axios
        .post(
          apiUrl + "getCities",
          { state_id: selectedStates, country_id: 233 },
          { headers: headers }
        )
        .then((response) => {
          let result = response.data.options;

          setState([]);
          setCity([]);

          setState(state_id);
          setCityOptions(result);
        });
    }
  };
  const submitSingleBuyerForm = async (data, e) => {
    e.preventDefault();

    setErrors(null);

    setLoading(true);

    setRecaptchaError("");
    if (!captchaVerified) {
      setLoading(false);
      setRecaptchaError("Please complete reCAPTCHA verification.");
      return false;
    }
    var data = new FormData(e.target);
    let formObject = Object.fromEntries(data.entries());
    formObject.parking = parkingValue;
    formObject.property_type = propertyTypeValue;
    formObject.property_flaw = locationFlawsValue;
    formObject.address = addressList;
    formObject.purchase_method = purchaseMethodsValue;
    if (formObject.hasOwnProperty("building_class")) {
      formObject.building_class = buildingClassNamesValue;
    }
    if (formObject.hasOwnProperty("zoning")) {
      formObject.zoning = zoningValue.length > 0 ? zoningValue : "";
    }

    if (formObject.hasOwnProperty("phone")) {
      let phoneNumber = formObject.phone.replace(/-/g, "");
      formObject.phone = phoneNumber;
    }
    console.log(formObject, "formObject")
    try {
      let response = await axios.post(
        apiUrl + "upload-single-buyer-details",
        formObject,
        { headers: headers }
      );
      if (response) {
        setLoading(false);
        if (response.data.status) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
          navigate("/login");
        }
        if (error.response.data.validation_errors) {
          setErrors(error.response.data.validation_errors);
        }
        if (error.response.data.errors) {
          setErrors(error.response.errors);
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  const handleCopyToClipBoard = (url) => {
    navigator.clipboard.writeText(url);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
    toast.success("Url Copied Successfully !", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };
  const copyAddBuyerLink = async () => {
    setCopyLoading(true);
    setGeneratedUrl("");
    try {
      let response = await axios.get(apiUrl + "copy-single-buyer-form-link", {
        headers: headers,
      });
      if (response.data.status) {
        let token = response.data.data.copy_token;
        let copyUrl = baseURL + "/add-buyer/" + token;
        navigator.clipboard.writeText(copyUrl);
        setGeneratedUrl(copyUrl);
        setCopySuccess(true);
        setCopyLoading(false);
        toast.success("Url Generated Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // setTimeout(() => {
        //   setCopySuccess(false);
        // }, 5000);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLogout();
        navigate("/login");
      } else {
        console.log(error);
        toast.error("An error occurred", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const copySocialShareLink = async () => {
    setCopySocialLoading(true);
    setGeneratedUrl("");
    try {
      let response = await axios.get(apiUrl + "copy-single-buyer-form-link", {
        headers: headers,
      });
      if (response.data.status) {
        let token = response.data.data.copy_token;
        let copyUrl = baseURL + "/seller/social-share-add-buyer/" + token;
        setGeneratedUrl(copyUrl);
        setCopySocialLoading(false);
      }
      SetOpenSocialShareModal(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLogout();
        navigate("/login");
      } else {
        console.log(error);
        toast.error("An error occurred", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  }
  const handleCustum = (e, name) => {
    let selectedValues = Array.isArray(e) ? e.map((x) => x.value) : [];
    if (name == "property_type") {
      selectedValues = [e.value];
      if (
        selectedValues.includes(2) ||
        selectedValues.includes(10) ||
        selectedValues.includes(11) ||
        selectedValues.includes(14) ||
        selectedValues.includes(15)
      ) {
        setMultiFamilyBuyerSelected(true);
      } else {
        setMultiFamilyBuyerSelected(false);
      }
      if (selectedValues.includes(7)) {
        setIsLandSelected(true);
      } else {
        setIsLandSelected(false);
      }
      if (selectedValues.includes(8)) {
        setManufacturedSelected(true);
      } else {
        setManufacturedSelected(false);
      }
      if (selectedValues.includes(14)) {
        setMobileHomeParkSelected(true);
      } else {
        setMobileHomeParkSelected(false);
      }
      if (selectedValues.includes(15)) {
        setHotelMotelSelected(true);
      } else {
        setHotelMotelSelected(false);
      }
      setPropertyTypeValue(selectedValues);
    } else if (name == "purchase_method") {
      if (selectedValues.includes(5)) {
        setShowCreativeFinancing(true);
      } else {
        setShowCreativeFinancing(false);
      }
      setPurchaseMethodsValue(selectedValues);
    } else if (name == "country") {
      getStates(e);
    } else if (name == "state") {
      setState(e);
      getCities([e]);
    } else if (name == "city") {
      setCity(e);
    } else if (name == "building_class") {
      setBuildingClassNamesValue(selectedValues);
    } else if (name == "parking") {
      setParkingValue(selectedValues);
      setParkingDefaultValue(e);
    } else if (name == "buyer_type") {
      let value = "";
      if (e) {
        value = parseInt(e);
      }
      setBuyerTypeValue(value);
    } else if (name == "start_date") {
      setStartDate(e);
      setEndDate("");
    } else if (name == "end_date") {
      setEndDate(e);
    } else if (name == "market_preferance") {
      setMarketPreferanceValue(e);
    } else if (name == "zoning") {
      setZoningValue(selectedValues);
    }
  };

  const handleOpenModal = () => {
    SetOpenVideoModal(true);
  };

  const handleCityChange = (event) => {
    let selectedValues = event.map((item) => item.value);
    setCityvalue(selectedValues);
    setCity(event);
  };
  const handleChangeErrorMessage = (field_name) => {
    if (field_name === "bedroom") {
      if (parseInt(bedRoomMax) >= parseInt(bedRoomMin)) {
        clearErrors(["bedroom_min", "bedroom_max"]);
      }
    } else if (field_name === "bath") {
      if (parseInt(bathMax) >= parseInt(bathMin)) {
        clearErrors(["bath_min", "bath_max"]);
      }
    } else if (field_name === "sqft") {
      if (parseInt(sqFtMax) >= parseInt(sqFtMin)) {
        clearErrors(["size_min", "size_max"]);
      }
    } else if (field_name === "lotsizesqft") {
      if (parseInt(lotSizesqFtMax) >= parseInt(lotSizesqFtMin)) {
        clearErrors(["lot_size_min", "lot_size_max"]);
      }
    } else if (field_name === "stories") {
      if (parseInt(storiesMax) >= parseInt(storiesMin)) {
        clearErrors(["stories_min", "stories_max"]);
      }
    } else if (field_name === "price") {
      if (parseInt(priceMax) >= parseInt(priceMin)) {
        clearErrors(["price_min", "price_max"]);
      }
    }
  };

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
        setRepCodeUrl(response.data.rep_code_apply_btn_link);
        setRepCode(response.data.referral_code);
      } catch (error) {
        console.log(error);
      }
    }
    getRepCodeDetail();
  }, []);

  useEffect(() => {
    const fetchAdvertisementBannerData = async () => {
      try {
        let headers = {
          Accept: "application/json",
          Authorization: "Bearer " + getTokenData().access_token,
          "auth-token": getTokenData().access_token,
        };

        let response = await axios.post(apiUrl + `banner/add-buyer-details`, {}, {
          headers: headers,
        });
        setAdvertisementData(response.data.data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchAdvertisementBannerData();
  }, [])

  const formatInput = (input) => {
    let cleaned = input.replace(/\D/g, "");

    return cleaned
      .substring(0, 10)
      .replace(/(\d{3})(\d{0,3})(\d{0,4})/, (_, g1, g2, g3) =>
        [g1, g2, g3].filter(Boolean).join("-")
      );
  };

  useEffect(() => {
    const formattedValue = formatInput(phoneValue);
    setValue("phone", formattedValue);
  }, [phoneValue, setValue]);


  let dataObj = {
    setState,
    setCity,
    setAddress,
    setAddressList,
    setZipCode,
    address,
    zipCode,
    city,
    state
  }

  const [generateREPShow, setGenerateREPShow] = useState(false);
  const handleGenerateREPClose = () => setGenerateREPShow(false);
  const handleGenerateREPShow = (isRefCode = false) => {
    if (isRefCode) {
      window.open(repCodeUrl, "_blank");
    } else {
      setGenerateREPShow(true);
    }
  };

  const handleCheckExistingBuyer = async (e) => {
    const isChecked = e.target.checked;
    setAttachCheckboxChecked(isChecked);

    if (isChecked && emailValue) {
      try {
        let formData = new FormData();
        formData.append("email", emailValue);
        formData.append("request_type", 1);

        let response = await axios.post(
          apiUrl + "attach-existing-buyer",
          formData,
          { headers: headers }
        );

        if (response.status === 200 && (response.data.status || response.data.status === "true")) {
          setAttachBuyerEmail(emailValue);
          if (response.data.message) {
            setAttachBuyerMessage(response.data.message);
          }
          setShowAttachConfirmModal(true);
        }
      } catch (error) {
        setAttachCheckboxChecked(false);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message, { position: toast.POSITION.TOP_RIGHT });
        } else if (error.response?.data?.error) {
          toast.error(error.response.data.error, { position: toast.POSITION.TOP_RIGHT });
        }
      }
    }
  };

  const handleConfirmAttachYes = async () => {
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("email", attachBuyerEmail);
      formData.append("request_type", 2);

      let response = await axios.post(
        apiUrl + "attach-existing-buyer",
        formData,
        { headers: headers }
      );
      if (response.status === 200 && response.data.status) {
        toast.success(response.data.message || "Buyer attached to your database successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setShowAttachConfirmModal(false);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message, { position: toast.POSITION.TOP_RIGHT });
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error, { position: toast.POSITION.TOP_RIGHT });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAttachNo = () => {
    setShowAttachConfirmModal(false);
    setAttachCheckboxChecked(false);
  };



  const handleCancelAttach = () => {
    setShowAttachConfirmModal(false);
    setAttachCheckboxChecked(false);
  };

  return (
    <>
      <Header />
      <section className="main-section position-relative pt-4 pb-120">
        {isLoader ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img src="../../../assets/images/loader.svg" />
          </div>
        ) : (
          <>
            <div className="container position-relative pat-40">
              <div className="back-block">
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
              <div className="card-box">
                <div className="row">
                  <div className="col-12 col-lg-8 w-70">
                    <div className="card-box-inner">
                      <div className="row Rep_code_Row">
                        <div className="col-12 col-md-12 col-xl-6">
                          <h3>Upload BuyBox Criteria</h3>
                          <p>Fill the below form OR send link to the buyer</p>
                        </div>
                        <div className="col-12 col-md-12 col-xl-6">
                          <div className="add_buyer-right">
                            <button className="share_btn" onClick={copySocialShareLink}>
                              <span className="link-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                  <path d="M13.8805 12.1076C13.0181 12.1076 12.2411 12.48 11.7018 13.0725L6.8512 10.0683C6.9807 9.73675 7.05252 9.37667 7.05252 8.99998C7.05252 8.62315 6.9807 8.26308 6.8512 7.9317L11.7018 4.92736C12.2411 5.51979 13.0181 5.89237 13.8805 5.89237C15.5051 5.89237 16.8268 4.57072 16.8268 2.94612C16.8268 1.32152 15.5051 0 13.8805 0C12.2559 0 10.9343 1.32165 10.9343 2.94625C10.9343 3.32295 11.0062 3.68302 11.1356 4.01453L6.28513 7.01874C5.74584 6.4263 4.96883 6.05373 4.10641 6.05373C2.48181 6.05373 1.16016 7.37552 1.16016 8.99998C1.16016 10.6246 2.48181 11.9462 4.10641 11.9462C4.96883 11.9462 5.74584 11.5738 6.28513 10.9812L11.1356 13.9854C11.0062 14.3169 10.9343 14.677 10.9343 15.0538C10.9343 16.6783 12.2559 18 13.8805 18C15.5051 18 16.8268 16.6783 16.8268 15.0538C16.8268 13.4292 15.5051 12.1076 13.8805 12.1076ZM12.0086 2.94625C12.0086 1.91409 12.8483 1.07432 13.8805 1.07432C14.9127 1.07432 15.7524 1.91409 15.7524 2.94625C15.7524 3.97842 14.9127 4.81818 13.8805 4.81818C12.8483 4.81818 12.0086 3.97842 12.0086 2.94625ZM4.10641 10.8719C3.07411 10.8719 2.23434 10.0321 2.23434 8.99998C2.23434 7.96782 3.07411 7.12805 4.10641 7.12805C5.13857 7.12805 5.9782 7.96782 5.9782 8.99998C5.9782 10.0321 5.13857 10.8719 4.10641 10.8719ZM12.0086 15.0537C12.0086 14.0215 12.8483 13.1818 13.8805 13.1818C14.9127 13.1818 15.7524 14.0215 15.7524 15.0537C15.7524 16.0859 14.9127 16.9256 13.8805 16.9256C12.8483 16.9256 12.0086 16.0859 12.0086 15.0537Z" fill="#121639" />
                                </svg>
                              </span>
                              Share {copySocialLoading ? <MiniLoader /> : ""}
                            </button>
                          </div>
                        </div>
                      </div>
                      {copySuccess && generatedUrl != "" ? (
                        <div id="inviteCode" className="invite-page">
                          <input id="link" value={generatedUrl} readOnly />
                          <div id="copy">
                            <i
                              className="fa-solid fa-copy"
                              aria-hidden="true"
                              data-copytarget="#link"
                              onClick={() =>
                                handleCopyToClipBoard(generatedUrl)
                              }
                            ></i>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <form method="post" onSubmit={handleSubmit(submitSingleBuyerForm)}>
                        <div className="card-box-blocks">
                          <div className="row">
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                              <label>First Name<span>*</span></label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="first_name"
                                  className="form-control"
                                  placeholder="Enter First Name"
                                  {...register("first_name", {
                                    required: "First Name is required",
                                    validate: {
                                      maxLength: (v) =>
                                        v.length <= 50 ||
                                        "The First Name should have at most 50 characters",
                                      matchPattern: (v) =>
                                        /^[a-zA-Z\s]+$/.test(v) ||
                                        "First Name can not include number or special character",
                                    },
                                  })}
                                />
                                {errors.first_name && (
                                  <p className="error">
                                    {errors.first_name?.message}
                                  </p>
                                )}
                                {renderFieldError("first_name")}
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                              <label>Last Name<span>*</span>
                              </label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="last_name"
                                  className="form-control"
                                  placeholder="Enter Last Name"
                                  {...register("last_name", {
                                    required: "Last Name is required",
                                    validate: {
                                      maxLength: (v) =>
                                        v.length <= 50 ||
                                        "The Last Name should have at most 50 characters",
                                      matchPattern: (v) =>
                                        /^[a-zA-Z\s]+$/.test(v) ||
                                        "Last Name can not include number or special character",
                                    },
                                  })}
                                />

                                {errors.last_name && (
                                  <p className="error">
                                    {errors.last_name?.message}
                                  </p>
                                )}
                                {renderFieldError("last_name")}
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                              <label>
                                Email Address<span>*</span>
                              </label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="email"
                                  className="form-control"
                                  placeholder="Enter Email Address"
                                  {...register("email", {
                                    required: "Email address is required",
                                    validate: {
                                      maxLength: (v) =>
                                        v.length <= 50 ||
                                        "The Email address should have at most 50 characters",
                                      matchPattern: (v) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                                          v
                                        ) ||
                                        "Email address must be a valid address",
                                    },
                                  })}
                                />
                                {errors.email && (
                                  <p className="error">
                                    {errors.email?.message}
                                  </p>
                                )}
                                {renderFieldError("email")}
                              </div>
                              {emailValue && (
                                <div className="form-group mt-2">
                                  <label className="d-flex align-items-center" style={{ fontWeight: "normal", gap: "8px", textTransform: "none" }}>
                                    <input
                                      type="checkbox"
                                      checked={attachCheckboxChecked}
                                      onChange={handleCheckExistingBuyer}
                                      style={{ width: "16px", height: "16px", flexShrink: 0 }}
                                    />
                                    Check if email is already registered and attach to my database
                                  </label>
                                </div>
                              )}
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                              <input type="hidden" name="country_code" value={countryCode} />
                              <label>
                                Phone Number<span>*</span>
                              </label>
                              <div className="form-group">
                                <div className="form-group-inner">
                                  <span className="form-icon verification_count">(+{countryCode})</span>
                                  <input
                                    type="text"
                                    name="phone"
                                    className="form-control verification_input"
                                    placeholder="Eg. 123-456-7890"
                                    {...register("phone", {
                                      required: "Phone Number is required",
                                      validate: {
                                        matchPattern: (v) =>
                                          /^[0-9-]*$/.test(v) || "Please enter a valid phone number",
                                        maxLength: (v) =>
                                          (v.length <= 13 && v.length >= 1) ||
                                          "The phone number should be between 1 to 10 characters",
                                      },
                                    })}
                                  />
                                </div>
                                {errors.phone && (
                                  <p className="error">
                                    {errors.phone?.message}
                                  </p>
                                )}
                                {renderFieldError("phone")}
                              </div>
                            </div>
                             {/* <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                              <label>REP CODE<span></span></label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="rep_code"
                                  className="form-control"
                                  placeholder="Enter REP Code"
                                  {...register("rep_code", {
                                    required: "REP Code is required",
                                    // validate: {
                                    //   maxLength: (v) =>
                                    //     v.length <= 50 ||
                                    //     "The First Name should have at most 50 characters",
                                    //   matchPattern: (v) =>
                                    //     /^[a-zA-Z\s]+$/.test(v) ||
                                    //     "First Name can not include number or special character",
                                    // },
                                  })}
                                />
                                {errors.rep_code && (
                                  <p className="error">
                                    {errors.rep_code?.message}
                                  </p>
                                )}
                                {renderFieldError("rep_code")}
                              </div>
                            </div> */}
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                              <label>
                                Company/LLC
                              </label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="company_name"
                                  placeholder="Company LLC"
                                />
                                {renderFieldError("company_name")}
                              </div>
                            </div>

                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                              <label>
                                Contact Preference <span>*</span>
                              </label>
                              <div className="form-group">
                                <Controller
                                  control={control}
                                  name="contact_preferance"
                                  rules={{
                                    required: "Contact Preference is required",
                                  }}
                                  render={({
                                    field: { value, onChange, name },
                                  }) => (
                                    <Select
                                      options={contactPreferanceOption}
                                      name={name}
                                      className="select"
                                      placeholder="Select Contact Preference"
                                      isClearable={true}
                                      onChange={(e) => {
                                        onChange(e);
                                        handleCustum(e, "contact_preferance");
                                      }}
                                    />
                                  )}
                                />
                                {errors.contact_preferance && (
                                  <p className="error">
                                    {errors.contact_preferance?.message}
                                  </p>
                                )}
                                {renderFieldError("contact_preferance")}
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                              <label>
                                Buyer Type<span>*</span>
                              </label>
                              <div className="form-group">
                                <Controller
                                  control={control}
                                  name="buyer_type"
                                  rules={{ required: "Buyer Type is required" }}
                                  render={({
                                    field: { value, onChange, name },
                                  }) => (
                                    <Select
                                      options={buyerTypeOption}
                                      className="select"
                                      name={name}
                                      placeholder="Select Buyer Type"
                                      setMultiselectOption={setBuyerTypeValue}
                                      onChange={(e) => {
                                        onChange(e);
                                        handleCustum(e, "buyer_type");
                                      }}
                                    />
                                  )}
                                />
                                {errors.buyer_type && (
                                  <p className="error">
                                    {errors.buyer_type?.message}
                                  </p>
                                )}

                                {renderFieldError("buyer_type")}
                              </div>
                            </div>
                            <AddAddressAndRadius address={address} setAddress={setAddress} latitude={latitude} setLatitude={setLatitude} longitude={longitude} setLongitude={setLongitude} radius={radius} setRadius={setRadius} addressList={addressList} setAddressList={setAddressList} hideRadius={false} />
                            <input
                              type="hidden"
                              name="latitude"
                              className="form-control"
                              placeholder="Latitude"
                              value={latitude ?? ''}
                            />

                            <input
                              type="hidden"
                              name="longitude"
                              className="form-control"
                              placeholder="Longitude"
                              value={longitude ?? ""}
                            />

                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <label>
                                MLS Status<span>*</span>
                              </label>
                              <div className="form-group">
                                <Controller
                                  control={control}
                                  name="market_preferance"
                                  rules={{ required: "MLS status is required" }}
                                  render={({
                                    field: { value, onChange, name },
                                  }) => (
                                    <Select
                                      options={marketPreferanceOption}
                                      name={name}
                                      className="select"
                                      placeholder="Select MLS Status"
                                      isClearable={true}
                                      onChange={(e) => {
                                        onChange(e);
                                        handleCustum(e, "market_preferance");
                                      }}
                                    />
                                  )}
                                />
                                {errors.market_preferance && (
                                  <p className="error">
                                    {errors.market_preferance?.message}
                                  </p>
                                )}

                                {renderFieldError("market_preferance")}
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                              <label>REP Code </label>
                              <div className="form-group">
                                <div className="form-group-inner position-relative">
                                  <input
                                    type="text"
                                    className="form-control ps-5"
                                    name="rep_code"
                                    placeholder="Enter REP Code"
                                    {...register("rep_code")}
                                  />
                                </div>
                                {renderFieldError("rep_code")}
                              </div>
                            </div>
                            <div className="col-12 col-lg-12">
                              <label>
                                Parking (multi-select)<span>*</span>
                              </label>
                              <div className="form-group">
                                <Controller
                                  control={control}
                                  name="parking"
                                  className="select"
                                  rules={{ required: "Parking is required" }}
                                  render={({
                                    field: { value, onChange, name },
                                  }) => (
                                    <Select
                                      value={parkingDefaultValue}
                                      options={parkingOption}
                                      name={name}
                                      className="select"
                                      placeholder="Select parking"
                                      setMultiselectOption={setParkingValue}
                                      onChange={(e) => {
                                        onChange(e);
                                        handleCustum(e, "parking");
                                      }}
                                      isMulti
                                    />
                                  )}
                                />
                                {errors.parking && (
                                  <p className="error">
                                    {errors.parking?.message}
                                  </p>
                                )}

                                {renderFieldError("parking")}
                              </div>
                            </div>
                            <div className="col-12 col-lg-12">
                              <div className="form-group">
                                <label>
                                  Property Type<span>*</span>
                                </label>
                                <div className="form-group">
                                  <Controller
                                    control={control}
                                    name="property_type"
                                    rules={{
                                      required: "Property Type is required",
                                    }}
                                    render={({
                                      field: { value, onChange, name },
                                    }) => (
                                      <Select
                                        options={propertyTypeOption}
                                        name={name}
                                        className="select"
                                        placeholder="Select Property Type"
                                        setMultiselectOption={
                                          setPropertyTypeValue
                                        }
                                        showCreative={
                                          setMultiFamilyBuyerSelected
                                        }
                                        onChange={(e) => {
                                          onChange(e);
                                          handleCustum(e, "property_type");
                                        }}
                                        // isMulti
                                        closeMenuOnSelect={true}
                                      />
                                    )}
                                  />
                                  {errors.property_type && (
                                    <p className="error">
                                      {errors.property_type?.message}
                                    </p>
                                  )}

                                  {renderFieldError("property_type")}
                                </div>
                              </div>
                            </div>
                            {isLandSelected && (
                              <div className="block-divide">
                                <div className="row">
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                                    <label>
                                      Zoning (multi-select)<span>*</span>
                                    </label>
                                    <div className="form-group">
                                      <Controller
                                        control={control}
                                        name="zoning"
                                        rules={{
                                          required: "Zoning is required",
                                        }}
                                        render={({
                                          field: { value, onChange, name },
                                        }) => (
                                          <Select
                                            options={zoningOption}
                                            name={name}
                                            className="select"
                                            placeholder="Select zoning"
                                            onChange={(e) => {
                                              onChange(e);
                                              handleCustum(e, "zoning");
                                            }}
                                            closeMenuOnSelect={false}
                                            isMulti
                                          />
                                        )}
                                      />
                                      {errors.zoning && (
                                        <p className="error">
                                          {errors.zoning?.message}
                                        </p>
                                      )}
                                      {renderFieldError("zoning")}
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                                    <label>
                                      Utilities <span>*</span>
                                    </label>
                                    <div className="form-group">

                                      <Controller
                                        control={control}
                                        name="utilities"
                                        rules={{
                                          required: "Utilities is required",
                                        }}
                                        render={({
                                          field: { value, onChange, name },
                                        }) => (
                                          <Select
                                            options={utilitiesOption}
                                            name={name}
                                            className="select"
                                            placeholder="Select Utilities"
                                            onChange={(e) => {
                                              onChange(e);
                                              handleCustum(e, "utilities");
                                            }}
                                            closeMenuOnSelect={false}
                                          />
                                        )}
                                      />
                                      {errors.utilities && (
                                        <p className="error">
                                          {errors.utilities?.message}
                                        </p>
                                      )}
                                      {renderFieldError("utilities")}
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                                    <label>
                                      Sewage <span>*</span>
                                    </label>
                                    <div className="form-group">

                                      <Controller
                                        control={control}
                                        name="sewer"
                                        rules={{
                                          required: "Sewage is required",
                                        }}
                                        render={({
                                          field: { value, onChange, name },
                                        }) => (
                                          <Select
                                            options={sewerOption}
                                            name={name}
                                            className="select"
                                            placeholder="Select Sewage"
                                            onChange={(e) => {
                                              onChange(e);
                                              handleCustum(e, "sewer");
                                            }}
                                            closeMenuOnSelect={false}
                                          />
                                        )}
                                      />
                                      {errors.sewer && (
                                        <p className="error">
                                          {errors.sewer?.message}
                                        </p>
                                      )}
                                      {renderFieldError("sewer")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {multiFamilyBuyerSelected && (
                              <div className="block-divide">
                                <div className="row">
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <label>
                                      Minimum Units<span>*</span>
                                    </label>
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="unit_min"
                                        className="form-control"
                                        placeholder="Minimum Units"
                                        {...register("unit_min", {
                                          required: "Minimum Units is required",
                                          validate: {
                                            matchPattern: (v) =>
                                              /^[0-9]\d*$/.test(v) ||
                                              "Please enter valid number",
                                            maxLength: (v) =>
                                              v.length <= 10 ||
                                              "The digit should be less than equal 10",
                                          },
                                        })}
                                      />
                                      {errors.unit_min && (
                                        <p className="error">
                                          {errors.unit_min?.message}
                                        </p>
                                      )}

                                      {renderFieldError("unit_min")}
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <label>
                                      Maximum Units<span>*</span>
                                    </label>
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="unit_max"
                                        className="form-control"
                                        placeholder="Maximum Units"
                                        {...register("unit_max", {
                                          required: "Maximum Units is required",
                                          validate: {
                                            matchPattern: (v) =>
                                              /^[0-9]\d*$/.test(v) ||
                                              "Please enter valid number",
                                            maxLength: (v) =>
                                              v.length <= 10 ||
                                              "The digit should be less than equal 10",
                                          },
                                        })}
                                      />
                                      {errors.unit_max && (
                                        <p className="error">
                                          {errors.unit_max?.message}
                                        </p>
                                      )}
                                      {renderFieldError("unit_max")}
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <label>
                                      Building class (multi-select)<span>*</span>
                                    </label>
                                    <div className="form-group">

                                      <Controller
                                        control={control}
                                        name="building_class"
                                        rules={{
                                          required:
                                            "Building class is required",
                                        }}
                                        render={({
                                          field: { value, onChange, name },
                                        }) => (
                                          <Select
                                            options={buildingClassNamesOption}
                                            name={name}
                                            className="select"
                                            placeholder="Select Building class"
                                            onChange={(e) => {
                                              onChange(e);
                                              handleCustum(e, "building_class");
                                            }}
                                            closeMenuOnSelect={false}
                                            isMulti
                                          />
                                        )}
                                      />
                                      {errors.building_class && (
                                        <p className="error">
                                          {errors.building_class?.message}
                                        </p>
                                      )}
                                      {renderFieldError("building_class")}
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-12 col-lg-3">
                                    <label>
                                      Value Add<span>*</span>
                                    </label>
                                    <div className="form-group">
                                      <div className="radio-block">
                                        <div className="label-container">
                                          <input
                                            type="radio"
                                            name="value_add"
                                            value="1"
                                            id="value_add_yes"
                                            {...register("value_add", {
                                              required: "Value Add is required",
                                            })}
                                          />
                                          <label
                                            className="mb-0"
                                            htmlFor="value_add_yes"
                                          >
                                            Yes
                                          </label>
                                        </div>
                                        <div className="label-container">
                                          <input
                                            type="radio"
                                            name="value_add"
                                            value="0"
                                            id="value_add_no"
                                            {...register("value_add", {
                                              required: "Value Add is required",
                                            })}
                                          />
                                          <label
                                            className="mb-0"
                                            htmlFor="value_add_no"
                                          >
                                            No
                                          </label>
                                        </div>
                                      </div>
                                      {errors.value_add && (
                                        <p className="error">
                                          {errors.value_add?.message}
                                        </p>
                                      )}
                                      {renderFieldError("value_add")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="col-12 col-lg-12">
                              <label>
                                Purchase Method (multi-select)<span>*</span>
                              </label>
                              <div className="form-group">


                                <Controller
                                  control={control}
                                  name="purchase_method"
                                  rules={{
                                    required: "Purchase Method is required",
                                  }}
                                  render={({
                                    field: { value, onChange, name },
                                  }) => (
                                    <Select
                                      options={purchaseMethodsOption}
                                      name={name}
                                      className="select"
                                      placeholder="Select Purchase Method"
                                      setMultiselectOption={
                                        setPurchaseMethodsValue
                                      }
                                      showCreative={setShowCreativeFinancing}
                                      onChange={(e) => {
                                        onChange(e);
                                        handleCustum(e, "purchase_method");
                                      }}
                                      closeMenuOnSelect={false}
                                      isMulti
                                    />
                                  )}
                                />
                                {errors.purchase_method && (
                                  <p className="error">
                                    {errors.purchase_method?.message}
                                  </p>
                                )}

                                {renderFieldError("purchase_method")}
                              </div>
                            </div>

                            {showCreativeFinancing && (
                              <div className="block-divide">
                                <h5>Creative Financing</h5>
                                <div className="row">
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <label>
                                      Down Payment (%) <span>*</span>
                                    </label>
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="max_down_payment_percentage"
                                        className="form-control"
                                        placeholder="Down Payment (%)"
                                        {...register(
                                          "max_down_payment_percentage",
                                          {
                                            required:
                                              "Down Payment (%) is required",
                                            validate: {
                                              matchPattern: (v) =>
                                                /^[0-9]\d*$/.test(v) ||
                                                "Please enter valid Down Payment (%)",
                                              maxLength: (v) =>
                                                (v.length <= 15 &&
                                                  v.length >= 1) ||
                                                "The Down Payment (%) should be more than 1 digit and less than equal 15",
                                            },
                                          }
                                        )}
                                      />
                                      {errors.max_down_payment_percentage && (
                                        <p className="error">
                                          {
                                            errors.max_down_payment_percentage
                                              ?.message
                                          }
                                        </p>
                                      )}
                                      {renderFieldError(
                                        "max_down_payment_percentage"
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <label>
                                      Down Payment ($)<span>*</span>
                                    </label>
                                    <div className="form-group">
                                      <input
                                        type="text"
                                        name="max_down_payment_money"
                                        className="form-control"
                                        placeholder="Down Payment ($)"
                                        {...register("max_down_payment_money", {
                                          required:
                                            "Down Payment ($) is required",
                                          validate: {
                                            matchPattern: (v) =>
                                              /^[0-9]\d*$/.test(v) ||
                                              "Please enter valid Down Payment ($)",
                                            maxLength: (v) =>
                                              (v.length <= 15 &&
                                                v.length >= 1) ||
                                              "The Down Payment ($) should be more than 1 digit and less than equal 15",
                                          },
                                        })}
                                      />
                                      {errors.max_down_payment_money && (
                                        <p className="error">
                                          {
                                            errors.max_down_payment_money
                                              ?.message
                                          }
                                        </p>
                                      )}
                                      {renderFieldError(
                                        "max_down_payment_money"
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <label>
                                      Interest Rate (%)<span>*</span>
                                    </label>
                                    <div className="form-group">
                                      <input
                                        type="number"
                                        name="max_interest_rate"
                                        className="form-control"
                                        placeholder="Interest Rate (%)"
                                        {...register("max_interest_rate", {
                                          required:
                                            "Interest Rate (%) is required",
                                          validate: {
                                            matchPattern: (v) =>
                                              /^[0-9]\d*$/.test(v) ||
                                              "Please enter valid Interest Rate (%)",
                                            maxLength: (v) =>
                                              (v.length <= 15 &&
                                                v.length >= 1) ||
                                              "The Interest Rate (%) should be more than 1 digit and less than equal 15",
                                          },
                                        })}
                                      />
                                      {errors.max_interest_rate && (
                                        <p className="error">
                                          {errors.max_interest_rate?.message}
                                        </p>
                                      )}
                                      {renderFieldError("max_interest_rate")}
                                    </div>
                                  </div>
                                  <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                    <label>
                                      Balloon Payment <span>*</span>
                                    </label>
                                    <div className="form-group">
                                      <div className="radio-block">
                                        <div className="label-container">
                                          <input
                                            type="radio"
                                            name="balloon_payment"
                                            value="1"
                                            id="balloon_payment_yes"
                                            {...register("balloon_payment", {
                                              required:
                                                "Balloon Payment is required",
                                            })}
                                          />
                                          <label
                                            className="mb-0"
                                            htmlFor="balloon_payment_yes"
                                          >
                                            Yes
                                          </label>
                                        </div>
                                        <div className="label-container">
                                          <input
                                            type="radio"
                                            name="balloon_payment"
                                            value="0"
                                            id="balloon_payment_no"
                                            {...register("balloon_payment", {
                                              required:
                                                "Balloon Payment is required",
                                            })}
                                          />
                                          <label
                                            className="mb-0"
                                            htmlFor="balloon_payment_no"
                                          >
                                            No
                                          </label>
                                        </div>
                                      </div>
                                      {errors.balloon_payment && (
                                        <p className="error">
                                          {errors.balloon_payment?.message}
                                        </p>
                                      )}
                                      {renderFieldError("balloon_payment")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {!mobileHomeParkSelected && !hotelMotelSelected && (
                              <>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Bedroom (min)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="bedroom_min"
                                      className="form-control"
                                      placeholder="Bedroom (min)"
                                      {...register("bedroom_min", {
                                        onChange: (e) => {
                                          setBedRoomMin(e.target.value);
                                        },
                                        required: "Bedroom (min) is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          maxLength: (v) =>
                                            v.length <= 10 ||
                                            "The digit should be less than equal 10",
                                          positiveNumber: (v) =>
                                            parseFloat(v) <= bedRoomMax ||
                                            "The Bedroom (min) should be less than or equal Bedroom (max)",
                                        },
                                      })}
                                      onKeyUp={() => {
                                        handleChangeErrorMessage("bedroom");
                                      }}
                                    />
                                    {errors.bedroom_min && (
                                      <p className="error">
                                        {errors.bedroom_min?.message}
                                      </p>
                                    )}

                                    {renderFieldError("bedroom_min")}
                                  </div>
                                </div>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Bedroom (max)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="bedroom_max"
                                      className="form-control"
                                      placeholder="Bedroom (max)"
                                      {...register("bedroom_max", {
                                        onChange: (e) => {
                                          setBedRoomMax(e.target.value);
                                        },
                                        required: "Bedroom (max) is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          maxLength: (v) =>
                                            v.length <= 10 ||
                                            "The digit should be less than equal 10",
                                          positiveNumber: (v) =>
                                            parseFloat(v) >= bedRoomMin ||
                                            "The Bedroom (max) should be greater than or equal Bedroom (min)",
                                        },
                                      })}
                                      onKeyUp={() => {
                                        handleChangeErrorMessage("bedroom");
                                      }}
                                    />
                                    {errors.bedroom_max && (
                                      <p className="error">
                                        {errors.bedroom_max?.message}
                                      </p>
                                    )}

                                    {renderFieldError("bedroom_max")}
                                  </div>
                                </div>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Bath (min)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="bath_min"
                                      className="form-control"
                                      placeholder="Bath (min)"
                                      {...register("bath_min", {
                                        onChange: (e) => {
                                          setBathMin(e.target.value);
                                        },
                                        required: "Bath (min) is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          maxLength: (v) =>
                                            v.length <= 10 ||
                                            "The digit should be less than equal 10",
                                          positiveNumber: (v) =>
                                            parseFloat(v) <= bathMax ||
                                            "The Bath (min) should be less than or equal Bath (max)",
                                        },
                                      })}
                                      onKeyUp={() => {
                                        handleChangeErrorMessage("bath");
                                      }}
                                    />
                                    {errors.bath_min && (
                                      <p className="error">
                                        {errors.bath_min?.message}
                                      </p>
                                    )}
                                    {renderFieldError("bath_min")}
                                  </div>
                                </div>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Bath (max)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="bath_max"
                                      className="form-control"
                                      placeholder="Bath (max)"
                                      {...register("bath_max", {
                                        onChange: (e) => {
                                          setBathMax(e.target.value);
                                        },
                                        required: "Bath (max) is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          maxLength: (v) =>
                                            v.length <= 10 ||
                                            "The digit should be less than equal 10",
                                          positiveNumber: (v) =>
                                            parseFloat(v) >= bathMin ||
                                            "The Bath (max) should be greater than or equal Bath (min)",
                                        },
                                      })}
                                      onKeyUp={() => {
                                        handleChangeErrorMessage("bath");
                                      }}
                                    />
                                    {errors.bath_max && (
                                      <p className="error">
                                        {errors.bath_max?.message}
                                      </p>
                                    )}

                                    {renderFieldError("bath_max")}
                                  </div>
                                </div>
                              </>
                            )}
                            {!mobileHomeParkSelected && (
                              <>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Sq Ft Min<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="size_min"
                                      className="form-control"
                                      placeholder="Sq Ft Min"
                                      {...register("size_min", {
                                        onChange: (e) => {
                                          setSqFtMin(e.target.value);
                                        },
                                        required: "Sq Ft Min is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          maxLength: (v) =>
                                            v.length <= 10 ||
                                            "The digit should be less than equal 10",
                                          positiveNumber: (v) =>
                                            parseFloat(v) <= sqFtMin ||
                                            "The Sq Ft (min) should be less than or equal Sq Ft (max)",
                                        },
                                      })}
                                      onKeyUp={() => {
                                        handleChangeErrorMessage("sqft");
                                      }}
                                    />
                                    {errors.size_min && (
                                      <p className="error">
                                        {errors.size_min?.message}
                                      </p>
                                    )}

                                    {renderFieldError("size_min")}
                                  </div>
                                </div>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Sq Ft Max<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="size_max"
                                      className="form-control"
                                      placeholder="Sq Ft Max"
                                      {...register("size_max", {
                                        onChange: (e) => {
                                          setSqFtMax(e.target.value);
                                        },
                                        required: "Sq Ft Max is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          maxLength: (v) =>
                                            v.length <= 10 ||
                                            "The digit should be less than equal 10",
                                          positiveNumber: (v) =>
                                            parseFloat(v) >= sqFtMin ||
                                            "The Sq Ft (max) should be greater than or equal Sq Ft (min)",
                                        },
                                      })}
                                      onKeyUp={() => {
                                        handleChangeErrorMessage("sqft");
                                      }}
                                    />
                                    {errors.size_max && (
                                      <p className="error">
                                        {errors.size_max?.message}
                                      </p>
                                    )}

                                    {renderFieldError("size_max")}
                                  </div>
                                </div>
                              </>
                            )}
                            {hotelMotelSelected && (
                              <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                <label>
                                  Rooms <span>*</span>
                                </label>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    name="rooms"
                                    className="form-control"
                                    placeholder="Rooms"
                                    {...register("rooms", {
                                      onChange: (e) => {
                                        setlotSizesqFtMin(e.target.value);
                                      },
                                      required: "Rooms is required",
                                      validate: {
                                        matchPattern: (v) =>
                                          /^[0-9]\d*$/.test(v) ||
                                          "Please enter valid number",
                                      },
                                    })}
                                  />
                                  {errors.rooms && (
                                    <p className="error">
                                      {errors.rooms?.message}
                                    </p>
                                  )}
                                  {renderFieldError("rooms")}
                                </div>
                              </div>
                            )}
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                              <label>
                                Lot Size Sq Ft (min)<span>*</span>
                              </label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="lot_size_min"
                                  className="form-control"
                                  placeholder="Lot Size Sq Ft (min)"
                                  {...register("lot_size_min", {
                                    onChange: (e) => {
                                      setlotSizesqFtMin(e.target.value);
                                    },
                                    required:
                                      "Lot Size Sq Ft (min) is required",
                                    validate: {
                                      matchPattern: (v) =>
                                        /^[0-9]\d*$/.test(v) ||
                                        "Please enter valid number",
                                      maxLength: (v) =>
                                        v.length <= 10 ||
                                        "The digit should be less than equal 10",
                                      positiveNumber: (v) =>
                                        parseFloat(v) <= lotSizesqFtMax ||
                                        "The Lot Size Sq Ft (min) should be less than or equal Lot Size Sq Ft (max)",
                                    },
                                  })}
                                  onKeyUp={() => {
                                    handleChangeErrorMessage("lotsizesqft");
                                  }}
                                />
                                {errors.lot_size_min && (
                                  <p className="error">
                                    {errors.lot_size_min?.message}
                                  </p>
                                )}

                                {renderFieldError("lot_size_min")}
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                              <label>
                                Lot Size Sq Ft (max)<span>*</span>
                              </label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="lot_size_max"
                                  className="form-control"
                                  placeholder="Lot Size Sq Ft (max)"
                                  {...register("lot_size_max", {
                                    onChange: (e) => {
                                      setlotSizesqFtMax(e.target.value);
                                    },
                                    required:
                                      "Lot Size Sq Ft (max) is required",
                                    validate: {
                                      matchPattern: (v) =>
                                        /^[0-9]\d*$/.test(v) ||
                                        "Please enter valid number",
                                      maxLength: (v) =>
                                        v.length <= 10 ||
                                        "The digit should be less than equal 10",
                                      positiveNumber: (v) =>
                                        parseFloat(v) >= lotSizesqFtMin ||
                                        "The Lot Size Sq Ft (max) should be greater than or equal Lot Size Sq Ft (min)",
                                    },
                                  })}
                                  onKeyUp={() => {
                                    handleChangeErrorMessage("lotsizesqft");
                                  }}
                                />
                                {errors.lot_size_max && (
                                  <p className="error">
                                    {errors.lot_size_max?.message}
                                  </p>
                                )}

                                {renderFieldError("lot_size_max")}
                              </div>
                            </div>
                            {!mobileHomeParkSelected && (
                              <>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Year Built (min)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <Controller
                                      control={control}
                                      name="build_year_min"
                                      rules={{
                                        required:
                                          "Year Built (min) is required",
                                      }}
                                      render={({
                                        field: { value, onChange, name },
                                      }) => (
                                        <DatePicker
                                          id="DatePicker"
                                          type="string"
                                          maxDate={new Date()}
                                          className="text-primary text-center form-control"
                                          selected={startDate}
                                          placeholderText="Year Built (Min)"
                                          name="build_year_min"
                                          autoComplete="off"
                                          onChange={(e) => {
                                            onChange(e);
                                            handleCustum(e, "start_date");
                                          }}
                                          showYearPicker
                                          dateFormat="yyyy"
                                          yearItemNumber={9}
                                        />
                                      )}
                                    />
                                    {errors.build_year_min && (
                                      <p className="error">
                                        {errors.build_year_min?.message}
                                      </p>
                                    )}

                                    {renderFieldError("build_year_min")}
                                  </div>
                                </div>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Year Built (max)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <Controller
                                      control={control}
                                      name="build_year_max"
                                      rules={{
                                        required:
                                          "Year Built (max) is required",
                                      }}
                                      render={({
                                        field: { value, onChange, name },
                                      }) => (
                                        <DatePicker
                                          minDate={startDate}
                                          maxDate={new Date()}
                                          id="DatePicker"
                                          type="string"
                                          className="text-primary text-center form-control"
                                          selected={endDate}
                                          name="build_year_max"
                                          placeholderText="Year Built (Max)"
                                          autoComplete="off"
                                          onChange={(e) => {
                                            onChange(e);
                                            handleCustum(e, "end_date");
                                          }}
                                          showYearPicker
                                          dateFormat="yyyy"
                                          yearItemNumber={9}
                                        />
                                      )}
                                    />
                                    {errors.build_year_max && (
                                      <p className="error">
                                        {errors.build_year_max?.message}
                                      </p>
                                    )}
                                    {renderFieldError("build_year_max")}
                                  </div>
                                </div>
                              </>
                            )}
                            {!isLandSelected && !mobileHomeParkSelected && (
                              <>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Stories (min)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="stories_min"
                                      className="form-control"
                                      placeholder="Stories (min)"
                                      {...register("stories_min", {
                                        onChange: (e) => {
                                          setStoriesMin(e.target.value);
                                        },
                                        required: "Stories (min) is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          positiveNumber: (v) =>
                                            parseFloat(v) <= storiesMax ||
                                            "The Stories (min) should be less than or equal Stories (max)",
                                        },
                                      })}
                                      onKeyUp={() => {
                                        handleChangeErrorMessage("stories");
                                      }}
                                    />
                                    {errors.stories_min && (
                                      <p className="error">
                                        {errors.stories_min?.message}
                                      </p>
                                    )}

                                    {renderFieldError("stories_min")}
                                  </div>
                                </div>
                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                  <label>
                                    Stories (max)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <input
                                      type="text"
                                      name="stories_max"
                                      className="form-control"
                                      placeholder="Stories (max)"
                                      {...register("stories_max", {
                                        onChange: (e) => {
                                          setStoriesMax(e.target.value);
                                        },
                                        required: "Stories (max) is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          positiveNumber: (v) =>
                                            parseFloat(v) >= storiesMin ||
                                            "The Stories (max) should be greater than or equal Stories (min)",
                                        },
                                      })}
                                      onKeyUp={() => {
                                        handleChangeErrorMessage("stories");
                                      }}
                                    />
                                    {errors.stories_max && (
                                      <p className="error">
                                        {errors.stories_max?.message}
                                      </p>
                                    )}

                                    {renderFieldError("stories_max")}
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                              <label>
                                Price (min)<span>*</span>
                              </label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="price_min"
                                  className="form-control"
                                  placeholder="Price (min)"
                                  {...register("price_min", {
                                    onChange: (e) => {
                                      setPriceMin(e.target.value);
                                    },
                                    required: "Price (min) is required",
                                    validate: {
                                      matchPattern: (v) =>
                                        /^[0-9]\d*$/.test(v) ||
                                        "Please enter valid number",
                                      maxLength: (v) =>
                                        v.length <= 10 ||
                                        "The digit should be less than equal 10",
                                      positiveNumber: (v) =>
                                        parseFloat(v) <= priceMax ||
                                        "The Price (min) should be less than or equal Price (max)",
                                    },
                                  })}
                                  onKeyUp={() => {
                                    handleChangeErrorMessage("price");
                                  }}
                                />
                                {errors.price_min && (
                                  <p className="error">
                                    {errors.price_min?.message}
                                  </p>
                                )}

                                {renderFieldError("price_min")}
                              </div>
                            </div>
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                              <label>
                                Price (max)<span>*</span>
                              </label>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="price_max"
                                  className="form-control"
                                  placeholder="Price (max)"
                                  {...register("price_max", {
                                    onChange: (e) => {
                                      setPriceMax(e.target.value);
                                    },
                                    required: "Price (max) is required",
                                    validate: {
                                      matchPattern: (v) =>
                                        /^[0-9]\d*$/.test(v) ||
                                        "Please enter valid number",
                                      maxLength: (v) =>
                                        v.length <= 10 ||
                                        "The digit should be less than equal 10",
                                      positiveNumber: (v) =>
                                        parseFloat(v) >= priceMin ||
                                        "The Price (max) should be greater than or equal Price (min)",
                                    },
                                  })}
                                  onKeyUp={() => {
                                    handleChangeErrorMessage("price");
                                  }}
                                />
                                {errors.price_max && (
                                  <p className="error">
                                    {errors.price_max?.message}
                                  </p>
                                )}

                                {renderFieldError("price_max")}
                              </div>
                            </div>
                            {!mobileHomeParkSelected && (
                              <>

                              </>
                            )}
                            {mobileHomeParkSelected && (
                              <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                                <label>
                                  Park Owned/Tenant Owned <span>*</span>
                                </label>
                                <div className="form-group">
                                  <Controller
                                    control={control}
                                    name="park"
                                    rules={{
                                      required:
                                        "Park Owned/Tenant Owned is required",
                                    }}
                                    render={({
                                      field: { value, onChange, name },
                                    }) => (
                                      <Select
                                        options={parkOption}
                                        name={name}
                                        className="select"
                                        placeholder="Select Park Owned/Tenant Owned"
                                        setMultiselectOption={setBuyerTypeValue}
                                        onChange={(e) => {
                                          onChange(e);
                                          handleCustum(e, "park");
                                        }}
                                      />
                                    )}
                                  />
                                  {errors.park && (
                                    <p className="error">
                                      {errors.park?.message}
                                    </p>
                                  )}
                                  {renderFieldError("park")}
                                </div>
                              </div>
                            )}
                            <div className="col-12 col-lg-12">
                              <div className="form-group">
                                <label>Location Flaws (Multi-Select)</label>
                                <div className="form-group">
                                  <MultiSelect
                                    name="property_flaw"
                                    options={locationFlawsOption}
                                    placeholder="Select Location Flaws"
                                    setMultiselectOption={setLocationFlawsValue}
                                  />
                                  {renderFieldError("property_flaw")}
                                </div>
                              </div>
                            </div>
                            <div className="column--grid">
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Solar</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="solar"
                                      value="1"
                                      id="solar_yes"
                                      defaultChecked
                                    />
                                    <label className="mb-0" htmlFor="solar_yes">
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="solar"
                                      value="0"
                                      id="solar_no"
                                    />
                                    <label className="mb-0" htmlFor="solar_no">
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("solar")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Pool</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="pool"
                                      value="1"
                                      id="pool_yes"
                                      defaultChecked
                                    />
                                    <label className="mb-0" htmlFor="pool_yes">
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="pool"
                                      value="0"
                                      id="pool_no"
                                    />
                                    <label className="mb-0" htmlFor="pool_no">
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("pool")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Septic</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="septic"
                                      value="1"
                                      id="septic_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="septic_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="septic"
                                      value="0"
                                      id="septic_no"
                                    />
                                    <label className="mb-0" htmlFor="septic_no">
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("septic")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Well</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="well"
                                      value="1"
                                      id="well_yes"
                                      defaultChecked
                                    />
                                    <label className="mb-0" htmlFor="well_yes">
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="well"
                                      value="0"
                                      id="well_no"
                                    />
                                    <label className="mb-0" htmlFor="well_no">
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("well")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>HOA</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="hoa"
                                      value="1"
                                      id="hoa_yes"
                                      defaultChecked
                                    />
                                    <label className="mb-0" htmlFor="hoa_yes">
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="hoa"
                                      value="0"
                                      id="hoa_no"
                                    />
                                    <label className="mb-0" htmlFor="hoa_no">
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("hoa")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Age restriction</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="age_restriction"
                                      value="1"
                                      id="age_restriction_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="age_restriction_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="age_restriction"
                                      value="0"
                                      id="age_restriction_no"
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="age_restriction_no"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("age_restriction")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Rental Restriction</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="rental_restriction"
                                      value="1"
                                      id="rental_restriction_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="rental_restriction_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="rental_restriction"
                                      value="0"
                                      id="rental_restriction_no"
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="rental_restriction_no"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("rental_restriction")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Post-Possession</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="post_possession"
                                      value="1"
                                      id="post_possession_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="post_possession_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="post_possession"
                                      value="0"
                                      id="post_possession_no"
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="post_possession_no"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("post_possession")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Tenant Conveys</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="tenant"
                                      value="1"
                                      id="tenant_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="tenant_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="tenant"
                                      value="0"
                                      id="tenant_no"
                                    />
                                    <label className="mb-0" htmlFor="tenant_no">
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("tenant")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Squatters</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="squatters"
                                      value="1"
                                      id="squatters_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="squatters_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="squatters"
                                      value="0"
                                      id="squatters_no"
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="squatters_no"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("squatters")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Building Required</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="building_required"
                                      value="1"
                                      id="building_required_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="building_required_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="building_required"
                                      value="0"
                                      id="building_required_no"
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="building_required_no"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("building_required")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Rebuild</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="rebuild"
                                      value="1"
                                      id="rebuild_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="rebuild_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="rebuild"
                                      value="0"
                                      id="rebuild_no"
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="rebuild_no"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("rebuild")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Foundation Issues</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="foundation_issues"
                                      value="1"
                                      id="foundation_issues_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="foundation_issues_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="foundation_issues"
                                      value="0"
                                      id="foundation_issues_no"
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="foundation_issues_no"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("foundation_issues")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Mold</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="mold"
                                      value="1"
                                      id="mold_yes"
                                      defaultChecked
                                    />
                                    <label className="mb-0" htmlFor="mold_yes">
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="mold"
                                      value="0"
                                      id="mold_no"
                                    />
                                    <label className="mb-0" htmlFor="mold_no">
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("mold")}
                              </div>
                              <div className="grid-template-col">
                                <div className="radio-block-group">
                                  <label>Fire Damaged</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="fire_damaged"
                                      value="1"
                                      id="fire_damaged_yes"
                                      defaultChecked
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="fire_damaged_yes"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="fire_damaged"
                                      value="0"
                                      id="fire_damaged_no"
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="fire_damaged_no"
                                    >
                                      No
                                    </label>
                                  </div>
                                </div>
                                {renderFieldError("fire_damaged")}
                              </div>
                              {manufactureSelected && (
                                <div className="grid-template-col">
                                  <div className="radio-block-group">
                                    <label>Permanently affixed </label>
                                    <div className="label-container">
                                      <input
                                        type="radio"
                                        name="permanent_affix"
                                        value="1"
                                        id="permanent_affix_yes"
                                        defaultChecked
                                      />
                                      <label
                                        className="mb-0"
                                        htmlFor="permanent_affix_yes"
                                      >
                                        Yes
                                      </label>
                                    </div>
                                    <div className="label-container">
                                      <input
                                        type="radio"
                                        name="permanent_affix"
                                        value="0"
                                        id="permanent_affix_no"
                                      />
                                      <label
                                        className="mb-0"
                                        htmlFor="permanent_affix_no"
                                      >
                                        No
                                      </label>
                                    </div>
                                  </div>
                                  {renderFieldError("permanent_affix")}
                                </div>
                              )}
                            </div>
                          </div>
                          <GoogleReCaptcha setCaptchaVerified={setCaptchaVerified} recaptchaError={recaptchaError} />
                          <div className="submit-btn">
                            <button
                              type="submit"
                              className="btn btn-fill"
                              disabled={loading ? "disabled" : ""}
                            >
                              Submit Now! {loading ? <MiniLoader /> : ""}{" "}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4 w-30">
                    <UploadMultipleBuyers />
                    {isActiveVideo ? (
                      <div className="watch-video">
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
                    <AdBanner
                      adData={advertisementData}
                      className="advertisement"
                      fallbackImage="./assets/images/add-1.svg"
                    />
                  </div>
                </div>
              </div>
            </div>
            <SocialShare
              SetOpenSocialShareModal={SetOpenSocialShareModal}
              openSocialShareModal={openSocialShareModal}
              handleCopyToClipBoard={handleCopyToClipBoard}
              generatedUrl={generatedUrl}
              copyLoading={copyLoading}
            />
            <WatchVideo
              isLoader={isLoader}
              videoUrl={videoUrl}
              videoSubTitle={videoSubTitle}
              SetOpenVideoModal={SetOpenVideoModal}
              openVideoModal={openVideoModal}
            />
          </>
        )}
      </section>

      <Modal show={generateREPShow} onHide={handleGenerateREPClose} centered className="both_modal_design rep_code_modal">
        <Modal.Header closeButton>
          <h5>Here is your REP Code</h5>
          <p>Please find the REP code below </p>
        </Modal.Header>
        <Modal.Body>
          <div className="rep_copy_box">
            <span>DFR5220</span>
            <button className="rep_copy_btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Copy Code
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showAttachConfirmModal} onHide={handleCancelAttach} centered className="both_modal_design">
        <Modal.Header closeButton>
          <h4 style={{ fontWeight: '600' }} className="mb-3">Confirm Attachment</h4>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0 text-center">
            {attachBuyerMessage ? (
              <span><strong>{attachBuyerEmail}</strong>: {attachBuyerMessage}</span>
            ) : (
              <span>The email <strong>{attachBuyerEmail}</strong> is already registered with an existing buyer.</span>
            )}
            <span className="d-block">Do you want to attach this buyer to your buyer database?</span>
          </p>
          <div className="FeaturedDealModal mt-30">
            <div className="both_btn_group m-0">
              <Button variant="primary" onClick={handleConfirmAttachYes} disabled={loading} className="btn-fill">
                {loading ? "Attaching..." : "Yes, Attach Buyer"}
              </Button>
              <Button variant="secondary" onClick={handleConfirmAttachNo} disabled={loading} className="light_bg_btn">
                {loading ? "Processing..." : "No"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
}

export default AddBuyerDetails;
