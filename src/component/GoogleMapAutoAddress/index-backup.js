import React, { useEffect, useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const GoogleMapAutoAddress = ({ dataObj , register = '', errors=''}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_KEY, 
    libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <AutocompleteInput
      address={dataObj.address}
      setAddress={dataObj.setAddress}
      city={dataObj.city}
      setCity={dataObj.setCity}
      state={dataObj.state}
      setState={dataObj.setState}
      zipCode={dataObj.zipCode}
      setZipCode={dataObj.setZipCode}
      register={register}
      serverError ={dataObj.renderFieldError || ''}
      errors={errors}
    />
  );
};

const AutocompleteInput = ({
  address,
  setAddress,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode,
  register,
  serverError,
  errors,
}) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["address"], 
    },
    debounce: 300,
  });

 
  useEffect(() => {
    if (address) {
      setValue(address);
    }
  }, [address]);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(true);
  const handleSelect = async (selectedAddress) => {
    setValue(selectedAddress, false);
    setIsVisible(true);
    setAddress(selectedAddress);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: selectedAddress });
      const { lat, lng } = await getLatLng(results[0]);
      console.log("Coordinates:", { lat, lng });

      const addressComponents = results[0].address_components;

      const cityComponent = addressComponents.find((component) =>
        component.types.includes("locality") || component.types.includes("administrative_area_level_2")
      );
      const stateComponent = addressComponents.find((component) =>
        component.types.includes("administrative_area_level_1")
      );
      const pinComponent = addressComponents.find((component) =>
        component.types.includes("postal_code")
      );

      // setCity(cityComponent?.long_name || "");
      // setState(stateComponent?.long_name || "");
      // setZipCode(pinComponent?.long_name || "");
    } catch (error) {
      console.error("Error getting geocode data:", error);
    }
  };

  const handleChangeAddress = (e) => {
    if(e.target.value.trim() == ""){
      setZipCode("");
      setState("");
      setCity("");
    }
    setValue(e.target.value);
    setAddress(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    setIsVisible(false);
    if (status === "OK") {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) => Math.min(prevIndex + 1, data.length - 1));
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (e.key === "Enter") {
        if (highlightedIndex >= 0) {
          handleSelect(data[highlightedIndex].description);
        } else {
          clearSuggestions();
        }
        e.preventDefault();
      }
    }
  };
  return (
    <>
      <div className="col-12 col-lg-12">
        <label>Address<span>*</span></label>
        <div className="form-group position-relative">
          <input
            type="text"
            name="address"
            value={value} // Use value from usePlacesAutocomplete hook
            disabled={!ready}
            placeholder="Type your location"
            className="form-control"
            {...(register ? register("address", { required: "Address is required" }) : {})}
            onChange={handleChangeAddress}
            onKeyDown={handleKeyDown}
          />
          {(status === "OK" && !isVisible) && (
            <ul className="auto_address_list">
              {data.map(({ place_id, description }, index) => (
                <li
                  key={place_id}
                  onClick={() => handleSelect(description)}
                  className={index === highlightedIndex ? "highlighted" : ""}
                  style={{
                    backgroundColor: index === highlightedIndex ? "#e1e2f1" : "",
                  }}
                >
                  {description}
                </li>
              ))}
            </ul>
          )}
          {errors.address && (<p className="error">{errors.address?.message}</p>)}
          {serverError && serverError('address')}
          
        </div>
      </div>
      {/* <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
        <label>State</label>
        <div className="form-group">
          <input type="text" value={state} name="state" readOnly className="form-control" />
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
        <label>City</label>
        <div className="form-group">
          <input type="text" value={city} name="city" readOnly className="form-control" />
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
        <label>Pin Code</label>
        <div className="form-group">
          <input type="text" value={zipCode} name="zip_code" readOnly className="form-control" />
        </div>
      </div> */}
    </>
  );
};

export default GoogleMapAutoAddress;
