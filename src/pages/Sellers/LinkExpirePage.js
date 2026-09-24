import React from "react";
import {Link } from "react-router-dom";
const LinkExpirePage = ({type}) => {
    const body = document.querySelector('body');
    body.classList.remove('bg-img');
    return (
    <div className="linkExpire">
        <div className="container h-100">
            <div className="row h-100 align-items-center mx-0">
                <div className="col-lg-10 col-md-11 col-12 mx-auto">
                    <div className="cards p-4">
                        <div className="row cardBody mx-0">
                            <div className="col-xl-6 col-lg-7 col-md-8 col-9 mx-auto">
                                <div className="expireImg"><img src="/assets/images/expire.png" className="w-100" alt="expire link"/></div>
                            </div>
                            <div className="col-12 text-center">
                                {(type === 'buyer-password-verify') ?
                                    <>
                                        <div className="subheading my-md-3 my-2">Your Email is already Verified. Please Login</div>
                                        <Link to='/login'> <button className="btn btn-primary">Login</button></Link>
                                    </>:
                                    <>
                                        <div className="heading">The link has expired</div>
                                        <div className="subheading my-md-3 my-2">Oops! This URL is not valid anymore</div>
                                    </>
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
export default LinkExpirePage;