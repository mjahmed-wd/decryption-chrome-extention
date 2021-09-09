import React from "react";
import { Formik, Form, Field } from "formik";
import { ToastContainer, toast } from "react-toastify";
import homeIcon from "./image/homeIcon.png";
import { useHistory } from "react-router-dom";

const initData = {
  key: localStorage.getItem("key") || "",
  iv: localStorage.getItem("iv") || "",
};

const SettingPage = () => {
  const history = useHistory();

  return (
    <div className="mt-3 mb-3">
      <img
        src={homeIcon}
        alt=""
        srcSet=""
        style={{ width: "15px" }}
        onClick={() => history.push("/")}
      />

      <Formik
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          localStorage.setItem("key", values?.key);
          localStorage.setItem("iv", values?.iv);
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="w-100">
            <div className="mt-2 mb-2">
              <b>Enter Secret Key</b>
              <Field
                className="form-control mr-3 mb-3"
                type="text"
                name="key"
                placeholder="Secret Key"
              />
              <b>Enter Initialization Vector</b>
              <Field
                className="form-control mr-3 mb-3"
                type="text"
                name="iv"
                placeholder="Initialization Vector"
              />
              <div className="w-100 d-flex justify-content-end">
                <button className="btn btn-secondary ml-3" type="submit">
                  Save
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

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

export default SettingPage;
