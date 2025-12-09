import React, { FC, useEffect, useState } from "react";
import {
  DOMAIN,
  get_schoolbyid,
  upload_school_files,
  update_school,
} from "../../../../../app/routing/ApiEndpoints"; // Import the update endpoint if available
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CardsWidget5Props {
  schoolId: string | undefined;
}

interface SchoolDetail {
  id: string; // Replace with actual types as needed
  name: string;
  address: string;
  email: string;
  phone: string;
  state: string;
  country: string;
  bank_account_no: string;
  bank_name: string;
  tagline: string;
  type_of_school: string;
  website: string;
  year_founded: string;
  ifsc_code: string;
  school_logo: string;
  // Add other fields here as needed
}

const stateCityMap: { [key: string]: string[] } = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar"],
  Bihar: ["Patna", "Gaya", "Bhagalpur"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur"],
  Goa: ["Panaji", "Margao", "Vasco da Gama"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Haryana: ["Gurgaon", "Faridabad", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubli", "Mangalore"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Manipur: ["Imphal"],
  Meghalaya: ["Shillong"],
  Mizoram: ["Aizawl"],
  Nagaland: ["Kohima", "Dimapur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota"],
  Sikkim: ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirapalli"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
  Tripura: ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
  Uttarakhand: ["Dehradun", "Haridwar", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
  Delhi: ["New Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  Ladakh: ["Leh", "Kargil"],
  Lakshadweep: ["Kavaratti"],
  Puducherry: ["Pondicherry"],
};

// Sort the stateCityMap with states and cities in alphabetical order
const sortedStateCityMap: { [key: string]: string[] } = Object.keys(
  stateCityMap
)
  .sort() // Sort the states alphabetically
  .reduce((acc, state) => {
    acc[state] = stateCityMap[state].sort(); // Sort cities for each state alphabetically
    return acc;
  }, {} as { [key: string]: string[] });

// Now you can use `sortedStateCityMap` instead of `stateCityMap` in your useEffect or elsewhere in your code

const CardsWidget5: FC<CardsWidget5Props> = ({ schoolId }) => {
  const [schoolDetail, setSchoolDetails] = useState<SchoolDetail | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState<SchoolDetail[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${get_schoolbyid}/${schoolId}`);
        if (!response.ok) {
          // Extract the status and error message from the response
          const errorData = await response.json();
          throw new Error(
            `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
          );
        }
        const result = await response.json();
        setSchoolDetails(result.data[0]);
        setFormData(result.data[0]);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching Subscriptions:", error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    if (schoolId) {
      setRefresh(false);
      fetchData();
    }
  }, [schoolId, refresh]);

  useEffect(() => {
    if (schoolDetail) {
      let detectedState = "";
      let detectedCity = schoolDetail.city || "";

      // Find the correct state from the city
      Object.entries(sortedStateCityMap).forEach(([state, cities]) => {
        if (cities.includes(schoolDetail.state)) {
          detectedState = state; // The state where this city exists
          detectedCity = schoolDetail.state; // Treat the provided "state" as city
        }
      });

      // If no correct state is found, fallback to the original state value
      setSelectedState(detectedState || schoolDetail.state || "");
      setSelectedCity(detectedCity || "");
    }
  }, [schoolDetail]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      // Check for required fields (fields present in schoolDetail)
      const requiredFields = [
        "name",
        "address",
        "email",
        "phone",
        "state",
        "country",
        "bank_account_no",
        "bank_name",
        "tagline",
        "type_of_school",
        "website",
        "year_founded",
        "ifsc_code",
        "school_logo",
      ];

      // Validation for required fields
      for (const field of requiredFields) {
        if (formData[field] === undefined || formData[field] === "") {
          toast.error(`${field} is required.`);
          return; // Stop execution if any required field is missing
        }
      }

      // ✅ Email Validation
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      // ✅ Phone Number Validation (exactly 10 digits)
      if (!formData.phone || formData.phone.length !== 10) {
        toast.error("Phone number must be exactly 10 digits.");
        return;
      }

      // Compare formData with schoolDetail to only send the fields that have changed
      const updatedFormData = Object.keys(formData).reduce((acc, key) => {
        if (formData[key] !== schoolDetail[key]) {
          acc[key] = formData[key]; // Add only changed fields to the update object
        }
        return acc;
      }, {} as Partial<SchoolDetail>); // Make sure to type this properly

      console.log("Updated Form Data:", updatedFormData);

      // If no fields are changed, do nothing
      if (Object.keys(updatedFormData).length === 0 && !logoFile) {
        toast.info("No changes detected.", { autoClose: 3000 });
        return;
      }

      // If a logo file is provided, upload it first
      if (logoFile) {
        const logoResponse = await uploadFile(logoFile, schoolId);
        if (logoResponse && logoResponse.url) {
          updatedFormData.school_logo = logoResponse.url; // Update formData with logo URL
        } else {
          throw new Error("Logo upload failed");
        }
      }

      // Update school details after file uploads
      const response = await fetch(`${DOMAIN}/${update_school}/${schoolId}`, {
        method: "PUT", // Assuming you are using PUT method to update
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData), // Send only updated form data
      });

      if (!response.ok) {
        toast.error("An error occurred Fetching School Details!", {
          autoClose: 3000,
        });
        throw new Error("Failed to update school details");
      }

      const updatedData = await response.json();
      toast.success("Data sent successfully.", { autoClose: 3000 });
      setSchoolDetails(updatedData); // Update the state with the new data
      setIsModalVisible(false);
      setRefresh(true);

      // Close the modal
      handleCancel();
    } catch (error) {
      console.error("Error updating school details:", error);
      toast.error("Failed to communicate with server!", { autoClose: 3000 });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedCity(""); // Reset city when state changes
    setFormData((prev) => ({
      ...prev,
      state: newState,
      city: "", // Reset city in formData
    }));
  };

  // Handle City Selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    setFormData((prev) => ({
      ...prev,
      city: newCity,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLogoFile(file);
    }
  };

  const uploadFile = async (file: File, schoolId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("school_id", schoolId);
    try {
      const response = await fetch(`${DOMAIN}/${upload_school_files}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("File upload failed");
      }
      return await response.json(); // Return the file URL from the response
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const iconMap = {
    name: "fas fa-school",
    email: "fas fa-envelope",
    phone: "fas fa-phone",
    address: "fas fa-map-marker-alt",
    state: "fas fa-map",
    country: "fas fa-globe",
    bank_account_no: "fas fa-university",
    bank_name: "fas fa-university",
    ifsc_code: "fas fa-shield-havled",
    year_founded: "fas fa-calendar-alt",
    type_of_school: "fas fa-graduation-cap",
    website: "fas fa-globe",
    tagline: "fas fa-tag",
    timezone: "fas fa-clock",
    date_format: "fas fa-calendar",
    currency: "fas fa-money-bill-wave",
    currency_symbol: "fas fa-rupee-sign",
    educational_board: "fas fa-book",
    school_id: "fas fa-id-card",
    is_active: "fas fa-check",
    upload_documents: "fas fa-file-upload",
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: "#F2F6FF",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid lightgray",
          paddingBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1C335C",
              fontFamily: "Manrope",
            }}
          >
            School Details
          </span>
        </div>
        <div
          onClick={showModal}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            backgroundColor: "#1C335C",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#16294D")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#1C335C")
          }
        >
          <span
            style={{
              marginRight: "8px",
              color: "white",
              fontSize: "14px",
              fontWeight: "700",
              fontFamily: "Manrope",
            }}
          >
            Edit
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16px"
            height="16px"
            fill="#ffffff"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M3 17.25V21h3.75l11-11.03-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </div>
      </div>

      <div className="card-body" style={{ marginTop: "20px", width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", // 4 items per row
            gap: "20px",
          }}
        >
          {schoolDetail &&
            Object.entries(schoolDetail).map(([key, value]) => (
              <div
                key={key}
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <i
                  className={iconMap[key] || "fas fa-info-circle"}
                  style={{ fontSize: "20px", color: "#1C335C" }}
                ></i>
                <div>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#212121",
                      fontFamily: "Manrope",
                      textTransform: "capitalize",
                    }}
                  >
                    {key.replace(/_/g, " ")}:
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1C335C",
                      fontFamily: "Manrope",
                    }}
                  >
                    {/* Conditional display for the 'promote' key */}
                    {key === "promot_type"
                      ? value === 0 || value === "0"
                        ? "Pass Pay Promote"
                        : "Pass Promote Pay"
                      : value}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal for Editing School Details */}
      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
        show={isModalVisible}
        onHide={handleCancel}
        backdrop={true}
      >
        <div className="modal-header">
          <h2 style={{ fontFamily: "Manrope" }}>Edit School Details:</h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={handleCancel}
          >
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div className="modal-body py-lg-10 px-lg-10">
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formSchoolName"
                >
                  <Form.Label>School Name *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-school"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Update school name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formEmail">
                  <Form.Label>School Email *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-envelope"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="email"
                      placeholder="Upadte school email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formPhone">
                  <Form.Label>School Phone *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-phone"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Upadte school phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formAddress"
                >
                  <Form.Label>School Address *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-map-marker-alt"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Upadte school address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formState">
                  <Form.Label>School State *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-map"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="state"
                      value={selectedState}
                      onChange={handleStateChange}
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      <option value="">Select State</option>
                      {Object.keys(stateCityMap)
                        .sort() // 🔥 Sort the states alphabetically
                        .map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formCity">
                  <Form.Label>School City *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-city"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="city"
                      value={selectedCity}
                      onChange={handleCityChange}
                      disabled={!selectedState} // Disable if no state is selected
                      style={{
                        fontFamily: "Manrope",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      <option value="">Select City</option>
                      {selectedState &&
                        sortedStateCityMap[selectedState]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formCountry"
                >
                  <Form.Label>School Country *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-globe"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="country"
                      placeholder="Upadte school country"
                      value={formData.country || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formBankAccountNo"
                >
                  <Form.Label>Bank Account Number *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-university"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="bank_account_no"
                      placeholder="Upadte bank account number"
                      value={formData.bank_account_no || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formBankName"
                >
                  <Form.Label>Bank Name *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-university"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="bank_name"
                      placeholder="Upadte bank name"
                      value={formData.bank_name || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formIfscCode"
                >
                  <Form.Label>IFSC Code *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-shield-halved"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="ifsc_code"
                      placeholder="Upadte IFSC Code"
                      value={formData.ifsc_code || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formEmailUser"
                >
                  <Form.Label>Email User *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-at"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="email_user"
                      placeholder="Upadte Email User"
                      value={formData.email_user || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formEmailPassword"
                >
                  <Form.Label>Email Password *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-lock"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="email_pass"
                      placeholder="Upadte Email Pass"
                      value={formData.email_pass || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formVoucherType"
                >
                  <Form.Label>Voucher Type *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-receipt"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="voucher_type"
                      value={formData.voucher_type || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Voucher Type</option>
                      <option value="receipt">Receipt</option>
                      <option value="challan">Challan</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formPromotType"
                >
                  <Form.Label>Promote Type *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-receipt"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="promot_type"
                      value={formData.promot_type || ""}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Promote Type</option>
                      <option value="0">Pass Pay Promote</option>
                      <option value="1">Pass Promote Pay</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formYearFounded"
                >
                  <Form.Label>Year Founded *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-calendar-alt"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="year_founded"
                      placeholder="Upadte Year Founded"
                      value={formData.year_founded || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formTypeOfSchool"
                >
                  <Form.Label>Type Of School*</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-graduation-cap"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="type_of_school"
                      placeholder="Upadte Type Of School"
                      value={formData.type_of_school || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formWebsite"
                >
                  <Form.Label>Website *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-globe"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="website"
                      placeholder="Update Website"
                      value={formData.website || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formTagline"
                >
                  <Form.Label>Tagline *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-tag"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="tagline"
                      placeholder="Update Tagline"
                      value={formData.tagline || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formTtimezone"
                >
                  <Form.Label>Timezone *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-tag"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="timezone"
                      placeholder="Update Timezone"
                      value={formData.timezone || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formDateFormat"
                >
                  <Form.Label>DateFormat *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-calendar"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="dateformat"
                      placeholder="Update DateFormat"
                      value={formData.date_format || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formCurrency"
                >
                  <Form.Label>Currency *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-money-bill-wave"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="currency"
                      placeholder="Update Currency"
                      value={formData.currency || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formCurrencySymbol"
                >
                  <Form.Label>Currency Symbol *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-rupee-sign"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="currency_symbol"
                      placeholder="Update Currency Symbol"
                      value={formData.currency_symbol || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formEducationalBoard"
                >
                  <Form.Label>Educational Board *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-rupee-sign"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="educational_board"
                      placeholder="Update Educational Board"
                      value={formData.educational_board || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3 custom-input"
                  controlId="formIsActive"
                >
                  <Form.Label>Is Active *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-rupee-sign"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="is_active"
                      placeholder="Update Is Active"
                      value={formData.is_active || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3 custom-input" controlId="formLogo">
                  <Form.Label>Upload Logo</Form.Label>
                  <Form.Control
                    type="file"
                    name="logo"
                    onChange={(e) => handleFileChange(e)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="modal-footer border-0">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            style={{
              width: "118px",
              height: "36px",
              padding: "8px 10px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexShrink: "0",
              backgroundColor: "rgba(39, 59, 99, 0.76)",
            }}
            onClick={handleSave}
          >
            <span
              style={{
                color: "#FFF",
                fontFamily: "Manrope",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              Save
            </span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export { CardsWidget5 };
