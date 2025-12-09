import React, { useState, useEffect } from "react";
import { useAuth } from "../../../modules/auth";
import { useLocation } from "react-router-dom";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Content } from "../../../../_metronic/layout/components/content";

const UserAccount: React.FC = () => {
  const { currentUser } = useAuth();
  const school_id = (currentUser as any)?.school_id;
  const currency = (currentUser as any)?.currency;
  const currency_symbol = (currentUser as any)?.currency_symbol;
  const date_format = (currentUser as any)?.date_format;
  const email = (currentUser as any)?.email;
  const multiple_schools = (currentUser as any)?.multiple_schools;
  const name = (currentUser as any)?.name;
  const school_name = (currentUser as any)?.school_name;
  const role_name = (currentUser as any)?.role_name;
  const session_name = (currentUser as any)?.session_name;
  const time_format = (currentUser as any)?.time_format;
  const timezone = (currentUser as any)?.timezone;

  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch subscription details for the school
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      const schoolId = school_id;
      try {
        const response = await fetch(
          `${DOMAIN}/api/superadmin/get-subscription-id/${schoolId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch subscription details");
        }
        const data = await response.json();
        setSubscriptionDetails(data.result[0]);
      } catch (error) {
        console.error("Error fetching subscription details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (school_id) {
      fetchSubscriptionDetails();
    }
  }, [school_id]);

  const handleUpgrade = () => {
    alert("Upgrade subscription feature coming soon!");
    // You can add functionality to redirect to a payment/upgrade page here
  };

  return (
    <>
      <div className="bg-white">
      <div>
        <Content>
      {role_name === "School Master" && (
        <Container
          fluid
          style={{
            padding: "20px",
            fontFamily: "Manrope, sans-serif",
            color: "#1F4061",
          }}
        >
          <h1 className="mb-4" style={{ fontSize: "2rem", fontWeight: "600" }}>
            Subscription & School Details
          </h1>

          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm" style={{ width: "100%" }}>
                <Card.Body>
                  <h5 className="text" style={{
                    color: "#336699",
                    fontSize:'1.7rem',
                  }}>School Details</h5>
                  <hr />
                  <p>
                    <strong>School Name:</strong> {school_name}
                  </p>
                  <p>
                    <strong>Admin Name:</strong> {name}
                  </p>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>Role:</strong> {role_name}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              {loading ? (
                <div className="text-center mt-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : subscriptionDetails ? (
                <Card className="shadow-sm" style={{ width: "100%" }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text" style={{
                    color: "#336699",
                    fontSize:'1.7rem',
                  }}>Subscription Details</h5>
                      <Button
                        variant="success"
                        onClick={handleUpgrade}
                        style={{ backgroundColor: "#1F4061" }}
                      >
                        Upgrade Subscription
                      </Button>
                    </div>
                    <hr />
                    <p>
                      <strong>Plan Name:</strong>{" "}
                      {subscriptionDetails.subscription_name}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {subscriptionDetails.status || "Active"}
                    </p>
                  </Card.Body>
                </Card>
              ) : (
                <p className="text-danger text-center">
                  Failed to load subscription details.
                </p>
              )}
            </Col>
          </Row>
        </Container>
      )}
        </Content>
        </div></div>
    </>
  );
};

export default UserAccount;
