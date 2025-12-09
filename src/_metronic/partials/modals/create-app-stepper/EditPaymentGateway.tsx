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
  selectedPaymentGateway: any; // Assuming the data structure of selectedPaymentGateway
};

const EditPaymentGateway: React.FC<Props> = ({
  show,
  handleClose,
  setRefresh,
  schoolId,
  selectedPaymentGateway,
}) => {
  const [formData, setFormData] = useState({
    routerDomain: "",
    username: "",
    password: "",
    merchantCode: "",
    privateKey: "",
    privateValue: "",
    urlSuccess: "",
    urlFail: "",
  });

  const [mode, setMode] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [paymentGatewayId, setPaymentGatewayId] = useState("");

  useEffect(() => {
    if (selectedPaymentGateway) {
      setFormData({
        routerDomain: selectedPaymentGateway.router_domain || "",
        username: selectedPaymentGateway.username || "",
        password: selectedPaymentGateway.password || "",
        merchantCode: selectedPaymentGateway.merchant_code || "",
        privateKey: selectedPaymentGateway.private_key || "",
        privateValue: selectedPaymentGateway.private_value || "",
        urlSuccess: selectedPaymentGateway.url_success || "",
        urlFail: selectedPaymentGateway.url_fail || "",
      });
      setPaymentGatewayId(selectedPaymentGateway.id)
      setSelectedMode(selectedPaymentGateway.mode);
      setMode(selectedPaymentGateway.mode);
      setSelectedStatus(selectedPaymentGateway.status);
      setStatus(selectedPaymentGateway.status);
    }
  }, [selectedPaymentGateway, show]);

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
        `${DOMAIN}/api/school/edit-paymentgateway/${schoolId}/${paymentGatewayId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            selectedMode,
            selectedStatus,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
        );
      }

      toast.success("Payment Gateway updated successfully");
      setRefresh(true);
      handleClose();
      // setSelectedMode("");
      // setSelectedStatus("");
      // setMode("");
      // setStatus("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to update Payment Gateway: ${error.message}`
          : "An unexpected error occurred"
      );
    }
  };

  return (
    <Modal
      id="kt_modal_edit_payment_gateway"
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
          Edit Payment Gateway
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
                        value={formData[name]}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            ))}

          {/* Mode field */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formSelectMode" className="mt-3">
                <Form.Label>Select Mode</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedMode}
                  disabled
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

            {/* Status field */}
            <Col md={6}>
              <Form.Group controlId="formSelectStatus" className="mt-3">
                <Form.Label>Select Status</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedStatus}
                  name="status"
                  onChange={()=> handleChange}
                  // disabled
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

export { EditPaymentGateway };
