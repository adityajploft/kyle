import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import MultiSelect from "../../partials/Select2/MultiSelect";
import Select from "react-select";
import { useFormError } from "../../hooks/useFormError";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import MiniLoader from "../../partials/MiniLoader";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import SuccessfullySubmittedPage from "./SuccessfullySubmittedPage";
import { useAuth } from "../../hooks/useAuth";
import GoogleReCaptcha from "../../component/SocialLogin/GoogleReCaptcha";
import PhoneNumberWithOTPVerify from "../../component/PhoneNumberWithOTPVerify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import AddAddressAndRadius from "../../component/GoogleMapAutoAddress/index";


function CopyAddBuyer({ urlType }) {  
  const { token } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoader, setIsLoader] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { getTokenData, setLogout } = useAuth();
  const { setErrors, renderFieldError } = useFormError();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    getValues,
    clearErrors,
    watch,
  } = useForm();
  const phoneValue = watch("phone", ""); 
  const apiUrl = process.env.REACT_APP_API_URL;
  const capchaSiteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
  const capchaSecretKey = process.env.REACT_APP_RECAPTCHA_SECRET_KEY;

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState([]);
  const [radius, setRadius] = useState(); 

  const [purchaseMethodsOption, setPurchaseMethodsOption] = useState([]);
  const [buildingClassNamesOption, setBuildingClassNamesOption] = useState([]);
  const [propertyTypeOption, setPropertyTypeOption] = useState([]);
  const [parkingOption, setParkingOption] = useState([]);
  const [locationFlawsOption, setLocationFlawsOption] = useState([]);
  const [buyerTypeOption, setbuyerTypeOption] = useState([]);

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

  const [marketPreferanceOption, setMarketPreferanceOption] = useState([]);
  const [contactPreferanceOption, setContactPreferanceOption] = useState([]);
  const [zoningOption, setZoningOption] = useState([]);
  const [sewerOption, setSewerOption] = useState([]);
  const [utilitiesOption, setUtilitiesOption] = useState([]);

  const [parkingValue, setParkingValue] = useState([]);
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

  const [isTokenExpire, setIsTokenExpire] = useState(false);

  const [loading, setLoading] = useState(false);

  const [privacyLink, setPrivacyLink] = useState({});
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState("");
  const [isVerifiedOTP, setIsVerifiedOTP] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [addressList, setAddressList] = useState([]);

  useEffect(() => {
    console.log("first")
    checkTokenExpire();
    getOptionsValues();
  }, [navigate]);

  let headers = {
    Accept: "application/json",
  };
  const checkTokenExpire = () => {
    try {
      axios
        .get(`${apiUrl}check-token/${urlType}/${token}`, { headers: headers })
        .then((response) => {
          console.log(response.data.status,)
          if (response.data.status) {
            setIsTokenExpire(false);
            getOptionsValues();
            setIsLoader(false);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.data.error) {
              setIsTokenExpire(true);
              setIsLoader(false);
            }
          }
        });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  const getOptionsValues = () => {
    try {
      axios
        .get(apiUrl + "copy-buyer-form-details", { headers: headers })
        .then((response) => {
          if (response.data.status) {
            let result = response.data.result;

            setPurchaseMethodsOption(result.purchase_methods);
            setBuildingClassNamesOption(result.building_class_values);
            setPropertyTypeOption(result.property_types);
            setLocationFlawsOption(result.location_flaws);
            setParkingOption(result.parking_values);
            setParkOption(result.park);
            setStateOptions(result.states);
            setbuyerTypeOption(result.buyer_types);
            setMarketPreferanceOption(result.market_preferances);
            setContactPreferanceOption(result.contact_preferances);
            setZoningOption(result.zonings);
            setSewerOption(result.sewers);
            setUtilitiesOption(result.utilities);
            setPrivacyLink(result.links);

            setIsLoader(false);
          }
        });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLogout();
        }
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
  };

  const getStates = (country_id) => {
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

          setCountry(country_id);
          setStateOptions(result);
        });
    }
  };

  const getCities = async (state_id) => {
    try {
      if (state_id == null) {
        setState([]);
        setCity([]);
        setCityOptions([]);
      } else {
        const selectedStates = state_id.map((item) => item.value);
        setStatevalue(selectedStates);
        let country_id = { country };
        let response = await axios.post(
          apiUrl + "getCities",
          { state_id: selectedStates, country_id: 233 },
          { headers: headers }
        );
        if (response) {
          let result = response.data.options;
          setCity([]);
          setCityOptions(result);
        }
      }
    } catch (error) { }
  };
  const submitSingleBuyerForm = (data, e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    if (!captchaVerified) {
      setLoading(false);
      setRecaptchaError("Please complete reCAPTCHA verification.");
      return false;
    }
    var data = new FormData(e.target);
    let formObject = Object.fromEntries(data.entries());
    formObject.parking =  parkingValue;
    formObject.address=addressList;
    formObject.property_type = propertyTypeValue;
    formObject.property_flaw = locationFlawsValue;
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
    formObject.type = urlType;
    axios
      .post(`${apiUrl}copy-single-buyer-details/${token}`, formObject, {
        headers: headers,
      })
      .then((response) => {
        setLoading(false);
        setIsSubmitted(true);
        if (response.data.status) {
          Swal.fire({
            icon: "success",
            title: "success",
            text: "Buyer data saved successfully",
          });
          navigate(location.pathname);
          setIsTokenExpire(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          if (error.response.data.validation_errors) {
            setErrors(error.response.data.validation_errors);
          }
          if (error.response.data.error) {
            toast.error(error.response.data.error, {
              position: toast.POSITION.TOP_RIGHT,
            });
            if (error.response.data.error_type == "token_expired") {
              setIsTokenExpire(true);
            }
          }
        }
      });
  };
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
    } else if (name == "parking") {
      setParkingValue(selectedValues);
    } else if (name == "country") {
      getStates(e);
    } else if (name == "state") {
      setState(e);
      getCities([e]);
    } else if (name == "city") {
      //setCity(e);
    } else if (name == "building_class") {
      setBuildingClassNamesValue(selectedValues);
    } else if (name == "buyer_type") {
      setBuyerTypeValue(e);
    } else if (name == "start_date") {
      setStartDate(e);
    } else if (name == "end_date") {
      setEndDate(e);
    } else if (name == "market_preferance") {
      setMarketPreferanceValue(e);
    } else if (name == "zoning") {
      setZoningValue(selectedValues);
    } else if (name == "zoning") {
      setZoningValue(selectedValues);
    }
  };
  const handleCityChange = (event) => {
    let selectedValues = event.map((item) => item.value);
    console.log(selectedValues, "selectedValues");
    setCityvalue(selectedValues);
    setCity(event);
  };
  const handleChangeErrorMessage = (field_name) => {
    console.log("hello", field_name);
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
      console.log(parseInt(storiesMax));
      console.log(parseInt(storiesMin));
      if (parseInt(storiesMax) >= parseInt(storiesMin)) {
        clearErrors(["stories_min", "stories_max"]);
      }
    } else if (field_name === "price") {
      if (parseInt(priceMax) >= parseInt(priceMin)) {
        clearErrors(["price_min", "price_max"]);
      }
    }
  };

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
  return (
    <>

      <section className="main-section position-relative pt-4">
        {isLoader ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img src="../../../assets/images/loader.svg" />
          </div>
        ) : isTokenExpire ? (
          <div className="row">
            <SuccessfullySubmittedPage isSubmitted={isSubmitted} />
          </div>
        ) : (
          <div className="container position-relative">
            <div className="card-box">
              <div className="row">
                <div className="col-2 col-md-4 col-lg-3 col-xxl-2">
                  <div className="header-logo d-none d-md-block">
                    <Link to="/">
                      <img
                        alt="logo"
                        src="/assets/images/logo.svg"
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                  <div className="header-logo d-md-none">
                    <Link to="/">
                      <img
                        alt="logo"
                        src="/assets/images/mobile-logo.svg"
                        className="img-fluid"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-12">
                  <div className="card-box-inner">
                    <div className="row">
                      <div className="col-12 col-sm-7 col-md-12 col-lg-12">
                        <div className="center-content mb-3 md:mb-5">
                          <img src="./assets/images/logo.svg" className="img-fluid" alt="" />
                          <h2>Buy Box Criteria</h2>
                        </div>
                      </div>
                    </div>

                    <form
                      method="post"
                      onSubmit={handleSubmit(submitSingleBuyerForm)}
                    >
                      <div className="card-box-blocks">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
                            <label>
                              First Name<span>*</span>
                            </label>
                            <div className="form-group">
                              <input
                                type="text"
                                name="first_name"
                                className="form-control"
                                placeholder="First Name"
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
                            <label>
                              Last Name<span>*</span>
                            </label>
                            <div className="form-group">
                              <input
                                type="text"
                                name="last_name"
                                className="form-control"
                                placeholder="Last Name"
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
                                placeholder="Email Address"
                                {...register("email", {
                                  required: "Email is required",
                                  validate: {
                                    maxLength: (v) =>
                                      v.length <= 50 ||
                                      "The email should have at most 50 characters",
                                    matchPattern: (v) =>
                                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                                        v
                                      ) ||
                                      "Email address must be a valid address",
                                  },
                                })}
                              />
                              {errors.email && (
                                <p className="error">{errors.email?.message}</p>
                              )}
                              {renderFieldError("email")}
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3">
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
                            </div>
                          <PhoneNumberWithOTPVerify register={register} getValues={getValues} watch={watch} errors={errors.phone} setIsVerifiedOTP={setIsVerifiedOTP} isVerifiedOTP={isVerifiedOTP} renderFieldError={renderFieldError} clearErrors={clearErrors} setFormErrors={setErrors} />
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
                              {errors.company_name && (
                                <p className="error">
                                  {errors.company_name?.message}
                                </p>
                              )}
                              {renderFieldError("company_name")}
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                            <label>
                              Contact Preference<span>*</span>
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
                                    name={name}
                                    className="select"
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
                        
                          <AddAddressAndRadius address={address} setAddress={setAddress} latitude={latitude} setLatitude={setLatitude} longitude={longitude} setLongitude={setLongitude} radius={radius} setRadius={setRadius} addressList={addressList} setAddressList={setAddressList} hideRadius={false}/>

                              
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
                                rules={{ required: "MLS Status is required" }}
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
                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <label>
                              Parking (Multi-Select)<span>*</span>
                            </label>
                            <div className="form-group">
                              <Controller
                                control={control}
                                name="parking"
                                rules={{ required: "Parking is required" }}
                                render={({
                                  field: { value, onChange, name },
                                }) => (
                                  <Select
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
                                      showCreative={setMultiFamilyBuyerSelected}
                                      onChange={(e) => {
                                        onChange(e);
                                        handleCustum(e, "property_type");
                                      }}
                                     
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
                                    Zoning (Multi-Select)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <Controller
                                      control={control}
                                      name="zoning"
                                      rules={{ required: "Zoning is required" }}
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
                                    Utilities<span>*</span>
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
                                    Sewage<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <Controller
                                      control={control}
                                      name="sewer"
                                      rules={{ required: "Sewage is required" }}
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
                                    Building class (Multi-Select)<span>*</span>
                                  </label>
                                  <div className="form-group">
                                    <Controller
                                      control={control}
                                      name="building_class"
                                      rules={{
                                        required: "Building class is required",
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
                                    Value Add <span>*</span>
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
                              Purchase Method (Multi-Select)<span>*</span>
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
                                      type="number"
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
                                      type="number"
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
                                            (v.length <= 15 && v.length >= 1) ||
                                            "The Down Payment ($) should be more than 1 digit and less than equal 15",
                                        },
                                      })}
                                    />
                                    {errors.max_down_payment_money && (
                                      <p className="error">
                                        {errors.max_down_payment_money?.message}
                                      </p>
                                    )}
                                    {renderFieldError("max_down_payment_money")}
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
                                            (v.length <= 15 && v.length >= 1) ||
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
                                          parseFloat(v) <= sqFtMax ||
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
                                Rooms<span>*</span>
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
                                  required: "Lot Size Sq Ft (Min) is required",
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
                                  required: "Lot Size Sq Ft (max) is required",
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
                                      required: "Year Built (Min) is required",
                                    }}
                                    render={({
                                      field: { value, onChange, name },
                                    }) => (
                                      <DatePicker
                                        id="DatePicker"
                                        maxDate={new Date()}
                                        type="string"
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
                                      required: "Year Built (Max) is required",
                                    }}
                                    render={({
                                      field: { value, onChange, name },
                                    }) => (
                                      <DatePicker
                                        minDate={startDate}
                                        id="DatePicker"
                                        type="string"
                                        maxDate={new Date()}
                                        className="text-primary text-center form-control"
                                        selected={endDate}
                                        name="build_year_max"
                                        placeholderText="Year Built (Max)"
                                        autoComplete="off"
                                        minYear={2020}
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

                              {renderFieldError("arv_min")}
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
                            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                              <label>
                                Park Owned/Tenant Owned<span>*</span>{" "}
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
                                      className="select"
                                      options={parkOption}
                                      name={name}
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
                              <label>Location Flaws  (Multi-Select)</label>
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
                                  <label className="mb-0" htmlFor="septic_yes">
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
                                  <label className="mb-0" htmlFor="tenant_yes">
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
                                  <label className="mb-0" htmlFor="rebuild_yes">
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
                                  <label className="mb-0" htmlFor="rebuild_no">
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
                                    />
                                    <label
                                      className="mb-0"
                                      htmlFor="permanent_affix_yes"
                                      defaultChecked
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

                          <GoogleReCaptcha setCaptchaVerified={setCaptchaVerified} recaptchaError={recaptchaError} />
                          <div className="col-12 col-lg-12">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" name="terms_accepted" value="1" id="privacy-policy" {...register("terms_accepted", {
                                required: "This field is required",
                              })} />
                              <label className="form-check-label text-transform-none" htmlFor="privacy-policy">
                                <p>I have read and agree to the <Link target="_blank" to={privacyLink.privacy_policy_link !== undefined ? privacyLink.privacy_policy_link : ''}>Privacy Policy </Link>
                                  and
                                  <Link target="_blank" to={privacyLink.terms_services_link !== undefined ? privacyLink.terms_services_link : ''}> Terms or Service </Link></p>
                              </label>
                              {errors.terms_accepted && (
                                <p className="error error_space">{errors.terms_accepted?.message}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {isVerifiedOTP ?
                          <div className="submit-btn">
                            <button
                              type="submit"
                              className="btn btn-fill"
                              disabled={loading ? "disabled" : ""}
                            >
                              Submit Now! {loading ? <MiniLoader /> : ""}{" "}
                            </button>

                          </div> :
                          <div className="submit-btn" style={{ position: 'relative' }}>
                            <div
                              data-tooltip-id="my-tooltip-1"
                              className="col-md-12 tooltip-wrapper"
                              style={{ display: 'inline-block', cursor: 'not-allowed' }}
                            >
                              <button
                                type="submit"
                                className="btn btn-fill"
                                disabled={true}
                                style={{ pointerEvents: 'none' }}
                              >
                                Submit Now!
                              </button>
                            </div>
                          </div>
                        }
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <ReactTooltip
        id="my-tooltip-1"
        place="top"
        content="Please verify Phone Number to submit this form" />
    </>
  );
}

export default CopyAddBuyer;
