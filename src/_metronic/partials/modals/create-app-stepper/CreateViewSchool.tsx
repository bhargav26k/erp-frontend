import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  DOMAIN,
  get_subscriptions,
  UpdateSubscriptionForSchool,
} from "../../../../app/routing/ApiEndpoints";

interface Subscription {
  id: number;
  name: string;
}

interface AssignFeesMasterProps {
  show: boolean;
  handleClose: () => void;
  school_id: number | undefined;
  setRefresh: (refresh: boolean) => void;
  previousSubscription: string | undefined; // New prop for previous subscription name
  previousSubscriptionId: number | undefined; // New prop for previous subscription ID
}

const CreateViewSchool: React.FC<AssignFeesMasterProps> = ({
  show,
  handleClose,
  school_id,
  setRefresh,
  previousSubscription,
  previousSubscriptionId,
}) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<
    number | undefined
  >(previousSubscriptionId);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // For confirmation modal

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    // Set the selected subscription to the previous one when the modal opens
    if (previousSubscriptionId !== undefined) {
      setSelectedSubscription(previousSubscriptionId);
    }
  }, [previousSubscriptionId]);

  const fetchSubscriptions = async () => {
    try {
      // Fetch all available subscriptions
      const response = await fetch(`${DOMAIN}/${get_subscriptions}`);
      if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(
          `Error ${errorData.status}: ${errorData.error || "Unknown error"}`
        );
      }
      const responseData = await response.json();
      setSubscriptions(responseData.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching Subscriptions:", error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  const handleSave = () => {
    // Open confirmation modal before saving
    setShowConfirmationModal(true);
  };

  const confirmSave = async () => {
    try {
      const response = await fetch(`${DOMAIN}/${UpdateSubscriptionForSchool}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          school_id: school_id,
          subscription_id: selectedSubscription,
        }),
      });

      if (!response.ok) {
        // Extract the status and error message from the response
        const errorData = await response.json();
        throw new Error(
          `Error Updating Assigned Subscription: ${errorData.status}: ${
            errorData.error || "Unknown error"
          }`
        );
      }
      handleClose();
      setRefresh(true);
      setShowConfirmationModal(false); // Close confirmation modal
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error Updating Subscriptions:", error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <Modal centered show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Manage Subscriptions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCurrentSubscription">
              <Form.Label>Current Subscription</Form.Label>
              <Form.Control
                type="text"
                readOnly
                disabled
                value={previousSubscription || "No Subscription"}
              />
            </Form.Group>
            <Form.Group controlId="formSelectSubscription" className="mt-3">
              <Form.Label>Select New Subscription</Form.Label>
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                <Form.Control
                  as="select"
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    width: "100%",
                    paddingRight: "2rem", // Space for the arrow
                  }}
                  value={selectedSubscription}
                  onChange={(e) =>
                    setSelectedSubscription(Number(e.target.value))
                  }
                >
                  {subscriptions.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </Form.Control>
                <span
                  style={{
                    content: '""',
                    position: "absolute",
                    top: "50%",
                    right: "1rem",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid #5d5d5d", 
                  }}
                ></span>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={selectedSubscription === previousSubscriptionId} // Disable save if no change
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        centered
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the subscription to{" "}
          {subscriptions.find((sub) => sub.id === selectedSubscription)?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmationModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmSave}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { CreateViewSchool };
