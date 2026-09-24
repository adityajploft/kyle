import React from "react";
import ButtonLoader from "../../../partials/MiniLoader";

const ApplicationProcess = ({ miniLoader }) => {
  return (
    <>
      <fieldset>
        <div className="card-box-blocks">
          <div className="application-process">
            <div className="pricehard">$100</div>
            <h3>Please Submit Your Application Fee</h3>
            <p className="mb-0">
              You will be redirected to schedule your virtual verification meeting. Please be on-time for your meeting as the application fee is non-refundable.
            </p>
            <div className="process-payment-btn">
              <button type="submit" className="btn btn-fill">
                Process Payment {miniLoader ? <ButtonLoader /> : ""}
              </button>
            </div>
          </div>
        </div>
      
      </fieldset>
    </>
  );
};

export default ApplicationProcess;
