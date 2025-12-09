import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { getSchoolUserByToken, loginSchoolUser } from "../core/_requests";
import { useAuth } from "../core/Auth";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Container, Row } from "react-bootstrap";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("email is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
});

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function StaffLogin() {
  const [loading, setLoading] = useState(false);
  const { saveAuth, setCurrentUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const { data: auth } = await loginSchoolUser(
          values.email,
          values.password
        );
        saveAuth(auth);

        const { data: user } = await getSchoolUserByToken(
          auth.id,
          auth.school_id,
          auth.session_id
        );
        const sessionName = user.data?.[0]?.session_name;
        const sessionToastKey = `logged-in-toast`;
        if (sessionName && !localStorage.getItem(sessionToastKey)) {
          toast.info(
            <span
              style={{
                fontWeight: "500",
                fontFamily: "Manrope",
                fontSize: "15px",
              }}
            >
              You are working in the session:
              <span style={{ fontWeight: "700" }}> {sessionName}</span>
            </span>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
              style: {
                backgroundColor: "#1F3259", // Custom background color
                color: "#ffffff", // Text color
              },
            }
          );
          localStorage.setItem(sessionToastKey, "true");
        }
        setCurrentUser(user.data?.[0]);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error || error?.message || "Login failed.";
        setStatus(errorMessage);
        setLoading(false)
      }
    },
  });

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
    >
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={12} className="mx-auto">
          <form
            className="form"
            onSubmit={formik.handleSubmit}
            noValidate
            id="kt_login_signin_form"
          >
            <div className="text-center mb-11">
              <div className="d-flex flex-column justify-content-center align-items-center mb-4">
                <img
                  src="/media/logos/onepitara-logo.png"
                  alt="One Pitara Logo"
                  style={{
                    height: "120px", // Increased size
                    objectFit: "contain", // Keeps aspect ratio
                    backgroundColor: "transparent", // Ensure no solid fill
                    mixBlendMode: "multiply", // Blends with background
                  }}
                  className="img-fluid mx-auto d-block"
                />
                <p
                  className="fs-1 fw-bold"
                  style={{
                    color: "#1F3259",
                    position: "absolute",
                    marginTop: "100px",
                  }}
                >
                  School Portal Sign In
                </p>
              </div>
              <hr style={{ border: "1px dashed gray" }} />
              {/* <div style={{ color: "#1F3259",fontWeight:'600', fontSize:'14px' ,fontFamily:'Manrope' }}>
          Enter Credentials
        </div> */}
            </div>

            {formik.status ? (
              <div className="mb-lg-15 alert alert-danger">
                <div className="alert-text font-weight-bold">
                  {formik.status}
                </div>
              </div>
            ) : (
              <div
                className="mb-10 p-8 rounded"
                style={{ backgroundColor: "#F8F5FF" }}
              >
                <div
                  className="text-info"
                  style={{
                    color: "#1F3259",
                    fontWeight: "400",
                    fontSize: "14px",
                    fontFamily: "Manrope",
                  }}
                >
                  Use a valid account <strong>email</strong> and{" "}
                  <strong>password</strong> to continue.
                </div>
              </div>
            )}

            {/* begin::Form group */}
            <div className="fv-row mb-8">
              <label
                className="form-label"
                style={{
                  color: "#1F3259",
                  fontWeight: "800",
                  fontSize: "14px",
                  fontFamily: "Manrope",
                }}
              >
                Email
              </label>
              <input
                placeholder="Enter Email"
                type="text"
                {...formik.getFieldProps("email")}
                className={clsx("form-control bg-transparent")}
                name="email"
                autoComplete="off"
                style={{
                  border: "1px solid lightgray",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                  color: "#1F3259",
                }}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="fv-plugins-message-container">
                  <span role="alert">{formik.errors.email}</span>
                </div>
              )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className="fv-row mb-3">
              <label
                className="form-label"
                style={{
                  fontWeight: "800",
                  fontSize: "14px",
                  fontFamily: "Manrope",
                  color: "#1F3259",
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                autoComplete="off"
                {...formik.getFieldProps("password")}
                className={clsx("form-control bg-transparent")}
                style={{
                  border: "1px solid lightgray",
                  fontFamily: "Manrope",
                  fontSize: "14px",
                }}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.password}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Form group */}

            {/* begin::Wrapper */}
            <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
              <div />

              {/* begin::Link */}
              <Link
                to="/auth/forgot-password/staff"
                className="link-primary"
                style={{ fontFamily: "Manrope", fontSize: "14px" }}
              >
                Forgot Password ?
              </Link>
              {/* end::Link */}
            </div>
            {/* end::Wrapper */}

            {/* begin::Action */}
            <div className="d-grid mb-10">
              <button
                type="submit"
                id="kt_sign_in_submit"
                className="btn"
                style={{ backgroundColor: "#1F3259" }}
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {!loading && (
                  <span
                    className="indicator-label"
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      color: "#fff",
                    }}
                  >
                    Continue
                  </span>
                )}
                {loading && (
                  <span
                    className="indicator-progress"
                    style={{
                      display: "block",
                      fontFamily: "Manrope",
                      fontSize: "14px",
                    }}
                  >
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
            {/* end::Action */}

            {/* <div
        className="text-center"
        style={{
          fontFamily: "Manrope",
          fontSize: "14px",
          color: "#1F3259",
          fontWeight: "500",
        }}
      >
        Swtich Logins?{" "}
        <Link
          to="#"
          className="link-primary"
          style={{
            fontFamily: "Manrope",
            fontSize: "14px",
            color: "#1F3259",
            fontWeight: "600",
          }}
        >
          Student Login
        </Link>
      </div> */}
          </form>
        </Col>
      </Row>
    </Container>
  );
}

// import {useState} from 'react'
// import * as Yup from 'yup'
// import clsx from 'clsx'
// import {Link} from 'react-router-dom'
// import {useFormik} from 'formik'
// import {getUserByToken, login} from '../core/_requests'
// import {toAbsoluteUrl} from '../../../../_metronic/helpers'
// import {useAuth} from '../core/Auth'

// const loginSchema = Yup.object().shape({
//   email: Yup.string()
//     .email('Wrong email format')
//     .min(3, 'Minimum 3 symbols')
//     .max(50, 'Maximum 50 symbols')
//     .required('Email is required'),
//   password: Yup.string()
//     .min(3, 'Minimum 3 symbols')
//     .max(50, 'Maximum 50 symbols')
//     .required('Password is required'),
// })

// const initialValues = {
//   email: 'admin@demo.com',
//   password: 'demo',
// }

// /*
//   Formik+YUP+Typescript:
//   https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
//   https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
// */

// export function Login() {
//   const [loading, setLoading] = useState(false)
//   const {saveAuth, setCurrentUser} = useAuth()

//   const formik = useFormik({
//     initialValues,
//     validationSchema: loginSchema,
//     onSubmit: async (values, {setStatus, setSubmitting}) => {
//       setLoading(true)
//       try {
//         const {data: auth} = await login(values.email, values.password)
//         saveAuth(auth)
//         const {data: user} = await getUserByToken(auth.api_token)
//         setCurrentUser(user)
//       } catch (error) {
//         console.error(error)
//         saveAuth(undefined)
//         setStatus('The login details are incorrect')
//         setSubmitting(false)
//         setLoading(false)
//       }
//     },
//   })

//   return (
//     <form
//       className='form w-100'
//       onSubmit={formik.handleSubmit}
//       noValidate
//       id='kt_login_signin_form'
//     >
//       {/* begin::Heading */}
//       <div className='text-center mb-11'>
//         <h1 className='text-gray-900 fw-bolder mb-3'>Sign In</h1>
//         <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div>
//       </div>
//       {/* begin::Heading */}

//       {/* begin::Login options */}
//       <div className='row g-3 mb-9'>
//         {/* begin::Col */}
//         <div className='col-md-6'>
//           {/* begin::Google link */}
//           <a
//             href='#'
//             className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
//           >
//             <img
//               alt='Logo'
//               src={toAbsoluteUrl('media/svg/brand-logos/google-icon.svg')}
//               className='h-15px me-3'
//             />
//             Sign in with Google
//           </a>
//           {/* end::Google link */}
//         </div>
//         {/* end::Col */}

//         {/* begin::Col */}
//         <div className='col-md-6'>
//           {/* begin::Google link */}
//           <a
//             href='#'
//             className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
//           >
//             <img
//               alt='Logo'
//               src={toAbsoluteUrl('media/svg/brand-logos/apple-black.svg')}
//               className='theme-light-show h-15px me-3'
//             />
//             <img
//               alt='Logo'
//               src={toAbsoluteUrl('media/svg/brand-logos/apple-black-dark.svg')}
//               className='theme-dark-show h-15px me-3'
//             />
//             Sign in with Apple
//           </a>
//           {/* end::Google link */}
//         </div>
//         {/* end::Col */}
//       </div>
//       {/* end::Login options */}

//       {/* begin::Separator */}
//       <div className='separator separator-content my-14'>
//         <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span>
//       </div>
//       {/* end::Separator */}

//       {formik.status ? (
//         <div className='mb-lg-15 alert alert-danger'>
//           <div className='alert-text font-weight-bold'>{formik.status}</div>
//         </div>
//       ) : (
//         <div className='mb-10 bg-light-info p-8 rounded'>
//           <div className='text-info'>
//             Use account <strong>admin@demo.com</strong> and password <strong>demo</strong> to
//             continue.
//           </div>
//         </div>
//       )}

//       {/* begin::Form group */}
//       <div className='fv-row mb-8'>
//         <label className='form-label fs-6 fw-bolder text-gray-900'>Email</label>
//         <input
//           placeholder='Email'
//           {...formik.getFieldProps('email')}
//           className={clsx(
//             'form-control bg-transparent',
//             {'is-invalid': formik.touched.email && formik.errors.email},
//             {
//               'is-valid': formik.touched.email && !formik.errors.email,
//             }
//           )}
//           type='email'
//           name='email'
//           autoComplete='off'
//         />
//         {formik.touched.email && formik.errors.email && (
//           <div className='fv-plugins-message-container'>
//             <span role='alert'>{formik.errors.email}</span>
//           </div>
//         )}
//       </div>
//       {/* end::Form group */}

//       {/* begin::Form group */}
//       <div className='fv-row mb-3'>
//         <label className='form-label fw-bolder text-gray-900 fs-6 mb-0'>Password</label>
//         <input
//           type='password'
//           autoComplete='off'
//           {...formik.getFieldProps('password')}
//           className={clsx(
//             'form-control bg-transparent',
//             {
//               'is-invalid': formik.touched.password && formik.errors.password,
//             },
//             {
//               'is-valid': formik.touched.password && !formik.errors.password,
//             }
//           )}
//         />
//         {formik.touched.password && formik.errors.password && (
//           <div className='fv-plugins-message-container'>
//             <div className='fv-help-block'>
//               <span role='alert'>{formik.errors.password}</span>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* end::Form group */}

//       {/* begin::Wrapper */}
//       <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
//         <div />

//         {/* begin::Link */}
//         <Link to='/auth/forgot-password' className='link-primary'>
//           Forgot Password ?
//         </Link>
//         {/* end::Link */}
//       </div>
//       {/* end::Wrapper */}

//       {/* begin::Action */}
//       <div className='d-grid mb-10'>
//         <button
//           type='submit'
//           id='kt_sign_in_submit'
//           className='btn btn-primary'
//           disabled={formik.isSubmitting || !formik.isValid}
//         >
//           {!loading && <span className='indicator-label'>Continue</span>}
//           {loading && (
//             <span className='indicator-progress' style={{display: 'block'}}>
//               Please wait...
//               <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
//             </span>
//           )}
//         </button>
//       </div>
//       {/* end::Action */}

//       <div className='text-gray-500 text-center fw-semibold fs-6'>
//         Not a Member yet?{' '}
//         <Link to='/auth/registration' className='link-primary'>
//           Sign up
//         </Link>
//       </div>
//     </form>
//   )
// }
