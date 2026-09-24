import React from "react";

const MoreBuyersResult = ({buyerData}) => {

    return(
        <>
        <div className="tab-pane fade" id="pills-more-buyers" role="tabpanel" aria-labelledby="pills-more-buyers-tab">
            <div className="property-critera">
                <div className="row">
                { buyerData.map((data) => { 
                    return(<div className="col-12 col-lg-6" key={data.id}>
                        <div className="property-critera-block">
                            <div className="critera-card">
                                <div className="center-align">
                                    <span className="price-img">
                                        <img src="./assets/images/price.svg" className="img-fluid" /></span>
                                    <p>Buyer</p>
                                </div>
                            </div>
                            <div className="property-critera-details">
                                <ul className="list-unstyled mb-0">
                                    <li>
                                        <span className="detail-icon">
                                            <img src="./assets/images/user-gradient.svg" className="img-fluid" />
                                        </span>
                                        <span className="name-dealer">{data.first_name} {data.last_name}</span>
                                    </li>
                                    <li>
                                        <span className="detail-icon">
                                            <img src="./assets/images/phone-gradient.svg" className="img-fluid" /></span>
                                        <a href={"tel:+1" + data.phone} className="name-dealer">+1 {data.phone}</a>
                                    </li>
                                    <li>
                                        <span className="detail-icon">
                                            <img src="./assets/images/email.svg" className="img-fluid"/></span>
                                        <a href={'mailto:'+data.email} className="name-dealer email-tag">{data.email}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>)})}
                </div>
            </div>
        </div>
        </>
    );
}

export default MoreBuyersResult;