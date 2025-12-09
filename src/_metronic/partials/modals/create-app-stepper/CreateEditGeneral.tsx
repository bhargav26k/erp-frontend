import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useAuth } from "../../../../app/modules/auth/core/Auth";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  show: boolean;
  handleClose: () => void;
  enqId: string | undefined;
  setRefresh: (refresh: boolean) => void;
};

type Reference = {
  id: string;
  reference: string;
};
const modalsRoot = document.getElementById("root-modals") || document.body;

interface Source {
  id: string;
  source: string;
}

interface FormData {
  full_name: string;
  contact_number: string;
  email: string;
  address: string;
  reference_id: number;
  reference: string;
  description: string;
  follow_up_date: Date;
  note: string;
  source_id: number;
  source: string;
  x;
}

const CreateEditGeneral = ({ show, handleClose, enqId, setRefresh }: Props) => {
  const { currentUser } = useAuth();
  const schoolId = currentUser?.school_id;

  const [source, setSource] = useState<Source[]>([]);
  const [reference, setReference] = useState<Reference[]>([]);
  const [changedFields, setChangedFields] = useState({});
  const initialFormData: FormData = {
    full_name: "",
    contact_number: "",
    email: "",
    address: "",
    reference_id: 0,
    reference: "",
    description: "",
    follow_up_date: new Date(),
    note: "",
    source_id: 0,
    source: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    const fetchSource = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-source?schoolId=${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`Error in Fetching source ${response.status}`);
        }
        const data = await response.json();
        setSource(data);
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };
    fetchSource();

    const fetchReference = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/get-reference?schoolId=${schoolId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReference(data);
      } catch (error) {
        console.error("Error fetching references:", error);
      }
    };

    fetchReference();
  }, [schoolId, enqId]);

  const formatDateToYYYYMMDD = (dateString: string | number | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchById = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/getGeneralEnquiryById/${schoolId}/${enqId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Data not received ${response.status}`);
        }

        const data = await response.json();

        const followUpDate = data?.[0]?.follow_up_date
          ? formatDateToYYYYMMDD(data[0].follow_up_date)
          : "";

        setFormData({
          full_name: data[0]?.full_name || "",
          contact_number: data[0]?.contact_number || "",
          email: data[0]?.email || "",
          address: data[0]?.address || "",
          description: data[0]?.description || "",
          note: data[0]?.note || "",
          reference_id: data[0]?.reference_id || 0,
          source_id: data[0]?.source_id || 0,
          reference: data[0]?.reference || "",
          source: data[0]?.source || "",
          follow_up_date: followUpDate,
        });
      } catch (error) {
        console.error("Error fetching enquiry details:", error);
      }
    };

    fetchById();
  }, [schoolId, enqId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setChangedFields((prevChangedFields) => ({
      ...prevChangedFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enquiry_id = enqId;

    try {
      const response = await fetch(
        `${DOMAIN}/api/school/updateEnquiryById/${schoolId}/${enquiry_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changedFields),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit info");
      }

      const data = await response.json();
      toast.success("Enquiry updated successfully!");
      setRefresh(true);
      handleClose();
    } catch (error) {
      console.error("Error editing info:", error);
      toast.error("Error editing Enquiry. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setSource([]);
    setReference([]);
    setFormData(initialFormData);
    setChangedFields({});
    handleClose();
  };

  return createPortal(
    <Modal
      id="kt_modal_create_app"
      tabIndex={-1}
      size="lg"
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1000px"
      show={show}
      onHide={handleCloseModal}
      backdrop="static"
      keyboard={false}
    >
      <div
        className="modal-header"
        style={{
          backgroundColor: "#F2F6FF",
          borderBottom: "1px solid lightgray",
        }}
      >
        <h2
          style={{ fontFamily: "Manrope", fontSize: "18px", fontWeight: "600" }}
        >
          Edit General Enquiry
        </h2>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleCloseModal}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div
        className="modal-body py-lg-10 px-lg-10"
        style={{ backgroundColor: "#F2F6FF" }}
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="full_name">
                <Form.Label>Full Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="contact_number">
                <Form.Label>Contact Number</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-phone"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-map-marker-alt"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="reference">
                <Form.Label>Select Reference</Form.Label>
                <Form.Select
                  name="reference_id"
                  value={formData.reference_id}
                  onChange={handleChange}
                >
                  <option value="">Select Reference</option>
                  {reference.map((ref) => (
                    <option key={ref.id} value={ref.id}>
                      {ref.reference}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="source">
                <Form.Label>Select Source</Form.Label>
                <Form.Select
                  name="source_id"
                  value={formData.source_id}
                  onChange={handleChange}
                >
                  <option value="">Select Source</option>
                  {source.map((src) => (
                    <option key={src.id} value={src.id}>
                      {src.source}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-info-circle"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="note">
                <Form.Label>Note</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-sticky-note"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="follow_up_date">
                <Form.Label>Follow Up Date</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-calendar-alt"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    name="follow_up_date"
                    value={formData.follow_up_date}
                    onChange={handleChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </Modal>,
    modalsRoot
  );
};

export { CreateEditGeneral };
