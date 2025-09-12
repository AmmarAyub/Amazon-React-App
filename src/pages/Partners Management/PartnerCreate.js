import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, FloatingLabel, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import "./PartnerCreate.css";

const PartnerCreate = () => {
  const [formData, setFormData] = useState({
    Name: '',
    PartnerShipType: '',
    Email: '',
    Phone: '',
    Title: '',
    ContactCompanyID: '',
    Website: '',
    Address: '',
    Industry: '',
    Renewal: false,
    MinDealValue: '',
    RegistrationDate: '',
    City: '',
    State: '',
    PostalCode: '',
    Country: '',
    Notes: ''
  });
  
  const [contactCompanies, setContactCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch contact companies on component mount
  useEffect(() => {
    const fetchContactCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:7224/api/PartnerManagement/contact-companies');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the data for the dropdown
        const companies = data.map(company => ({
          value: company.contactCompanyID,
          label: company.companyName
        }));
        
        setContactCompanies(companies);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load contact companies: ${err.message}`);
        setLoading(false);
      }
    };

    fetchContactCompanies();
  }, []);

  const handleCancelPartner = () => {
    navigate('/partners');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Get current user info (you might need to get this from your auth context)
      const currentUser = "admin"; // Replace with actual user from your auth context
      const currentDate = new Date().toISOString();

      // Prepare the data for submission - match exactly with PartnerCreateDto
      const submissionData = {
        PartnerShipType: formData.PartnerShipType,
        Name: formData.Name,
        Email: formData.Email || null,
        Phone: formData.Phone || null,
        Title: formData.Title || null,
        Address: formData.Address || null,
        City: formData.City || null,
        State: formData.State || null,
        PostalCode: formData.PostalCode || null,
        Country: formData.Country || null,
        Website: formData.Website || null,
        Industry: formData.Industry || null,
        ContactCompanyID: formData.ContactCompanyID ? parseInt(formData.ContactCompanyID) : null,
        Renewal: formData.Renewal,
        MinDealValue: formData.MinDealValue ? parseFloat(formData.MinDealValue) : null,
        RegistrationDate: formData.RegistrationDate || new Date().toISOString(),
        Notes: formData.Notes || null,
        ChangedBy: currentUser, // Add required field
        ChangeDate: currentDate // Add required field
      };

      console.log('Submitting data:', submissionData);

      const response = await fetch('https://localhost:7224/api/PartnerManagement/CreatePartner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
debugger;
      if (!response.ok) {
        // Try to get detailed error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          
          // If there are model state errors, display them
          if (errorData.errors) {
            const modelErrors = Object.values(errorData.errors).flat().join(', ');
            errorMessage = modelErrors || errorMessage;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const successMessage = result.message || `Partner "${result.Name || formData.Name}" created successfully!`;
      
      setSuccess(successMessage);
      
      // Redirect to partners list after a short delay
      setTimeout(() => {
        navigate('/partners');
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to create partner. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-wrap">
      <Container className="d-flex align-items-center justify-content-center">
        <Card className="w-100" id="bb">
          <Card.Body>
            <h2 className="text-center"><b>CREATE NEW PARTNER</b></h2>
            <hr />
            
            {success && (
              <Alert variant="success" className="mb-3">
                {success}
              </Alert>
            )}
            
            {error && (
              <Alert variant="danger" className="mb-3">
                <strong>Error:</strong> {error}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <FloatingLabel controlId="Name" label="Partner Name" className="mb-3">
                    <Form.Control
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      placeholder="Enter the Name"
                      required
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel controlId="PartnerShipType" label="Partner Type" className="mb-3">
                    <Form.Select
                      name="PartnerShipType"
                      value={formData.PartnerShipType}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    >
                      <option value="">-- Select Type --</option>
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Others">Others</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel controlId="Email" label="Email" className="mb-3">
                    <Form.Control
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      placeholder="Enter the Email"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <FloatingLabel controlId="Phone" label="Phone" className="mb-3">
                    <Form.Control
                      type="tel"
                      name="Phone"
                      value={formData.Phone}
                      onChange={handleChange}
                      placeholder="Enter the Phone"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel controlId="Title" label="Title" className="mb-3">
                    <Form.Control
                      type="text"
                      name="Title"
                      value={formData.Title}
                      onChange={handleChange}
                      placeholder="Enter the Title of Partner"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel controlId="ContactCompanyID" label="Contact Company" className="mb-3">
                    {loading ? (
                      <div className="text-center">
                        <Spinner animation="border" size="sm" />
                        <span className="ms-2">Loading companies...</span>
                      </div>
                    ) : (
                      <Form.Select
                        name="ContactCompanyID"
                        value={formData.ContactCompanyID}
                        onChange={handleChange}
                        disabled={submitting}
                      >
                        <option value="">-- Select Company --</option>
                        {contactCompanies.map((company) => (
                          <option key={company.value} value={company.value}>
                            {company.label}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="Website" label="Website" className="mb-3">
                    <Form.Control
                      type="url"
                      name="Website"
                      value={formData.Website}
                      onChange={handleChange}
                      placeholder="Enter the Website Name or URL"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="Address" label="Address" className="mb-3">
                    <Form.Control
                      type="text"
                      name="Address"
                      value={formData.Address}
                      onChange={handleChange}
                      placeholder="Enter the Address"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <FloatingLabel controlId="Industry" label="Industry" className="mb-3">
                    <Form.Control
                      type="text"
                      name="Industry"
                      value={formData.Industry}
                      onChange={handleChange}
                      placeholder="Enter the Industry Name"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={3} className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    id="Renewal"
                    name="Renewal"
                    label="Renewal"
                    checked={formData.Renewal}
                    onChange={handleChange}
                    className="mt-4"
                    disabled={submitting}
                  />
                </Col>
                <Col md={3}>
                  <FloatingLabel controlId="MinDealValue" label="Min Deal Value" className="mb-3">
                    <Form.Control
                      type="number"
                      name="MinDealValue"
                      value={formData.MinDealValue}
                      onChange={handleChange}
                      placeholder="Enter the Price"
                      disabled={submitting}
                      step="0.01"
                      min="0"
                    />
                  </FloatingLabel>
                </Col>
                <Col md={3}>
                  <FloatingLabel controlId="RegistrationDate" label="Registration Date" className="mb-3">
                    <Form.Control
                      type="date"
                      name="RegistrationDate"
                      value={formData.RegistrationDate}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <FloatingLabel controlId="City" label="City" className="mb-3">
                    <Form.Control
                      type="text"
                      name="City"
                      value={formData.City}
                      onChange={handleChange}
                      placeholder="Enter the City"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={3}>
                  <FloatingLabel controlId="State" label="State" className="mb-3">
                    <Form.Control
                      type="text"
                      name="State"
                      value={formData.State}
                      onChange={handleChange}
                      placeholder="Enter the State"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={3}>
                  <FloatingLabel controlId="PostalCode" label="Postal Code" className="mb-3">
                    <Form.Control
                      type="text"
                      name="PostalCode"
                      value={formData.PostalCode}
                      onChange={handleChange}
                      placeholder="Enter the ZipCode"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
                <Col md={3}>
                  <FloatingLabel controlId="Country" label="Country" className="mb-3">
                    <Form.Control
                      type="text"
                      name="Country"
                      value={formData.Country}
                      onChange={handleChange}
                      placeholder="Enter the Country"
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <FloatingLabel controlId="Notes" label="Notes" className="mb-3">
                    <Form.Control
                      as="textarea"
                      name="Notes"
                      value={formData.Notes}
                      onChange={handleChange}
                      placeholder="Enter Comments"
                      style={{ height: '100px' }}
                      disabled={submitting}
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              <Row>
                <Col md={12} className="text-end">
                  <Button 
                    variant="success" 
                    type="submit" 
                    className="me-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={handleCancelPartner}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PartnerCreate;