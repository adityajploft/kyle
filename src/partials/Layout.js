import React from "react";
import { Link, useLocation } from "react-router-dom";
import DarkMode from "./DarkMode";

const Layout = ({ children }) => {
  const location = useLocation();
  const isNotLogin = location.pathname !== "/login";
  return (
    <section className="account-block">
      <div className="container-fluid p-0">
        <div className="account-session">
          <div className="row align-items-center g-0">
            <div className="col-12 col-lg-6">
              <div className="dark-container">
                <DarkMode />
              </div>
              {children}
            </div>
            <div className="col-12 col-lg-6">
              <div className="session-img">
                <img
                  src="/assets/images/bg.jpg"
                  className="img-fluid"
                  alt="logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Layout;
