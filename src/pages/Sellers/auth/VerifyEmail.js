import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormError } from "../../../hooks/useFormError";
import { useParams } from "react-router-dom";

function VerifyEmail({ match }) {
  const { id, hash } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;
  const { navigate } = useFormError();

  useEffect(() => {
    const emailVerifyFun = async () => {
      try {
        const response = await axios.get(`${apiUrl}email/verify/${id}/${hash}`);
        if (response.data.status) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/login");
        } else {

        }
      } catch (error) {
        if (error.response) {
          toast.error("Invalid email verification token", {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/login");
        }
      }
    };

    emailVerifyFun();
  }, [apiUrl, id, hash, navigate]);

  return <div>Verifying email...</div>;
}

export default VerifyEmail;
