import React from "react";
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function BuyerCard({
  data,
  handleLikeClick,
  handleDisikeClick,
  handleClickEditFlag,
  index,
}) {
  // let PreferenceIcons = "../../../assets/images/contact-preferance.svg";
  // if (data.contact_preferance_id === 1) {
  //   PreferenceIcons = "../../../assets/images/result-user-icon.svg";
  // } else if (data.contact_preferance_id === 2) {
  //   PreferenceIcons = "../../../assets/images/Text-Preference-bg.svg";
  // } else if (data.contact_preferance_id === 3) {
  //   PreferenceIcons = "../../../assets/images/Call-Preference-bg.svg";
  // } else if (data.contact_preferance_id === 4) {
  //   PreferenceIcons = "../../../assets/images/no-preference-bg.svg";
  // }
  let PreferenceIcons = "../../../assets/images/result-user-icon.svg";
  const buyerProfileImage = data?.buyer_profile_image || "/assets/images/purchase-buyer.svg";
  return (
    <div className="col-12 col-lg-6">
      <div className="property-critera-block buyer-blog-area buyer-blog-new">
        {data.profile_tag_name &&
          <OverlayTrigger
            placement="top"
            style={{ backgroundColor: "green" }}
            overlay={<Tooltip> Profile Tag </Tooltip>}>
            <div className="buyer-active-verfiy">
              {(data.profile_tag_image) && <img
                src={data.profile_tag_image}
                className="img-fluid profile-tag-image"
                alt=""
                title=""
              />
              }
              <span>{data.profile_tag_name}</span>
            </div>
          </OverlayTrigger>
        }
        <div className="critera-card">
          <div className={`center-align position-relative ${data.createdByAdmin ? "purchase-buyer-img" : "your-buyer-img"}`}>
            <img
              src={buyerProfileImage}
              className="img-fluid price-img"
              alt=""
              onError={(e) => {
                e.currentTarget.src = "/assets/images/purchase-buyer.svg";
              }}
            />
            {(data.is_buyer_verified) &&
              <div className="buyer-check">
                <OverlayTrigger
                  placement="top"
                  style={{ backgroundColor: "green" }}
                  overlay={<Tooltip> Profile Verified </Tooltip>}>
                  <img src='../../../assets/images/pcheck.svg' className="img-fluid" alt="" />
                </OverlayTrigger>
              </div>
            }
            <p>
              Buyer
            </p>

            {data.createdByAdmin ? (
              <ul className="like-unlike mb-0 list-unstyled 888">
                <li>
                  <span className="numb like-span">{data.totalBuyerLikes}</span>
                  <span
                    className="ico-no ml-min"
                    onClick={() => {
                      handleLikeClick(data.id, index);
                    }}
                  >
                    <img
                      src={
                        !data.liked
                          ? "/assets/images/like.svg"
                          : "/assets/images/liked.svg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </span>
                </li>
                <li>
                  <span
                    className="ico-no mr-min"
                    onClick={() => {
                      handleDisikeClick(data.id, index);
                    }}
                  >
                    <img
                      src={
                        !data.disliked
                          ? "/assets/images/unlike.svg"
                          : "/assets/images/unliked.svg"
                      }
                      className="img-fluid"
                      alt=""
                    />
                  </span>
                  <span className="numb text-end unlike-span">
                    {data.totalBuyerUnlikes}
                  </span>
                </li>
              </ul>
            ) : (
              ""
            )}
            <div className={data.createdByAdmin ? "purchase-buyer" : "your-buyer"}>
              {data.createdByAdmin ? <Image src='/assets/images/purchase-buyer.svg' alt='' /> : <Image src='/assets/images/your-buyer-text.svg' alt='' />}
            </div>
          </div>
        </div>
        <div className="property-critera-details">
          <ul className="list-unstyled mb-0">
            <li>
              <span className="detail-icon">
                <img src={PreferenceIcons} className="img-fluid" alt="" />
              </span>
              <span className="name-dealer b-name">
                {data.first_name} {data.last_name}
              </span>
            </li>
            <li>
              <span className="detail-icon">
                <img
                  src="../../../assets/images/callingbox.svg"
                  className="img-fluid"
                  alt=""
                />
              </span>
              <a href={"tel:+1" + data.phone} className="name-dealer">
                +1 {data.phone}
              </a>
            </li>
            <li>
              <span className="detail-icon">
                <img src="../../../assets/images/emailbox.svg" className="img-fluid" alt="" />
              </span>
              <a href={"mailto:" + data.email} className="name-dealer email-tag">
                {data.email}
                <span className="mx-2">
                </span>
              </a>
            </li>
          </ul>
        </div>
        <>
          <div
            className="red-flag inner_red_flag"
            onClick={() => {
              handleClickEditFlag(data.redFlag, data.id);
            }}
          >
            <OverlayTrigger placement="top" style={{ backgroundColor: 'green' }} overlay={<Tooltip>Flag</Tooltip>} >
              <img
                src="/assets/images/red-flag-bg.svg"
                className="img-fluid"
                alt=""
              />
            </OverlayTrigger>
          </div>
        </>
        {(data.phone_verified || data.email_verified || data.driver_license_verified || data.llc_verified || data.proof_of_funds_verified || data.certified_closer_verified || data.createdByAdmin) ?
          <div className="cornor-block cornor-block2">
            {data.phone_verified &&
              <OverlayTrigger placement="top" style={{ backgroundColor: 'green' }} overlay={<Tooltip>Phone Verified</Tooltip>} >
                <img src="/assets/images/ver-phone-number.svg" className="img-fluid" alt="" />
              </OverlayTrigger>
            }
            {data.email_verified &&
              <OverlayTrigger placement="top" style={{ backgroundColor: 'green' }} overlay={<Tooltip>Email Verified</Tooltip>} >
                <img src="/assets/images/ver-email.svg" className="img-fluid" alt="" />
              </OverlayTrigger>
            }
            {(data.driver_license_verified) &&
              <OverlayTrigger placement="top" style={{ backgroundColor: 'green' }} overlay={<Tooltip>ID/Driver’s License</Tooltip>} >
                <img
                  src="/assets/images/drivers -license.svg"
                  className="img-fluid"
                  alt=""
                />
              </OverlayTrigger>
            }
            {(data.llc_verified) &&
              <OverlayTrigger placement="top" style={{ backgroundColor: 'green' }} overlay={<Tooltip>LLC Verification</Tooltip>} >
                <img
                  src="/assets/images/LLC-verification.svg"
                  className="img-fluid"
                  alt=""
                />
              </OverlayTrigger>
            }
            {(data.proof_of_funds_verified) &&
              <OverlayTrigger placement="top" style={{ backgroundColor: 'green' }} overlay={<Tooltip>Proof of Funds</Tooltip>} >
                <img
                  src="/assets/images/profoffund.svg"
                  className="img-fluid"
                  alt=""
                />
              </OverlayTrigger>
            }
            {(data.certified_closer_verified) &&
              <OverlayTrigger placement="top" style={{ backgroundColor: 'green' }} overlay={<Tooltip>Certified Closer Verification</Tooltip>} >
                <img
                  src="/assets/images/ccv.svg"
                  className="img-fluid"
                  alt=""
                />
              </OverlayTrigger>
            }


          </div> : ''}

      </div>
    </div>
  );
}
