import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Validation Schemas
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Wrong email format").required("Email is required"),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 characters")
    .required("OTP is required"),
});

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password too short")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export function ForgotPassword({ role }) {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    message: string;
    res_code: string;
  } | null>(null);
  const [emailExists, setEmailExists] = useState(false);
  const [otpChecked, setOtpChecked] = useState(false);
  const [email, setEmail] = useState("");

  // // if(role === 'super_admin')
  const table = role;
  // console.log(role);
  

  const formikEmail = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await fetch(`${DOMAIN}/api/school/getemailchecked`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            table: table,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setApiResponse(data);
          if (data.res_code === "01") {
            setEmailExists(true);
            setEmail(values.email);
            console.log("otp for reference :" + " " + data.otp);
            
          } else {
            setApiResponse({ message: "Email not found", res_code: "99" });
          }
        } else {
          setApiResponse({ message: "Failed to verify email", res_code: "99" });
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setApiResponse({ message: "Failed to verify email", res_code: "99" });
      } finally {
        setLoading(false);
      }
    },
  });

  const formikOtp = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await fetch(`${DOMAIN}/api/school/checkotp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: values.otp,
            table: table,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setApiResponse(data);
          if (data.res_code === "01") {
            setOtpChecked(true);
          } else {
            setApiResponse({ message: "Invalid OTP", res_code: "99" });
          }
        } else {
          setApiResponse({ message: "Failed to verify OTP", res_code: "99" });
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        setApiResponse({ message: "Failed to verify OTP", res_code: "99" });
      } finally {
        setLoading(false);
      }
    },
  });

  const Navigate = useNavigate();

  const formikPassword = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await fetch(`${DOMAIN}/api/school/updatepassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            newPassword: values.newPassword,
            table: table,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setApiResponse(data);
          toast.success("Password Updated...");
          Navigate("/auth");
        } else {
          setApiResponse({
            message: "Failed to reset password",
            res_code: "99",
          });
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        setApiResponse({ message: "Failed to reset password", res_code: "99" });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_password_reset_form"
      onSubmit={
        !emailExists
          ? formikEmail.handleSubmit
          : !otpChecked
          ? formikOtp.handleSubmit
          : formikPassword.handleSubmit
      }
    >
      <div className="text-center mb-10">
        <h1 className="text-gray-900 fw-bolder mb-3">Forgot Password?</h1>
        <div className="text-gray-500 fw-semibold fs-6">
          {!emailExists
            ? "Enter your email to reset your password."
            : !otpChecked
            ? "Enter the OTP sent to your email."
            : "Enter your new password."}
        </div>
      </div>

      {apiResponse && (
        <div
          className={`mb-10 ${
            apiResponse.res_code === "01"
              ? "bg-light-info"
              : "alert alert-danger"
          } p-8 rounded`}
        >
          <div
            className={
              apiResponse.res_code === "01"
                ? "text-info"
                : "font-weight-bold text-danger"
            }
          >
            {apiResponse.message}
          </div>
        </div>
      )}

      {!emailExists && (
        <div className="fv-row mb-8">
          <label className="form-label fw-bolder text-gray-900 fs-6">
            Email
          </label>
          <input
            type="email"
            placeholder=""
            autoComplete="off"
            {...formikEmail.getFieldProps("email")}
            className={`form-control bg-transparent ${
              formikEmail.touched.email && formikEmail.errors.email
                ? "is-invalid"
                : ""
            }`}
          />
          {formikEmail.touched.email && formikEmail.errors.email && (
            <div className="fv-help-block">
              <span role="alert">{formikEmail.errors.email}</span>
            </div>
          )}
        </div>
      )}

      {emailExists && !otpChecked && (
        <div className="fv-row mb-8">
          <label className="form-label fw-bolder text-gray-900 fs-6">OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            autoComplete="off"
            {...formikOtp.getFieldProps("otp")}
            className={`form-control bg-transparent ${
              formikOtp.touched.otp && formikOtp.errors.otp ? "is-invalid" : ""
            }`}
          />
          {formikOtp.touched.otp && formikOtp.errors.otp && (
            <div className="fv-help-block">
              <span role="alert">{formikOtp.errors.otp}</span>
            </div>
          )}
        </div>
      )}

      {otpChecked && (
        <>
          <div className="fv-row mb-8">
            <label className="form-label fw-bolder text-gray-900 fs-6">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              autoComplete="off"
              {...formikPassword.getFieldProps("newPassword")}
              className={`form-control bg-transparent ${
                formikPassword.touched.newPassword &&
                formikPassword.errors.newPassword
                  ? "is-invalid"
                  : ""
              }`}
            />
            {formikPassword.touched.newPassword &&
              formikPassword.errors.newPassword && (
                <div className="fv-help-block">
                  <span role="alert">{formikPassword.errors.newPassword}</span>
                </div>
              )}
          </div>
          <div className="fv-row mb-8">
            <label className="form-label fw-bolder text-gray-900 fs-6">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              autoComplete="off"
              {...formikPassword.getFieldProps("confirmPassword")}
              className={`form-control bg-transparent ${
                formikPassword.touched.confirmPassword &&
                formikPassword.errors.confirmPassword
                  ? "is-invalid"
                  : ""
              }`}
            />
            {formikPassword.touched.confirmPassword &&
              formikPassword.errors.confirmPassword && (
                <div className="fv-help-block">
                  <span role="alert">
                    {formikPassword.errors.confirmPassword}
                  </span>
                </div>
              )}
          </div>
        </>
      )}

      <div className="d-flex flex-wrap justify-content-center gap-3 pb-lg-0">
        <button
          type="submit"
          id="kt_password_reset_submit"
          className="btn btn-primary"
        >
          <span className="indicator-label">
            {emailExists && !otpChecked
              ? "Verify OTP"
              : otpChecked
              ? "Reset Password"
              : "Submit"}
          </span>
          {loading && (
            <span className="indicator-progress">
              Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary border border-black"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
