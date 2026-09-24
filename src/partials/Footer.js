import React from "react";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <>
      <footer className="footer-main">
        <div className="container">
          <div className="copyright-text text-center">
            © {new Date().getFullYear()} All Copyrights Reserved By{" "}
            <Link to="/">BuyboxBot</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
export default Footer;
