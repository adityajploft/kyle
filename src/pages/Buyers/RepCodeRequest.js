import React from "react";
import BuyerHeader from "../../partials/BuyerHeader";
import Footer from "../../partials/Footer";
import RepCodeRequestForm from "../../component/RepCodeRequestForm/RepCodeRequestForm";

const BuyerRepCodeRequest = () => {
  return (
    <>
      <BuyerHeader />
      <RepCodeRequestForm role="buyer" />
      <Footer />
    </>
  );
};

export default BuyerRepCodeRequest;
