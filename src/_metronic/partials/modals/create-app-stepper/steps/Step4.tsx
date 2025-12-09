/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// import { StepProps } from "../AddStaffModels";

const Step4 = ({ data, updateData, hasError }: any) => (
  <div className="current" data-kt-stepper-element="content">
    <div className="w-500" style={{ minWidth: "650px" }}>
      {/*begin::Form Group */}
      <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">Employee id</span>
          </label>
          <input
            type="text" 
            className="form-control form-control-lg form-control-solid border-black"
            name="employee_id"
            placeholder=""
            value={data.appBasic.employee_id}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, employee_id: e.target.value },
              })
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required"> Name</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="name"
            placeholder=""
            value={data.appBasic.name}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, name: e.target.value },
              })
            }
          />
        </div>
        
      </div>
      <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2 ">
            <span className="required">Surname</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="surname"
            placeholder=""
            value={data.appBasic.surname}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, surname: e.target.value },
              })
            }
          />
        </div>
        
        <div  
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">father_name</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="father_name"
            placeholder=""
            value={data.appBasic.father_name}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, father_name: e.target.value },
              })
            }
          />
        </div>
        
      </div>
     
        

       <div className="w-500" style={{ minWidth: "650px" }}>
      {/*begin::Form Group */}
      <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required"> contact_no</span>
          </label>
          <input
            type="tel"
            className="form-control form-control-lg form-control-solid border-black"
            name="contact_no"
            placeholder=""
            value={data.appBasic.contact_no}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, contact_no: e.target.value },
              })
            }
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">email</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="email"
            placeholder=""
            value={data.appBasic.email}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, email: e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.email && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="email"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              email is required
            </div>
          </div>
        )}
      </div>
      <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2 ">
            <span className="required">password</span>
          </label>
          <input
            type="tel"
            className="form-control form-control-lg form-control-solid border-black"
            name="password"
            placeholder=""
            value={data.appBasic.password}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, password: e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.password && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="password"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              password is required
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
            <span className="required">Dob</span>
          </label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid border-black"
            name="dob"
            placeholder=""
            value={data.appBasic.dob}
            onChange={(e) =>
              updateData({
                appBasic: { ...data.appBasic, dob: e.target.value },
              })
            }
          />
        </div>
        {!data.appBasic.dob && hasError && (
          <div className="fv-plugins-message-container">
            <div
              data-field="dob"
              data-validator="notEmpty"
              className="fv-help-block"
            >
              dob is required
            </div>
          </div>
        )}
      </div>
    
      <div className="fv-row mb-10" style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            // border:'1px solid'
          }}
        >
          <label className="d-flex align-items-center fs-5 fw-semibold mb-2 ">
            <span className="required">gender</span>
          </label>
          <select
            className="form-control form-control-lg form-control-solid border-black"
            name="gender"
            value={data.appBasic.gender}
            onChange={(e) =>
              updateData({
                appBasic: {
                  ...data.appBasic,
                  gender: e.target.value,
                },
              })
            }
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            {/* Add more options as needed */}
          </select>
          {!data.appBasic.gender && hasError && (
            <div className="fv-plugins-message-container">
              <div
                data-field="gender"
                data-validator="notEmpty"
                className="fv-help-block"
              >
                gender App name is required
              </div>
            </div>
          )}
        </div>
        
    </div>
  </div>
 



      
  </div>
  </div>
);



export { Step4 };
