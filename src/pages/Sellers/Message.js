import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ChatSidebar from "../../component/ChatPanel/ChatSidebar";
import ChatMessagePanel from "../../component/ChatPanel/ChatMessagePanel";
import { useAuth } from "../../hooks/useAuth";
import BuyerHeader from "../../partials/BuyerHeader";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import { ChatProvider } from "../../context/chatContext";

const Message = () => {
  const { id: chatPartnerId ='' } = useParams();
  const { getTokenData, getLocalStorageUserdata } = useAuth();

  const [userRole, setUserRole] = useState(0);

  const [isLoader, setIsLoader] = useState(false);
  const [receiverId, setReceiverId] = useState("");


  const messagesEndRef = useRef("chat_box");

  useEffect(() => {
    const userData = getLocalStorageUserdata();
    if (getTokenData().access_token && userRole === 0) {
      setUserRole(userData.role);
    }
    setReceiverId(chatPartnerId);
  }, []);
  
  return (
    <>
      {userRole === 3 && <BuyerHeader />}
      {userRole === 2 && <Header />}
      <section className="main-section position-relative pt-4 pb-120">
        {isLoader ? <div className="loader" style={{ textAlign: "center" }}><img src="../../../assets/images/loader.svg" /></div> :
          <Container className="position-relative">
            <div className="back-block">
              <div className="row">
                <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                  <Link to={void(0)} onClick={() => { window.history.back() }} className="back">
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 6H1" stroke="#0A2540" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5.9 11L1 6L5.9 1" stroke="#0A2540" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                  </Link>
                </div>
                <div className="col-7 col-sm-4 col-md-4 col-lg-4 align-self-center">
                  <h6 className="center-head text-center mb-0">Message</h6>
                </div>
              </div>
            </div>
            <ChatProvider>

            <div className="card-box">
                <Row>
                  {!chatPartnerId && 
                    <Col lg="4">
                        <ChatSidebar/>
                    </Col>
                  }
                  <Col lg={chatPartnerId ? '12' : '8'}>
                    <div className="message-panel">
                        <ChatMessagePanel/>
                      <div ref={messagesEndRef} />
                    </div>
                  </Col>
                </Row> 
            </div>
            </ChatProvider>

          </Container>
        }
      </section>
      <Footer />
    </>
  );
};

export default Message;
