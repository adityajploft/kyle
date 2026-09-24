import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/authContext";
import MiniLoader from "../partials/MiniLoader";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";
import { Tooltip as ReactTooltip } from "react-tooltip";

const UploadMultipleBuyers = () => {
  const { authData } = useContext(AuthContext);
  const { getTokenData, setLogout } = useAuth();
const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  /** upload multiple buyer using csv  */
  const [csvFile, setCsvFile] = useState();
  const [border, setBorder] = useState("1px dashed #677AAB");
  const [validCsv, setValidCsv] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filename, setFileName] = useState("Upload your .CSV file");
  const [loading, setLoading] = useState(false);
  const formData = new FormData();
  if (csvFile) {
    formData.append("csvFile", csvFile);
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const fileSize = file.size;
    const fileType = file.type;
    if (fileType != "text/csv") {
      setBorder("1px dashed #ff0018");
      setValidCsv(false);
      setErrorMsg("Please add valid file (csv)");
      setFileName("Upload your .CSV file");
    } else if (fileSize > maxFileSize) {
      setBorder("1px dashed #ff0018");
      setValidCsv(false);
      setFileName("Upload your .CSV file");
      setErrorMsg(
        "File size is too large. Please upload a file that is less than 5MB."
      );
    } else {
      setErrorMsg("");
      setBorder("1px dashed #677AAB");
      setValidCsv(true);
      setFileName(file.name);
    }
    setCsvFile(file);
  };
  const submitCsvFile = (e) => {
    e.preventDefault();
    let headers = {
      Accept: "application/json",
      Authorization: "Bearer " + getTokenData().access_token,
      "auth-token": getTokenData().access_token,
      "Content-Type": "multipart/form-data",
    };
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.post(
          apiUrl + "upload-multiple-buyers-csv",
          formData,
          { headers: headers }
        );
        if (response.data.status) {
          setLoading(false);
          setCsvFile("");
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/");
        } else {
          setLoading(false);
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          navigate("/");
        }
      } catch (error) {
        setLoading(false);
        console.log(error.response.data.message,'resss');
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
    if (csvFile != "") {
      fetchData();
    } else {
      toast.error("Please Upload Csv First", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      <form className="form-container" method="post" onSubmit={submitCsvFile}>
        <div className="outer-heading text-center">
          <h3>Upload Multiple Buyer </h3>
          <p className="mb-0"> Download CSV
            <a href="/assets/sample/kyle-sample.csv" data-tooltip-id="my-tooltip-1"> Sample 1 ,</a> 
            <a href="/assets/sample/import-buyer-by-email.csv" data-tooltip-id="my-tooltip-2"> Sample 2</a> 
          </p>
        </div>
        <div className="upload-single-data" style={{ border: border }}>
          <div className="upload-files-container">
            <div className="drag-file-area">
              <button type="button" className="upload-button">
                <img
                  src="../../../assets/images/folder-big.svg"
                  className="img-fluid"
                  alt=""
                />
              </button>
              <label className="label d-block">
                <span className="browse-files">
                  <input
                    type="file"
                    name="csvFile"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="default-file-input"
                  />
                  <span className="d-block upload-file">{filename}</span>
                  <span className="browse-files-text">browse Now!</span>
                </span>
              </label>
            </div>
            <span className="cannot-upload-message">
              {" "}
              <span className="error">error</span> Please select a file first{" "}
              <span className="cancel-alert-button">cancel</span>{" "}
            </span>
            <div className="file-block">
              <div className="file-info">
                <span className="file-name"> </span> |{" "}
                <span className="file-size"> </span>{" "}
              </div>
              <span className="remove-file-icon">
                <img
                  src="./assets/images/remove-file-icon.svg"
                  className="img-fluid"
                  alt=""
                />
              </span>
              <div className="progress-bar"> </div>
            </div>
          </div>
        </div>
        {validCsv ? (
          <div className="submit-btn my-30">
            <button
              className="btn btn-fill"
              disabled={loading ? "disabled" : ""}
            >
              Submit Now! {loading ? <MiniLoader /> : ""}{" "}
            </button>
          </div>
        ) : (
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
        )}
      </form>
      <ReactTooltip
        id="my-tooltip-1"
        place="top"
        content="Upload buyer with complete details"/>
      <ReactTooltip
        id="my-tooltip-2"
        place="top"
        content="Upload buyer with only email"/>
    </>
  );
};
export default UploadMultipleBuyers;
