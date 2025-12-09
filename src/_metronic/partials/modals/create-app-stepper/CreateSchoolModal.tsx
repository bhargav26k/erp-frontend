import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import {
  DOMAIN,
  get_subscriptions,
  get_acedamic_year,
  AddSchool,
} from "../../../../app/routing/ApiEndpoints";
import "./CreateSchoolModal.css";
import { useAuth } from "../../../../app/modules/auth";
import { toast } from "react-toastify";

type Props = {
  show: boolean;
  handleClose: () => void;
  refresh: any;
};

interface AcedamicYear {
  id: number;
  session: string;
}
interface Subscription {
  id: number;
  name: string;
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

const sortedStateCityMap: { [key: string]: string[] } = Object.fromEntries(
  Object.entries(stateCityMap)
    .sort(([stateA], [stateB]) => stateA.localeCompare(stateB)) // Sort states alphabetically
    .map(([state, cities]) => [state, [...cities].sort()]) // Sort cities alphabetically
);

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateSchoolModal = ({ show, handleClose, refresh }: Props) => {
  const { currentUser } = useAuth();
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [timeFormat, setTimeFormat] = useState("hh:mm");
  const [currency, setCurrency] = useState("Rs");
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [schoolMaster, setSchoolMaster] = useState("");
  const [academicType, setAcademicType] = useState("");
  const [academicYearError, setAcademicYearError] = useState<string | null>(
    null
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schoolMasterOptions, setSchoolMasterOptions] = useState([]);
  // const [schoolLogo, setSchoolLogo] = useState<File | null>(null);
  // const [schoolSmallLogo, setSchoolSmallLogo] = useState<File | null>(null);
  const [subscriptionOptions, setSubscriptionOptions] = useState<
    Subscription[]
  >([]);
  const [academicYear, setAcademicYear] = useState<AcedamicYear[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
      setAcademicType(value);
    }

  // Fetch subscription options from the backend
  useEffect(() => {
    const fetchSubscriptionOptions = async () => {
      try {
        const response = await fetch(`${DOMAIN}/${get_subscriptions}`);
        if (!response.ok) {
          // Extract the status and error message from the response
          const errorData = await response.json();
          throw new Error(
            `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
          );
        }
        const result = await response.json();

        setSubscriptionOptions(result.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching Subscriptions:", error.message);
        } else {
          console.error("An unexpected error occurred");
        }
      }
    };

    fetchSubscriptionOptions();
    // const fetchAcademicYear = async () => {
    //   try {
    //     const response = await fetch(
    //       `${DOMAIN}/api/superadmin/get_academicyear`
    //     );
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch subscription types");
    //     }
    //     const data = await response.json();

    //     setAcademicYear(data); // Assuming the response has this structure
    //   } catch (error) {
    //     console.error("Error fetching subscription types:", error);
    //   }
    // };

    // fetchAcademicYear();
    const fetchSchoolMaster = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/superadmin/get-all-schools-masters`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subscription types");
        }
        const data = await response.json();

        setSchoolMasterOptions(data); // Assuming the response has this structure
      } catch (error) {
        console.error("Error fetching subscription types:", error);
      }
    };

    fetchSchoolMaster();
  }, []);

  const validateSchoolForm = () => {
    let isValid = true;

    // ✅ Validate Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    } else {
      setEmailError(null);
    }

    // ✅ Validate Phone Number (10 digits required)
    if (!phone || phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      isValid = false;
    } else {
      setPhoneError(null);
    }

    return isValid;
  };

  const handleSubmit = async () => {
    // Validation: Ensure no fields are empty
    if (
      !schoolName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !state.trim() ||
      !city.trim() ||
      !country.trim() ||
      !dateFormat.trim() ||
      !timeFormat.trim() ||
      !currency.trim() ||
      !currencySymbol.trim() ||
      !academicType.trim() ||
      !subscriptionType.trim() ||
      !schoolMaster.trim() ||
      !startDate ||
      !endDate ||
      !currentUser?.id
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check if email contains capital letters
    if (/[A-Z]/.test(email)) {
      toast.error("Email should not contain capital letters.");
      return;
    }

    // Check if country contains only letters (no numbers or symbols)
    if (!/^[A-Za-z\s]+$/.test(country)) {
      toast.error("Country should contain only letters.");
      return;
    }

    // Check if phone number is exactly 10 digits
    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error("Phone number should be exactly 10 digits.");
      return;
    }

    // Convert email to lowercase
    const formattedEmail = email.trim().toLowerCase();

    setIsSubmitting(true);

    const formData = {
      name: schoolName.trim(),
      email: formattedEmail, // Email is now in lowercase
      phone: phone.trim(),
      address: address.trim(),
      state: state.trim(),
      city: city.trim(),
      country: country.trim(), // Country validated for text-only input
      date_format: dateFormat.trim(),
      time_format: timeFormat.trim(),
      currency: currency.trim(),
      currency_symbol: currencySymbol.trim(),
      academic_year: academicType.trim(),
      subscription_type: subscriptionType.trim(),
      school_master: schoolMaster.trim(),
      start_date: startDate,
      end_date: endDate,
      userId: currentUser?.id,
    };

    try {
      const response = await fetch(`${DOMAIN}/${AddSchool}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
        );
      }

      const result = await response.json();
      console.log("School created successfully:", result);
      refresh(true);
      handleClose();
    } catch (error) {
      console.error("Error creating school:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <Modal
      id="kt_modal_create_school"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleClose}
      backdrop={true}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
          fontFamily: "Manrope",
          color: "#",
        }}
      >
        <h2
          style={{ fontFamily: "Manrope", fontSize: "20px", fontWeight: "600" }}
        >
          Create School
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div
        className="modal-body py-lg-10 px-lg-10"
        style={{
          backgroundColor: "#F2F6FF",
        }}
      >
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formSchoolName"
              >
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  School Name *
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-school"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter school name"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            {/* <Col md={4}>
              <Form.Group className='mb-3 custom-input' controlId='formTagline'>
                <Form.Label>Tagline</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className='fas fa-pencil-alt'></i>
                  </InputGroup.Text>
                  <Form.Control
                    type='text'
                    placeholder='Enter school tagline'
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </InputGroup>
                <Form.Text className='text-muted'>This is an input helper text.</Form.Text>
              </Form.Group>
            </Col> */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formEmail">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  School Email *
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Enter school email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    isInvalid={!!emailError} // Highlight if invalid
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formPhone">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  School Phone *
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-phone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter school phone"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numeric input and restrict to 10 digits
                      if (/^\d{0,10}$/.test(value)) {
                        setPhone(value);
                      }
                    }}
                    required
                    isInvalid={!!phoneError} // Highlight if invalid
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {phoneError}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formAddress">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  School Address
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-map-marker-alt"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter school address"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formState">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  State
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-location-arrow"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={state}
                    required
                    onChange={(e) => setState(e.target.value)}
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
              <Form.Group className="mb-3 custom-input" controlId="formState">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  City
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-location-arrow"></i>
                  </InputGroup.Text>
                  <Form.Select
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    <option value="">Select City</option>
                    {state &&
                      sortedStateCityMap[state]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </Form.Select>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formCountry">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Country
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-globe"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter country"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            {/* <Col md={4}>
              <Form.Group className='mb-3 custom-input' controlId='formBoard'>
                <Form.Label>Educational Board</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className='fas fa-computer'></i>
                  </InputGroup.Text>
                  <Form.Control
                    type='text'
                    placeholder='Enter Education Board'
                    value={educationalBoard}
                    onChange={(e) => setEducationalBoard(e.target.value)}
                  />
                </InputGroup>
                <Form.Text className='text-muted'>This is an input helper text.</Form.Text>
              </Form.Group>
            </Col> */}
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formCountry">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Date Format
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-calendar"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter Date Formate"
                    value={dateFormat}
                    required
                    onChange={(e) => setDateFormat(e.target.value)}
                    disabled
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formState">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Time Format
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-clock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter Time Format"
                    value={timeFormat}
                    required
                    onChange={(e) => setTimeFormat(e.target.value)}
                    disabled
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formCountry">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Currency
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-money-bill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    type="text"
                    placeholder="Enter Curreny"
                    value={currency}
                    required
                    onChange={(e) => setCurrency(e.target.value)}
                    disabled
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formAcademicYear">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Academic Year *
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-calendar"></i>
                  </InputGroup.Text>
                  <Form.Control
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    type="text"
                    placeholder="Enter Academic Year"
                    value={academicType}
                    onChange={handleAcademicYearChange}
                    required
                  />
                </InputGroup> 
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group
                className="mb-3 custom-input"
                controlId="formStartDate"
              >
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Start Date *
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-date"></i>
                  </InputGroup.Text>
                  <Form.Control
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    type="date"
                    placeholder="Enter Start Date"
                    value={startDate}
                    required
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            {/* <Col md={4}>
              <Form.Group className='mb-3 custom-input' controlId='formCountry'>
              <Form.Label style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}>Bank Account</Form.Label>
              <InputGroup>
              <InputGroup.Text>
              <i className='fas fa-bank'></i>
              </InputGroup.Text>
              <Form.Control
              style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}
              type='text'
                    placeholder='Enter Bank Account'
                    value={bankAccountNo}
                    onChange={(e) => setBankAccountNo(e.target.value)}
                  />
                  </InputGroup>
                <Form.Text className='text-muted'>Enter the Short form of the currency.</Form.Text>
                </Form.Group>
                </Col> */}
            {/* <Col md={4}>
              <Form.Group className='mb-3 custom-input' controlId='formCountry'>
              <Form.Label style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}>Ifsc Code</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                  <i className='fas fa-key'></i>
                  </InputGroup.Text>
                  <Form.Control
                  style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}
                    type='text'
                    placeholder='Enter IFSC code'
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                  />
                </InputGroup>
                <Form.Text className='text-muted'>Enter the Short form of the currency.</Form.Text>
                </Form.Group>
                </Col> */}
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formEndDate">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  End Date *
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-date"></i>
                  </InputGroup.Text>
                  <Form.Control
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    type="date"
                    required
                    placeholder="Enter End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            {/* <Col md={4}>
              <Form.Group className='mb-3 custom-input' controlId='formCountry'>
                <Form.Label style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}>Bank Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className='fas fa-building'></i>
                  </InputGroup.Text>
                  <Form.Control
                  style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}
                    type='text'
                    placeholder='Enter Bank name'
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </InputGroup>
                <Form.Text className='text-muted'>Enter the Short form of the currency.</Form.Text>
              </Form.Group>
            </Col> */}
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formSubscriptionType">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Subscription Type *
                </Form.Label>
                <Form.Select
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                  required
                >
                  <option value="">Select Subscription Type</option>
                  {subscriptionOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formCompannyMaster">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Select Company *
                </Form.Label>
                <Form.Select
                  value={schoolMaster}
                  onChange={(e) => setSchoolMaster(e.target.value)}
                  required
                >
                  <option value="">Select Company</option>
                  {schoolMasterOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Choose the Company for the school.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3 custom-input" controlId="formCountry">
                <Form.Label
                  style={{
                    fontFamily: "Manrope",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Currency Symbol
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-indian-rupee"></i>
                  </InputGroup.Text>
                  <Form.Control
                    style={{
                      fontFamily: "Manrope",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    type="text"
                    placeholder="Enter Curreny Symbol"
                    value={currencySymbol}
                    required
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    disabled
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          {/* <Row>
            <Col md={6}>
              <Form.Group className='mb-3 custom-input' controlId='formSchoolSmallLogo'>
                <Form.Label style={{fontFamily:'Manrope', fontSize:'14px', fontWeight:'500'}}>School Small Logo *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className='fas fa-upload'></i>
                  </InputGroup.Text>
                  <Form.Control type='file' onChange={handleSmallLogoUpload} required />
                </InputGroup>
                {schoolSmallLogo && <p className='mt-2'>Selected file: {schoolSmallLogo.name}</p>}
              </Form.Group>
            </Col>
          </Row> */}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateSchoolModal };
