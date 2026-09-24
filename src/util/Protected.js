import React,{useEffect} from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";

const Protected = ({ element }) => {
  const { userData, getTokenData } = useAuth();
  const navigate = useNavigate();
  const tokenData = getTokenData();
  const isLoggedIn = Boolean(tokenData?.access_token);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (userData === undefined || userData === null) {
        return <div className="loader" style={{ textAlign: "center" }}><img src="../../../assets/images/loader.svg" /></div>;
  }

  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

export default Protected;
