import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
// import "./Style.css";

type Props = {
  show: boolean;
  handleClose: () => void;
  refresh: (refresh: boolean) => void;
};

interface Section {
  id: string; // Adjust the type as per your data structure
  section: string;
  // Add other properties if needed
}

interface Class {
  id: string; // Adjust the type as per your data structure
  class: string;
  // Add other properties if needed
}
interface Category {
  id: string; // Adjust the type as per your data structure
  category: string;
  // Add other properties if needed
}
interface Route {
  id: string; // Adjust the type as per your data structure
  route_title: string;
  // Add other properties if needed
}

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateStudent = ({ show, handleClose, refresh }: Props) => {
  const { currentUser } = useAuth();
  // console.log(currentUser);
  
  const schoolId = currentUser?.school_id;
  const sessionId = currentUser?.session_id;
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [categories, setCategory] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    admission_no: 0,
    class: "",
    section: "",
    roll_no: "",
    firstname: "",
    lastname: "",
    gender: "",
    dob: "",
    category_id: "",
    religion: "",
    caste: "",
    mobileno: "",
    email: "",
    admission_date: "",
    academic_year: "",
    studentPhoto: null,
    blood_group: "",
    school_house_id: "",
    height: "",
    weight: "",
    measurement_date: "",
    father_name: "",
    father_phone: "",
    father_occupation: "",
    father_pic: null,
    mother_name: "",
    mother_phone: "",
    mother_occupation: "",
    mother_pic: null,
    guardian_name: "",
    guardian_relation: "",
    guardian_email: "",
    guardian_pic: null,
    guardian_occupation: "",
    guardian_phone: "",
    guardian_is: 0,
    guardian_address: "",
    current_address: "",
    permanent_address: "",
    route_id: "",
    hostel: "",
    room_no: "",
    bank_account_no: "",
    bank_name: "",
    ifsc_code: "",
    previous_school: "",
    rte: "",
    state:"",
    city:"",
    pincode:"",
    school_id: schoolId,
  });
  /* @ts-ignore */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchSections = async () => {
      if (!formData.class) return;

      const schoolId = currentUser?.school_id;
      try {
        const response = await fetch(`${DOMAIN}/api/school/get-sections?schoolId=${schoolId}&classId=${formData.class}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSections(data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();  
  }, [formData.class]);


  useEffect(() => {
    const fetchClasses = async () => {
      const schoolId = currentUser?.school_id;
      if (!schoolId) return; 

      try {
        const response = await fetch(`${DOMAIN}/api/school/get-classes?schoolId=${schoolId}&sessionId=${sessionId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();

    const fetchRoutes = async () => {
      const schoolId = currentUser?.school_id;
      if (!schoolId) return; 

      try {
        const response = await fetch(`${DOMAIN}/api/school/get-routes?schoolId=${schoolId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRoutes(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchRoutes();

    const fetchCategory = async () => {
      const schoolId = currentUser?.school_id;
      if (!schoolId) return; 

      try {
        const response = await fetch(`${DOMAIN}/api/school/get-categories`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchCategory();
  }, [currentUser]);



  /* @ts-ignore */
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${DOMAIN}/api/school/storeStudent`, {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            formData
          })
      });
  
      if (!response.ok) {
        throw new Error("Failed to create student");
      }
  
      const data = await response.json();
      console.log("Student created successfully:", data);
      handleClose();
      refresh(true);
    } catch (error) {
      console.error("Error creating student:", error);
    }
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered"
      show={show}
      onHide={handleClose}
      fullscreen={true}
    >
      <div
        className="modal-content"
        style={{ padding: "20px 5px", borderRadius: "17px", width: "auto" }}
      >
        <div
          className="modal-header border-0"
          style={{ width: "100%", height: "17px" }}
          >
          <span
            className=""
            id="staticBackdropLabel"
            style={{
              fontSize: "24px",
              fontWeight: "600",
              fontFamily: "Manrope",
            }}
          >
            Create Student
          </span> 
          <span
            data-bs-dismiss="modal"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#ECECEC" />
              <path
                d="M22.8572 9.14294L9.14288 22.8572M9.14288 9.14294L22.8572 22.8572"
                stroke="#464646"
                stroke-width="2"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "23px" }}>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Student Information
              </h1>
              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
                >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="number"
                    className="form-control"
                    id="admission_no"
                    name="admission_no"
                    placeholder=""
                    value={formData.admission_no}
                    onChange={handleChange}
                  />
                  <label htmlFor="admission_no">Addmission No.</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <select
                    className="form-select"
                    id="class"
                    name="class"
                    aria-label="Default select example"
                    value={formData.class}
                    onChange={handleChange}
                  >
                    <option value="">Choose Class</option>
                    {classes.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.class}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="class">Select Class</label>
                </div>

                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <select
                    className="form-select"
                    id="section"
                    name="section"
                    aria-label="Default select example"
                    value={formData.section}
                    onChange={handleChange}
                  >
                    <option value="">Choose Section</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.section}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="section">Select Section</label>
                </div>

                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="roll_no"
                    name="roll_no"
                    placeholder=""
                    value={formData.roll_no}
                    onChange={handleChange}
                  />
                  <label htmlFor="roll_no">Roll Number</label>
                </div>
              </div>
              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
                >
                  <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    // border:'1px solid'
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="firstname"
                    name="firstname"
                    placeholder=""
                    value={formData.firstname}
                    onChange={handleChange}
                  />
                  <label htmlFor="firstname">First Name</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    // border:'1px solid'
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    name="lastname"
                    placeholder=""
                    value={formData.lastname}
                    onChange={handleChange}
                  />
                  <label htmlFor="lastname">Last Name</label>
                </div>

                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <select
                    className="form-select"
                    id="gender"
                    aria-label="Default select example"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                   >
                    <option value="" selected>
                      Choose Gender
                    </option>
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Other</option>
                  </select>
                  <label htmlFor="gender">Select Gender</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    // border:'1px solid'
                  }}
                >
                  <input
                    type="date"
                    className="form-control"
                    id="dob"
                    name="dob"
                    placeholder=""
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  <label htmlFor="dob">Date Of Birth</label>
                </div>
              </div>
              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <select
                    className="form-select"
                    id="category_id"
                    aria-label="Default select example"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                  >
                    <option value="" selected>
                      Choose Category
                    </option>
                   {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="category_id">Select Category</label>
                  
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="religion"
                    name="religion"
                    placeholder=""
                    value={formData.religion}
                    onChange={handleChange}
                  />
                  <label htmlFor="religion">Enter Religion</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="caste"
                    name="caste"
                    placeholder=""
                    value={formData.caste}
                    onChange={handleChange}
                  />
                  <label htmlFor="caste">Enter Caste</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="tel"
                    className="form-control"
                    id="mobileno"
                    name="mobileno"
                    placeholder=""
                    value={formData.mobileno}
                    onChange={handleChange}
                  />
                  <label htmlFor="mobileno">Mobile No.</label>
                </div>
              </div>
              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder=""
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">Enter Email</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="date"
                    className="form-control"
                    id="admission_date"
                    name="admission_date"
                    placeholder=""
                    value={formData.admission_date}
                    onChange={handleChange}
                  />
                  <label htmlFor="admission_date">Admission Date</label>
                </div>

                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="number"
                    className="form-control"
                    id="academic_year"
                    name="academic_year"
                    placeholder=""
                    min="1900"
                    max="2100"
                    step="1"
                    value={formData.academic_year}
                    onChange={handleChange}
                  />
                  <label htmlFor="academic_year">Enter academic_year</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="file"
                    className="form-control"
                    id="studentPhoto"
                    name="studentPhoto"
                    placeholder=""  
                    /* @ts-ignore */
                    value={formData?.studentPhoto}
                    onChange={handleChange}
                  />
                  <label htmlFor="studentPhoto">Student Photo</label>
                </div>
              </div>
              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <select
                    className="form-select"
                    id="blood_group"
                    aria-label="Default select example"
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                  >
                    <option value="" selected>
                      Choose Blood Group
                    </option>
                    <option value="1">O+</option>
                    <option value="2">A+</option>
                    <option value="3">B+</option>
                    <option value="3">AB+</option>
                    <option value="3">O-</option>
                    <option value="3">A-</option>
                    <option value="3">B-</option>
                    <option value="3">AB-</option>
                  </select>
                  <label htmlFor="blood_group">Select Blodd Group</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <select
                    className="form-select"
                    id="school_house_id"
                    aria-label="Default select example"
                    name="school_house_id"
                    value={formData.school_house_id}
                    onChange={handleChange}
                  >
                    <option value="" selected>
                      Choose Student House
                    </option>
                    <option value="1">Agni</option>
                    <option value="2">Prithvi</option>
                    <option value="3">Jal</option>
                    <option value="3">Vayu</option>
                    <option value="3">Akash</option>
                  </select>
                  <label htmlFor="school_house_id ">Select Student House</label>
                </div>

                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                 >
                  <input
                    type="text"
                    className="form-control"
                    id="height"
                    name="height"
                    placeholder=""
                    value={formData.height}
                    onChange={handleChange}
                  />
                  <label htmlFor="height">Enter Height</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                  >
                  <input
                    type="text"
                    className="form-control"
                    id="weight"
                    name="weight"
                    placeholder=""
                    value={formData.weight}
                    onChange={handleChange}
                  />
                  <label htmlFor="weight">Enter Weight</label>
                </div>
              </div>
              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
                 >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                 >
                  <input
                    type="date"
                    className="form-control"
                    id="measurement_date"
                    name="measurement_date"
                    placeholder=""
                    value={formData.measurement_date}
                    onChange={handleChange}
                  />
                  <label htmlFor="measurement_date">Enter As On Date</label>
                </div>

                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                 >
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    placeholder=""
                    value={formData.state}
                    onChange={handleChange}
                  />
                  <label htmlFor="state">State</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                 >
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    placeholder=""
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <label htmlFor="city">City</label>
                </div>
                
                
              </div>

              

              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Parent Guardian Detail
              </h1>
              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="father_name"
                    name="father_name"
                    placeholder=""
                    value={formData.father_name}
                    onChange={handleChange}
                  />
                  <label htmlFor="father_name">Enter Father Name</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="tel"
                    className="form-control"
                    id="father_phone"
                    name="father_phone"
                    placeholder=""
                    value={formData.father_phone}
                    onChange={handleChange}
                  />
                  <label htmlFor="father_phone">Enter Father Phone</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="tel"
                    className="form-control"
                    id="father_occupation"
                    name="father_occupation"
                    placeholder=""
                    value={formData.father_occupation}
                    onChange={handleChange}
                  />
                  <label htmlFor="father_occupation">
                    Enter Father Occupation
                  </label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="file"
                    className="form-control"
                    id="father_pic"
                    name="father_pic"
                    placeholder=""
                    onChange={handleChange}
                  />
                  <label htmlFor="father_pic">Father Photo</label>
                </div>
              </div>

              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="mother_name"
                    name="mother_name"
                    placeholder=""
                    value={formData.mother_name}
                    onChange={handleChange}
                  />
                  <label htmlFor="mother_name">Enter Mother Name</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="tel"
                    className="form-control"
                    id="mother_phone"
                    name="mother_phone"
                    placeholder=""
                    value={formData.mother_phone}
                    onChange={handleChange}
                  />
                  <label htmlFor="mother_phone">Enter Mother Phone</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="tel"
                    className="form-control"
                    id="mother_occupation"
                    name="mother_occupation"
                    placeholder=""
                    value={formData.mother_occupation}
                    onChange={handleChange}
                  />
                  <label htmlFor="mother_occupation">
                    Enter Mother Occupation
                  </label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="file"
                    className="form-control"
                    id="mother_pic"
                    name="mother_pic"
                    placeholder=""
                    onChange={handleChange}
                  />
                  <label htmlFor="mother_pic">Mother Photo</label>
                </div>
              </div>

              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <span>If Guardian Is : </span>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value="Father"
                    onChange={() =>
                      setFormData({ ...formData, guardian_is: 1 })
                    }
                  />
                  <label
                    className="form-check-label text-black"
                    htmlFor="flexRadioDefault1"
                  >
                    Father
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value="Mother"
                    onChange={() =>
                      setFormData({ ...formData, guardian_is: 1 })
                    }
                  />
                  <label
                    className="form-check-label text-black"
                    htmlFor="flexRadioDefault1"
                  >
                    Mother
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value="Other"
                    onChange={() =>
                      setFormData({ ...formData, guardian_is: 1 })
                    }
                  />
                  <label
                    className="form-check-label text-black"
                    htmlFor="flexRadioDefault1"
                  >
                    Other
                  </label>
                </div>
              </div>

              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="guardian_name"
                    name="guardian_name"
                    placeholder=""
                    value={formData.guardian_name}
                    onChange={handleChange}
                  />
                  <label htmlFor="guardian_name">Enter Guardian Name</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="tel"
                    className="form-control"
                    id="guardian_relation"
                    name="guardian_relation"
                    placeholder=""
                    value={formData.guardian_relation}
                    onChange={handleChange}
                  />
                  <label htmlFor="guardian_relation">
                    Enter Guardian Relation
                  </label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="tel"
                    className="form-control"
                    id="guardian_email"
                    name="guardian_email"
                    placeholder=""
                    value={formData.guardian_email}
                    onChange={handleChange}
                  />
                  <label htmlFor="guardian_email">Enter Guardian Email</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <input
                    type="file"
                    className="form-control"
                    id="guardian_pic"
                    name="guardian_pic"
                    placeholder=""
                    onChange={handleChange}
                  />
                  <label htmlFor="guardian_pic">Guardian Photo</label>
                </div>
              </div>
              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "25%",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="guardian_phone"
                    name="guardian_phone"
                    placeholder=""
                    value={formData.guardian_phone}
                    onChange={handleChange}
                  />
                  <label htmlFor="guardian_phone">Enter Guardian Phone</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "25%",
                  }}
                >
                  <input
                    type="tel"
                    className="form-control"
                    id="guardian_occupation"
                    name="guardian_occupation"
                    placeholder=""
                    value={formData.guardian_occupation}
                    onChange={handleChange}
                  />
                  <label htmlFor="guardian_occupation">
                    Enter Guardian Occupation
                  </label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "25%",
                  }}
                >
                  <input
                    type="tel"
                    className="form-control"
                    id="guardian_address"
                    name="guardian_address"
                    placeholder=""
                    value={formData.guardian_address}
                    onChange={handleChange}
                  />
                  <label htmlFor="guardian_address">
                    Enter Guardian Address
                  </label>
                </div>
              </div>

              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Add More Details
              </h1>

              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Student Address Details
              </span>

              <div
                className="fv-row mb-10 mt-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-check"
                  style={{
                    width: "50%",
                  }}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label text-black"
                    htmlFor="flexCheckDefault"
                  >
                    If Guardian Address is Current Address
                  </label>
                </div>
                <div
                  className="form-check"
                  style={{
                    width: "50%",
                  }}
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label text-black"
                    htmlFor="flexCheckDefault"
                  >
                    If Permanent Address is Current Address
                  </label>
                </div>
              </div>
              <div
                className="fv-row mb-10"
                style={{ display: "flex", gap: "10px", height: "120px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                    height: "120px",
                  }}
                >
                  <textarea
                    className="form-control fixed-textarea"
                    id="current_address"
                    name="current_address"
                    placeholder=""
                    value={formData.current_address}
                    onChange={handleChange}
                    rows={3}
                    style={{ resize: "none", height: "120px" }}
                  />

                  <label htmlFor="current_address">Enter Current Address</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                    height: "120px",
                  }}
                >
                  <textarea
                    className="form-control fixed-textarea"
                    id="permanent_address"
                    name="permanent_address"
                    placeholder=""
                    value={formData.permanent_address}
                    onChange={handleChange}
                    rows={3}
                    style={{ resize: "none", height: "120px" }}
                  />
                  <label htmlFor="permanent_address">
                    Enter Permanent Address
                  </label>
                </div>
              </div>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Transport Details
              </span>
              <div
                className="fv-row mt-10 mb-5"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                  }}
                >
                  <select
                    className="form-select"
                    id="route_id"
                    aria-label="Default select example"
                    name="route_id"
                    value={formData.route_id}
                    onChange={handleChange}
                  >
                    <option value="" selected>
                      Choose Route List
                    </option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.route_title}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="route_id">Route List</label>
                </div>
              </div>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Hostel Details
              </span>
              <div
                className="fv-row mb-10 mt-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                  }}
                >
                  <select
                    className="form-select"
                    id="hostel_room_id"
                    aria-label="Default select example"
                    name="bloddGroup"
                    value={formData.blood_group}
                    onChange={handleChange}
                  >
                    <option value="" selected>
                      Choose Hostel
                    </option>
                    <option value="1">Hinjawadi</option>
                    <option value="2">Kathraj</option>
                  </select>
                  <label htmlFor="bloddGroup">Hostel</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                  }}
                >
                  <select
                    className="form-select"
                    id="hostel_room_id"
                    aria-label="Default select example"
                    name="hostel_room_id"
                    value={formData.hostel}
                    onChange={handleChange}
                  >
                    <option value="" selected>
                      Choose Room Number
                    </option>
                    <option value="1">Hinjawadi</option>
                    <option value="2">Kathraj</option>
                  </select>
                  <label htmlFor="hostel_room_id">Room Number</label>
                </div>
              </div>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Manrope",
                }}
              >
                Miscellaneous Details
              </span>
              <div
                className="fv-row mb-10 mt-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "33%",
                  }}
                >
                  <input
                    type="number"
                    className="form-control"
                    id="bank_account_no"
                    name="bank_account_no"
                    placeholder=""
                    value={formData.bank_account_no}
                    onChange={handleChange}
                  />
                  <label htmlFor="bank_account_no">Bank Account Number</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "33%",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="bank_name"
                    name="bank_name"
                    placeholder=""
                    value={formData.bank_name}
                    onChange={handleChange}
                  />
                  <label htmlFor="bank_name">Bank Name</label>
                </div>
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "33%",
                  }}
                >
                  <input
                    type="number"
                    className="form-control"
                    id="ifsc_code"
                    name="ifsc_code"
                    placeholder=""
                    value={formData.ifsc_code}
                    onChange={handleChange}
                  />
                  <label htmlFor="ifsc_code">IFSC Code</label>
                </div>
              </div>
              <div
                className="fv-row mb-10 mt-10"
                style={{ display: "flex", gap: "10px" }}
              >
                <div
                  className="form-floating mb-3"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    id="previous_school"
                    name="previous_school"
                    placeholder=""
                    value={formData.previous_school}
                    onChange={handleChange}
                  />
                  <label htmlFor="previous_school">
                    Previous School Details
                  </label>
                </div>
                <div
                  className="fv-row mb-10"
                  style={{ display: "flex", gap: "10px" }}
                >
                  <span>RTE : </span>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rte"
                      id="rte"
                      value="Yes"
                      checked={formData.rte === "Yes"}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label text-black"
                      htmlFor="rte"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rte"
                      id="rte"
                      value="Yes"
                      checked={formData.rte === "Yes"}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label text-black"
                      htmlFor="rte"
                    >
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "end" }}>
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateStudent };
