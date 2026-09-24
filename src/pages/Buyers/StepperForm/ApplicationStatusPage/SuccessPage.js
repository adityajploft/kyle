import React from "react";

const SuccessPage = () => {
  return (
    <>
      <div className="linkExpire successfull h-auto">
        <div className="container">
          <div className="row h-100 align-items-center mx-0">
            <div className="col-lg-10 col-md-11 col-12 mx-auto">
              <div className="cards p-4">
                <div className="row cardBody mx-0 py-5">
                  <div className="col-xl-6 col-lg-7 col-md-8 col-9 mx-auto">
                    <div className="expireImg mx-auto">
                      <img
                        src="/assets/images/success_message.svg"
                        className="w-100"
                        alt="expire link"
                      />
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <div className="heading">Thank you!</div>
                    <div className="subheading my-md-3 my-2">
                      Your profile has been successfully verified.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
