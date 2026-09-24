import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import MultiSelect from "../../partials/Select2/MultiSelect";
import Select from "react-select";
import { useFormError } from "../../hooks/useFormError";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import MiniLoader from "../../partials/MiniLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuth } from "../../hooks/useAuth";
import BuyerHeader from "../../partials/BuyerHeader";
import Footer from "../../partials/Footer";
// import BuyerProfilePayment from "../../modal/BuyerProfilePayment";

import AddAddressAndRadius from "../../component/GoogleMapAutoAddress/index";
import PhoneNumberWithOTPVerify from "../../component/PhoneNumberWithOTPVerify";
import EmailWithOTPVerify from "../../component/EmailWithOTPVerify";
// import GoogleMapAutoAddress from "../../component/GoogleMapAutoAddress";

const normalizeEmail = (value) =>
  (value || "").toString().trim().toLowerCase();
const normalizePhone = (value) =>
  (value || "").toString().replace(/\D/g, "");

function EditBuyerProfile() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { getTokenData, setLogout, getLocalStorageUserdata, setLocalStorageUserdata } = useAuth();
  const { id } = useParams();

  const { setErrors, renderFieldError } = useFormError();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    clearErrors,
    setValue,
    getValues,
    watch,
  } = useForm();

  /* previous form data start*/
  const [loader, setLoader] = useState(false);
  const [miniLoader, setMiniLoader] = useState(false);
  const [miniProfileLoader, setMiniProfileLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [border, setBorder] = useState("1px dashed #677AAB");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [isVerifiedOTP, setIsVerifiedOTP] = useState(false);
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
  const [verifiedEmailValue, setVerifiedEmailValue] = useState("");
  const [verifiedPhoneValue, setVerifiedPhoneValue] = useState("");
  const prevVerifiedEmailRef = useRef(false);
  const prevVerifiedPhoneRef = useRef(false);

  const [solar, setSolar] = useState("");
  const [pool, setPool] = useState("");
  const [septic, setSeptic] = useState("");
  const [well, setWell] = useState("");
  const [hoa, setHoa] = useState("");
  const [ageRestriction, setAgeRestriction] = useState("");
  const [rentalRestriction, setRentalRestriction] = useState("");
  const [postPossession, setPostPossession] = useState("");
  const [tenantConveys, setTenantConveys] = useState("");
  const [squatters, setSquatters] = useState("");
  const [buildingRequired, setBuildingRequired] = useState("");
  const [rebuild, setRebuild] = useState("");
  const [foundationIssues, setFoundationIssues] = useState("");
  const [mold, setMold] = useState("");
  const [fireDamaged, setFireDamaged] = useState("");
  const [permanentAffix, setPermanentAffix] = useState("");
  const [valueAdd, setValueAdd] = useState("");

  /* previous form data end */
  const [currentBuyerData, setCurrentBuyerData] = useState({});
  const [country, setCountry] = useState([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const emailValue = watch("email", "");
  const phoneValue = watch("phone", "");

  const [propertyType, setPropertyType] = useState([]);
  const [purchaseMethods, setPurchaseMethods] = useState([]);
  const [locationFlaws, setLocationFlaws] = useState([]);
  const [parking, setParking] = useState([]);
  const [marketPreferance, setMarketPreferance] = useState([]);
  const [contactPreferance, setContactPreferance] = useState([]);
  const [zoning, setZoning] = useState([]);
  const [sewer, setSewer] = useState([]);
  const [utilities, setUtilities] = useState([]);


  const [purchaseMethodsOption, setPurchaseMethodsOption] = useState([]);
  const [buildingClassNamesOption, setBuildingClassNamesOption] = useState([]);
  const [propertyTypeOption, setPropertyTypeOption] = useState([]);
  const [parkingOption, setParkingOption] = useState([]);
  const [locationFlawsOption, setLocationFlawsOption] = useState([]);
  const [buyerTypeOption, setbuyerTypeOption] = useState([]);

  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [parkOption, setParkOption] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState();
  const [addressList, setAddressList] = useState([]);

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

  useEffect(() => {

    getOptionsValues();
    fetchBuyerData();
  }, [navigate]);

  useEffect(() => {
    if (!prevVerifiedEmailRef.current && isVerifiedEmail) {
      setVerifiedEmailValue(normalizeEmail(emailValue));
    }
    prevVerifiedEmailRef.current = isVerifiedEmail;
  }, [emailValue, isVerifiedEmail]);

  useEffect(() => {
    if (!prevVerifiedPhoneRef.current && isVerifiedOTP) {
      setVerifiedPhoneValue(normalizePhone(phoneValue));
    }
    prevVerifiedPhoneRef.current = isVerifiedOTP;
  }, [phoneValue, isVerifiedOTP]);

  const apiUrl = process.env.REACT_APP_API_URL;
  const countryCode = process.env.REACT_APP_COUNTRY_CODE;

  let headers = {
    Accept: "application/json",
    Authorization: "Bearer " + getTokenData().access_token,
    "Content-Type": "multipart/form-data",
  };

  const fetchBuyerData = async () => {
    try {
      let response = await axios.get(`${apiUrl}edit-buyer/${id}`, {
        headers: headers,
      });
      if (response.data.status) {
        let responseData = response.data.buyer;


        for (let key in responseData) {
          setValue(key, responseData[key]);
        }

        // if (!responseData.is_profile_updatable && !responseData.is_buyer_verified) {
        //   navigate("/buyer/profile");
        //   Swal.fire({
        //     icon: "info",
        //     title: "Profile Update Locked",
        //     text: "Profile Updation can only be done after the Buyer completes verification.",
        //     confirmButtonText: "Okay",
        //     buttonsStyling: false,
        //     customClass: {
        //       confirmButton: "btn btn-fill w-auto",
        //     },
        //     didOpen: () => {
        //       const confirmBtn = Swal.getConfirmButton();
        //       confirmBtn.style.backgroundColor = "#3f53fe";
        //       confirmBtn.style.color = "#fff";
        //       confirmBtn.style.borderRadius = "8px";
        //       confirmBtn.style.padding = "12px 36px";
        //     }
        //   });
        //   return;
        // }

        if (responseData.profile_image !== "") {
          setPreviewImageUrl(responseData.profile_image);
        }
        if (responseData.email) {
          setValue("email", responseData.email);
        }

        if (Array.isArray(responseData.address)) {
          const transformedAddressList = responseData.address.map((item) => ({
            ...item,
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }));

          setAddressList(transformedAddressList);

          if (transformedAddressList.length > 0) {
            const lastAddressObj = transformedAddressList[transformedAddressList.length - 1];
            setAddress(lastAddressObj.address || "");
            setLatitude(lastAddressObj.latitude);
            setLongitude(lastAddressObj.longitude);
            setRadius(lastAddressObj.radius);
          }
        }
        setCurrentBuyerData(responseData);
        setIsVerifiedEmail(Boolean(responseData.email_verified));
        setIsVerifiedOTP(Boolean(responseData.phone_verified));
        setVerifiedEmailValue(
          responseData.email_verified ? normalizeEmail(responseData.email) : ""
        );
        setVerifiedPhoneValue(
          responseData.phone_verified ? normalizePhone(responseData.phone) : ""
        );
        if (responseData.phone) {
          setValue("phone", formatInput(responseData.phone));
        }
        setState(responseData.state);
        setCity(responseData.city);
        setZipCode(responseData.zip_code);
        setPropertyType(responseData.property_type);
        setPurchaseMethods(responseData.purchase_method);
        setParkingValue(responseData.parking);
        setBuyerTypeValue(responseData.buyer_type);
        setLocationFlaws(responseData.property_flaw);
        setMarketPreferance(responseData.market_preferance);
        setContactPreferance(responseData.contact_preferance);
        setZoning(responseData.zoning);
        setSewer(responseData.sewer);
        setUtilities(responseData.utilities);
        setStatevalue(responseData.state);
        setCityvalue(responseData.city);

        const selectedProperty = responseData.property_type.map((item) => item.value);
        setPropertyTypeValue(selectedProperty);

        if (selectedProperty.includes(7)) {
          setIsLandSelected(true);
          const selectedZoning = responseData.zoning.map((item) => item.value);
          setZoningValue(selectedZoning);
        }

        if (selectedProperty.includes(10)) {
          setMultiFamilyBuyerSelected(true);
          const selectedBuildingClass = responseData.building_class.map((item) => item.value);
          setBuildingClassNamesValue(selectedBuildingClass);
          setValueAdd(String(responseData.value_add));
        }

        if (selectedProperty.includes(14)) {
          setMobileHomeParkSelected(true);
        }

        const selectedPurchaseMethods = responseData.purchase_method.map((item) => item.value);
        setPurchaseMethodsValue(selectedPurchaseMethods);

        const selectedParking = responseData.parking.map((item) => item.value);
        setParking(selectedParking);

        const selectedLocationFlaws = responseData.property_flaw.map((item) => item.value);
        setLocationFlawsValue(selectedLocationFlaws);
        // Update min/max values
        setBedRoomMin(responseData.bedroom_min);
        setBedRoomMax(responseData.bedroom_max);
        setBathMin(responseData.bath_min);
        setBathMax(responseData.bath_max);
        setSqFtMin(responseData.size_min);
        setSqFtMax(responseData.size_max);
        setlotSizesqFtMin(responseData.lot_size_min);
        setlotSizesqFtMax(responseData.lot_size_max);
        setStoriesMin(responseData.stories_min);
        setStoriesMax(responseData.stories_max);
        setPriceMin(responseData.price_min);
        setPriceMax(responseData.price_max);

        if (responseData.build_year_min) {
          setStartDate(new Date(responseData.build_year_min, 0, 1, 0, 0, 0));
        }
        if (responseData.build_year_max) {
          setEndDate(new Date(responseData.build_year_max, 0, 1, 0, 0, 0));
        }

        // Update checkbox values
        setSolar(String(responseData.solar));
        setPool(String(responseData.pool));
        setSeptic(String(responseData.septic));
        setWell(String(responseData.well));
        setHoa(String(responseData.hoa));
        setAgeRestriction(String(responseData.age_restriction));
        setRentalRestriction(String(responseData.rental_restriction));
        setPostPossession(String(responseData.post_possession));
        setTenantConveys(String(responseData.tenant));
        setSquatters(String(responseData.squatters));
        setBuildingRequired(String(responseData.building_required));
        setRebuild(String(responseData.rebuild));
        setFoundationIssues(String(responseData.foundation_issues));
        setMold(String(responseData.mold));
        setFireDamaged(String(responseData.fire_damaged));
        setPermanentAffix(String(responseData.permanent_affix));
        setLoader(false);
      }
    } catch (error) {
      if (error.response) {
        console.log(error)
        if (error.response.status === 401) {
          setLogout();
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
  const showProfileUpdateLockedAlert = (message) => {
    Swal.fire({
      icon: "info",
      title: "Profile Update Locked",
      text: message,
      confirmButtonText: "Okay",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-fill w-auto",
      },
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        confirmBtn.style.backgroundColor = "#3f53fe";
        confirmBtn.style.color = "#fff";
        confirmBtn.style.borderRadius = "8px";
        confirmBtn.style.padding = "12px 36px";
      },
    });
  };
  const handleProfileUpdateLocked = () => {
    showProfileUpdateLockedAlert(
      "Profile update can only be done after the Buyer proof of funds verification."
    );
  };
  const getOptionsValues = () => {
    try {
      axios
        .get(apiUrl + "edit-buyer-form-element-values", { headers: headers })
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
    } catch (error) {
      if (error.response) {
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
  const submitSingleBuyerForm = (data, e) => {
    e.preventDefault();
    setErrors(null);
    setMiniLoader(true);
    var data = new FormData(e.target);
    let formObject = Object.fromEntries(data.entries());

    formObject.property_type = propertyTypeValue;
    formObject.property_flaw = locationFlawsValue;
    formObject.purchase_method = purchaseMethodsValue;
    formObject.address = addressList;
    if (formObject.hasOwnProperty("building_class")) {
      formObject.building_class = buildingClassNamesValue;
    }
    if (formObject.hasOwnProperty("zoning")) {
      formObject.zoning = zoningValue.length > 0 ? zoningValue : "";
    }
    if (formObject.hasOwnProperty("state")) {
      formObject.state = stateValue.length > 0 ? stateValue : "";
    }
    if (formObject.hasOwnProperty("city")) {
      formObject.city = cityValue.length > 0 ? cityValue : "";
    }
    if (formObject.hasOwnProperty("parking")) {
      formObject.parking = parking;
    }
    if (formObject.hasOwnProperty("permanent_affix")) {
      formObject.permanent_affix = permanentAffix;
    }
    if (formObject.hasOwnProperty("phone") && formObject.phone) {
      formObject.phone = formObject.phone.replace(/-/g, "");
    }

    // OTP Validation for Email and Phone
    const currentEmail = normalizeEmail(formObject.email);
    const originalEmail = normalizeEmail(currentBuyerData.email);
    const currentDigits = normalizePhone(formObject.phone);
    const originalDigits = normalizePhone(currentBuyerData.phone);
    const savedVerifiedEmail = normalizeEmail(verifiedEmailValue);
    const savedVerifiedPhone = normalizePhone(verifiedPhoneValue);

    if (savedVerifiedEmail) {
      if (currentEmail !== savedVerifiedEmail) {
        setMiniLoader(false);
        toast.error("Please verify your new email address with OTP before submitting", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
    } else if (currentEmail !== originalEmail && !isVerifiedEmail) {
      setMiniLoader(false);
      toast.error("Please verify your new email address with OTP before submitting", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    if (savedVerifiedPhone) {
      if (currentDigits !== savedVerifiedPhone) {
        setMiniLoader(false);
        toast.error("Please verify your new phone number with OTP before submitting", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return;
      }
    } else if (currentDigits !== originalDigits && !isVerifiedOTP) {
      setMiniLoader(false);
      toast.error("Please verify your new phone number with OTP before submitting", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    axios
      .post(`${apiUrl}update-single-buyer-details/${id}`, formObject, {
        headers: headers,
      })
      .then((response) => {
        setMiniLoader(false);
        if (response.data.status) {
          let userData = getLocalStorageUserdata();

          userData.first_name = response.data.userData.first_name;
          userData.last_name = response.data.userData.last_name;
          userData.profile_image = response.data.userData.profile_image;
          userData.level_type = response.data.userData.level_type;
          userData.role = response.data.userData.role;
          userData.total_buyer_uploaded = response.data.userData.total_buyer_uploaded;

          setLocalStorageUserdata(userData);
          const profileName = document.querySelector(".user-name-title");
          const profilePic = document.querySelector(".user-profile");
          profileName.innerHTML =
            response.data.userData.first_name +
            " " +
            response.data.userData.last_name;
          if (response.data.userData.profile_image != "") {
            profilePic.src = response.data.userData.profile_image;
          }
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/buyer/profile");
        }
      })
      .catch((error) => {
        setMiniLoader(false);
        if (error.response) {
          if (error.response.data.validation_errors) {
            setErrors(error.response.data.validation_errors);
          }
          if (error.response.data.error) {
            toast.error(error.response.data.error, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      });
  };
  const handleCustum = (e, name) => {
    let selectedValues = Array.isArray(e) ? e.map((x) => x.value) : [];
    if (name == "property_type") {
      selectedValues = [e.value];
      setPropertyTypeValue(selectedValues);
      setPropertyType(e);
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
      console.log(selectedValues, "selectedValues");
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
    } else if (name == "purchase_method") {
      setPurchaseMethods(e);
      if (selectedValues.includes(5)) {
        setShowCreativeFinancing(true);
      } else {
        setShowCreativeFinancing(false);
      }
      setPurchaseMethodsValue(selectedValues);
    } else if (name == "parking") {
      setParking(selectedValues);
      setParkingValue(e);
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
      setEndDate("");
    } else if (name == "end_date") {
      setEndDate(e);
    } else if (name == "market_preferance") {
      setMarketPreferance(e);
    } else if (name == "contact_preferance") {
      setContactPreferance(e);
    } else if (name == "zoning") {
      setZoningValue(selectedValues);
      setZoning(e);
    }
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
  const hasUploadedProofOfFunds = async () => {
    let proofHeaders = {
      Accept: "application/json",
      Authorization: "Bearer " + getTokenData().access_token,
      "auth-token": getTokenData().access_token,
    };

    let response = await axios.get(`${apiUrl}get-proof-of-funds-pdfs`, {
      headers: proofHeaders,
      params: { _: Date.now() },
    });

    const documents = Array.isArray(response?.data?.data) ? response.data.data : [];

    return documents.filter((document) => {
      const isDeleted =
        document?.is_deleted === 1 ||
        document?.is_deleted === true ||
        document?.deleted_at;

      return !isDeleted && (document?.id || document?.file_url || document?.original_file_name);
    }).length > 0;
  };
  const handleProfileChange = async (e, isPayment) => {
    e.preventDefault();
    try {
      const profilePic = document.querySelector(".user-profile");
      if (isPayment === 0) {
        handleProfileUpdateLocked();
      } else {
        setMiniProfileLoader(true);

        const hasProofOfFunds = await hasUploadedProofOfFunds();
        if (!hasProofOfFunds) {
          setMiniProfileLoader(false);
          if (e.target) {
            e.target.value = "";
          }
          showProfileUpdateLockedAlert(
            "Please keep at least one proof of funds document before updating your profile picture."
          );
          return;
        }

        const file = e.target.files?.[0];
        if (!file) {
          setMiniProfileLoader(false);
          return;
        }

        const checkImage = isValidImage(file);
        if (checkImage) {
          let response = await axios.post(
            apiUrl + "update-buyer-profile-image",
            { profile_image: file },
            {
              headers: headers,
            }
          );
          if (response.data.status) {
            console.log(getLocalStorageUserdata().profile_image);
            let existingData = getLocalStorageUserdata();
            existingData.profile_image = response.data.profile_image;
            setLocalStorageUserdata(existingData);
            profilePic.src = response.data.profile_image;
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
        setMiniProfileLoader(false);
      }
    } catch (error) {
      console.log(error.response);
      setMiniProfileLoader(false);
      if (error.response) {
        if (error.response.data.validation_errors) {
          setErrors(error.response.data.validation_errors);
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
  const isValidImage = (file) => {
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    const fileSize = file.size;
    const fileType = file.type;
    const fileName = file.name;
    const extension = ["image/png", "image/jpg", "image/jpeg"];

    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPreviewImageUrl(reader.result);
      });
      reader.readAsDataURL(file);
    }

    if (fileName != "" && !extension.includes(fileType)) {
      setErrorMsg("Please add valid file (jpg,jpeg,png)");
      setBorder("1px dashed #ff0018");
      return false;
    } else if (fileSize > maxFileSize) {
      setErrorMsg(
        "File size is too large. Please upload a file that is less than 2MB."
      );
      setBorder("1px dashed #ff0018");
      return false;
    } else {
      setBorder("1px dashed #677AAB");
      setErrorMsg("");
      setPreviewImageUrl("");
    }
    return true;
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
    setZipCode,
    address,
    zipCode,
    city,
    state
  }

  return (
    <>
      <BuyerHeader />
      <section className="main-section position-relative pt-4 pb-120">
        {loader ? (
          <div className="loader" style={{ textAlign: "center" }}>
            <img src="../../../assets/images/loader.svg" />
          </div>
        ) : (
          <div className="container position-relative pat-40">
            <div className="back-block">
              <div className="row">
                <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                  <Link to="/buyer/profile" className="back">
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
                      ></path>
                      <path
                        d="M5.9 11L1 6L5.9 1"
                        stroke="#0A2540"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    Back
                  </Link>
                </div>
                <div className="col-6 col-sm-4 col-md-4 col-lg-4 align-self-center">
                  <h6 className="center-head text-center mb-0">Edit Profile</h6>
                </div>
              </div>
            </div>
            <div className="card-box">
              <div className="row">
                <div className="col-12 col-lg-4">
                  <div className="outer-heading text-center">
                    <h3 className="mb-0">Edit Profile Picture </h3>
                  </div>
                  <div className="upload-photo" style={{ border: border }}>
                    <div className="containers">
                      <div className="imageWrapper">
                        {previewImageUrl == "" ? (
                          <img
                            className="image img-fluid"
                            src="/assets/images/avtar-big.png"
                          />
                        ) : (
                          <img className="image" src={previewImageUrl} />
                        )}
                      </div>
                    </div>

                    {currentBuyerData.is_buyer_verified ? (
                      <button className="file-upload">
                        <input
                          type="file"
                          className="file-input"
                          accept="image/png, image/jpg, image/jpeg"
                          onChange={(e) => handleProfileChange(e, 1)}
                        />
                        Change Profile Picture {miniProfileLoader ? <MiniLoader /> : ""}{" "}
                      </button>
                    ) : (
                      <button
                        className="file-upload"
                        onClick={(e) => handleProfileChange(e, 0)}
                      >
                        Change Profile Picture
                      </button>
                    )}
                  </div>
                  {renderFieldError("profile_image")}
                  <p
                    style={{
                      padding: "6px",
                      textAlign: "center",
                      fontSize: "13px",
                      color: "red",
                      fontWeight: "700",
                    }}
                  >
                    {errorMsg}
                  </p>
                </div>
                <div className="col-12 col-lg-8">
                  <div className="card-box-inner">
                    <h3>Edit Profile</h3>
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
                                defaultValue={currentBuyerData.first_name}
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
                                defaultValue={currentBuyerData.last_name}
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
                          <EmailWithOTPVerify
                            register={register}
                            getValues={getValues}
                            watch={watch}
                            errors={errors.email}
                            setIsVerifiedEmail={setIsVerifiedEmail}
                            isVerifiedEmail={isVerifiedEmail}
                            renderFieldError={renderFieldError}
                            initialEmail={currentBuyerData.email}
                            clearErrors={clearErrors}
                            setFormErrors={setErrors}
                          />
                          <PhoneNumberWithOTPVerify
                            register={register}
                            getValues={getValues}
                            watch={watch}
                            errors={errors.phone}
                            setIsVerifiedOTP={setIsVerifiedOTP}
                            isVerifiedOTP={isVerifiedOTP}
                            renderFieldError={renderFieldError}
                            initialPhone={currentBuyerData.phone}
                            clearErrors={clearErrors}
                            setFormErrors={setErrors}
                          />
                          <div className="col-12 col-lg-12">
                            <label>
                              Description
                            </label>
                            <div className="form-group">
                              <textarea className="form-control" name="description" style={{ height: '90px' }} defaultValue={currentBuyerData.description}></textarea>
                            </div>
                          </div>
                          <AddAddressAndRadius address={address} setAddress={setAddress} latitude={latitude} setLatitude={setLatitude} longitude={longitude} setLongitude={setLongitude} radius={radius} setRadius={setRadius} addressList={addressList} setAddressList={setAddressList} hideRadius={false} />

                          <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                            <label>
                              Company/LLC<span>*</span>
                            </label>
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                name="company_name"
                                placeholder="Company LLC"
                                defaultValue={currentBuyerData.company_name}
                                {...register("company_name", {
                                  required: "Company/LLC is required",
                                  validate: {
                                    maxLength: (v) =>
                                      v.length <= 50 ||
                                      "The Company/LLC should have at most 50 characters",
                                  },
                                })}
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
                              MLS Status<span>*</span>
                            </label>
                            <div className="form-group">
                              <Controller
                                control={control}
                                name="market_preferance"
                                rules={{ required: "mls Status is required" }}
                                render={({
                                  field: { value, onChange, name },
                                }) => (
                                  <Select
                                    options={marketPreferanceOption}
                                    name={name}
                                    placeholder="Select MLS Status"
                                    value={marketPreferance}
                                    className="select"
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
                                    value={contactPreferance}
                                    placeholder="Select Contact Preference"
                                    className="select"
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
                                      value={propertyType}
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
                                    Zoning<span>*</span>
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
                                          value={zoning}
                                          className="select"
                                          name={name}
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
                                          defaultValue={utilities}
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
                                          defaultValue={sewer}
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
                              {/* <h5>Multi Family Buyer</h5> */}
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
                                      defaultValue={currentBuyerData.unit_min}
                                      placeholder="Minimum Units"
                                      {...register("unit_min", {
                                        required: "Minimum Units is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          maxLength: (v) =>
                                            v.toString().length <= 10 ||
                                            `The digit should be less than equal 10`,
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
                                      defaultValue={currentBuyerData.unit_max}
                                      {...register("unit_max", {
                                        required: "Maximum Units is required",
                                        validate: {
                                          matchPattern: (v) =>
                                            /^[0-9]\d*$/.test(v) ||
                                            "Please enter valid number",
                                          maxLength: (v) =>
                                            v.toString().length <= 10 ||
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
                                    Building class<span>*</span>
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
                                          defaultValue={
                                            currentBuyerData.building_class
                                          }
                                          className="select"
                                          name={name}
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
                                          checked={
                                            valueAdd === "1" ? "checked" : ""
                                          }
                                          id="value_add_yes"
                                          {...register("value_add", {
                                            onChange: (e) => {
                                              setValueAdd(e.target.value);
                                            },
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
                                          checked={
                                            valueAdd === "0" ? "checked" : ""
                                          }
                                          {...register("value_add", {
                                            onChange: (e) => {
                                              setValueAdd(e.target.value);
                                            },
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
                                    value={purchaseMethods}
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
                                <label> Bedroom (min)<span>*</span></label>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    name="bedroom_min"
                                    className="form-control"
                                    placeholder="Bedroom (min)"
                                    defaultValue={currentBuyerData.bedroom_min}
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
                                          v.toString().length <= 10 ||
                                          `The digit should be less than equal 10`,
                                        positiveNumber: (v) =>
                                          parseFloat(v) <= bedRoomMax ||
                                          `The Bedroom (min) should be less than or equal Bedroom (max)`,
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
                                    defaultValue={currentBuyerData.bedroom_max}
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
                                          v.toString().length <= 10 ||
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
                                    defaultValue={currentBuyerData.bath_min}
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
                                          v.toString().length <= 10 ||
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
                                    defaultValue={currentBuyerData.bath_max}
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
                                          v.toString().length <= 10 ||
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
                                    defaultValue={currentBuyerData.size_min}
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
                                          v.toString().length <= 10 ||
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
                                    defaultValue={currentBuyerData.size_max}
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
                                          v.toString().length <= 10 ||
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
                                  defaultValue={currentBuyerData.rooms}
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
                                defaultValue={currentBuyerData.lot_size_min}
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
                                      v.toString().length <= 10 ||
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
                                defaultValue={currentBuyerData.lot_size_max}
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
                                      v.toString().length <= 10 ||
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
                                        defaultValue={
                                          currentBuyerData.build_year_min
                                        }
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
                                    defaultValue={currentBuyerData.stories_min}
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
                                    defaultValue={currentBuyerData.stories_max}
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
                                defaultValue={currentBuyerData.price_min}
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
                                      v.toString().length <= 10 ||
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
                                defaultValue={currentBuyerData.price_max}
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
                                      v.toString().length <= 10 ||
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
                          <div className="col-6 col-lg-6">
                            <label> Parking<span>*</span></label>
                            <div className="form-group">
                              <Controller
                                control={control}
                                name="parking"
                                rules={{
                                  required: "Parking is required",
                                }}
                                render={({
                                  field: { value, onChange, name },
                                }) => (
                                  <Select
                                    options={parkingOption}
                                    name={name}
                                    className="select"
                                    value={parkingValue}
                                    placeholder="Select parking"
                                    setMultiselectOption={
                                      setParkingValue
                                    }
                                    showCreative={''}
                                    onChange={(e) => {
                                      onChange(e);
                                      handleCustum(e, "parking");
                                    }}
                                    closeMenuOnSelect={false}
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
                          <div className="col-6 col-lg-6">
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
                                    value={buyerTypeValue}
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
                              <label>Location Flaws (Multi-Select)<span>*</span></label>
                              <div className="form-group">
                                <MultiSelect
                                  name="property_flaw"
                                  options={locationFlawsOption}
                                  selectValue={locationFlaws}
                                  placeholder="Select Location Flaws"
                                  setMultiselectOption={setLocationFlawsValue}
                                  setSelectValues={setLocationFlaws}
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
                                    onChange={(e) => {
                                      setSolar(e.target.value);
                                    }}
                                    checked={solar === "1" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setSolar(e.target.value);
                                    }}
                                    checked={solar === "0" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setPool(e.target.value);
                                    }}
                                    checked={pool === "1" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setPool(e.target.value);
                                    }}
                                    checked={pool === "0" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setSeptic(e.target.value);
                                    }}
                                    checked={septic === "1" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setSeptic(e.target.value);
                                    }}
                                    checked={septic === "0" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setWell(e.target.value);
                                    }}
                                    checked={well === "1" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setWell(e.target.value);
                                    }}
                                    checked={well === "0" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setHoa(e.target.value);
                                    }}
                                    checked={hoa === "1" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setHoa(e.target.value);
                                    }}
                                    checked={hoa === "0" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setAgeRestriction(e.target.value);
                                    }}
                                    checked={
                                      ageRestriction === "1" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setAgeRestriction(e.target.value);
                                    }}
                                    checked={
                                      ageRestriction === "0" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setRentalRestriction(e.target.value);
                                    }}
                                    checked={
                                      rentalRestriction === "1" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setRentalRestriction(e.target.value);
                                    }}
                                    checked={
                                      rentalRestriction === "0" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setPostPossession(e.target.value);
                                    }}
                                    checked={
                                      postPossession === "1" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setPostPossession(e.target.value);
                                    }}
                                    checked={
                                      postPossession === "0" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setTenantConveys(e.target.value);
                                    }}
                                    checked={
                                      tenantConveys === "1" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setTenantConveys(e.target.value);
                                    }}
                                    checked={
                                      tenantConveys === "0" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setSquatters(e.target.value);
                                    }}
                                    checked={squatters === "1" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setSquatters(e.target.value);
                                    }}
                                    checked={squatters === "0" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setBuildingRequired(e.target.value);
                                    }}
                                    checked={
                                      buildingRequired === "1" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setBuildingRequired(e.target.value);
                                    }}
                                    checked={
                                      buildingRequired === "0" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setRebuild(e.target.value);
                                    }}
                                    checked={rebuild === "1" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setRebuild(e.target.value);
                                    }}
                                    checked={rebuild === "0" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setFoundationIssues(e.target.value);
                                    }}
                                    checked={
                                      foundationIssues === "1" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setFoundationIssues(e.target.value);
                                    }}
                                    checked={
                                      foundationIssues === "0" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setMold(e.target.value);
                                    }}
                                    checked={mold === "1" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setMold(e.target.value);
                                    }}
                                    checked={mold === "0" ? "checked" : ""}
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
                                    onChange={(e) => {
                                      setFireDamaged(e.target.value);
                                    }}
                                    checked={
                                      fireDamaged === "1" ? "checked" : ""
                                    }
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
                                    onChange={(e) => {
                                      setFireDamaged(e.target.value);
                                    }}
                                    checked={
                                      fireDamaged === "0" ? "checked" : ""
                                    }
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
                                  <label>Permanently affixed</label>
                                  <div className="label-container">
                                    <input
                                      type="radio"
                                      name="permanent_affix"
                                      value="1"
                                      id="permanent_affix_yes"
                                      onChange={(e) =>
                                        setPermanentAffix(e.target.value)
                                      }
                                      checked={permanentAffix === "1"}
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
                                      onChange={(e) =>
                                        setPermanentAffix(e.target.value)
                                      }
                                      checked={permanentAffix === "0"}
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

                        <div className="submit-btn">
                          <button
                            type="submit"
                            className="btn btn-fill"
                            disabled={miniLoader ? "disabled" : ""}
                          >
                            Submit Now! {miniLoader ? <MiniLoader /> : ""}{" "}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* <BuyerProfilePayment
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        /> */}
      </section>
      <Footer />
    </>
  );
}
export default EditBuyerProfile;

