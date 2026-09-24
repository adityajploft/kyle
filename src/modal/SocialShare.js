import React, { useState } from "react";
import { Image } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton, 
  EmailIcon,
} from 'react-share';

const SocialShare = ({
  openSocialShareModal,
  SetOpenSocialShareModal,
  handleCopyToClipBoard,
  generatedUrl
}) => {
  const handleClose = () => {
    SetOpenSocialShareModal(false);
  };

  const baseURL = window.location.origin;
  const text = 'Check out this page!';
  const subject = 'Check this out!';
  
  // Ensure the body value does not contain undefined
  const sanitizedBody = 'I found this amazing website, and I thought you should check it out.' || '';
  
  // Log to verify the sanitized body value
  console.log("Sanitized Email Body:", sanitizedBody);

  return (
    <div>
      <Modal
        show={openSocialShareModal}
        onHide={handleClose}
        className="modal-social-share-main both_modal_design"
        centered
      >
        <Modal.Header closeButton>
          <h5>Social Share</h5>
        </Modal.Header>
        <Modal.Body>
          <div className="social-share-btn">
            <div className="social-share-list">
              <FacebookShareButton url={generatedUrl} title={text}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>

              <TwitterShareButton url={generatedUrl} title={text}>
                {/* <TwitterIcon size={32} round /> */}
                <Image src= '../../../assets/images/twitter-icon.svg' alt="twitter"/>
              </TwitterShareButton>

              <WhatsappShareButton url={generatedUrl} title={text}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>

              <EmailShareButton subject={subject} body={sanitizedBody} separator="" url="">
                <EmailIcon size={32} round={true} className="email-sharing" />
              </EmailShareButton>
            </div>
            <div id="" className="invite-page modal-invite-link">
              <input id="link" defaultValue={generatedUrl} />
              <div
                id="copy"
                onClick={() => {
                  handleCopyToClipBoard(generatedUrl);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {/* <i className="fa-solid fa-copy" aria-hidden="true"></i> */}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SocialShare;
