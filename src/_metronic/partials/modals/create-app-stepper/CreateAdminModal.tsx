import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { KTIcon } from "../../../helpers";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";

type Props = {
  show: boolean;
  onHide: () => void;
  schoolId: number | null;
};

const CreateAdminModal = ({ show, onHide, schoolId }: Props) => {
  //  console.log("from createAdminModal",schoolId);
   
const [passwordError, setpasswordError] = useState('');

  const [formData, setFormData] = useState({
    // Initialize form data fields
    employee_id: "",
    lang_id: 0,
    department: 0,
    designation: 0,
    qualification: "",
    work_exp: "",
    name: "",
    surname: "",
    father_name: "",
    mother_name: "",
    contact_no: "",
    emergency_contact_no: "",
    email: "",
    dob: "",
    marital_status: "",
    date_of_joining: "",
    date_of_leaving: "0000-00-00",
    local_address: "",
    permanent_address: "",
    note: "",
    image: "",
    password: "",
    gender: "",
    account_title: "",
    bank_account_no: "",
    bank_name: "",
    ifsc_code: "",
    bank_branch: "",
    payscale: "",
    basic_salary: "",
    epf_no: "",
    contract_type: "",
    shift: "",
    location: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    resume: "",
    joining_letter: "",
    resignation_letter: "",
    other_document_name: "",
    other_document_file: "",
    user_id: 0,
    is_active: 1,
    verification_code: 0,
    disable_at: "0000-00-00",
    school_id:  schoolId ,
  });
 
  useEffect(()=>{
    setFormData(prevformData=>
      ({
        ...prevformData,
        school_id:schoolId
      })
    )
  },[schoolId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if(name==='password' || name==='confirmpassword')
      {
        setpasswordError('');
      }
      if(name==='confirmpassword' && value!==formData.password)
        {
          setpasswordError('Password do not match');
        }
      };
/* @ts-ignore */
  const handleFileChnage=(e)=>
    {
      const file=e.target.files[0];
      if(file)
        {
          setFormData(prevData=>
        ( {
              ...prevData,
              image:file.name
            })
        
          )
        }
    }
  /* @ts-ignore */
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try {
      const response = await fetch(
        `${DOMAIN}/api/superadmin/create_admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create admin");
      }
      const data = await response.json();
      console.log('Admin created successfully:', data);
      // Update formData with the response data if needed
      setFormData(prevFormdata=>({
        ...prevFormdata,
        ...data
      }));
      onHide();
    } catch (error) {
      console.error("Error:", error);
      // Handle error, e.g., show error message
    }
  };

  return (
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={onHide}
    >
      <div className="modal-header ">
        <h2> Add School Admin</h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={onHide}
        >
          <KTIcon className="fs-1" iconName="cross" />
        </div>
      </div>
      <div
        className="modal-body py-lg-10 px-lg-10 border"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="justify-content-center justify-content-xl-start flex-row-auto w-100 ">
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
               // border: "1px solid",
             //   padding: "10px",
                borderRadius: "10px",
               
              }}
              action="POST"
              onSubmit={handleSubmit}
            >
              <div className="current" data-kt-stepper-element="content">
                <div className="w-500" style={{ minWidth: "650px" }}>
                  <div
                    className="fv-row mb-10"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    
                    
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
                      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                        <span className="required"> Name:</span>
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
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "50%",
                      }}
                    >
                      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
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
                      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                        <span className="required"> Contact_No:</span>
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg form-control-solid border-black"
                        name="contact_no"
                        placeholder=""
                        value={formData.contact_no}
                        onChange={handleChange}
                        style={{
                          WebkitAppearance:'none',
                          MozAppearance:'textfield',
                          appearance:'textfield'                    
                        }}
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
                        <span className="required">Emergency_Contact_No</span>
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg form-control-solid border-black"
                        name="emergency_contact_no"
                        placeholder=""
                        value={formData.emergency_contact_no}
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
                      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                        <span className="required"> Email:</span>
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg form-control-solid border-black"
                        name="email"
                        placeholder=""
                        value={formData.email}
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
                        <span className="required">Date  of Birth :</span>
                      </label>
                      <input
                        type="date"
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
                      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                        <span className="required"> Marital_Status:</span>
                      </label>
                      <select
                        className="form-control form-control-lg form-control-solid border-black"
                        name="marital_status"
                        value={formData.marital_status}
                        /* @ts-ignore */
                        onChange={handleChange}
                      >
                        <option value="">Select Maritial Status...</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        </select>
                      
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "50%",
                      }}
                    >
                      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                        <span className="required">Date_Of_Joining</span>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-lg form-control-solid border-black"
                        name="date_of_joining"
                        value={formData.date_of_joining}
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
                      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                        <span className="required"> Image:</span>
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-lg form-control-solid border-black"
                        name="image"
                       accept="image/*"
                        //value={formData.image}
                        onChange={handleFileChnage}
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
                        <span className="required">Password</span>
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg form-control-solid border-black"
                        name="password"
                        placeholder=""
                        value={formData.password}
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
                        <span className="required"> confirm Password</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg form-control-solid border-black ${passwordError ? 'border-danger' : ''}`}

                        name="confirmpassword"
                        placeholder=""
                      //  value='confirmpassword'
                        onChange={handleChange}
                     required/>
                    {passwordError && <p className="text-danger"> {passwordError} </p> }
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
                    <span className="required">Employee_Username</span>
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
                      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                        <span className="required"> Gender:</span>
                      </label>
                      <select
                        className="form-control form-control-lg form-control-solid border-black"
                        name="gender"
                        value={formData.gender}
                        /* @ts-ignore */
                        onChange={handleChange}
                      >
                        <option value="">Select a gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        </select>
                    </div>
                  
                  </div>

                

                

              

                  
                </div>
              </div>
              {/* <div style={{ marginBottom: "10px" }}>
      <label htmlFor="name" style={{ fontWeight: "bold" }}>
        Name:
      </label>
      <input
        type="text"
        id="name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{
          marginLeft: "5px",
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
    <div style={{ marginBottom: "10px" }}>
      <label htmlFor="designation" style={{ fontWeight: "bold" }}>
        Email:
      </label>
      <input
        type="email"
        id="email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{
          marginLeft: "5px",
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
    <div style={{ marginBottom: "10px" }}>
      <label htmlFor="address" style={{ fontWeight: "bold" }}>
        Address:
      </label>
      <input
        type="text"
        id="address"
        value={formData.surname}
        onChange={handleChange}
        required
        style={{
          marginLeft: "5px",
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div> */}
              <button
                type="submit"
                // onSubmit={()=>handleSubmit}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                }}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onClick={(e)=>{
                 // e.preventDefault(); 
                onHide();
                }}
              
              >
                Submit
              </button>
            </form>
        </div>
      </div>
    </Modal>
  );
};

export { CreateAdminModal };
