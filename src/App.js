import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import AppRoutes from "./Routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Suspense fallback={<section className="main-section position-relative pt-4 pb-120"><div className="loader" style={{ textAlign: "center" }}><img src="../../../assets/images/loader.svg" /></div></section>}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
