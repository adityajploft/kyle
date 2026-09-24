import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import routes from "./index";
import Protected from "../util/Protected";

const AppRoutes = () => {

   const location = useLocation();
      useEffect(() => {
        let routeArray = ['/login','/forget-password','/seller/register','/buyer/register'];
        if(routeArray.includes(location.pathname)){
          document.body.classList.add('pb-0');
        }else{
          document.body.classList.remove('pb-0');
        }
      }, [location]);
  

  return (
    <Routes>
      {/* Seller Routes */}
      {Array.isArray(routes.seller) &&
        routes.seller.map(({ path, Component,urlType, protected: isProtected }) =>
          isProtected ? (
            <Route key={path} path={path} element={<Protected element={<Component urlType={urlType}/>} />} />
          ) : (
            <Route key={path} path={path} element={<Component urlType={urlType}/>} />
          )
      )}

      {/* Buyer Routes */}
      {Array.isArray(routes.buyer) &&
        routes.buyer.map(({ path, Component, protected: isProtected }) =>
          isProtected ? (
            <Route key={path} path={path} element={<Protected element={<Component />} />} />
          ) : (
            <Route key={path} path={path} element={<Component />} />
          )
      )}
    </Routes>
  );
};

export default AppRoutes;
