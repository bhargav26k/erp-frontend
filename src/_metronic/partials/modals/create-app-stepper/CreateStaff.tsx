import {  useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../helpers";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type Props = {
  show: boolean;
  handleClose: () => void;
  refresh: (refresh: boolean) => void;
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateStaff = ({ show, handleClose, refresh }: Props) => {
  const { currentUser } = useAuth();
  const school_id = currentUser?.school_id;

  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    surname: "",
    father_name: "",
    contact_no: "",
    email: "",
    dob: "",
    password: "",
    gender: "",
    contract_type: "",
    account_title: "",
    bank_account_no: "",
    bank_name: "",
    ifsc_code: "",
    basic_salary: "",
    user_id: "",
    school_id:school_id
  });
  

                      /* @ts-ignore */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
                      /* @ts-ignore */

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch(`${DOMAIN}/api/school/store-staff`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Failed to create school");
        }

        const data = await response.json();
        console.log("School created successfully:", data);
        handleClose();
        refresh(true);
    } catch (error) {
        console.error("Error creating school:", error);
    }
};


  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleClose}
      // onEntered={loadStepper}
      backdrop={true}
    >
      <div className="modal-header">
        <h2>Create Staff</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <KTIcon className="fs-1" iconName="cross" />
        </div>
      </div>

      <div className="modal-body py-lg-10 px-lg-10 border">
        <form onSubmit={handleSubmit}>
        <div className="w-500" style={{ minWidth: "650px" }}>
          <div
            className="fv-row mb-10"
            style={{ display: "flex", gap: "10px" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
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
               value={formData.employee_id}
               onChange={handleChange}
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
                 value={formData.name}
                 onChange={handleChange}
              />
            </div>
          </div>
          <div
            className="fv-row mb-10"
            style={{ display: "flex", gap: "10px" }}
          >
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
                value={formData.surname}
                onChange={handleChange}
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
                 value={formData.father_name}
                 onChange={handleChange}
              />
            </div>
          </div>
          <div
              className="fv-row mb-10"
              style={{ display: "flex", gap: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                }}
              >
                <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                  <span className="required"> contact_no</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid border-black"
                  name="contact_no"
                  placeholder=""
                  value={formData.contact_no}
                  onChange={handleChange}
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
                   value={formData.email}
                   onChange={handleChange}
                />
              </div>
            </div>
            <div
              className="fv-row mb-10"
              style={{ display: "flex", gap: "10px" }}
            >
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
                  type="text"
                  className="form-control form-control-lg form-control-solid border-black"
                  name="password"
                  placeholder=""
                  value={formData.password}
                  onChange={handleChange}
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
                  <span className="required">Dob</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid border-black"
                  name="dob"
                  placeholder=""
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div
              className="fv-row mb-10"
              style={{ display: "flex", gap: "10px" }}
            >
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
                   value={formData.gender}
                   onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  // border:'1px solid'
                }}
              >
                <label
                  className="form-check-label d-flex align-items-center fs-5 fw-semibold mb-2 text-black"
                  htmlFor="contract_type"
                >
                  <span className="required">contract_type</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid border-black"
                  name="contract_type"
                  placeholder=""
                  value={formData.contract_type}
                  onChange={handleChange}
                />
              </div>
      </div>
            <div
              className="fv-row mb-10"
              style={{ display: "flex", gap: "10px" }}
            >

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  // border:'1px solid'
                }}
              >
                <label
                  className="form-check-label d-flex align-items-center fs-5 fw-semibold mb-2 text-black"
                  htmlFor="account_title"
                >
                  <span className="required">account_title</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid border-black"
                  name="account_title"
                  placeholder=""
                  value={formData.account_title}
                  onChange={handleChange}
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
                <label
                  className="form-check-label d-flex align-items-center fs-5 fw-semibold mb-2 text-black"
                  htmlFor="bank_account_no"
                >
                  <span className="required">bank_account_no</span>
                </label>
                <input
                   type="text"
                   className="form-control form-control-lg form-control-solid border-black"
                   name="bank_account_no"
                   placeholder=""
                   value={formData.bank_account_no}
                   onChange={handleChange}
                />
              </div>
            </div>

            <div
              className="fv-row mb-10"
              style={{ display: "flex", gap: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  // border:'1px solid'
                }}
              >
                <label
                  className="form-check-label d-flex align-items-center fs-5 fw-semibold mb-2 text-black"
                  htmlFor="basic_salary"
                >
                  <span className="required">basic_salary</span>
                </label>
                <input
                 type="text"
                 className="form-control form-control-lg form-control-solid border-black"
                 name="basic_salary"
                 placeholder=""
                 value={formData.basic_salary}
                 onChange={handleChange}
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
                <label
                  className="form-check-label d-flex align-items-center fs-5 fw-semibold mb-2 text-black"
                  htmlFor="user_id"
                >
                  <span className="required">user_id</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid border-black"
                  name="user_id"
                  placeholder=""
                  value={formData.user_id}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div
              className="fv-row mb-10"
              style={{ display: "flex", gap: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  // border:'1px solid'
                }}
              >
                <label
                  className="form-check-label d-flex align-items-center fs-5 fw-semibold mb-2 text-black"
                  htmlFor="ifsc_code"
                >
                  <span className="required">ifsc_code</span>
                </label>
                <input
                 type="text"
                 className="form-control form-control-lg form-control-solid border-black"
                 name="ifsc_code"
                 placeholder=""
                 value={formData.ifsc_code}
                 onChange={handleChange}
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
                <label
                  className="form-check-label d-flex align-items-center fs-5 fw-semibold mb-2 text-black"
                  htmlFor="bank_name"
                >
                  <span className="required">bank_name</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid border-black"
                  name="bank_name"
                  placeholder=""
                  value={formData.bank_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'end'}}>
              <button className="btn btn-primary" type="submit">Submit</button>
            </div>
        </div>
        </form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateStaff };
