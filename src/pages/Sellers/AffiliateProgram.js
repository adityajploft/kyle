import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { Link } from "react-router-dom";
import { Image, Table } from "react-bootstrap";
const AffiliateProgram = () => {
  
  return (
    <>
      <Header />
      <section className="main-section position-relative pt-4">
            <div className="container position-relative">
              <div className="back-block">
                <div className="row">
                  <div className="col-12">
                    <h6 className="center-head text-center mb-0">
                      Affiliate Program 
                    </h6>
                  </div>
                </div>
              </div>
              <div className="card-box affiliate_program_box mb-5">
                <div className="affiliate_program_column">
                  <div className="affiliate_col_inner">
                    <h6>Affiliate Link</h6>
                    <div className="affiliate_code_copy">
                      <span>https://www.figma.com/design/dM57IcNssVgogWI4ZVA...</span>
                      <button className="affiliate_code_btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M7.33268 5.91252V7.83752C7.33268 9.44169 6.69102 10.0834 5.08685 10.0834H3.16185C1.55768 10.0834 0.916016 9.44169 0.916016 7.83752V5.91252C0.916016 4.30835 1.55768 3.66669 3.16185 3.66669H5.08685C6.69102 3.66669 7.33268 4.30835 7.33268 5.91252Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M10.0827 3.16252V5.08752C10.0827 6.69169 9.44102 7.33335 7.83685 7.33335H7.33268V5.91252C7.33268 4.30835 6.69102 3.66669 5.08685 3.66669H3.66602V3.16252C3.66602 1.55835 4.30768 0.916687 5.91185 0.916687H7.83685C9.44102 0.916687 10.0827 1.55835 10.0827 3.16252Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="affiliate_revenue_row">
                    <div className="affiliate_revenue_col">
                      <div className="revenue_col_left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="31" viewBox="0 0 32 31" fill="none">
                          <path d="M11.7012 18.5094C11.7012 20.1757 12.9799 21.519 14.5687 21.519H17.8108C19.1928 21.519 20.3166 20.3436 20.3166 18.8969C20.3166 17.3211 19.632 16.7657 18.6116 16.404L13.4062 14.5957C12.3858 14.234 11.7012 13.6786 11.7012 12.1027C11.7012 10.6561 12.8249 9.48065 14.207 9.48065H17.4491C19.0378 9.48065 20.3166 10.824 20.3166 12.4902" stroke="#009981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 7.75V23.25" stroke="#009981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16.0007 28.4166C23.1343 28.4166 28.9173 22.6337 28.9173 15.5C28.9173 8.3663 23.1343 2.58331 16.0007 2.58331C8.86697 2.58331 3.08398 8.3663 3.08398 15.5C3.08398 22.6337 8.86697 28.4166 16.0007 28.4166Z" stroke="#009981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <div className="revenue_col_right">
                        <h6>Total Revenue</h6>
                        <span>$18000</span>
                      </div>
                    </div>
                    <div className="affiliate_revenue_col">
                      <div className="revenue_col_left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="31" viewBox="0 0 32 31" fill="none">
                          <path d="M11.7012 18.5094C11.7012 20.1757 12.9799 21.519 14.5687 21.519H17.8108C19.1928 21.519 20.3166 20.3436 20.3166 18.8969C20.3166 17.3211 19.632 16.7657 18.6116 16.404L13.4062 14.5957C12.3858 14.234 11.7012 13.6786 11.7012 12.1027C11.7012 10.6561 12.8249 9.48065 14.207 9.48065H17.4491C19.0378 9.48065 20.3166 10.824 20.3166 12.4902" stroke="#1A83C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 7.75V23.25" stroke="#1A83C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16.0007 28.4166C23.1343 28.4166 28.9173 22.6337 28.9173 15.5C28.9173 8.3663 23.1343 2.58331 16.0007 2.58331C8.86697 2.58331 3.08398 8.3663 3.08398 15.5C3.08398 22.6337 8.86697 28.4166 16.0007 28.4166Z" stroke="#1A83C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <div className="revenue_col_right">
                        <h6>Monthly Revenue</h6>
                        <span>$8000</span>
                      </div>
                    </div>
                    <div className="affiliate_revenue_col">
                      <div className="revenue_col_left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="31" viewBox="0 0 32 31" fill="none">
                          <path d="M11.8518 14.0404C11.7227 14.0275 11.5677 14.0275 11.4256 14.0404C8.35141 13.9371 5.91016 11.4183 5.91016 8.31831C5.91016 5.15373 8.46766 2.58331 11.6452 2.58331C14.8097 2.58331 17.3802 5.15373 17.3802 8.31831C17.3672 11.4183 14.926 13.9371 11.8518 14.0404Z" stroke="#CC6D82" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M21.2167 5.16669C23.7226 5.16669 25.7376 7.1946 25.7376 9.68752C25.7376 12.1288 23.8001 14.1179 21.3847 14.2084C21.2813 14.1954 21.1651 14.1954 21.0488 14.2084" stroke="#CC6D82" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M5.3932 18.8067C2.26737 20.8992 2.26737 24.3092 5.3932 26.3888C8.94529 28.7654 14.7707 28.7654 18.3228 26.3888C21.4486 24.2963 21.4486 20.8863 18.3228 18.8067C14.7836 16.4429 8.9582 16.4429 5.3932 18.8067Z" stroke="#CC6D82" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M23.709 25.8333C24.639 25.6396 25.5173 25.265 26.2406 24.7096C28.2556 23.1983 28.2556 20.7054 26.2406 19.1941C25.5302 18.6516 24.6648 18.29 23.7477 18.0833" stroke="#CC6D82" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <div className="revenue_col_right">
                        <h6>Total Users</h6>
                        <span>8000</span>
                      </div>
                    </div>
                  </div>
                  <div className="affiliate_table">
                    <div className="table-responsive">
                      <Table>
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>User Name</th>
                            <th>Plan</th>
                            <th>Transition ID</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1.</td>
                            <td>Esther Howard</td>
                            <td>
                              <p><span><Image src= '../../../assets/images/affiliate_plan.svg' alt="Affiliate Plan"/></span> Top Spot</p>
                            </td>
                            <td className="text-uppercase">42DFG15252045</td>
                            <td className="text-uppercase">24-dEC-2024</td>
                          </tr>
                          <tr>
                            <td>2.</td>
                            <td>Esther Howard</td>
                            <td>
                              <p><span><Image src= '../../../assets/images/affiliate_plan.svg' alt="Affiliate Plan"/></span> Top Spot</p>
                            </td>
                            <td className="text-uppercase">42DFG15252045</td>
                            <td className="text-uppercase">24-dEC-2024</td>
                          </tr>
                          <tr>
                            <td>3.</td>
                            <td>Esther Howard</td>
                            <td>
                              <p><span><Image src= '../../../assets/images/affiliate_plan.svg' alt="Affiliate Plan"/></span> Top Spot</p>
                            </td>
                            <td className="text-uppercase">42DFG15252045</td>
                            <td className="text-uppercase">24-dEC-2024</td>
                          </tr>
                          <tr>
                            <td>4.</td>
                            <td>Esther Howard</td>
                            <td>
                              <p><span><Image src= '../../../assets/images/affiliate_plan.svg' alt="Affiliate Plan"/></span> Top Spot</p>
                            </td>
                            <td className="text-uppercase">42DFG15252045</td>
                            <td className="text-uppercase">24-dEC-2024</td>
                          </tr>
                          <tr>
                            <td>5.</td>
                            <td>Esther Howard</td>
                            <td>
                              <p><span><Image src= '../../../assets/images/affiliate_plan.svg' alt="Affiliate Plan"/></span> Top Spot</p>
                            </td>
                            <td className="text-uppercase">42DFG15252045</td>
                            <td className="text-uppercase">24-dEC-2024</td>
                          </tr>
                        </tbody>
                      </Table>
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
export default AffiliateProgram;
