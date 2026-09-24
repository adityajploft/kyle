import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/authContext";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";

const UploadMultipleBuyersOnChange = () => {
  const { authData } = useContext(AuthContext);
  const { getTokenData, setLogout } = useAuth();
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  /** upload multiple buyer using csv  */
  const [border, setBorder] = useState("1px dashed #677AAB");
  const [errorMsg, setErrorMsg] = useState("");
  const [filename, setFileName] = useState("Upload your .CSV file");
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const fileSize = file.size;
    const fileType = file.type;
    if (fileType != "text/csv") {
      setBorder("1px dashed #ff0018");
      setErrorMsg("Please add valid file (csv)");
      setFileName("Upload your .CSV file");
      return;
    } else if (fileSize > maxFileSize) {
      setBorder("1px dashed #ff0018");
      setErrorMsg(
        "File size is too large. Please upload a file that is less than 5MB."
      );
      setFileName("Upload your .CSV file");
      return;
    } else {
      setErrorMsg("");
      setBorder("1px dashed #677AAB");
      setFileName(file.name);
    }
    const formData = new FormData();
    if (file) {
      formData.append("csvFile", file);
    }
    let headers = {
      Accept: "application/json",
      Authorization: "Bearer " + getTokenData().access_token,
      "auth-token": getTokenData().access_token,
      "Content-Type": "multipart/form-data",
    };
    async function fetchData() {
      try {
        const response = await axios.post(
          apiUrl + "upload-multiple-buyers-csv",
          formData,
          { headers: headers }
        );
        if (response.data.status) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/");
        }
      } catch (error) {
        console.log(error.response,'resss');
        if (error.response) {
          if (error.response.status === 401) {
            setLogout();
          }else{
            toast.error(error.response.data.message, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
      }
    }
    if (file != "") {
      fetchData();
    } else {
      toast.error("Please Upload Csv First", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  return (
    <>
      <form
        className="form-container upload-multiple-data d-flex align-items-center justify-content-center"
        method="post"
      >
        <div className="upload-files-container">
          <div className="drag-file-area">
            <span className="upload-icon"> </span>
            <h5 className="uploadHeading">Upload Multiple Buyer Data</h5>
            <p className="dynamic-message mb-0">Drag & Drop</p>
            <button type="button" className="upload-button">
              <img
                src="../../../assets/images/folder-big.svg"
                className="img-fluid"
                alt=""
              />
            </button>
            <label className="label">
              <span className="browse-files">
                <input
                  type="file"
                  name="csvFile"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="default-file-input"
                />
                <span className="d-block upload-file">{filename}</span>
                <span className="browse-files-text">browse Now</span>
              </span>
            </label>
          </div>
          <span className="cannot-upload-message">
            {" "}
            <span className="error"></span> Please select a file first{" "}
            <span className="cancel-alert-button">cancel</span>{" "}
          </span>
          <div className="file-block">
            <div className="file-info">
              <span className="file-name"> </span> |{" "}
              <span className="file-size"> </span>{" "}
            </div>

            <div className="progress-bar"> </div>
          </div>
        </div>
      </form>
      <p
        style={{
          padding: "6px",
          textAlign: "center",
          fontSize: "13px",
          color: "red",
          fontWeight: "700",
        }}
      >
        {errorMsg}
      </p>
    </>
  );
};
export default UploadMultipleBuyersOnChange;
