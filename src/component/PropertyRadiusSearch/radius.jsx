import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Circle, Marker, Autocomplete, InfoWindow } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

const AddAddressAndRadius = () => {
  const [circles, setCircles] = useState([]);
  const [selectedCircleIndex, setSelectedCircleIndex] = useState(null);
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState(2000);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const autocompleteRef = useRef(null);
  const googleMapsApiKey =     process.env.REACT_APP_GOOGLE_MAP_KEY;

  // Fetch coordinates using Google Geocoding API
  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        return data.results[0].geometry.location;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
    return null;
  };

  // Handle place selection from Autocomplete
  const handlePlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        addNewCircle(newLocation, place.formatted_address);
        setMapCenter(newLocation);
      }
    }
  };

  // Add new circle for a manually entered address
  const handleAddRadius = async () => {
    if (!address) return;
    const newLocation = await fetchCoordinates(address);
    if (newLocation) {
      addNewCircle(newLocation, address);
      setMapCenter(newLocation);
    } else {
      alert("Invalid address! Please enter a valid location.");
    }
  };

  // Add a new circle
  const addNewCircle = (location, address) => {
    setCircles((prevCircles) => [...prevCircles, { center: location, radius: 2000, address }]);
    setSelectedCircleIndex(circles.length);
    setRadius(2000);
    setAddress("");
  };

  // Handle Circle Drag
  const handleCircleDragEnd = (event, index) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setCircles((prevCircles) =>
      prevCircles.map((circle, i) => (i === index ? { ...circle, center: { lat: newLat, lng: newLng } } : circle))
    );
  };

  // Handle Radius Change
  const handleRadiusChange = (e) => {
    const newRadius = Number(e.target.value);
    setRadius(newRadius);
    setCircles((prevCircles) =>
      prevCircles.map((circle, i) => (i === selectedCircleIndex ? { ...circle, radius: newRadius } : circle))
    );
  };

  // Fetch User's Current Location on Page Load
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };

          setMapCenter(userLocation);

          // Reverse Geocode to get Address
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
              const userAddress = data.results[0].formatted_address;
              setAddress(userAddress);
              addNewCircle(userLocation, userAddress);
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          setMapCenter(defaultCenter);
        }
      );
    };

    fetchCurrentLocation();
  }, [googleMapsApiKey]);

  // Remove a Circle
  const removeCircle = (index) => {
    setCircles((prevCircles) => prevCircles.filter((_, i) => i !== index));
    if (selectedCircleIndex === index) {
      setSelectedCircleIndex(null);
    }
  };

  // Custom Range Slider Percentage Calculation
  const rangePercentage = ((radius - 800) / (10000 - 800)) * 100 - 1;
  const sliderRangeStyle = {
    background: `linear-gradient(to right, #3F53FE ${rangePercentage}%, #ffffff ${rangePercentage}%)`,
  };
  const metersToMiles = (meters) => (meters * 0.000621371).toFixed(2);

  return (
    <div className="map_radius_area">
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places", "geometry"]}>
        <div className="map-section">
          <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={12}>
            {circles.map((circle, index) => (
              <React.Fragment key={index}>
                <Circle
                  center={circle.center}
                  radius={circle.radius}
                  options={{
                    fillColor: index === selectedCircleIndex ? "#0000FF33" : "#FF000033",
                    strokeColor: index === selectedCircleIndex ? "#0000FF" : "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    draggable: true,
                  }}
                  onDragEnd={(event) => handleCircleDragEnd(event, index)}
                />
                <Marker position={circle.center} onClick={() => setSelectedCircleIndex(index)} />
                {selectedCircleIndex === index && (
                  <InfoWindow position={circle.center} onCloseClick={() => setSelectedCircleIndex(null)}>
                    <div>
                      <p><strong>Address:</strong> {circle.address || "No address available"}</p>
                      <button className="btn btn-danger" onClick={() => removeCircle(index)}>Remove</button>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            ))}
          </GoogleMap>
        </div>

        <div className="form-group" style={{ marginTop: "10px" }}>
          <label><strong>Enter Address:</strong></label>
          <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={handlePlaceSelected}>
            <input
              type="text"
              placeholder="Enter address"
              value={address}
              className="form-control w-100"
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "300px", marginLeft: "10px", padding: "5px" }}
            />
          </Autocomplete>
          <button onClick={handleAddRadius} style={{ marginLeft: "10px", padding: "5px", backgroundColor: "#4CAF50", color: "white", border: "none", margin: "4px 12px" }}>
            Add Radius
          </button>
        </div>

        {selectedCircleIndex !== null && (
          <div className="radius-control" style={{ marginTop: "20px" }}>
            <label><strong>Adjust Radius:</strong> {metersToMiles(radius)} miles</label>
            <input
              type="range"
              min="1000"
              max="10000"
              value={radius}
              onChange={handleRadiusChange}
              style={{
                ...sliderRangeStyle,
                width: "100%",
                height: "9px",
                borderRadius: "10px",
                appearance: "none",
                outline: "none",
              }}
            />
          </div>
        )}
      </LoadScript>
    </div>
  );
};

export default AddAddressAndRadius;
