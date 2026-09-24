import React from "react";
const RejectedPage = ({setProfileVerificationStatus,rejectMessage}) => {
    return (
        <>
          <div className="linkExpire successfull profile-verification-st">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-8 col-12 mx-auto">
                  <div className="cards">
                  <     div className="expireImg mx-auto">
                            <img
                                src="/assets/images/app-close.svg"
                                alt="expire link"
                            />
                        </div>
                        <div className="heading">Verification Failed !</div>
                        <div className="subheading my-md-3 my-2">
                          Your verification has been failed. So the following reason has been given below:
                        </div>
                        <div className="subheading my-md-3 my-2 text-danger">
                          {rejectMessage}
                        </div>
                        <button className="btn btn-fill" onClick={()=>setProfileVerificationStatus('')}>Okay</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
    );
}
export default RejectedPage;