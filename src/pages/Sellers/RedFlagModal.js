import React from "react";

const RedFlagModal = ({ buyer_id, buyer_status }) => {
  return (
    <>
      <div
        className="modal fade modal-form-main"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img
                alt="close"
                src="/assets/images/close.svg"
                className="img-fluid"
              />
            </button>
            <div className="modal-body">
              <div className="want-to-edit">
                <div className="popup-heading-block text-center">
                  <span className="popup-icon">
                    <svg
                      width="12"
                      height="53"
                      viewBox="0 0 12 53"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.00131 17.847C2.74342 17.847 0.426758 19.2228 0.426758 21.2499V48.8328C0.426758 50.5705 2.74342 52.3077 6.00131 52.3077C9.1144 52.3077 11.648 50.5705 11.648 48.8328V21.2495C11.648 19.2226 9.1144 17.847 6.00131 17.847Z"
                        fill="#3F53FE"
                        fill-opacity="0.23"
                      ></path>
                      <path
                        d="M6.0008 0.83374C2.67051 0.83374 0.0644531 3.2228 0.0644531 5.97388C0.0644531 8.72517 2.67073 11.1866 6.0008 11.1866C9.25869 11.1866 11.8652 8.72517 11.8652 5.97388C11.8652 3.2228 9.25848 0.83374 6.0008 0.83374Z"
                        fill="#3F53FE"
                        fill-opacity="0.23"
                      ></path>
                    </svg>
                  </span>
                  <h3>Do you want to edit?</h3>
                  <p>Please share the reason with us</p>
                </div>
                <form className="modal-form">
                  <div className="row">
                    <div className="col-12 col-lg-12">
                      <div className="form-group">
                        <label>message Type here</label>
                        <textarea placeholder="Enter Your Message"></textarea>
                      </div>
                    </div>
                    <div className="col-12 col-lg-12">
                      <div className="form-group mb-0">
                        <div className="submit-btn">
                          <button type="submit" className="btn btn-fill">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* :  */}

      <div
        className="modal fade modal-form-main"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <div className="modal-dialog mx-block modal-dialog-centered">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img
                alt="close"
                src="./KYLE - Admin Request_files/close.svg"
                className="img-fluid"
              />
            </button>
            <div className="modal-body">
              <div className="want-to-edit">
                <div className="popup-heading-block text-center">
                  <span className="popup-icon-check">
                    <svg
                      width="41"
                      height="40"
                      viewBox="0 0 41 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M34.3161 10L15.9827 28.3333L7.64941 20"
                        stroke="#00AC47"
                        stroke-opacity="0.18"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </span>
                  <h3>Your Edit Request has been sent to the admin</h3>
                  <p className="mb-0">
                    Kindly wait for admin approval to edit the details
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* } */}
    </>
  );
};
export default RedFlagModal;
