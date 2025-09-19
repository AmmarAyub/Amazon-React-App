import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Nav,
  Modal,
  Button,
  Form,
  Table,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import { Book, Pencil } from 'react-bootstrap-icons';

const EditPartner = () => {
  const { partnerId } = useParams();
  const [partnerData, setPartnerData] = useState({
    contactCompany: {}
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('partner');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showEditPartnerModal, setShowEditPartnerModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // State for data arrays from API
  const [contacts, setContacts] = useState([
    { contactID: 1, contactName: "John Doe", contactRole: "Manager", email: "john@example.com" },
    { contactID: 2, contactName: "Jane Smith", contactRole: "Sales", email: "jane@example.com" }
  ]);
  
  const [trainings, setTrainings] = useState([
    { trainingID: 1, trainingName: "Security Training", trainingType: "Technical", completionDate: "2023-05-20" },
    { trainingID: 2, trainingName: "Sales Training", trainingType: "Business", completionDate: "2023-06-15" }
  ]);
  
  const [opportunities, setOpportunities] = useState([
    { opportunityID: 1, opportunityName: "Enterprise Deal", productName: "Firewall", opportunityType: "New Business" },
    { opportunityID: 2, opportunityName: "Upgrade Project", productName: "Switch", opportunityType: "Upgrade" }
  ]);
  
  const [logins, setLogins] = useState([
    { loginID: 1, username: "admin", password: "******", loginURL: "https://portal.example.com" },
    { loginID: 2, username: "user", password: "******", loginURL: "https://app.example.com" }
  ]);
  
  const [contactCompanies, setContactCompanies] = useState([]);
  // Form state for modals
  const [contactForm, setContactForm] = useState({});
  const [trainingForm, setTrainingForm] = useState({});
  const [partnerForm, setPartnerForm] = useState({});
  const [opportunityForm, setOpportunityForm] = useState({});
  const [loginForm, setLoginForm] = useState({});
  
  // Fetch contact companies
  useEffect(() => {
    const fetchContactCompanies = async () => {
      try {
        const response = await fetch('https://localhost:7224/api/PartnerManagement/contact-companies');
        if (response.ok) {
          const data = await response.json();
          setContactCompanies(data);
        }
      } catch (error) {
        console.error("Error fetching contact companies:", error);
      }
    };
    
    fetchContactCompanies();
  }, []);
  
  // Fetch partner data
  useEffect(() => {
    const fetchPartnerData = async () => {
      if (partnerId) {
        try {
          setLoading(true);
          
          // Make API call to fetch partner data
          const response = await fetch(`https://localhost:7224/api/PartnerManagement/GetPartnerEditData/${partnerId}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Check if data has the expected structure
          if (data.partner) {
            setPartnerData(data.partner);
          } else if (data) {
            setPartnerData(data);
          } else {
            throw new Error("Invalid data format from API");
          }
          
        } catch (error) {
          console.error("Error fetching partner data:", error);
          showNotification("Failed to load partner data", "danger");
          
          // Fallback to sample data if API fails
          const sampleData = {
            partnerID: parseInt(partnerId),
            name: "Partner Name",
            email: "partner@example.com",
            phone: "123-456-7890",
            contactCompanyID: 1,
            contactCompany: {
              companyName: "Contact Company",
              photoPath: "dummy.png"
            },
            partnerShipType: "Manufacturer",
            title: "Partner Title",
            address: "123 Main St",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "USA",
            website: "https://example.com",
            industry: "Technology",
            renewal: true,
            minDealValue: 10000,
            registrationDate: "2023-01-15",
            notes: "Sample partner notes"
          };
          
          setPartnerData(sampleData);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPartnerData();
  }, [partnerId]);
  
  // Show toast notification
  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };
  
  // Handle form changes
  const handleContactChange = (e) => {
    setContactForm({...contactForm, [e.target.name]: e.target.value});
  };
  
  const handleTrainingChange = (e) => {
    setTrainingForm({...trainingForm, [e.target.name]: e.target.value});
  };
  
  // Handle form input changes
  const handlePartnerChange = (e) => {
    const { name, value } = e.target;
    setPartnerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleOpportunityChange = (e) => {
    setOpportunityForm({...opportunityForm, [e.target.name]: e.target.value});
  };
  
  const handleLoginChange = (e) => {
    setLoginForm({...loginForm, [e.target.name]: e.target.value});
  };
  
  // Submit handlers
  const handleContactSubmit = () => {
    if (contactForm.contactID) {
      // Update existing contact
      const updatedContacts = contacts.map(contact => 
        contact.contactID === contactForm.contactID ? contactForm : contact
      );
      setContacts(updatedContacts);
      showNotification("Contact updated successfully");
    } else {
      // Add new contact
      const newContact = {
        ...contactForm,
        contactID: contacts.length > 0 ? Math.max(...contacts.map(c => c.contactID)) + 1 : 1
      };
      setContacts([...contacts, newContact]);
      showNotification("Contact added successfully");
    }
    setShowContactModal(false);
    setContactForm({});
  };
  
  const handleTrainingSubmit = () => {
    if (trainingForm.trainingID) {
      // Update existing training
      const updatedTrainings = trainings.map(training => 
        training.trainingID === trainingForm.trainingID ? trainingForm : training
      );
      setTrainings(updatedTrainings);
      showNotification("Training updated successfully");
    } else {
      // Add new training
      const newTraining = {
        ...trainingForm,
        trainingID: trainings.length > 0 ? Math.max(...trainings.map(t => t.trainingID)) + 1 : 1
      };
      setTrainings([...trainings, newTraining]);
      showNotification("Training added successfully");
    }
    setShowTrainingModal(false);
    setTrainingForm({});
  };

  // Update Partner API Integration
  const handlePartnerEditSubmit = async () => {
    try {
      // Convert renewal value to boolean
      const renewalValue = partnerForm.renewal !== undefined 
        ? partnerForm.renewal === 'true' || partnerForm.renewal === true
        : partnerData.renewal || false;
      
      // Format minDealValue as number
      let minDealValue = partnerData.minDealValue || 0;
      if (partnerForm.minDealValue !== undefined) {
        if (typeof partnerForm.minDealValue === 'string') {
          minDealValue = parseFloat(partnerForm.minDealValue.replace('$', '').replace(',', '')) || 0;
        } else {
          minDealValue = partnerForm.minDealValue || 0;
        }
      }
      
      // Format registrationDate
      const registrationDate = partnerForm.registrationDate || partnerData.registrationDate || '';
      
      // Create the data object with exact property names that match PartnerUpdateDto
      const updatedPartnerData = {
        PartnerID: parseInt(partnerId),
        Name: partnerForm.name || partnerData.name || '',
        Email: partnerForm.email || partnerData.email || '',
        Phone: partnerForm.phone || partnerData.phone || '',
        ContactCompanyID: partnerForm.contactCompanyID ? parseInt(partnerForm.contactCompanyID) : partnerData.contactCompanyID || 0,
        Title: partnerForm.title || partnerData.title || '',
        PartnerShipType: partnerForm.partnerShipType || partnerData.partnerShipType || '',
        Address: partnerForm.address || partnerData.address || '',
        City: partnerForm.city || partnerData.city || '',
        State: partnerForm.state || partnerData.state || '',
        PostalCode: partnerForm.postalCode || partnerData.postalCode || '',
        Country: partnerForm.country || partnerData.country || '',
        Website: partnerForm.website || partnerData.website || '',
        Industry: partnerForm.industry || partnerData.industry || '',
        Renewal: renewalValue,
        MinDealValue: minDealValue,
        RegistrationDate: registrationDate,
        Notes: partnerForm.notes || partnerData.notes || '',
        ChangedBy: "admin@example.com"
      };
      
      const apiUrl = `https://localhost:7224/api/PartnerManagement/EditPartner/${partnerId}`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPartnerData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }

      await response.json();
      showNotification("Partner updated successfully");
      setShowEditPartnerModal(false);
      
      // Refresh partner data
      const refreshResponse = await fetch(`https://localhost:7224/api/PartnerManagement/GetPartnerEditData/${partnerId}`);
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setPartnerData(refreshedData.partner || refreshedData);
      }
      
    } catch (error) {
      console.error("Error updating partner:", error);
      showNotification(`Failed to update partner: ${error.message}`, "danger");
    }
  };
  
  const handleOpportunitySubmit = () => {
    if (opportunityForm.opportunityID) {
      // Update existing opportunity
      const updatedOpportunities = opportunities.map(opportunity => 
        opportunity.opportunityID === opportunityForm.opportunityID ? opportunityForm : opportunity
      );
      setOpportunities(updatedOpportunities);
      showNotification("Opportunity updated successfully");
    } else {
      // Add new opportunity
      const newOpportunity = {
        ...opportunityForm,
        opportunityID: opportunities.length > 0 ? Math.max(...opportunities.map(o => o.opportunityID)) + 1 : 1
      };
      setOpportunities([...opportunities, newOpportunity]);
      showNotification("Opportunity added successfully");
    }
    setShowOpportunityModal(false);
    setOpportunityForm({});
  };
  
  const handleLoginSubmit = () => {
    if (loginForm.loginID) {
      // Update existing login
      const updatedLogins = logins.map(login => 
        login.loginID === loginForm.loginID ? loginForm : login
      );
      setLogins(updatedLogins);
      showNotification("Login updated successfully");
    } else {
      // Add new login
      const newLogin = {
        ...loginForm,
        loginID: logins.length > 0 ? Math.max(...logins.map(l => l.loginID)) + 1 : 1
      };
      setLogins([...logins, newLogin]);
      showNotification("Login added successfully");
    }
    setShowLoginModal(false);
    setLoginForm({});
  };
  
  // Open edit modals with data
  const openEditContact = (contact) => {
    setContactForm(contact);
    setShowContactModal(true);
  };
  
  const openEditTraining = (training) => {
    setTrainingForm(training);
    setShowTrainingModal(true);
  };
  
  const openEditOpportunity = (opportunity) => {
    setOpportunityForm(opportunity);
    setShowOpportunityModal(true);
  };
  
  const openEditLogin = (login) => {
    setLoginForm(login);
    setShowLoginModal(true);
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="content-wrap d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div>Loading partner data...</div>
      </div>
    );
  }
  
  // Show error state if no partner data is available
  if (!partnerData) {
    return (
      <div className="content-wrap d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div>Failed to load partner data.</div>
      </div>
    );
  }

  return (
    <div className="content-wrap" style={{ marginTop: '1%', alignItems: 'center' }}>
      <Container fluid className="data-table-list">
        <Row>
          <Col md={12}>
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav variant="tabs" className="nav-tabs-custom nav-justified">
                <Nav.Item>
                  <Nav.Link eventKey="partner">Partner</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="contact">Contact</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="training">Training</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="opportunity">Opportunity</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="logins">Logins</Nav.Link>
                </Nav.Item>
              </Nav>
              
              <Tab.Content>
                {/* Partner Tab */}
                <Tab.Pane eventKey="partner" className="p-3">
                  {/* Summary Cards */}
                  <Row className="g-3 mb-4">
                    <Col md={4}>
                      <Card className="summary-card h-100">
                        <Card.Body className="text-center d-flex flex-column justify-content-center">
                          {partnerData && partnerData.contactCompanyId && (
                            <a 
                              href={`http://portal.weitsolutions.com/ContactCompany/GetContactCompanyDetail/?id=${partnerData.contactCompanyId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              <h4 className="card-title mb-2">{partnerData.contactCompany?.companyName || 'N/A'}</h4>
                            </a>
                          )}
                          <div className="stat-text text-muted">Contact Company</div>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={4}>
                      <Card className="summary-card h-100">
                        <Card.Body>
                          <Row className="align-items-center h-100">
                            <Col xs={4}>
                              <img
                                src={partnerData && partnerData.contactCompany && partnerData.contactCompany.photoPath 
                                  ? `/DesignImg/ContactCompanys/${partnerData.contactCompany.photoPath}`
                                  : "/DesignImg/ContactCompanys/dummy.png"}
                                className="img-fluid rounded"
                                alt="Partner Logo"
                                style={{ maxHeight: '80px' }}
                              />
                            </Col>
                            <Col xs={8}>
                              <h4 className="card-title mb-1 text-center">{partnerData.name || 'N/A'}</h4>
                              <div className="stat-text text-muted text-center">Partner Name</div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={4}>
                      <Card className="summary-card h-100">
                        <Card.Body className="text-center d-flex flex-column justify-content-center">
                          <h4 className="card-title mb-2">{partnerData.partnerShipType || 'N/A'}</h4>
                          <div className="stat-text text-muted">Partnership Type</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  {/* Contact Info */}
                  <Card className="mb-4">
                    <Card.Body>
                      <div className="row align-items-center mb-4">
                        <div key="contact-info-title" className="col">
                          <h5 className="card-title mb-0">Contact Information</h5>
                        </div>
                        <div key="edit-partner-button" className="col-auto">
                            <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => {
                              setPartnerForm({
                                name: partnerData.name || '',
                                email: partnerData.email || '',
                                phone: partnerData.phone || '',
                                contactCompanyID: partnerData.contactCompanyID || partnerData.contactCompanyId || '',
                                title: partnerData.title || '',
                                partnerShipType: partnerData.partnerShipType || '',
                                address: partnerData.address || '',
                                city: partnerData.city || '',
                                state: partnerData.state || '',
                                postalCode: partnerData.postalCode || '',
                                country: partnerData.country || '',
                                website: partnerData.website || '',
                                industry: partnerData.industry || '',
                                renewal: partnerData.renewal !== null && partnerData.renewal !== undefined 
                                  ? partnerData.renewal.toString() 
                                  : 'true',
                                minDealValue: partnerData.minDealValue || '',
                                registrationDate: partnerData.registrationDate || '',
                                notes: partnerData.notes || ''
                              });
                              setShowEditPartnerModal(true);
                            }}
                          >
                            Edit Partner
                          </Button>
                        </div>
                      </div>
                      <Row>
                        <Col md={6}>
                          <div className="info-group mb-3">
                            <label className="text-muted small">Email</label>
                            <div className="info-value">
                              <a href={`mailto:${partnerData.email}`} className="text-decoration-none">
                                {partnerData.email || 'N/A'}
                              </a>
                            </div>
                          </div>
                          <div className="info-group mb-3">
                            <label className="text-muted small">Phone</label>
                            <div className="info-value">{partnerData.phone || 'N/A'}</div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-group">
                            <label className="text-muted small">Address</label>
                            <div className="info-value">
                              {partnerData.address ? (
                                <>
                                  <div>{partnerData.address}</div>
                                  <div>{partnerData.city}, {partnerData.state} {partnerData.postalCode}</div>
                                  <div>{partnerData.country}</div>
                                </>
                              ) : (
                                <div className="text-muted">No address provided</div>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                  
                  {/* Details Table */}
                  <Card className="mb-4">
                    <Card.Body>
                      <h5 className="card-title mb-4">Partner Details</h5>
                      <div className="table-responsive">
                        <Table hover>
                          <thead className="table-light">
                            <tr>
                              <th>Website</th>
                              <th>Industry</th>
                              <th>Renewal</th>
                              <th>Min Deal Value</th>
                              <th>Registration Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {partnerData.website && (
                                  <a href={partnerData.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                                    {partnerData.website}
                                  </a>
                                )}
                              </td>
                              <td>{partnerData.industry || 'N/A'}</td>
                              <td>{partnerData.renewal ? 'Yes' : 'No'}</td>
                              <td>{partnerData.minDealValue ? `$${partnerData.minDealValue}` : 'N/A'}</td>
                              <td>{partnerData.registrationDate || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                  
                  {/* Notes Section */}
                  <Card>
                    <Card.Body>
                      <h5 className="card-title mb-3">Notes</h5>
                      <div className="notes-content bg-light p-3 rounded">
                        {partnerData.notes ? (
                          partnerData.notes
                        ) : (
                          <span className="text-muted">No notes available</span>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
                
                {/* Contact Tab */}
                <Tab.Pane eventKey="contact" className="p-3">
                  <Row className="d-flex flex-wrap">
                    {contacts.length > 0 ? (
                      contacts.map(contact => (
                        <Col md={4} key={contact.contactID} className="mb-3">
                          <Card className="contact-card h-100">
                            <Card.Body className="position-relative">
                              <div className="position-absolute top-0 end-0 d-flex">
                                <Button 
                                  variant="link" 
                                  className="bg-transparent border-0 p-0 me-1"
                                  onClick={() => openEditContact(contact)}
                                  title="Edit Contact"
                                >
                                  <Pencil className="text-primary" />
                                </Button>
                              </div>
                              
                              <div className="mb-3 pt-3">
                                <h5 className="card-title text-dark mb-3">{contact.contactName}</h5>
                              </div>
                              
                              <div className="contact-info">
                                <div className="d-flex align-items-center mb-2">
                                  <span className="text-dark">{contact.contactRole}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="text-dark">{contact.email}</span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col md={12}>
                        <Card className="empty-card d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                          <Card.Body className="text-center text-muted">
                            <p className="mt-2 text-dark">No Contacts Added</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                    
                    <Col md={4} className="mb-3">
                      <Card 
                        className="add-contact-card h-100" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowContactModal(true)}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                          <i className="bi bi-plus-circle text-primary" style={{ fontSize: '2rem' }}></i>
                          <p className="card-text mt-2 text-primary">Add New Contact</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
                
                {/* Training Tab */}
                <Tab.Pane eventKey="training" className="p-3">
                  <Row className="d-flex flex-wrap">
                    {trainings.length > 0 ? (
                      trainings.map(training => (
                        <Col md={4} key={training.trainingID} className="mb-3">
                          <Card className="training-card h-100">
                            <Card.Body className="position-relative">
                              <div className="position-absolute top-0 end-0 d-flex">
                                <Button 
                                  variant="link" 
                                  className="bg-transparent border-0 p-0 me-1"
                                  onClick={() => openEditTraining(training)}
                                  title="Edit Training"
                                >
                                  <Pencil className="text-primary" />
                                </Button>
                              </div>
                              
                              <div className="mb-3 pt-3">
                                <h5 className="card-title text-dark mb-3">{training.trainingName}</h5>
                              </div>
                              
                              <div className="training-info">
                                <div className="d-flex align-items-center mb-2">
                                  <span className="text-dark">{training.trainingType}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="text-dark">
                                    {training.completionDate ? (
                                      new Date(training.completionDate).toLocaleDateString()
                                    ) : (
                                      <span>No date set</span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col md={12}>
                        <Card className="empty-card d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                          <Card.Body className="text-center text-muted">
                            <Book className='fs-1' />
                            <p className="mt-2 text-dark">No Training Added</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                    
                    <Col md={4} className="mb-3">
                      <Card 
                        className="add-training-card h-100" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowTrainingModal(true)}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                          <i className="bi bi-plus-circle text-primary" style={{ fontSize: '2rem' }}></i>
                          <p className="card-text mt-2 text-primary">Add New Training</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
                
                {/* Opportunity Tab */}
                <Tab.Pane eventKey="opportunity" className="p-3">
                  <Row className="d-flex flex-wrap">
                    {opportunities.length > 0 ? (
                      opportunities.map(opportunity => (
                        <Col md={4} key={opportunity.opportunityID} className="mb-3">
                          <Card className="opportunity-card h-100">
                            <Card.Body className="position-relative">
                              <div className="position-absolute top-0 end-0 d-flex">
                                <Button 
                                  variant="link" 
                                  className="bg-transparent border-0 p-0 me-1"
                                  onClick={() => openEditOpportunity(opportunity)}
                                  title="Edit Opportunity"
                                >
                                  <Pencil className="text-primary" />
                                </Button>
                              </div>
                              
                              <div className="mb-3 pt-3">
                                <h5 className="card-title text-dark mb-3">{opportunity.opportunityName}</h5>
                              </div>
                              
                              <div className="opportunity-info">
                                <div className="d-flex align-items-center mb-2">
                                  <span className="text-dark">{opportunity.productName}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="text-dark">{opportunity.opportunityType}</span>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col md={12}>
                        <Card className="empty-card d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                          <Card.Body className="text-center text-muted">
                            <i className="bi bi-lightbulb fs-1"></i>
                            <p className="mt-2 text-dark">No Opportunities Added</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                    
                    <Col md={4} className="mb-3">
                      <Card 
                        className="add-opportunity-card h-100" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowOpportunityModal(true)}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                          <i className="bi bi-plus-circle text-primary" style={{ fontSize: '2rem' }}></i>
                          <p className="card-text mt-2 text-primary">Add New Opportunity</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
                
                {/* Logins Tab */}
                <Tab.Pane eventKey="logins" className="p-3">
                  <Row className="d-flex flex-wrap">
                    {logins.length > 0 ? (
                      logins.map(login => (
                        <Col md={4} key={login.loginID} className="mb-3">
                          <Card className="login-card h-100">
                            <Card.Body className="position-relative">
                              <div className="position-absolute top-0 end-0 d-flex">
                                <Button 
                                  variant="link" 
                                  className="bg-transparent border-0 p-0 me-1"
                                  onClick={() => openEditLogin(login)}
                                  title="Edit Login"
                                >
                                  <Pencil className="text-primary" />
                                </Button>
                              </div>
                              
                              <div className="mb-3 pt-3">
                                <h5 className="card-title text-dark mb-3">{login.username}</h5>
                              </div>
                              
                              <div className="login-info">
                                <div className="d-flex align-items-center mb-2">
                                  <span className="text-dark">{login.password}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <a 
                                    href={login.loginURL} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-truncate text-primary" 
                                    style={{ maxWidth: '200px', display: 'inline-block' }}
                                  >
                                    {login.loginURL}
                                  </a>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col md={12}>
                        <Card className="empty-card d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                          <Card.Body className="text-center text-muted">
                            <i className="bi bi-shield-lock fs-1"></i>
                            <p className="mt-2 text-dark">No Logins Added</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                    
                    <Col md={4} className="mb-3">
                      <Card 
                        className="add-login-card h-100" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowLoginModal(true)}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                          <i className="bi bi-plus-circle text-primary" style={{ fontSize: '2rem' }}></i>
                          <p className="card-text mt-2 text-primary">Add New Login</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
      
      {/* Add/Edit Contact Modal */}
      <Modal show={showContactModal} onHide={() => {setShowContactModal(false); setContactForm({});}} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><b>{contactForm.contactID ? 'Edit' : 'Add New'} Contact</b></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '65vh', overflowY: 'auto' }}>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control 
                    type="text" 
                    disabled 
                    value={partnerData.name}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Contact Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="contactName"
                    placeholder="Enter Contact Name"
                    value={contactForm.contactName || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Contact Role</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="contactRole"
                    placeholder="Enter Contact Role"
                    value={contactForm.contactRole || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email"
                    placeholder="Enter Email Address"
                    value={contactForm.email || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="phone"
                    placeholder="Enter Phone Number"
                    value={contactForm.phone || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="address"
                    placeholder="Enter Address"
                    value={contactForm.address || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="city"
                    placeholder="Enter City"
                    value={contactForm.city || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="state"
                    placeholder="Enter State"
                    value={contactForm.state || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="postalCode"
                    placeholder="Enter Postal Code"
                    value={contactForm.postalCode || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="country"
                    placeholder="Enter Country"
                    value={contactForm.country || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    name="notes"
                    placeholder="Enter Comments"
                    value={contactForm.notes || ''}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleContactSubmit}>Save</Button>
          <Button variant="danger" onClick={() => {setShowContactModal(false); setContactForm({});}}>Close</Button>
        </Modal.Footer>
      </Modal>
      
      {/* Add/Edit Training Modal */}
      <Modal show={showTrainingModal} onHide={() => {setShowTrainingModal(false); setTrainingForm({});}}>
        <Modal.Header closeButton>
          <Modal.Title>{trainingForm.trainingID ? 'Edit' : 'Add New'} Training</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '65vh', overflowY: 'auto' }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control 
                    type="text" 
                    disabled 
                    value={partnerData.name}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Training Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="trainingName"
                    placeholder="Enter the Training Name"
                    value={trainingForm.trainingName || ''}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Training Type</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="trainingType"
                    placeholder="Enter the Training Type"
                    value={trainingForm.trainingType || ''}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Completion Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="completionDate"
                    value={trainingForm.completionDate || ''}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cert Issued To</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="certIssuedTo"
                    placeholder="Enter the name of the Person"
                    value={trainingForm.certIssuedTo || ''}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Certificate Uploaded</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="certificateUploaded"
                    value={trainingForm.certificateUploaded || ''}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleTrainingSubmit}>Save</Button>
          <Button variant="danger" onClick={() => {setShowTrainingModal(false); setTrainingForm({});}}>Close</Button>
        </Modal.Footer>
      </Modal>
      
      {/* Add/Edit Opportunity Modal */}
      <Modal show={showOpportunityModal} onHide={() => {setShowOpportunityModal(false); setOpportunityForm({});}} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><b>{opportunityForm.opportunityID ? 'Edit' : 'Add New'} Opportunity</b></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '65vh', overflowY: 'auto' }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control 
                    type="text" 
                    disabled 
                    value={partnerData.name}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Opportunity Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="opportunityName"
                    placeholder="Enter Opportunity Name"
                    value={opportunityForm.opportunityName || ''}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="productName"
                    placeholder="Enter Product Name"
                    value={opportunityForm.productName || ''}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Opportunity Type</Form.Label>
                  <Form.Select 
                    name="opportunityType"
                    value={opportunityForm.opportunityType || ''}
                    onChange={handleOpportunityChange}
                  >
                    <option value="">Select Type</option>
                    <option value="New Business">New Business</option>
                    <option value="Upgrade">Upgrade</option>
                    <option value="Renewal">Renewal</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Value</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="value"
                    placeholder="Enter Value"
                    value={opportunityForm.value || ''}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    name="status"
                    value={opportunityForm.status || ''}
                    onChange={handleOpportunityChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Prospecting">Prospecting</option>
                    <option value="Qualification">Qualification</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Expected Close Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="expectedCloseDate"
                    value={opportunityForm.expectedCloseDate || ''}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Probability (%)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="probability"
                    placeholder="Enter Probability"
                    min="0"
                    max="100"
                    value={opportunityForm.probability || ''}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    name="notes"
                    placeholder="Enter Opportunity Notes"
                    value={opportunityForm.notes || ''}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleOpportunitySubmit}>Save</Button>
          <Button variant="danger" onClick={() => {setShowOpportunityModal(false); setOpportunityForm({});}}>Close</Button>
        </Modal.Footer>
      </Modal>
      
      {/* Add/Edit Login Modal */}
      <Modal show={showLoginModal} onHide={() => {setShowLoginModal(false); setLoginForm({});}}>
        <Modal.Header closeButton>
          <Modal.Title><b>{loginForm.loginID ? 'Edit' : 'Add New'} Login</b></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '65vh', overflowY: 'auto' }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control 
                    type="text" 
                    disabled 
                    value={partnerData.name}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="username"
                    placeholder="Enter Username"
                    value={loginForm.username || ''}
                    onChange={handleLoginChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password"
                    placeholder="Enter Password"
                    value={loginForm.password || ''}
                    onChange={handleLoginChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Login URL</Form.Label>
                  <Form.Control 
                    type="url" 
                    name="loginURL"
                    placeholder="Enter Login URL"
                    value={loginForm.loginURL || ''}
                    onChange={handleLoginChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Platform Type</Form.Label>
                  <Form.Select 
                    name="platformType"
                    value={loginForm.platformType || ''}
                    onChange={handleLoginChange}
                  >
                    <option value="">Select Platform</option>
                    <option value="Partner Portal">Partner Portal</option>
                    <option value="Support Portal">Support Portal</option>
                    <option value="Training Portal">Training Portal</option>
                    <option value="Sales Portal">Sales Portal</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    name="status"
                    value={loginForm.status || ''}
                    onChange={handleLoginChange}
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    name="notes"
                    placeholder="Enter Login Notes"
                    value={loginForm.notes || ''}
                    onChange={handleLoginChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleLoginSubmit}>Save</Button>
          <Button variant="danger" onClick={() => {setShowLoginModal(false); setLoginForm({});}}>Close</Button>
        </Modal.Footer>
      </Modal>
      
      {/* Edit Partner Modal */}
      <Modal show={showEditPartnerModal} onHide={() => setShowEditPartnerModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>EDIT PARTNER DETAILS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Partner Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name"
                    value={partnerForm.name || (partnerData ? partnerData.name : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email"
                    value={partnerForm.email || (partnerData ? partnerData.email : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="phone"
                    value={partnerForm.phone || (partnerData ? partnerData.phone : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                 <Form.Group className="mb-3">
                <Form.Label>Contact Company</Form.Label>
                <Form.Select
                  name="contactCompanyID"
                  value={partnerForm.contactCompanyID || partnerData.contactCompanyID || ''}
                  onChange={handlePartnerChange}
                >
                  <option value="">Select Contact Company</option>
                  {contactCompanies.map(company => (
                    <option key={company.contactCompanyId} value={company.contactCompanyId}>
                      {company.companyName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title"
                    value={partnerForm.title || (partnerData ? partnerData.title : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Partner Type</Form.Label>
                  <Form.Select 
                    name="partnerShipType"
                    value={partnerForm.partnerShipType || (partnerData ? partnerData.partnerShipType : '') || ''}
                    onChange={handlePartnerChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Others">Others</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="address"
                    value={partnerForm.address || (partnerData ? partnerData.address : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="city"
                    value={partnerForm.city || (partnerData ? partnerData.city : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="state"
                    value={partnerForm.state || (partnerData ? partnerData.state : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="postalCode"
                    value={partnerForm.postalCode || (partnerData ? partnerData.postalCode : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Country</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="country"
                    value={partnerForm.country || (partnerData ? partnerData.country : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Website</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="website"
                    value={partnerForm.website || (partnerData ? partnerData.website : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Industry</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="industry"
                    value={partnerForm.industry || (partnerData ? partnerData.industry : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Renewal</Form.Label>
                  <Form.Select
                    name="renewal"
                    value={partnerForm.renewal ?? (partnerData?.renewal !== null && partnerData?.renewal !== undefined ? partnerData.renewal.toString() : 'true')}
                    onChange={handlePartnerChange}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Min Deal Value</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="minDealValue"
                    value={partnerForm.minDealValue || (partnerData ? partnerData.minDealValue : '') || ''}
                    onChange={handlePartnerChange}
                    placeholder="Enter numeric value"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Registration Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="registrationDate"
                    value={partnerForm.registrationDate || (partnerData ? partnerData.registrationDate : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    name="notes"
                    value={partnerForm.notes || (partnerData ? partnerData.notes : '') || ''}
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handlePartnerEditSubmit}>Save</Button>
          <Button variant="danger" onClick={() => setShowEditPartnerModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      
      {/* Toast notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          onClose={() => setShowToast(false)} 
          show={showToast} 
          delay={3000} 
          autohide
          bg={toastType}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default EditPartner;