import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure icons load
import { Container, Card, Row, Col } from 'react-bootstrap';

const PRIMARY_COLOR = '#1C335C';
const WHITE = '#FFFFFF';

const PrivacyPolicy: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-5 w-full">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="border-0 shadow-lg rounded-3 overflow-hidden">
            {/* Header with primary color */}
            <Card.Header style={{ backgroundColor: PRIMARY_COLOR, color: WHITE }} className="py-4">
              <div className="d-flex align-items-center gap-3">
                <i className="fas fa-shield-alt" style={{fontSize:'40px'}}></i>
                <div>
                  <h1 className="h2 mb-0" style={{color:'#fff'}}>Privacy Policy</h1>
                  <p className="mb-0" style={{ opacity: 0.8 }}>
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card.Header>

            {/* Body on white background */}
            <Card.Body style={{ backgroundColor: WHITE, color: PRIMARY_COLOR }} className="p-4 p-md-5">
              <p className="lead" style={{ color: PRIMARY_COLOR, opacity: 0.9 }}>
                Welcome to <strong>One Pitara School ERP</strong>. We respect your privacy and are committed to protecting your personal information.
              </p>

              {/* Quick Navigation on white */}
              <div className="mb-5 p-4 rounded-3" style={{ backgroundColor: WHITE, border: `1px solid ${PRIMARY_COLOR}` }}>
                <h5 className="mb-3" style={{ color: PRIMARY_COLOR }}>
                  <i className="fas fa-list-ol me-2"></i>Quick Navigation
                </h5>
                <Row>
                  {[
                    '1. Information We Collect',
                    '2. How We Use Information',
                    '3. Information Sharing',
                    '4. Data Security',
                    '5. Cookies & Tracking',
                    "6. Children's Privacy",
                    '7. Your Rights',
                    '8. Policy Changes',
                    '9. Contact Us'
                  ].map((item, i) => (
                    <Col sm={6} md={4} key={i} className="mb-2">
                      <a href={`#section-${i+1}`} style={{ color: PRIMARY_COLOR, textDecoration: 'none' }}>
                        {item}
                      </a>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Sections */}
              <Section
                id={1}
                title="Information We Collect"
                icon="fa-database"
                content={[
                  'Personal Information: Names, email addresses, phone numbers, user profiles (students, parents, teachers, staff).',
                  'Academic Records: Attendance, grades, assignments, feedback, discipline records.',
                  'Financial Information: Fee payments, invoices, transaction IDs, payment confirmations.',
                  'Technical Data: IP addresses, browser type, device info, logs, usage patterns.'
                ]}
              />

              <Section
                id={2}
                title="How We Use Information"
                icon="fa-chart-line"
                content={[
                  'To provide and maintain ERP services.',
                  'To manage admissions, attendance, grading, and communications.',
                  'To process fee transactions and generate invoices.',
                  'To send notifications, alerts, and updates.',
                  'To analyze usage trends and improve functionality.'
                ]}
              />

              <Section
                id={3}
                title="Information Sharing"
                icon="fa-users"
                content={[
                  'Authorized School Personnel: Admins, teachers, staff.',
                  'Service Providers: Payment gateways, email services, cloud hosts under confidentiality.',
                  'Legal Obligations: When required by law or to protect rights.'
                ]}
              />

              <Section
                id={4}
                title="Data Security"
                icon="fa-lock"
                content={[
                  'We implement encryption in transit and at rest, access controls, and regular security audits to protect your data.'
                ]}
              />

              <Section
                id={5}
                title="Cookies & Tracking"
                icon="fa-cookie-bite"
                content={[
                  'We use cookies and similar technologies to enhance experience, analyze usage, and personalize content.',
                  'You can disable cookies in your browser, but some features may not function fully.'
                ]}
              />

              <Section
                id={6}
                title="Children's Privacy"
                icon="fa-child"
                content={[
                  'Our ERP is designed for educational use. We comply with applicable laws and obtain parental consent for processing minors’ data when required.'
                ]}
              />

              <Section
                id={7}
                title="Your Rights"
                icon="fa-balance-scale"
                content={[
                  'Access and correct your personal data.',
                  'Request deletion or processing restriction.',
                  'Data portability requests.',
                  'Withdraw consent at any time.'
                ]}
              />

              <Section
                id={8}
                title="Policy Changes"
                icon="fa-sync-alt"
                content={[
                  'We may update this policy periodically. Significant changes will be communicated via email or within the app.',
                  'The date at the top indicates the last revision.'
                ]}
              />

              <Section
                id={9}
                title="Contact Us"
                icon="fa-envelope"
                content={[
                  'Email: support@dexpertsystems.com',
                  'Address: Gera Imperium Rise, Wipro Circle, 1118, Hinjawadi Phase 2 Rd, Hinjawadi Phase II, Hinjawadi Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Pimpri-Chinchwad, Maharashtra 411057'
                ]}
              />
            </Card.Body>

            {/* Footer with primary color text on white */}
            <Card.Footer style={{ backgroundColor: WHITE }} className="py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div style={{ color: PRIMARY_COLOR, fontSize: '0.9rem' }}>
                  © {new Date().getFullYear()} One Pitara School ERP. All rights reserved.
                </div>
                <button onClick={scrollToTop} style={{ color: PRIMARY_COLOR, textDecoration: 'none', background: 'none', border: 'none' }}>
                  <i className="fas fa-arrow-up me-1"></i>Back to top
                </button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

interface SectionProps {
  id: number;
  title: string;
  icon: string;
  content: string[];
}

const Section: React.FC<SectionProps> = ({ id, title, icon, content }) => (
  <section id={`section-${id}`} className="mb-5">
    <div className="d-flex gap-3 mb-4 align-items-center">
      <div style={{ backgroundColor: PRIMARY_COLOR, color: WHITE }} className="rounded-circle p-3">
        <i className={`fas ${icon} fa-lg`}></i>
      </div>
      <h3 style={{ color: PRIMARY_COLOR }} className="h4 mb-0">{id}. {title}</h3>
    </div>
    <div style={{ borderLeft: `3px solid ${PRIMARY_COLOR}` }} className="ps-4">
      {content.map((line, idx) => (
        <p key={idx} style={{ color: PRIMARY_COLOR, marginBottom: '0.5rem' }}>{line}</p>
      ))}
    </div>
  </section>
);

export default PrivacyPolicy;
