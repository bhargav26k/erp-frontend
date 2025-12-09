import React, { useState, useEffect } from "react";
import { useAuth } from "../../../modules/auth";
import { useLocation } from "react-router-dom";
import { DOMAIN } from "../../../routing/ApiEndpoints";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
// import { CreateStudentTransection } from "../../../../_metronic/partials/modals/create-app-stepper/CreateStudentTransection";
// import { CreateEditStudent } from "../../../../_metronic/partials/modals/create-app-stepper/CreateEditStudent";
// import { CreateEditStudentUpload } from "../../../../_metronic/partials/modals/create-app-stepper/CreateEditStudentUpload";

const UserSupport: React.FC = () => {
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

  const supportTeam = [
    {
      name: "Anju Gupta",
      role: "Technical Lead",
      email: "john.doe@example.com",
      phone: "+1 234 567 890",
    },
    {
      name: "Vineet Mishra",
      role: "Senior Developer",
      email: "jane.smith@example.com",
      phone: "+1 234 567 891",
    },
    {
      name: "Akshat Joshi",
      role: "Developer",
      email: "mike.johnson@example.com",
      phone: "+1 234 567 892",
    },
  ];

  return (
    <>
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            fontFamily: "Manrope, sans-serif",
            color:'#1F4061',
          }}
        >
          <Container className="py-5">
            <div className="text-center mb-5">
              <h1 className="fw-bold" style={{color:'#1F4061', fontSize:'3rem',}}>Support</h1>
              <p className="text-muted" style={{ fontSize:'1.3rem',}}>
                We are here to help you with any technical or support-related
                issues.
              </p>
            </div>

            {/* <Row className="g-4">
              {supportTeam.map((member, index) => (
                <Col key={index} md={4}>
                  <Card className="shadow-sm border-0">
                    <Card.Body className="text-center">
                      <h5 className="fw-bold">{member.name}</h5>
                      <p className="text-muted mb-2">{member.role}</p>
                      <p>
                        <i className="fas fa-envelope me-2"></i>
                        {member.email}
                      </p>
                      <p>
                        <i className="fas fa-phone me-2"></i>
                        {member.phone}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row> */}

            <div className="mt-5 text-center">
              <h4 className="fw-bold" style={{ fontSize:'1.6rem',}}>General Contact Information</h4>
              <p className="text-muted mb-3">
                If you have a general inquiry, feel free to reach us through the
                following details:
              </p>
              <p>
                <i className="fas fa-envelope me-2" style={{ fontSize:'1.2rem',}}></i>
                <strong>Email:</strong>  support@dexpertsystems.com,
              </p>
              <p>
                <i className="fas fa-envelope me-2" style={{ fontSize:'1.2rem',}}></i>
                <strong>Address:</strong>  Gera Imperium Rise, Wipro Circle, 1118, Hinjawadi Phase 2 Rd, Hinjawadi Phase II, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Pimpri-Chinchwad, Maharashtra 411057
              </p>
              <p>
                <i className="fas fa-phone me-2" style={{ fontSize:'1.2rem',}}></i>
                <strong>Hotline:</strong> 020 6712 8236
              </p>
              <Button variant="button" className="mt-3" style={{color:'#fff', fontSize:'1.3rem',backgroundColor:'#1F4061'}}>
                Contact Us
              </Button>
            </div>

            <div className="mt-5 text-center text-muted">
              <p style={{ fontSize:'1.2rem',}}>&copy; 2025 Support Team. All rights reserved.</p>
            </div>
          </Container>
        </div>
    </>
  );
};

export default UserSupport;
