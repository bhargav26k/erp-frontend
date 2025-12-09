import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DOMAIN } from "../../../../app/routing/ApiEndpoints";
import { Col, Form, Modal, Row } from "react-bootstrap";

type Props = {
  show: boolean;
  handleClose: () => void;
  setRefresh: (refresh: boolean) => void;
  schoolId: string | undefined;
};

const AddPaymentGateWay: React.FC<Props> = ({
  show,
  handleClose,
  setRefresh,
  schoolId,
}) => {
  const [mode, setMode] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [formData, setFormData] = useState({
    frontDomain: "",
    routerDomain: "",
    username: "",
    password: "",
    merchantCode: "",
    privateKey: "",
    privateValue: "",
    urlSuccess: "",
    urlFail: "",
  });

  useEffect(() => {
    const fetchPaymentGatewayDetails = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/api/school/check-paymentgateway/${schoolId}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
          );
        }

        const result = await response.json();
        setSelectedMode(result.mode === 'test' ? 'live' : 'test');
        setMode(result.mode);
        setSelectedStatus(result.status === 'active' ? 'in_active' : 'active');
        setStatus(result.status);
      } catch (error) {
        console.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    };

    if (show) {
      fetchPaymentGatewayDetails();
    }
  }, [schoolId, show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${DOMAIN}/api/school/add-paymentgateway/${schoolId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            selectedMode,
            selectedStatus: formData.selectedStatus === "active" ? 1 : 0,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
        );
      }

      toast.success("Payment Gateway added successfully");
      setRefresh(true);
      handleClose();
      setSelectedMode("");
      setSelectedStatus("");
      setMode("");
      setStatus("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to add Payment Gateway: ${error.message}`
          : "An unexpected error occurred"
      );
    }
  };

  return (
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
        className="card-header"
        style={{
          backgroundColor: "rgb(242, 246, 255)",
          padding: "16px 20px",
          borderBottom: "1px solid #E0E4F0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1C335C",
            fontFamily: "Manrope",
          }}
        >
          Add Payment Gateway
        </span>
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div className="modal-body" style={{ backgroundColor: "#F2F6FF" }}>
        <Form onSubmit={handleSubmit}>
          {/* Define the fields array */}
          {[
            { label: "Router Domain", name: "routerDomain" },
            { label: "Front Domain", name: "frontDomain" },
            { label: "Username", name: "username" },
            { label: "Password", name: "password" },
            { label: "Merchant Code", name: "merchantCode" },
            { label: "Private Key", name: "privateKey" },
            { label: "Private Value", name: "privateValue" },
            { label: "URL Success", name: "urlSuccess" },
            { label: "URL Fail", name: "urlFail" },
          ]
            .reduce((rows, field, index) => {
              if (index % 2 === 0) rows.push([]);
              rows[rows.length - 1].push(field);
              return rows;
            }, [] as Array<Array<{ label: string; name: string }>>)
            .map((row, rowIndex) => (
              <Row className="mb-3" key={`row-${rowIndex}`}>
                {row.map(({ label, name }) => (
                  <Col md={6} key={name}>
                    <Form.Group controlId={name}>
                      <Form.Label>{label}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={`Enter ${label}`}
                        name={name}
                        value={(formData as any)[name]}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            ))}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formSelectMode" className="mt-3">
                <Form.Label>Select Mode</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  disabled={mode === 'test' || mode === 'live'}
                >
                  {mode === "test" ? (
                    <option value="live">Live</option>
                  ) : mode === "live" ? (
                    <option value="test">Test</option>
                  ) : (
                    <>
                      <option value="test">Test</option>
                      <option value="live">Live</option>
                    </>
                  )}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formSelectStatus" className="mt-3">
                <Form.Label>Select Status</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={status === 'active'}
                >
                  {status === "active" ? (
                    <option value="in_active">In Active</option>
                  ) : status === "in_active" ? (
                    <>
                      <option value="active">Active</option>
                      <option value="in_active">In Active</option>
                    </>
                  ) : (
                    <>
                      <option value="in_active">In Active</option>
                      <option value="active">Active</option>
                    </>
                  )}
                </Form.Control>
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
    </Modal>
  );
};

export { AddPaymentGateWay };
