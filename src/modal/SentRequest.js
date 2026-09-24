import React from 'react';
import Modal from 'react-bootstrap/Modal';

const SentRequest = ({setSentOpen,sentOpen}) =>{

    const handleClose = () => {
        setSentOpen(false);
    };

    return (
        <div>
          <Modal show={sentOpen} onHide={handleClose} className="modal-form-main requestmodal-sent" centered>
            <button type="button" className="btn-close" onClick={handleClose}>
                <i className='fa fa-times fa-lg'></i>
            </button>
            <Modal.Body>
            <div className="want-to-edit">
                <div className="popup-heading-block text-center">
                    <span className="popup-icon-check">
                        <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M34.3161 10L15.9827 28.3333L7.64941 20" stroke="#00AC47" strokeOpacity="0.18" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </span>
                    <h3>Your Edit Request has been sent to the admin</h3>
                    <p className="mb-0">Kindly wait for admin approval to edit the details</p>
                </div>
            </div>
            </Modal.Body>
          </Modal>
        </div>
    );
}
export default SentRequest;