import React, { useState, useEffect } from 'react';

function MyLocation() {
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);
  console.log( 'Latitude:',position.latitude, 'Longitude:' ,position.longitude);
  return (
    <div>
    </div>
  );
}

export default MyLocation;