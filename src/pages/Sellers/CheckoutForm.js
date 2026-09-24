import { useState } from "react";
import { useStripe, useElements,AddressElement, PaymentElement, LinkAuthenticationElement} from "@stripe/react-stripe-js";
import {useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CheckoutForm({setClientSecret}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });

  const handleAddressChange = (event) => {
      setAddress({
        ...address,
        [event.target.name]: event.target.value,
      });
  };

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    const baseUrl = window.location.origin;
    const { error, payment  } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${baseUrl}/completion`,
      },
    });
    if (!error) {
      console.log(`Payment successful! Amount: ${payment}`);
    } 
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else if(error.type === 'card_error' || error.type === 'invalid_request_error'){
      toast.error("Sorry! Your Payment is not Completed Try Again", {position: toast.POSITION.TOP_RIGHT});
      window.location.reload();
    }else {
      console.log(error);
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" cancelUrl={`${window.location.origin}/cancel`}/>
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}