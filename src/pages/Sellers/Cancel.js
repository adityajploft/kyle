import React from "react";
import axios from "axios";
import {useNavigate , Link} from "react-router-dom";

const Cancel = () => {
  const body = document.querySelector('body');
  body.classList.remove('bg-img');
    return (
      <div className="payment-bg">
        <div className="card payment-card p-5">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <span className="payment-card_danger payment-card__success"><img src="/assets/images/delete.svg"/>
            </span>
          </div>
          <h1 className="payment-card__msg fw-bold m-0">Sorry ! Payment Not Completed</h1>
          <h2 className="payment-card__submsg">Please try again</h2>
          <div className="payment-card__tags">
              <Link to="/">
                <div className="payment-card__tag submit-btn"> <button type="submit" className="btn btn-fill px-4 py-1 w-auto">Back to home</button></div>
              </Link>
          </div>
        </div>
      </div>
    )
}
export default Cancel;