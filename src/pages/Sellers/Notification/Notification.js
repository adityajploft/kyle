import React from "react";
import { Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function Notification({dealData}) {  
  return (
    <>
        <Row>
            <Col xs={12}>      
                <div className="seller-notification-card">
                    <h3>Notification</h3>
                    <div className="seller-notification-list">
                        {dealData.map((data,index)=>(
                            <div className="seller-notification-box" key={index}>
                                <div className="seller-notification-title">
                                    <h4>{data.title}</h4>
                                    <p>New Buy Added in your buyer list</p>
                                </div>
                                <div className="seller-notification-list">
                                    <div className="seller-notification-col">
                                        <div className="seller-notification-img">
                                            <Image className="img-fluid" src="./assets/images/home_buy.svg" alt=""/>
                                        </div>
                                        <div className="seller-notification-dis">
                                            <h4>{data.want_to_buy_count}</h4>
                                            <p>Want To Buy</p>
                                        </div>
                                    </div>
                                    <div className="seller-notification-col">
                                        <div className="seller-notification-img">
                                            <Image className="img-fluid" src="./assets/images/home_check.svg" alt=""/>
                                        </div>
                                        <div className="seller-notification-dis">
                                            <h4>{data.interested_count}</h4>
                                            <p>Interested</p>
                                        </div>
                                    </div>
                                    <div className="seller-notification-col">
                                        <div className="seller-notification-img">
                                            <Image className="img-fluid" src="./assets/images/home_close.svg" alt=""/>
                                        </div>
                                        <div className="seller-notification-dis">
                                            <h4>{data.not_interested_count}</h4>
                                            <p>Not Interested</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="seller-notification-view">
                                    <Link to={`/seller/property-deal-details/${data.id}`}>
                                        <Button className="btn btn-fill btn-w-icon">View Details</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Col>
        </Row>
    </>
  );
}
