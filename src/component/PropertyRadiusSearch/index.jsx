import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Circle, Marker, Autocomplete, InfoWindow } from '@react-google-maps/api';
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const mapContainerStyle = {
  width: '100%',
  height: '388px',
};

const METERS_PER_MILE = 1609.34;
const defaultRadius = 1 * METERS_PER_MILE;


const USA_POLYGON = [
  { lat: 49.38, lng: -124.77 },
  { lat: 32.53, lng: -117.12 },
  { lat: 25.84, lng: -97.40 },
  { lat: 29.76, lng: -95.36 },
  { lat: 30.33, lng: -81.65 },
  { lat: 35.22, lng: -80.84 },
  { lat: 40.71, lng: -74.00 },
  { lat: 45.52, lng: -122.67 },
  { lat: 49.38, lng: -124.77 }
];

const isInsideUSA = (lat, lng) => {
  if (!window.google || !window.google.maps) return true;

  const point = new window.google.maps.LatLng(lat, lng);

  return window.google.maps.geometry.poly.containsLocation(
    point,
    new window.google.maps.Polygon({ paths: USA_POLYGON })
  );
};

const isLocationInUSA = async (lat, lng) => {
  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        const country = results[0].address_components.find(comp =>
          comp.types.includes("country")
        );

        resolve(country?.short_name === "US");
      } else {
        resolve(false);
      }
    });
  });
};

const AddAddressAndRadius = (
  { address = [],
    setAddress = () => { },
    setAddAddressModal = () => { },
    latitude,
    longitude,

    setLatitude = () => { },
    setLongitude = () => { },
    radius = defaultRadius,
    setRadius = () => { },
    addressList = [],
    setAddressList = () => { },
    hideRadius,
  }
) => {
  const [center, setCenter] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const autocompleteRef = useRef(null);
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAP_KEY;
  const location = useLocation();
  const [errormsg, setErrormsg] = useState();
  const [activeMarker, setActiveMarker] = useState(null);
  const [mainRadius, setMainRadius] = useState();
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  useEffect(() => {
    if (center) {
      setLatitude(center.lat);
      setLongitude(center.lng);
    }
    setMainRadius(defaultRadius)
  }, [center, setLatitude, setLongitude]);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = { latitude: 38.9072, longitude: -77.0369 };
          setCenter({ lat: latitude, lng: longitude });

          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}&region=us`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
              setAddress(data.results[0].formatted_address);
            }
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
          setCenter({ lat: 38.9072, lng: -77.0369 });
          setAddress('Washington, USA');
        }
      );
    };

    fetchCurrentLocation();
  }, [googleMapsApiKey]);

  const fetchAddress = (location) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        console.error('Geocode error:', status);
        setAddress('No address available');
      }
    });
  };

  const handlePlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location = { lat, lng };
        setCenter(location);
        setLatitude(lat);
        setLongitude(lng);
        setAddress(place.formatted_address || 'No address available');
      }
    }
  };

  const handlePrimaryLocationDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();

    setLatitude(newLat);
    setLongitude(newLng);
    setCenter({ lat: newLat, lng: newLng });
    fetchAddress({ lat: newLat, lng: newLng });
  };

  const handleCircleDragEnd = (event, index) => {
    console.log(index, "  ");
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    const newLocation = { lat: newLat, lng: newLng };
    setCenter(newLocation);
    fetchAddress(newLocation);
    setAddressList(prev =>
      prev.map((item, idx) =>
        idx === index
          ? { ...item, latitude: newLat, longitude: newLng }
          : item
      )
    );
    setShowInfoWindow(false);
  };

  // const handleCircleDragEnd = async (event, index) => {
  //   const newLat = event.latLng.lat();
  //   const newLng = event.latLng.lng();

  //   const isUSA = await isLocationInUSA(newLat, newLng);

  //   if (!isUSA) {
  //     toast.error("Only USA locations are allowed");

  //     const prev = addressList[index];

  //     setTimeout(() => {
  //       setCenter({ lat: prev.latitude, lng: prev.longitude });
  //     }, 200);

  //     return;
  //   }

  //   const newLocation = { lat: newLat, lng: newLng };
  //   setCenter(newLocation);
  //   fetchAddress(newLocation);

  //   setAddressList(prev =>
  //     prev.map((item, idx) =>
  //       idx === index
  //         ? { ...item, latitude: newLat, longitude: newLng }
  //         : item
  //     )
  //   );

  //   setShowInfoWindow(false);
  // };

  const handleRadiusChange = (e, index) => {
    const miles = Number(e.target.value);
    if (!isNaN(miles) && miles >= 0) {
      const newList = [...addressList];
      newList[index].radius = Math.floor(miles * METERS_PER_MILE);
      setAddressList(newList);
      console.log(newList, "newList");
    }
  };

  const handleMarkerClick = (item, index) => {
    setShowInfoWindow(true);
    setActiveMarker(index);
    setCenter({ lat: item.latitude, lng: item.longitude });
    setAddress(item.title);
  };

  const handleInfoWindowClose = () => {
    setShowInfoWindow(false);
  };

  if (!center) {
    return <div>Loading map...</div>;
  }

  const rangePercentage = (((radius / METERS_PER_MILE) - 1) / (6 - 1)) * 100;
  const sliderRangeStyle = {
    background: `linear-gradient(to right, #3F53FE ${rangePercentage}%, #ffffff ${rangePercentage}%)`,
  };

  const buildCurrentAddressEntry = () => {
    if (!address || !address.trim() || latitude == null || longitude == null) {
      return null;
    }

    const roundedRadius = Math.floor(mainRadius);

    return {
      title: address.trim(),
      latitude,
      longitude,
      radius: roundedRadius,
      range: 0,
    };
  };

  const getAddressKey = (entry) => {
    if (!entry) return "";

    const normalizedTitle = String(entry.title || "").trim().toLowerCase();
    const normalizedLatitude = Number(entry.latitude);
    const normalizedLongitude = Number(entry.longitude);

    return [
      normalizedTitle,
      Number.isFinite(normalizedLatitude) ? normalizedLatitude.toFixed(6) : "",
      Number.isFinite(normalizedLongitude) ? normalizedLongitude.toFixed(6) : "",
    ].join("|");
  };

  const getNormalizedAddressTitle = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const isSameLocation = (firstEntry, secondEntry) => {
    if (!firstEntry || !secondEntry) {
      return false;
    }

    const firstTitle = getNormalizedAddressTitle(firstEntry.title);
    const secondTitle = getNormalizedAddressTitle(secondEntry.title);

    if (firstTitle && secondTitle && firstTitle === secondTitle) {
      return true;
    }

    const firstLatitude = Number(firstEntry.latitude);
    const firstLongitude = Number(firstEntry.longitude);
    const secondLatitude = Number(secondEntry.latitude);
    const secondLongitude = Number(secondEntry.longitude);

    if (
      !Number.isFinite(firstLatitude) ||
      !Number.isFinite(firstLongitude) ||
      !Number.isFinite(secondLatitude) ||
      !Number.isFinite(secondLongitude)
    ) {
      return false;
    }

    return (
      Math.abs(firstLatitude - secondLatitude) < 0.0001 &&
      Math.abs(firstLongitude - secondLongitude) < 0.0001
    );
  };

  const handleAddAddress = () => {
    const nextEntry = buildCurrentAddressEntry();

    if (!nextEntry) {
      setErrormsg("Address field cannot be empty");
      return false;
    }

    const exists = addressList.some(
      (item) =>
        getAddressKey(item) === getAddressKey(nextEntry) ||
        isSameLocation(item, nextEntry),
    );

    if (exists) {
      setErrormsg("This address is already added");
      return false;
    }

    setAddressList((prev) => [...prev, nextEntry]);

    setAddress("");
    setErrormsg("");
    return true;
  };
  const removeAddress = (indexToRemove) => {
    setErrormsg("");
    setAddressList(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className='map_radius_area'>
      <LoadScript
        googleMapsApiKey={googleMapsApiKey}
        libraries={['places', 'geometry']}
      >
        <div className='map-section'>
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
            {address && latitude && longitude && (
              <>
                <Circle
                  center={{ lat: latitude, lng: longitude }}
                  // radius={mainRadius}
                  // options={{
                  //   fillColor: '#0000FF33',
                  //   strokeColor: '#0000FF',
                  //   strokeOpacity: 0.8,
                  //   strokeWeight: 2,
                  //   draggable: true,
                  // }}
                  // onDragEnd={(e) => {
                  //   const newLat = e.latLng.lat();
                  //   const newLng = e.latLng.lng();
                  //   setLatitude(newLat);
                  //   setLongitude(newLng);
                  //   setCenter({ lat: newLat, lng: newLng });
                  //   fetchAddress({ lat: newLat, lng: newLng });
                  // }}
                  onDragEnd={async (e) => {
                    const newLat = e.latLng.lat();
                    const newLng = e.latLng.lng();
                    console.log(newLat, newLng, "new lat lng");
                    // const isUSA = await isLocationInUSA(newLat, newLng);

                    // if (!isUSA) {
                    //   toast.error("Only USA locations are allowed");

                    //   setTimeout(() => {
                    //     setCenter({ lat: latitude, lng: longitude });
                    //   }, 200);

                    //   return;
                    // }

                    setLatitude(newLat);
                    setLongitude(newLng);
                    setCenter({ lat: newLat, lng: newLng });
                    fetchAddress({ lat: newLat, lng: newLng });
                  }}
                />
                <Marker
                  position={{ lat: latitude, lng: longitude }}
                  draggable={true}
                  onDragEnd={handlePrimaryLocationDragEnd}
                />
              </>
            )}

            {addressList?.map((item, index) => (
              <>
                <Circle
                  key={`circle-${index}`}
                  center={{ lat: item.latitude, lng: item.longitude }}
                  radius={item.radius}
                  options={{
                    fillColor: '#0000FF33',
                    strokeColor: '#0000FF',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    draggable: true,
                  }}
                  onDragEnd={(e) => handleCircleDragEnd(e, index)}
                />
                {console.log(index, "index")}
                <Marker key={`marker-${index}`} position={{ lat: item.latitude, lng: item.longitude }} label={{
                  text: `${index + 1}`,
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }} onClick={() => handleMarkerClick(item, index)} />
                {activeMarker === index && showInfoWindow && (
                  <InfoWindow position={{ lat: item.latitude, lng: item.longitude }} onCloseClick={handleInfoWindowClose}>
                    <div>
                      <p><strong>Address:</strong> {item.title || 'No address available'}</p>
                    </div>
                  </InfoWindow>
                )}
              </>
            ))}
          </GoogleMap>
        </div>
        <div className="form-group position-relative" style={{ marginTop: '10px' }}>
          <label> <strong>Location:</strong></label>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceSelected}
          >
            <input
              type="text"
              placeholder="Enter address"
              name="address"
              value={address}
              className="form-control w-100"
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: '300px', marginLeft: '10px', padding: '5px' }}
            />
          </Autocomplete>
          <div>{errormsg}</div>
          {location.pathname !== '/seller/sellers-form' && (
          <button type="button" className="btn btn-outline-primary mt-2" onClick={handleAddAddress} disabled={isSubmittingAddress}>Select Location</button>
          )}
          {addressList.length > 0 && (
            <div className="mt-3">
              <ul className='address-list'>
                {addressList.map((item, index) => (
                  <li key={index}>
                    <div className='address_list_top'>
                      <div>
                        <p className='mb-0'>Location {index + 1}</p>
                        <p className='location'>{item.title}</p>
                      </div>
                      <button type="button" className="buttons" onClick={() => removeAddress(index)} aria-label={`Remove Location ${index + 1}`}>{ }</button>
                    </div>
                    {!hideRadius && (
                      <>
                        <div>
                          <div key={index} className='map_radius_info'>
                            <label>Radius (miles) <span>{(item.radius / METERS_PER_MILE).toFixed(0)} mi</span></label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              value={item.radius / METERS_PER_MILE}
                              onChange={(e) => handleRadiusChange(e, index)}
                              style={{
                                ...sliderRangeStyle,
                                width: "100%",
                                height: "9px",
                                borderRadius: "10px",
                                outline: "none",
                              }}
                            />
                          </div>
                          <div className='map_radius_info'>
                            <label className='mb-0'>Enter Radius Manually (miles)</label>
                            <input
                              type="number"
                              value={item.radius ? (item.radius / METERS_PER_MILE).toFixed(0) : ""}
                              min="1"
                              max="100"
                              step="1"
                              onChange={(e) => {
                                const value = e.target.value;
                                const newList = [...addressList]
                                if (value === '' || isNaN(value)) {
                                  newList[index].radius = ""
                                  setRadius('');
                                } else {
                                  const parsedValue = parseInt(value, 10);
                                  if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 100) {
                                    newList[index].radius = Math.floor(parsedValue * METERS_PER_MILE);
                                    setRadius(Math.floor(parsedValue * METERS_PER_MILE));
                                  }
                                }
                                setAddressList(newList);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "-" || e.key === "+" || e.key === ".") {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>
                          {/* <div className="map_radius_info">
                            <label className="mb-0">Range</label>

                            <input
                              type="number"
                              min="0"
                              value={item.range === "" ? "" : item.range ?? 0}
                              onChange={(e) => {
                                let value = e.target.value;
                                if (value !== "" && Number(value) < 0) return;
                                const newList = [...addressList];
                                newList[index] = {
                                  ...newList[index],
                                  range: value, 
                                };

                                setAddressList(newList);
                              }}
                              onBlur={() => {
                                const newList = [...addressList];
                                newList[index] = {
                                  ...newList[index],
                                  range:
                                    item.range === "" || item.range === null
                                      ? 0
                                      : Number(item.range),
                                };
                                setAddressList(newList);
                              }}
                              onKeyDown={(e) => {
                                if (["-", "+", "e", "."].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div> */}

                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </LoadScript>
      {location.pathname !== '/seller/sellers-form' ? (
        <>
          <button
            className="btn btn-fill"
            disabled={isSubmittingAddress}
            onClick={() => {
              if (isSubmittingAddress) {
                return;
              }

              setIsSubmittingAddress(true);

              try {
                const currentEntry = buildCurrentAddressEntry();
                const exists = addressList.some((item) =>
                  isSameLocation(item, currentEntry),
                );

                if (!address || address.trim() === '') {
                  setErrormsg("Address field cannot be empty");
                  return;
                }

                if (!exists) {
                  const added = handleAddAddress();
                  if (!added) {
                    return;
                  }
                } else {
                  setErrormsg("");
                }

                setAddAddressModal(false);
              } finally {
                setIsSubmittingAddress(false);
              }
            }}
          >
            Submit Now!
          </button>

        </>
      ) : (
        <button className="btn btn-fill" disabled={isSubmittingAddress} onClick={() => { setAddAddressModal(false) }}>Submit Now!</button>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddAddressAndRadius;















// import React, { useState, useRef, useEffect } from 'react';
// import { GoogleMap, LoadScript, Circle, Marker, Autocomplete, InfoWindow } from '@react-google-maps/api';
// import { useLocation } from "react-router-dom";

// const mapContainerStyle = {
//   width: '100%',
//   height: '388px',
// };

// const METERS_PER_MILE = 1609.34;
// const defaultRadius = 1 * METERS_PER_MILE;

// const AddAddressAndRadius = (
//   { address = [],
//     setAddress = () => { },
//     setAddAddressModal = () => { },
//     latitude,
//     longitude,

//     setLatitude = () => { },
//     setLongitude = () => { },
//     radius = defaultRadius,
//     setRadius = () => { },
//     addressList = [],
//     setAddressList = () => { },
//     hideRadius,
//   }
// ) => {
//   const [center, setCenter] = useState(null);
//   const [showInfoWindow, setShowInfoWindow] = useState(false);
//   const autocompleteRef = useRef(null);
//   const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAP_KEY;
//   const location = useLocation();
//   const [errormsg, setErrormsg] = useState();
//   const [activeMarker, setActiveMarker] = useState(null);
//   const [mainRadius, setMainRadius] = useState();

//   useEffect(() => {
//     if (center) {
//       setLatitude(center.lat);
//       setLongitude(center.lng);
//     }
//     setMainRadius(defaultRadius)
//   }, [center, setLatitude, setLongitude]);

//   useEffect(() => {
//     const fetchCurrentLocation = async () => {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = { latitude: 38.9072, longitude: -77.0369 };
//           setCenter({ lat: latitude, lng: longitude });

//           try {
//             const response = await fetch(
//               `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}&region=us`
//             );
//             const data = await response.json();
//             if (data.results && data.results[0]) {
//               setAddress(data.results[0].formatted_address);
//             }
//           } catch (error) {
//             console.error('Error fetching address:', error);
//           }
//         },
//         (error) => {
//           console.error('Error fetching geolocation:', error);
//           setCenter({ lat: 38.9072, lng: -77.0369 });
//           setAddress('Washington, USA');
//         }
//       );
//     };

//     fetchCurrentLocation();
//   }, [googleMapsApiKey]);

//   const fetchAddress = (location) => {
//     const geocoder = new window.google.maps.Geocoder();
//     geocoder.geocode({ location }, (results, status) => {
//       if (status === 'OK' && results[0]) {
//         setAddress(results[0].formatted_address);
//       } else {
//         console.error('Geocode error:', status);
//         setAddress('No address available');
//       }
//     });
//   };

//   const handlePlaceSelected = () => {
//     if (autocompleteRef.current) {
//       const place = autocompleteRef.current.getPlace();
//       if (place.geometry && place.geometry.location) {
//         const lat = place.geometry.location.lat();
//         const lng = place.geometry.location.lng();
//         const location = { lat, lng };
//         setCenter(location);
//         setLatitude(lat);
//         setLongitude(lng);
//         setAddress(place.formatted_address || 'No address available');
//       }
//     }
//   };

//   const handleCircleDragEnd = (event, index) => {
//     const newLat = event.latLng.lat();
//     const newLng = event.latLng.lng();
//     const newLocation = { lat: newLat, lng: newLng };
//     setCenter(newLocation);
//     fetchAddress(newLocation);
//     setAddressList(prev =>
//       prev.map((item, idx) =>
//         idx === index
//           ? { ...item, latitude: newLat, longitude: newLng }
//           : item
//       )
//     );
//     setShowInfoWindow(false);
//   };

//   const handleRadiusChange = (e, index) => {
//     const miles = Number(e.target.value);
//     if (!isNaN(miles) && miles >= 0) {
//       const newList = [...addressList];
//       newList[index].radius = Math.floor(miles * METERS_PER_MILE);
//       setAddressList(newList);
//       console.log(newList, "newList");
//     }
//   };

//   const handleMarkerClick = (item, index) => {
//     setShowInfoWindow(true);
//     setActiveMarker(index);
//     setCenter({ lat: item.latitude, lng: item.longitude });
//     setAddress(item.title);
//   };

//   const handleInfoWindowClose = () => {
//     setShowInfoWindow(false);
//   };

//   if (!center) {
//     return <div>Loading map...</div>;
//   }

//   const rangePercentage = (((radius / METERS_PER_MILE) - 1) / (6 - 1)) * 100;
//   const sliderRangeStyle = {
//     background: `linear-gradient(to right, #3F53FE ${rangePercentage}%, #ffffff ${rangePercentage}%)`,
//   };

//   const handleAddAddress = () => {
//     const exists = addressList.some(
//       item =>
//         item.title === address
//     );
//     if (!exists && address && latitude && longitude) {
//       const roundedRadius = Math.floor(mainRadius);
//       setAddressList(prev => [
//         ...prev,
//         { title: address, latitude: latitude, longitude: longitude, radius: roundedRadius, range: 0 }
//       ]);
//       setAddress('');
//       setErrormsg("");
//     }
//   };
//   const removeAddress = (indexToRemove) => {
//     setAddressList(prev => prev.filter((_, index) => index !== indexToRemove));
//   };

//   return (
//     <div className='map_radius_area'>
//       <LoadScript
//         googleMapsApiKey={googleMapsApiKey}
//         libraries={['places', 'geometry']}
//       >
//         <div className='map-section'>
//           <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={12}>
//             {address && latitude && longitude && (
//               <>
//                 <Circle
//                   center={{ lat: latitude, lng: longitude }}
//                   radius={mainRadius}
//                   options={{
//                     fillColor: '#0000FF33',
//                     strokeColor: '#0000FF',
//                     strokeOpacity: 0.8,
//                     strokeWeight: 2,
//                     draggable: true,
//                   }}
//                   onDragEnd={(e) => {
//                     const newLat = e.latLng.lat();
//                     const newLng = e.latLng.lng();
//                     setLatitude(newLat);
//                     setLongitude(newLng);
//                     setCenter({ lat: newLat, lng: newLng });
//                     fetchAddress({ lat: newLat, lng: newLng });
//                   }}
//                 />
//                 <Marker position={{ lat: latitude, lng: longitude }} />
//               </>
//             )}

//             {addressList.map((item, index) => (
//               <>
//                 <Circle
//                   key={`circle-${index}`}
//                   center={{ lat: item.latitude, lng: item.longitude }}
//                   radius={item.radius}
//                   options={{
//                     fillColor: '#0000FF33',
//                     strokeColor: '#0000FF',
//                     strokeOpacity: 0.8,
//                     strokeWeight: 2,
//                     draggable: true,
//                   }}
//                   onDragEnd={(e) => handleCircleDragEnd(e, index)}
//                 />
//                 {console.log(index, "index")}
//                 <Marker key={`marker-${index}`} position={{ lat: item.latitude, lng: item.longitude }} label={{
//                   text: `${index + 1}`,
//                   color: 'white',
//                   fontSize: '14px',
//                   fontWeight: 'bold',
//                 }} onClick={() => handleMarkerClick(item, index)} />
//                 {activeMarker === index && showInfoWindow && (
//                   <InfoWindow position={{ lat: item.latitude, lng: item.longitude }} onCloseClick={handleInfoWindowClose}>
//                     <div>
//                       <p><strong>Address:</strong> {item.title || 'No address available'}</p>
//                     </div>
//                   </InfoWindow>
//                 )}
//               </>
//             ))}
//           </GoogleMap>
//         </div>
//         <div className="form-group position-relative" style={{ marginTop: '10px' }}>
//           <label> <strong>Location:</strong></label>
//           <Autocomplete
//             onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
//             onPlaceChanged={handlePlaceSelected}
//             options={{ componentRestrictions: { country: "us" } }}
//           >
//             <input
//               type="text"
//               placeholder="Enter address"
//               name="address"
//               value={address}
//               className="form-control w-100"
//               onChange={(e) => setAddress(e.target.value)}
//               style={{ width: '300px', marginLeft: '10px', padding: '5px' }}
//             />
//           </Autocomplete>
//           <div>{errormsg}</div>
//           {location.pathname !== '/seller/sellers-form' && (
//             <button className="btn btn-outline-primary mt-2" onClick={handleAddAddress}>Select Location</button>
//           )}
//           {addressList.length > 0 && (
//             <div className="mt-3">
//               <ul className='address-list'>
//                 {addressList.map((item, index) => (
//                   <li key={index}>
//                     <div className='address_list_top'>
//                       <div>
//                         <p className='mb-0'>Location {index + 1}</p>
//                         <p className='location'>{item.title}</p>
//                       </div>
//                       <button className="buttons" onClick={() => removeAddress(index)}>{ }</button>
//                     </div>
//                     {!hideRadius && (
//                       <>
//                         <div>
//                           <div key={index} className='map_radius_info'>
//                             <label>Radius (miles) <span>{(item.radius / METERS_PER_MILE).toFixed(0)} mi</span></label>
//                             <input
//                               type="range"
//                               min="0"
//                               max="100"
//                               step="1"
//                               value={item.radius / METERS_PER_MILE}
//                               onChange={(e) => handleRadiusChange(e, index)}
//                               style={{
//                                 ...sliderRangeStyle,
//                                 width: "100%",
//                                 height: "9px",
//                                 borderRadius: "10px",
//                                 outline: "none",
//                               }}
//                             />
//                           </div>
//                           <div className='map_radius_info'>
//                             <label className='mb-0'>Enter Radius Manually (miles)</label>
//                             <input
//                               type="number"
//                               value={item.radius ? (item.radius / METERS_PER_MILE).toFixed(0) : ""}
//                               min="1"
//                               max="100"
//                               step="1"
//                               onChange={(e) => {
//                                 const value = e.target.value;
//                                 const newList = [...addressList]
//                                 if (value === '' || isNaN(value)) {
//                                   newList[index].radius = ""
//                                   setRadius('');
//                                 } else {
//                                   const parsedValue = parseInt(value, 10);
//                                   if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 100) {
//                                     newList[index].radius = Math.floor(parsedValue * METERS_PER_MILE);
//                                     setRadius(Math.floor(parsedValue * METERS_PER_MILE));
//                                   }
//                                 }
//                                 setAddressList(newList);
//                               }}
//                               onKeyDown={(e) => {
//                                 if (e.key === "-" || e.key === "+" || e.key === ".") {
//                                   e.preventDefault();
//                                 }
//                               }}
//                             />
//                           </div>
//                           <div className="map_radius_info">
//                             <label className="mb-0">Range</label>

//                             <input
//                               type="number"
//                               min="0"
//                               value={item.range === "" ? "" : item.range ?? 0}
//                               onChange={(e) => {
//                                 let value = e.target.value;
//                                 if (value !== "" && Number(value) < 0) return;
//                                 const newList = [...addressList];
//                                 newList[index] = {
//                                   ...newList[index],
//                                   range: value,
//                                 };

//                                 setAddressList(newList);
//                               }}
//                               onBlur={() => {
//                                 const newList = [...addressList];
//                                 newList[index] = {
//                                   ...newList[index],
//                                   range:
//                                     item.range === "" || item.range === null
//                                       ? 0
//                                       : Number(item.range),
//                                 };
//                                 setAddressList(newList);
//                               }}
//                               onKeyDown={(e) => {
//                                 if (["-", "+", "e", "."].includes(e.key)) {
//                                   e.preventDefault();
//                                 }
//                               }}
//                             />
//                           </div>

//                         </div>
//                       </>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//       </LoadScript>
//       {location.pathname !== '/seller/sellers-form' ? (
//         <>
//           <button
//             className="btn btn-fill"
//             onClick={() => {
//               const exists = addressList.some(
//                 item => item.title === address &&
//                   item.latitude === latitude &&
//                   item.longitude === longitude
//               );

//               if (!address || address.trim() === '') {
//                 setErrormsg("Address field cannot be empty");
//                 return;
//               }

//               setAddAddressModal(false);
//             }}
//           >
//             Submit Now!
//           </button>

//         </>
//       ) : (
//         <button className="btn btn-fill" onClick={() => { setAddAddressModal(false) }}>Submit Now!</button>
//       )}
//     </div>
//   );
// };

// export default AddAddressAndRadius;
