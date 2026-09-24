import React from "react";

const ApprorvedPage = ({handleNext,stepNameData}) => {
    return (
        <>
          <div className="linkExpire successfull profile-verification-st profile-congtrs">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 col-md-8 col-12 mx-auto">
                  <div className="cards">
                    <div className="expireImg mx-auto">
                        <img
                            src="/assets/images/congrats.svg"
                            alt="expire link"
                        />
                    </div>
                    <div className="heading text-black">Congratulations !</div>
                    <div className="subheading my-md-3 my-2 text-black">
                      {stepNameData}
                    </div>
                    <button className="btn btn-fill" onClick={handleNext}>Okay</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
    );
}

export default ApprorvedPage;