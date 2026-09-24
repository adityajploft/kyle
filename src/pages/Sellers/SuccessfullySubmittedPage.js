import React from "react";

const SuccessfullySubmittedPage = ({isSubmitted}) => {
    const body = document.querySelector('body');
    body.classList.remove('bg-img');
    return (
    <div className="linkExpire successfull">
        <div className="container h-100">
            <div className="row h-100 align-items-center mx-0">
                <div className="col-lg-10 col-md-11 col-12 mx-auto">
                    <div className="cards p-4">
                        <div className="row cardBody mx-0 py-5">
                            <div className="col-xl-6 col-lg-7 col-md-8 col-9 mx-auto">
                                <div className="expireImg mx-auto"><img src="/assets/images/success_message.svg" className="w-100" alt="expire link"/></div>
                            </div>
                            <div className="col-12 text-center">
                                <div className="heading">Thank you!</div>
                                {isSubmitted ? 
                                    <div className="subheading my-md-3 my-2">Success! Check your email to finalize your account setup</div>:
                                    <div className="subheading my-md-3 my-2">Your form has been successfully submitted.</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
export default SuccessfullySubmittedPage;