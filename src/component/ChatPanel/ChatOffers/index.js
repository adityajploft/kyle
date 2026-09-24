import { useAuth } from '../../../hooks/useAuth';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useFormError } from "../../../hooks/useFormError";
import { useNavigate } from "react-router-dom";

const ChatOffers = ({ messages, priceMessages, activeUserData }) => {
    const [acceptOffer, setAcceptOffer] = useState(false);
    const [buyerDetails, setBuyerDetails] = useState([]);
    const { getTokenData, setLogout } = useAuth();
    const { setErrors } = useFormError();
    const currentDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
    const apiUrl = process.env.REACT_APP_API_URL;
    const { id = '', logId = '' } = useParams();
    let navigate = useNavigate();
   
    const handleAcceptOfferClose = () => {
        setAcceptOffer(false);
    }

    const handleAcceptOffer = (e) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to accept this offer and mark this property as sold!",
            icon: "warning",
            showDenyButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                handleMarkSold();
            } else {
                setAcceptOffer(false);
            }
        });
    }

    const handleMarkSold = async () => {
        try {
            let headers = {
                Accept: "application/json",
                Authorization: "Bearer " + getTokenData().access_token,
                "auth-token": getTokenData().access_token,
            };
            let response = await axios.post(
                `${apiUrl}update-buyer-deal/${id}`,
                {
                    search_log_id: logId, status: 1,
                },
                { headers: headers }
            );
            setBuyerDetails(prev => ({
                ...prev,
                buyers: { ...prev.buyers, mark_as_sold: true }
            }));
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            navigate(`/seller/property-deal-details/${logId}`);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setLogout();
                }
                if (error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
                if (error.response.data.error) {
                    toast.error(error.response.data.error, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            }
        }
    }
    return (
        <>
            <div>
                <div className="day-header line-with-text"><span>{currentDate}</span></div>
                {Object.entries(priceMessages).map(([msg, pricemsg], index) => (
                    <div key={msg.id} className={` ${msg.type === "outgoing" ? "outgoing_msg" : "false"}`}>
                        <div className="day-header line-with-text"><span>{msg}</span>
                        </div>

                        {
                            pricemsg.map((data, index) => (
                                <>
                                    {console.log(data, "data")}
                                    
                                    <div className={`offer_item ${data.sender_id !== activeUserData.id && 'outgoing_msg'}`} >
                                        <div className="msg_content">
                                            <span>My Offer</span>
                                            <h4>${data.content}</h4>
                                        </div>
                                        <p>{data.date_time_label} {data.created_time}</p>
                                    </div>
                                    <p className="msg_time">
                                        {/* {data.date_time_label} {data.created_time} */}
                                    </p>
                                </>
                            ))
                        }
                    </div>
                ))}
            </div>
        </>
    );
};
export default ChatOffers;