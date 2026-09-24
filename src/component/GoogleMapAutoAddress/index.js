import React, { useEffect, useState } from "react";
import { Image, Modal } from "react-bootstrap";
import AddAddressAndRadius from "../PropertyRadiusSearch";


const GoogleMapAutoAddress = ({address, setAddress , setLatitude , latitude,longitude,setLongitude,radius,setRadius,addressList ,setAddressList,hideRadius}) => {
  const [addAddressModal, setAddAddressModal] = useState(false);
 
  const handleAddAddressModal = () =>{
    setAddAddressModal(true);
  }

  useEffect(() => {
    if (addressList.length > 0) {
      const firstAddress = addressList[0];
      setAddress(firstAddress.title);
    }
  }, [addressList, setAddress]);

  return (
    <>
      <div className="col-12 col-lg-12 add_address_seller">
        <label>Location<span>*</span></label>
        <div className="form-group position-relative">
          <input
            type="text"
            name="address"
              value={
                addressList.length > 0
                  ? addressList[0].title
                  : address
              }
            placeholder="Add Your Loaction"
            className="form-control"
          />
          <button type="button" className="add_address_input" onClick={() => handleAddAddressModal()}>
            {addressList.length === 0
               ? "Select Locations"
               : addressList.length === 1
               ? "1 Location Added"
               : `${addressList.length} Locations Added`}
            </button>
        </div>
      </div>
      <Modal show={addAddressModal} onHide={() => setAddAddressModal(false)} centered className="address_radius_modal">
        <Modal.Header closeButton className='new_modal_close'></Modal.Header>
        <Modal.Body className='space_modal'>
          <AddAddressAndRadius address={address} setAddress={setAddress} setAddAddressModal={setAddAddressModal} latitude={latitude} setLatitude={setLatitude}  longitude={longitude} setLongitude={setLongitude} radius={radius} setRadius={setRadius}  addressList={addressList} setAddressList={setAddressList} hideRadius={hideRadius}/>   
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GoogleMapAutoAddress;
