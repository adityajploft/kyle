import React from "react";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";

const AdminMessage = () => {
  return (
    <>
      <Header />
      <section className="main-section position-relative pt-4 pb-120">
        <div className="container position-relative">
          <div className="back-block">
            <div className="row">
              <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                <a href="#" className="back">
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 6H1"
                      stroke="#0A2540"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.9 11L1 6L5.9 1"
                      stroke="#0A2540"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </a>
              </div>
              <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                <h6 className="center-head text-center mb-0">My Buyers</h6>
              </div>
              <div className="col-12 col-sm-4 col-md-4 col-lg-4">
                <p className="page-out mb-0 text-center text-sm-end text-md-end text-lg-end">
                  20 out of 20
                </p>
              </div>
            </div>
          </div>
          <div className="card-box">
            <div className="row">
              <div className="col-12 col-lg-12">
                <div className="card-box-inner">
                  <h3 className="text-center">
                    Property Criteria Match With 10 Buyers
                  </h3>
                  <div className="property-critera">
                    <div className="row">
                      <div className="col-12 col-lg-6">
                        <div className="property-critera-block">
                          <div className="critera-card">
                            <div className="center-align">
                              <span className="price-img">
                                <img
                                  src="../../../assets/images/price.svg"
                                  className="img-fluid"
                                />
                              </span>
                              <p>Buyer</p>
                            </div>
                          </div>
                          <div className="property-critera-details">
                            <ul className="list-unstyled mb-0">
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/user-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <span className="name-dealer">
                                  Devid Miller
                                </span>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/phone-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a href="91123456789" className="name-dealer">
                                  +91123456789
                                </a>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/gmail.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a
                                  href="mailto:Devidmiller@gmail.com"
                                  className="name-dealer"
                                >
                                  Devidmiller@gmail.com
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="cornor-block">
                            <div
                              className="red-flag"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              <img
                                src="../../../assets/images/red-flag.svg"
                                className="img-fluid"
                              />
                            </div>
                            <div className="show-hide-data">
                              <button type="button" className="unhide-btn">
                                <span className="icon-unhide">
                                  <svg
                                    width="17"
                                    height="16"
                                    viewBox="0 0 17 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_677_7400)">
                                      <path
                                        d="M1.16699 7.99996C1.16699 7.99996 3.83366 2.66663 8.50033 2.66663C13.167 2.66663 15.8337 7.99996 15.8337 7.99996C15.8337 7.99996 13.167 13.3333 8.50033 13.3333C3.83366 13.3333 1.16699 7.99996 1.16699 7.99996Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M8.5 10C9.60457 10 10.5 9.10457 10.5 8C10.5 6.89543 9.60457 6 8.5 6C7.39543 6 6.5 6.89543 6.5 8C6.5 9.10457 7.39543 10 8.5 10Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_677_7400">
                                        <rect
                                          width="16"
                                          height="16"
                                          fill="white"
                                          transform="translate(0.5)"
                                        ></rect>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </span>
                              </button>
                              <button type="button" className="hide-btn">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12.3813 7.63169C12.5605 7.52784 12.7899 7.58884 12.8938 7.76804L14.3251 10.2368C14.4289 10.4159 14.3679 10.6454 14.1887 10.7493C14.0096 10.8531 13.7801 10.7921 13.6762 10.6129L12.245 8.14419C12.1411 7.96504 12.2021 7.73559 12.3813 7.63169Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.57269 8.9618C9.77669 8.9259 9.97114 9.0621 10.0071 9.26605L10.4508 11.7848C10.4867 11.9888 10.3505 12.1832 10.1466 12.2192C9.94264 12.2551 9.74814 12.1189 9.71219 11.9149L9.26844 9.3962C9.23254 9.19225 9.36874 8.99775 9.57269 8.9618Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M6.42181 8.95555C6.62576 8.9914 6.76206 9.1858 6.72621 9.3898L6.28246 11.9148C6.24661 12.1188 6.05221 12.2551 5.84821 12.2192C5.64426 12.1834 5.50796 11.989 5.54381 11.785L5.98756 9.25995C6.02341 9.056 6.21781 8.9197 6.42181 8.95555Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M3.61283 7.63129C3.79223 7.73479 3.85377 7.96409 3.75029 8.14349L2.31904 10.6247C2.21555 10.8041 1.98623 10.8657 1.80683 10.7622C1.62743 10.6587 1.56589 10.4294 1.66937 10.25L3.10062 7.76874C3.2041 7.58934 3.43343 7.52779 3.61283 7.63129Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.76439 6.26444C1.9255 6.13429 2.16161 6.15944 2.29174 6.32054C3.30032 7.56924 5.12844 9.12494 8.00004 9.12494C10.8716 9.12494 12.6997 7.56924 13.7083 6.32054C13.8384 6.15944 14.0745 6.13429 14.2356 6.26444C14.3967 6.39459 14.4219 6.63069 14.2917 6.79179C13.2003 8.14309 11.1784 9.87494 8.00004 9.87494C4.82158 9.87494 2.79971 8.14309 1.70829 6.79179C1.57815 6.63069 1.60327 6.39459 1.76439 6.26444Z"
                                    fill="white"
                                  ></path>
                                </svg>
                                <span className="cont-inn">Unhide</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="property-critera-block">
                          <div className="critera-card">
                            <div className="center-align">
                              <span className="price-img">
                                <img
                                  src="../../../assets/images/price.svg"
                                  className="img-fluid"
                                />
                              </span>
                              <p>Buyer</p>
                            </div>
                          </div>
                          <div className="property-critera-details">
                            <ul className="list-unstyled mb-0">
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/user-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <span className="name-dealer">
                                  Devid Miller
                                </span>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/phone-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a href="91123456789" className="name-dealer">
                                  +91123456789
                                </a>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/gmail.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a
                                  href="mailto:Devidmiller@gmail.com"
                                  className="name-dealer"
                                >
                                  Devidmiller@gmail.com
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="cornor-block">
                            <div
                              className="red-flag"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              <img
                                src="../../../assets/images/red-flag.svg"
                                className="img-fluid"
                              />
                            </div>
                            <div className="show-hide-data">
                              <button type="button" className="unhide-btn">
                                <span className="icon-unhide">
                                  <svg
                                    width="17"
                                    height="16"
                                    viewBox="0 0 17 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_677_7400)">
                                      <path
                                        d="M1.16699 7.99996C1.16699 7.99996 3.83366 2.66663 8.50033 2.66663C13.167 2.66663 15.8337 7.99996 15.8337 7.99996C15.8337 7.99996 13.167 13.3333 8.50033 13.3333C3.83366 13.3333 1.16699 7.99996 1.16699 7.99996Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M8.5 10C9.60457 10 10.5 9.10457 10.5 8C10.5 6.89543 9.60457 6 8.5 6C7.39543 6 6.5 6.89543 6.5 8C6.5 9.10457 7.39543 10 8.5 10Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_677_7400">
                                        <rect
                                          width="16"
                                          height="16"
                                          fill="white"
                                          transform="translate(0.5)"
                                        ></rect>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </span>
                              </button>
                              <button type="button" className="hide-btn">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12.3813 7.63169C12.5605 7.52784 12.7899 7.58884 12.8938 7.76804L14.3251 10.2368C14.4289 10.4159 14.3679 10.6454 14.1887 10.7493C14.0096 10.8531 13.7801 10.7921 13.6762 10.6129L12.245 8.14419C12.1411 7.96504 12.2021 7.73559 12.3813 7.63169Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.57269 8.9618C9.77669 8.9259 9.97114 9.0621 10.0071 9.26605L10.4508 11.7848C10.4867 11.9888 10.3505 12.1832 10.1466 12.2192C9.94264 12.2551 9.74814 12.1189 9.71219 11.9149L9.26844 9.3962C9.23254 9.19225 9.36874 8.99775 9.57269 8.9618Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M6.42181 8.95555C6.62576 8.9914 6.76206 9.1858 6.72621 9.3898L6.28246 11.9148C6.24661 12.1188 6.05221 12.2551 5.84821 12.2192C5.64426 12.1834 5.50796 11.989 5.54381 11.785L5.98756 9.25995C6.02341 9.056 6.21781 8.9197 6.42181 8.95555Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M3.61283 7.63129C3.79223 7.73479 3.85377 7.96409 3.75029 8.14349L2.31904 10.6247C2.21555 10.8041 1.98623 10.8657 1.80683 10.7622C1.62743 10.6587 1.56589 10.4294 1.66937 10.25L3.10062 7.76874C3.2041 7.58934 3.43343 7.52779 3.61283 7.63129Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.76439 6.26444C1.9255 6.13429 2.16161 6.15944 2.29174 6.32054C3.30032 7.56924 5.12844 9.12494 8.00004 9.12494C10.8716 9.12494 12.6997 7.56924 13.7083 6.32054C13.8384 6.15944 14.0745 6.13429 14.2356 6.26444C14.3967 6.39459 14.4219 6.63069 14.2917 6.79179C13.2003 8.14309 11.1784 9.87494 8.00004 9.87494C4.82158 9.87494 2.79971 8.14309 1.70829 6.79179C1.57815 6.63069 1.60327 6.39459 1.76439 6.26444Z"
                                    fill="white"
                                  ></path>
                                </svg>
                                <span className="cont-inn">Unhide</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="property-critera-block">
                          <div className="critera-card">
                            <div className="center-align">
                              <span className="price-img">
                                <img
                                  src="../../../assets/images/price.svg"
                                  className="img-fluid"
                                />
                              </span>
                              <p>Buyer</p>
                            </div>
                          </div>
                          <div className="property-critera-details">
                            <ul className="list-unstyled mb-0">
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/user-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <span className="name-dealer">
                                  Devid Miller
                                </span>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/phone-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a href="91123456789" className="name-dealer">
                                  +91123456789
                                </a>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/gmail.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a
                                  href="mailto:Devidmiller@gmail.com"
                                  className="name-dealer"
                                >
                                  Devidmiller@gmail.com
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="cornor-block">
                            <div
                              className="red-flag"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              <img
                                src="../../../assets/images/red-flag.svg"
                                className="img-fluid"
                              />
                            </div>
                            <div className="show-hide-data">
                              <button type="button" className="unhide-btn">
                                <span className="icon-unhide">
                                  <svg
                                    width="17"
                                    height="16"
                                    viewBox="0 0 17 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_677_7400)">
                                      <path
                                        d="M1.16699 7.99996C1.16699 7.99996 3.83366 2.66663 8.50033 2.66663C13.167 2.66663 15.8337 7.99996 15.8337 7.99996C15.8337 7.99996 13.167 13.3333 8.50033 13.3333C3.83366 13.3333 1.16699 7.99996 1.16699 7.99996Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M8.5 10C9.60457 10 10.5 9.10457 10.5 8C10.5 6.89543 9.60457 6 8.5 6C7.39543 6 6.5 6.89543 6.5 8C6.5 9.10457 7.39543 10 8.5 10Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_677_7400">
                                        <rect
                                          width="16"
                                          height="16"
                                          fill="white"
                                          transform="translate(0.5)"
                                        ></rect>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </span>
                              </button>
                              <button type="button" className="hide-btn">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12.3813 7.63169C12.5605 7.52784 12.7899 7.58884 12.8938 7.76804L14.3251 10.2368C14.4289 10.4159 14.3679 10.6454 14.1887 10.7493C14.0096 10.8531 13.7801 10.7921 13.6762 10.6129L12.245 8.14419C12.1411 7.96504 12.2021 7.73559 12.3813 7.63169Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.57269 8.9618C9.77669 8.9259 9.97114 9.0621 10.0071 9.26605L10.4508 11.7848C10.4867 11.9888 10.3505 12.1832 10.1466 12.2192C9.94264 12.2551 9.74814 12.1189 9.71219 11.9149L9.26844 9.3962C9.23254 9.19225 9.36874 8.99775 9.57269 8.9618Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M6.42181 8.95555C6.62576 8.9914 6.76206 9.1858 6.72621 9.3898L6.28246 11.9148C6.24661 12.1188 6.05221 12.2551 5.84821 12.2192C5.64426 12.1834 5.50796 11.989 5.54381 11.785L5.98756 9.25995C6.02341 9.056 6.21781 8.9197 6.42181 8.95555Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M3.61283 7.63129C3.79223 7.73479 3.85377 7.96409 3.75029 8.14349L2.31904 10.6247C2.21555 10.8041 1.98623 10.8657 1.80683 10.7622C1.62743 10.6587 1.56589 10.4294 1.66937 10.25L3.10062 7.76874C3.2041 7.58934 3.43343 7.52779 3.61283 7.63129Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.76439 6.26444C1.9255 6.13429 2.16161 6.15944 2.29174 6.32054C3.30032 7.56924 5.12844 9.12494 8.00004 9.12494C10.8716 9.12494 12.6997 7.56924 13.7083 6.32054C13.8384 6.15944 14.0745 6.13429 14.2356 6.26444C14.3967 6.39459 14.4219 6.63069 14.2917 6.79179C13.2003 8.14309 11.1784 9.87494 8.00004 9.87494C4.82158 9.87494 2.79971 8.14309 1.70829 6.79179C1.57815 6.63069 1.60327 6.39459 1.76439 6.26444Z"
                                    fill="white"
                                  ></path>
                                </svg>
                                <span className="cont-inn">Unhide</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="property-critera-block">
                          <div className="critera-card">
                            <div className="center-align">
                              <span className="price-img">
                                <img
                                  src="../../../assets/images/price.svg"
                                  className="img-fluid"
                                />
                              </span>
                              <p>Buyer</p>
                            </div>
                          </div>
                          <div className="property-critera-details">
                            <ul className="list-unstyled mb-0">
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/user-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <span className="name-dealer">
                                  Devid Miller
                                </span>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/phone-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a href="91123456789" className="name-dealer">
                                  +91123456789
                                </a>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/gmail.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a
                                  href="mailto:Devidmiller@gmail.com"
                                  className="name-dealer"
                                >
                                  Devidmiller@gmail.com
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="cornor-block">
                            <div
                              className="red-flag"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              <img
                                src="../../../assets/images/red-flag.svg"
                                className="img-fluid"
                              />
                            </div>
                            <div className="show-hide-data">
                              <button type="button" className="unhide-btn">
                                <span className="icon-unhide">
                                  <svg
                                    width="17"
                                    height="16"
                                    viewBox="0 0 17 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_677_7400)">
                                      <path
                                        d="M1.16699 7.99996C1.16699 7.99996 3.83366 2.66663 8.50033 2.66663C13.167 2.66663 15.8337 7.99996 15.8337 7.99996C15.8337 7.99996 13.167 13.3333 8.50033 13.3333C3.83366 13.3333 1.16699 7.99996 1.16699 7.99996Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M8.5 10C9.60457 10 10.5 9.10457 10.5 8C10.5 6.89543 9.60457 6 8.5 6C7.39543 6 6.5 6.89543 6.5 8C6.5 9.10457 7.39543 10 8.5 10Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_677_7400">
                                        <rect
                                          width="16"
                                          height="16"
                                          fill="white"
                                          transform="translate(0.5)"
                                        ></rect>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </span>
                              </button>
                              <button type="button" className="hide-btn">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12.3813 7.63169C12.5605 7.52784 12.7899 7.58884 12.8938 7.76804L14.3251 10.2368C14.4289 10.4159 14.3679 10.6454 14.1887 10.7493C14.0096 10.8531 13.7801 10.7921 13.6762 10.6129L12.245 8.14419C12.1411 7.96504 12.2021 7.73559 12.3813 7.63169Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.57269 8.9618C9.77669 8.9259 9.97114 9.0621 10.0071 9.26605L10.4508 11.7848C10.4867 11.9888 10.3505 12.1832 10.1466 12.2192C9.94264 12.2551 9.74814 12.1189 9.71219 11.9149L9.26844 9.3962C9.23254 9.19225 9.36874 8.99775 9.57269 8.9618Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M6.42181 8.95555C6.62576 8.9914 6.76206 9.1858 6.72621 9.3898L6.28246 11.9148C6.24661 12.1188 6.05221 12.2551 5.84821 12.2192C5.64426 12.1834 5.50796 11.989 5.54381 11.785L5.98756 9.25995C6.02341 9.056 6.21781 8.9197 6.42181 8.95555Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M3.61283 7.63129C3.79223 7.73479 3.85377 7.96409 3.75029 8.14349L2.31904 10.6247C2.21555 10.8041 1.98623 10.8657 1.80683 10.7622C1.62743 10.6587 1.56589 10.4294 1.66937 10.25L3.10062 7.76874C3.2041 7.58934 3.43343 7.52779 3.61283 7.63129Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.76439 6.26444C1.9255 6.13429 2.16161 6.15944 2.29174 6.32054C3.30032 7.56924 5.12844 9.12494 8.00004 9.12494C10.8716 9.12494 12.6997 7.56924 13.7083 6.32054C13.8384 6.15944 14.0745 6.13429 14.2356 6.26444C14.3967 6.39459 14.4219 6.63069 14.2917 6.79179C13.2003 8.14309 11.1784 9.87494 8.00004 9.87494C4.82158 9.87494 2.79971 8.14309 1.70829 6.79179C1.57815 6.63069 1.60327 6.39459 1.76439 6.26444Z"
                                    fill="white"
                                  ></path>
                                </svg>
                                <span className="cont-inn">Unhide</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="property-critera-block">
                          <div className="critera-card">
                            <div className="center-align">
                              <span className="price-img">
                                <img
                                  src="../../../assets/images/price.svg"
                                  className="img-fluid"
                                />
                              </span>
                              <p>Buyer</p>
                            </div>
                          </div>
                          <div className="property-critera-details">
                            <ul className="list-unstyled mb-0">
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/user-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <span className="name-dealer">
                                  Devid Miller
                                </span>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/phone-gradient.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a href="91123456789" className="name-dealer">
                                  +91123456789
                                </a>
                              </li>
                              <li>
                                <span className="detail-icon">
                                  <img
                                    src="../../../assets/images/gmail.svg"
                                    className="img-fluid"
                                  />
                                </span>
                                <a
                                  href="mailto:Devidmiller@gmail.com"
                                  className="name-dealer"
                                >
                                  Devidmiller@gmail.com
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="cornor-block">
                            <div
                              className="red-flag"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              <img
                                src="../../../assets/images/red-flag.svg"
                                className="img-fluid"
                              />
                            </div>
                            <div className="show-hide-data">
                              <button type="button" className="unhide-btn">
                                <span className="icon-unhide">
                                  <svg
                                    width="17"
                                    height="16"
                                    viewBox="0 0 17 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_677_7400)">
                                      <path
                                        d="M1.16699 7.99996C1.16699 7.99996 3.83366 2.66663 8.50033 2.66663C13.167 2.66663 15.8337 7.99996 15.8337 7.99996C15.8337 7.99996 13.167 13.3333 8.50033 13.3333C3.83366 13.3333 1.16699 7.99996 1.16699 7.99996Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                      <path
                                        d="M8.5 10C9.60457 10 10.5 9.10457 10.5 8C10.5 6.89543 9.60457 6 8.5 6C7.39543 6 6.5 6.89543 6.5 8C6.5 9.10457 7.39543 10 8.5 10Z"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_677_7400">
                                        <rect
                                          width="16"
                                          height="16"
                                          fill="white"
                                          transform="translate(0.5)"
                                        ></rect>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </span>
                              </button>
                              <button type="button" className="hide-btn">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M12.3813 7.63169C12.5605 7.52784 12.7899 7.58884 12.8938 7.76804L14.3251 10.2368C14.4289 10.4159 14.3679 10.6454 14.1887 10.7493C14.0096 10.8531 13.7801 10.7921 13.6762 10.6129L12.245 8.14419C12.1411 7.96504 12.2021 7.73559 12.3813 7.63169Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M9.57269 8.9618C9.77669 8.9259 9.97114 9.0621 10.0071 9.26605L10.4508 11.7848C10.4867 11.9888 10.3505 12.1832 10.1466 12.2192C9.94264 12.2551 9.74814 12.1189 9.71219 11.9149L9.26844 9.3962C9.23254 9.19225 9.36874 8.99775 9.57269 8.9618Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M6.42181 8.95555C6.62576 8.9914 6.76206 9.1858 6.72621 9.3898L6.28246 11.9148C6.24661 12.1188 6.05221 12.2551 5.84821 12.2192C5.64426 12.1834 5.50796 11.989 5.54381 11.785L5.98756 9.25995C6.02341 9.056 6.21781 8.9197 6.42181 8.95555Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M3.61283 7.63129C3.79223 7.73479 3.85377 7.96409 3.75029 8.14349L2.31904 10.6247C2.21555 10.8041 1.98623 10.8657 1.80683 10.7622C1.62743 10.6587 1.56589 10.4294 1.66937 10.25L3.10062 7.76874C3.2041 7.58934 3.43343 7.52779 3.61283 7.63129Z"
                                    fill="white"
                                  ></path>
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1.76439 6.26444C1.9255 6.13429 2.16161 6.15944 2.29174 6.32054C3.30032 7.56924 5.12844 9.12494 8.00004 9.12494C10.8716 9.12494 12.6997 7.56924 13.7083 6.32054C13.8384 6.15944 14.0745 6.13429 14.2356 6.26444C14.3967 6.39459 14.4219 6.63069 14.2917 6.79179C13.2003 8.14309 11.1784 9.87494 8.00004 9.87494C4.82158 9.87494 2.79971 8.14309 1.70829 6.79179C1.57815 6.63069 1.60327 6.39459 1.76439 6.26444Z"
                                    fill="white"
                                  ></path>
                                </svg>
                                <span className="cont-inn">Unhide</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default AdminMessage;
