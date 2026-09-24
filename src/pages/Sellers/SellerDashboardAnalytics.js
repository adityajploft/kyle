import React, { useEffect, useState, useRef } from "react";
import { Accordion, Image, Spinner } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import SellerCurrentPlan from "./SellerCurrentPlan";

function SellerDashboardAnalytics() {
  const { getTokenData } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;

  const [dealActivities, setDealActivities] = useState({});
  const [buyerEngagement, setBuyerEngagement] = useState({});
  const [dealLoading, setDealLoading] = useState(false);
  const [buyerLoading, setBuyerLoading] = useState(false);

  const dealRef = useRef(null);
  const buyerRef = useRef(null);

  const [fetchDeal, setFetchDeal] = useState(false);
  const [fetchBuyer, setFetchBuyer] = useState(false);
  const [hasFetchedDeal, setHasFetchedDeal] = useState(false);
  const [hasFetchedBuyer, setHasFetchedBuyer] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === dealRef.current) {
              setFetchDeal(true);
            }
            if (entry.target === buyerRef.current) {
              setFetchBuyer(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (dealRef.current) observer.observe(dealRef.current);
    if (buyerRef.current) observer.observe(buyerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (fetchDeal && !hasFetchedDeal) {
      fetchDealData();
    }
  }, [fetchDeal, hasFetchedDeal]);

  useEffect(() => {
    if (fetchBuyer && !hasFetchedBuyer) {
      fetchBuyerData();
    }
  }, [fetchBuyer, hasFetchedBuyer]);

  const fetchDealData = async () => {
    setDealLoading(true);
    try {
      const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      const response = await axios.get(
        `${apiUrl}analytics/seller-dashboard-analytics?section=deal_activitites`,
        { headers }
      );
      setDealActivities(response.data?.data?.deal_activities || response.data?.deal_activities || {});
    } catch (error) {
      console.error(error);
    } finally {
      setDealLoading(false);
      setHasFetchedDeal(true);
    }
  };

  const fetchBuyerData = async () => {
    setBuyerLoading(true);
    try {
      const headers = {
        Accept: "application/json",
        Authorization: "Bearer " + getTokenData().access_token,
        "auth-token": getTokenData().access_token,
      };
      const response = await axios.get(
        `${apiUrl}analytics/seller-dashboard-analytics?section=buyer_engagement`,
        { headers }
      );
      setBuyerEngagement(response.data?.data?.buyer_engagement || response.data?.buyer_engagement || {});
    } catch (error) {
      console.error(error);
    } finally {
      setBuyerLoading(false);
      setHasFetchedBuyer(true);
    }
  };

  return (
    <>
      <div className="row" ref={dealRef}>
        <div className="col-12">
          <div className="seller-dash-card">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Deal Activity & Performance</Accordion.Header>
                <Accordion.Body>
                  {dealLoading ? (
                    <div className="d-flex justify-content-center p-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="grid_3 custom_blue_scrollbar">
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p># of Deals Listed</p>
                          <h3>{dealActivities?.total_deals_listed ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p># of Deals Sold</p>
                          <h3>{dealActivities?.total_deals_sold ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Total Offers Received</p>
                          <h3>{dealActivities?.total_offers_received ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Total Offers Accepted</p>
                          <h3>{dealActivities?.total_offers_accepted ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Offer Acceptance Rate</p>
                          <h3>{dealActivities?.offer_acceptance_rate ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/percentage-symbol.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Average Offers Per Deal</p>
                          <h3>{dealActivities?.average_offers_per_deal ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Average Days from Post to First Match</p>
                          <h3>{dealActivities?.average_days_to_first_match ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Average Time from Post to Sold</p>
                          <h3>{dealActivities?.average_days_to_sell ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/clock_notification.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Average % of Asking Price Captured</p>
                          <h3>{dealActivities?.average_asking_price_ratio ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/percentage-symbol.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Total $ Volume of Deals Closed</p>
                          <h3>{dealActivities?.total_deal_volume_closed ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Deals That Received No Offers</p>
                          <h3>{dealActivities?.deals_with_no_offers ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hand-user.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Deals That Received No Buyer Matches</p>
                          <h3>{dealActivities?.deals_with_no_buyer_matches ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hand-user.svg" alt="Deals" />
                        </div>
                      </div>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="row" ref={buyerRef}>
        <div className="col-12">
          <div className="seller-dash-card">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Buyer List Engagement</Accordion.Header>
                <Accordion.Body>
                  {buyerLoading ? (
                    <div className="d-flex justify-content-center p-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="grid_3 custom_blue_scrollbar">
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p># of Buyers Uploaded</p>
                          <h3>{buyerEngagement?.total_buyers_uploaded ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>% of Invited Buyers Who Signed Up</p>
                          <h3>{buyerEngagement?.invited_buyers_signed_up ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/percentage-symbol.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>% of Uploaded Buyers Who Completed BuyBox</p>
                          <h3>{buyerEngagement?.uploaded_buyers_completed_buybox ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/percentage-symbol.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p># of Matched Buyers Per Deal</p>
                          <h3>{buyerEngagement?.average_matched_buyers_per_deal ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/hash-icon.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Buyer Engagement Rate</p>
                          <h3>{buyerEngagement?.buyer_engagement_rate ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/percentage-symbol.svg" alt="Deals" />
                        </div>
                      </div>
                      <div className="veri_box_column">
                        <div className="veri_box_left">
                          <p>Buyer Response Time to Deal Notifications</p>
                          <h3>{buyerEngagement?.average_response_time_to_notifications ?? 0}</h3>
                        </div>
                        <div className="veri_box_right">
                          <Image src="/assets/images/clock_notification.svg" alt="Deals" />
                        </div>
                      </div>
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </div>

      <SellerCurrentPlan />
                        
    </>
  );
}

export default SellerDashboardAnalytics;
