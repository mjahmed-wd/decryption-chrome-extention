import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import gearIcon from "./image/favpng_gear.png";
import deleteIcon from "./image/delete.png";
import { useHistory } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const CryptoJS = require("crypto-js");

const key = CryptoJS.enc.Utf8.parse(localStorage.getItem("key") || "");
const iv = CryptoJS.enc.Utf8.parse(localStorage.getItem("iv") || "");
export const makeDecryption = (data) => {
  const decrypt = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedData = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

const initData = {
  text: "",
};

const Popup = () => {
  const history = useHistory();
  const localStorageUrl = localStorage.getItem("url");
  const localStorageData = localStorage.getItem("data");

  const [data, setData] = useState(JSON.parse(localStorageData) || "");
  const [urlData, setUrlData] = useState(localStorageUrl || "");

  const credentials = [localStorage.getItem("key"), localStorage.getItem("iv")];
  const checkCredentials = credentials.every(
    (item) => typeof item === "string" && item !== ""
  );
  if (!checkCredentials) {
    toast.warn("Please enter your Secret Key and  Initialization Vector");
    history.push("/setting");
  }
  const [deleteButtonStatus, setDeleteButtonStatus] = useState(false);

  useEffect(() => {
    if (urlData === "" && data === "") {
      setDeleteButtonStatus(false);
    } else {
      setDeleteButtonStatus(true);
    }
  }, [urlData, data]);

  return (
    <div className="mt-3 mb-3">
      <div className="w-100 d-flex justify-content-between">
        <OverlayTrigger
          key="right"
          placement="right"
          overlay={<Tooltip id={`tooltip-right`}>Settings Page.</Tooltip>}
        >
          <img
            src={gearIcon}
            alt=""
            srcSet=""
            style={{ width: "25px" }}
            onClick={() => history.push("/setting")}
          />
        </OverlayTrigger>

        {deleteButtonStatus && (
          <OverlayTrigger
            key="left"
            placement="left"
            overlay={<Tooltip id={`tooltip-bottom`}>Clear Data.</Tooltip>}
          >
            <img
              src={deleteIcon}
              alt=""
              srcSet=""
              style={{ width: "25px" }}
              className={deleteButtonStatus ? "" : "d-none"}
              onClick={() => {
                localStorage.removeItem("url");
                setUrlData("");
                localStorage.removeItem("data");
                setData("");
                toast.success("Cleared from storage");
              }}
            />
          </OverlayTrigger>
        )}
      </div>

      <Formik
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          let decoded;

          if (
            values?.text.startsWith("http") ||
            values?.text.startsWith("Request")
          ) {
            const tempArr = values?.text.split("?");
            let temp1 = tempArr.shift().concat("?");
            let temp2;
            if (tempArr.length > 2) {
              temp2 = tempArr.join("");
              temp2 = makeDecryption(temp2);
            } else {
              temp2 = tempArr.shift();
              temp2 = makeDecryption(temp2);
            }
            // check if it is full url or able to be json

            setUrlData(temp1 + temp2);
            localStorage.setItem("url", temp1 + temp2);
            resetForm(initData);
          } else {
            decoded = makeDecryption(values?.text);
            try {
              setData(JSON.parse(decoded));
              localStorage.setItem("data", decoded);
            } catch (e) {
              setUrlData(decoded);
              localStorage.setItem("url", decoded);
            }
            resetForm(initData);
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="w-100">
            <div className="d-flex justify-content-center mt-2 mb-2">
              <Field className="form-control mr-3" type="text" name="text" />
              <button className="btn btn-secondary ml-3" type="submit">
                Submit
              </button>
            </div>
            {urlData !== "" && (
              <>
                <p> {urlData}</p>
                <div className="w-100 d-flex justify-content-end">
                  <CopyToClipboard
                    text={urlData}
                    onCopy={() => toast.info("Copied to clipboard")}
                  >
                    <button className="btn btn-secondary text-center">
                      Copy
                    </button>
                  </CopyToClipboard>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
      {data !== "" && <ReactJson src={data} />}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </div>
  );
};

export default Popup;
