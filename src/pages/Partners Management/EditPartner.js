import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
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
  ToastContainer,
} from "react-bootstrap";
import { Book, Pencil } from "react-bootstrap-icons";

const EditPartner = () => {
  const { partnerId } = useParams();
  const [partnerData, setPartnerData] = useState({
    contactCompany: {},
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("partner");
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [showAddTrainingModal, setShowAddTrainingModal] = useState(false);
  const [showEditTrainingModal, setShowEditTrainingModal] = useState(false);
  const [showEditPartnerModal, setShowEditPartnerModal] = useState(false);
  const [showAddOpportunityModal, setShowAddOpportunityModal] = useState(false);
  const [showEditOpportunityModal, setShowEditOpportunityModal] = useState(false);
  const [showAddLoginModal, setShowAddLoginModal] = useState(false);
  const [showEditLoginModal, setShowEditLoginModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // State for data arrays from API
  const [contacts, setContacts] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [logins, setLogins] = useState([]);
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
        const response = await fetch(
          "https://localhost:7224/api/PartnerManagement/contact-companies"
        );
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

  // Enhanced contact data normalization with better debugging - wrapped in useCallback
  const normalizeContact = useCallback((contact) => {
    console.log("🔍 Raw contact data received:", contact);
    
    // Try all possible property names for contact ID
    const contactID = 
      contact.contactID || 
      contact.ContactID || 
      contact.contactId ||
      contact.ContactId ||
      contact.id ||
      contact.ID ||
      null;

    console.log("📋 Extracted ContactID:", contactID);
    
    const normalized = {
      contactID: contactID,
      contactName: contact.contactName || contact.ContactName || contact.name || "",
      contactRole: contact.contactRole || contact.ContactRole || contact.role || "",
      email: contact.email || contact.Email || "",
      phone: contact.phone || contact.Phone || "",
      address: contact.address || contact.AddressLine1 || contact.Address || "",
      city: contact.city || contact.City || "",
      state: contact.state || contact.State || "",
      postalCode: contact.postalCode || contact.PostalCode || "",
      country: contact.country || contact.Country || "",
      notes: contact.notes || contact.Notes || "",
    };
    
    console.log("✅ Normalized contact:", normalized);
    return normalized;
  }, []);

  // Training data normalization - wrapped in useCallback
  const normalizeTraining = useCallback((training) => {
    console.log("🔍 Raw training data received:", training);
    
    // Enhanced TrainingID extraction with more property names
    const trainingID = 
      training.trainingID || 
      training.TrainingID || 
      training.trainingId ||
      training.TrainingId ||
      training.id ||
      training.ID ||
      training.training_ID ||
      training.Training_ID ||
      null;

    console.log("📋 Extracted TrainingID:", trainingID);
    
    // Enhanced property mapping for training data
    const normalized = {
      trainingID: trainingID,
      partnerID: training.partnerID || training.PartnerID || training.partnerId || training.PartnerId || parseInt(partnerId),
      trainingName: training.trainingName || training.TrainingName || training.name || training.Name || "",
      trainingType: training.trainingType || training.TrainingType || training.type || training.Type || "",
      completionDate: training.completionDate || training.CompletionDate || training.date || training.Date || "",
      certIssuedTo: training.certIssuedTo !== undefined ? training.certIssuedTo : 
                   training.certIssued !== undefined ? training.certIssued : 
                   training.certificateIssued !== undefined ? training.certificateIssued : false,
      certificateUploaded: training.certificateUploaded !== undefined ? training.certificateUploaded : 
                          training.certUploaded !== undefined ? training.certUploaded : 
                          training.certificateUploaded !== undefined ? training.certificateUploaded : false,
    };
    
    console.log("✅ Normalized training:", normalized);
    return normalized;
  }, [partnerId]);

  // Opportunity data normalization based on backend model
  const normalizeOpportunity = useCallback((opportunity) => {
    console.log("🔍 Raw opportunity data received:", opportunity);
    
    const opportunityID = 
      opportunity.opportunityID || 
      opportunity.OpportunityID || 
      opportunity.opportunityId ||
      opportunity.OpportunityId ||
      opportunity.id ||
      opportunity.ID ||
      null;

    console.log("📋 Extracted OpportunityID:", opportunityID);
    
    const normalized = {
      opportunityID: opportunityID,
      partnerID: opportunity.partnerID || opportunity.PartnerID || opportunity.partnerId || opportunity.PartnerId || parseInt(partnerId),
      opportunityName: opportunity.opportunityName || opportunity.OpportunityName || opportunity.name || opportunity.Name || "",
      opportunityType: opportunity.opportunityType || opportunity.OpportunityType || opportunity.type || opportunity.Type || "",
      productName: opportunity.productName || opportunity.ProductName || opportunity.product || opportunity.Product || "",
      serialNumber: opportunity.serialNumber || opportunity.SerialNumber || "",
      fortiCareID: opportunity.fortiCareID || opportunity.FortiCareID || "",
      coTermQuoteID: opportunity.coTermQuoteID || opportunity.CoTermQuoteID || "",
      tradeUpID: opportunity.tradeUpID || opportunity.TradeUpID || "",
      isSDWANOpportunity: opportunity.isSDWANOpportunity !== undefined ? opportunity.isSDWANOpportunity : false,
      isOperationalTechnologyOpportunity: opportunity.isOperationalTechnologyOpportunity || opportunity.IsOperationalTechnologyOpportunity || "No",
      estimatedValue: opportunity.estimatedValue || opportunity.EstimatedValue || opportunity.value || opportunity.Value || 0,
      statusID: opportunity.statusID || opportunity.StatusID || 1,
      dealRegOOT: opportunity.dealRegOOT !== undefined ? opportunity.dealRegOOT : false,
      isRenewalOver9999: opportunity.isRenewalOver9999 !== undefined ? opportunity.isRenewalOver9999 : false,
      fedDeal: opportunity.fedDeal !== undefined ? opportunity.fedDeal : false,
      tradeIn: opportunity.tradeIn !== undefined ? opportunity.tradeIn : false,
      dealType: opportunity.dealType || opportunity.DealType || "New",
      description: opportunity.description || opportunity.Description || "",
      notes: opportunity.notes || opportunity.Notes || "",
      changedBy: opportunity.changedBy || opportunity.ChangedBy || "admin@example.com",
    };
    
    console.log("✅ Normalized opportunity:", normalized);
    return normalized;
  }, [partnerId]);

  // Login data normalization based on backend model
  const normalizeLogin = useCallback((login) => {
    console.log("🔍 Raw login data received:", login);
    
    const loginID = 
      login.loginID || 
      login.LoginID || 
      login.loginId ||
      login.LoginId ||
      login.id ||
      login.ID ||
      null;

    console.log("📋 Extracted LoginID:", loginID);
    
    const normalized = {
      loginID: loginID,
      partnerID: login.partnerID || login.PartnerID || login.partnerId || login.PartnerId || parseInt(partnerId),
      username: login.username || login.Username || login.userName || login.UserName || "",
      password: login.password || login.Password || "",
      loginURL: login.loginURL || login.LoginURL || login.url || login.Url || "",
    };
    
    console.log("✅ Normalized login:", normalized);
    return normalized;
  }, [partnerId]);

  // Improved training data finder function
  const findTrainingsInObject = useCallback((obj, path = 'root') => {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];
        if (item && (item.trainingName || item.TrainingName || item.trainingID || item.TrainingID || item.trainingId || item.TrainingId)) {
          console.log(`✅ Found trainings array at ${path}[${i}]`);
          return obj;
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          const firstItem = obj[key][0];
          if (firstItem && (firstItem.trainingName || firstItem.TrainingName || firstItem.trainingID || firstItem.TrainingID || firstItem.trainingId || firstItem.TrainingId)) {
            console.log(`✅ Found trainings array at ${path}.${key}`);
            return obj[key];
          }
        }
        const result = findTrainingsInObject(obj[key], `${path}.${key}`);
        if (result) return result;
      }
    }
    return null;
  }, []);

  // Improved opportunity data finder function
  const findOpportunitiesInObject = useCallback((obj, path = 'root') => {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];
        if (item && (item.opportunityName || item.OpportunityName || item.opportunityID || item.OpportunityID || item.opportunityId || item.OpportunityId)) {
          console.log(`✅ Found opportunities array at ${path}[${i}]`);
          return obj;
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          const firstItem = obj[key][0];
          if (firstItem && (firstItem.opportunityName || firstItem.OpportunityName || firstItem.opportunityID || firstItem.OpportunityID || firstItem.opportunityId || firstItem.OpportunityId)) {
            console.log(`✅ Found opportunities array at ${path}.${key}`);
            return obj[key];
          }
        }
        const result = findOpportunitiesInObject(obj[key], `${path}.${key}`);
        if (result) return result;
      }
    }
    return null;
  }, []);

  // Improved login data finder function
  const findLoginsInObject = useCallback((obj, path = 'root') => {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];
        if (item && (item.username || item.Username || item.loginID || item.LoginID || item.loginId || item.LoginId)) {
          console.log(`✅ Found logins array at ${path}[${i}]`);
          return obj;
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          const firstItem = obj[key][0];
          if (firstItem && (firstItem.username || firstItem.Username || firstItem.loginID || firstItem.LoginID || firstItem.loginId || firstItem.LoginId)) {
            console.log(`✅ Found logins array at ${path}.${key}`);
            return obj[key];
          }
        }
        const result = findLoginsInObject(obj[key], `${path}.${key}`);
        if (result) return result;
      }
    }
    return null;
  }, []);

  // Fetch partner data with improved data handling
  useEffect(() => {
    const fetchPartnerData = async () => {
      if (partnerId) {
        try {
          setLoading(true);
          console.log("🔄 Fetching partner data for ID:", partnerId);

          const response = await fetch(
            `https://localhost:7224/api/PartnerManagement/GetPartnerEditData/${partnerId}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("📦 Full API response:", data);

          // Debug the structure of the contacts data
          let contactsData = [];
          if (data.contacts) {
            console.log("👥 Contacts data found:", data.contacts);
            contactsData = data.contacts;
          } else if (data.partner && data.partner.contacts) {
            console.log("👥 Contacts found in partner object:", data.partner.contacts);
            contactsData = data.partner.contacts;
          } else {
            console.log("❌ No contacts data found in expected locations");
            // Try to find contacts anywhere in the response
            const findContactsInObject = (obj, path = 'root') => {
              if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                  const item = obj[i];
                  if (item && (item.contactName || item.ContactName || item.contactID || item.ContactID)) {
                    console.log(`✅ Found contacts array at ${path}[${i}]`);
                    return obj;
                  }
                }
              } else if (typeof obj === 'object' && obj !== null) {
                for (const key in obj) {
                  if (Array.isArray(obj[key]) && obj[key].length > 0) {
                    const firstItem = obj[key][0];
                    if (firstItem && (firstItem.contactName || firstItem.ContactName || firstItem.contactID || firstItem.ContactID)) {
                      console.log(`✅ Found contacts array at ${path}.${key}`);
                      return obj[key];
                    }
                  }
                  const result = findContactsInObject(obj[key], `${path}.${key}`);
                  if (result) return result;
                }
              }
              return null;
            };

            const foundContacts = findContactsInObject(data);
            if (foundContacts) {
              contactsData = foundContacts;
            }
          }

          // Debug the structure of the trainings data
          let trainingsData = [];
          if (data.trainings) {
            console.log("🎓 Trainings data found:", data.trainings);
            trainingsData = data.trainings;
          } else if (data.partner && data.partner.trainings) {
            console.log("🎓 Trainings found in partner object:", data.partner.trainings);
            trainingsData = data.partner.trainings;
          } else {
            console.log("❌ No trainings data found in expected locations");
            // Try to find trainings anywhere in the response using the useCallback function
            const foundTrainings = findTrainingsInObject(data);
            if (foundTrainings) {
              trainingsData = foundTrainings;
            }
          }

          // Debug the structure of the opportunities data
          let opportunitiesData = [];
          if (data.opportunities) {
            console.log("💼 Opportunities data found:", data.opportunities);
            opportunitiesData = data.opportunities;
          } else if (data.partner && data.partner.opportunities) {
            console.log("💼 Opportunities found in partner object:", data.partner.opportunities);
            opportunitiesData = data.partner.opportunities;
          } else {
            console.log("❌ No opportunities data found in expected locations");
            const foundOpportunities = findOpportunitiesInObject(data);
            if (foundOpportunities) {
              opportunitiesData = foundOpportunities;
            }
          }

          // Debug the structure of the logins data
          let loginsData = [];
          if (data.logins) {
            console.log("🔐 Logins data found:", data.logins);
            loginsData = data.logins;
          } else if (data.partner && data.partner.logins) {
            console.log("🔐 Logins found in partner object:", data.partner.logins);
            loginsData = data.partner.logins;
          } else {
            console.log("❌ No logins data found in expected locations");
            const foundLogins = findLoginsInObject(data);
            if (foundLogins) {
              loginsData = foundLogins;
            }
          }

          // Normalize all data
          const normalizedContacts = Array.isArray(contactsData) 
            ? contactsData.map(normalizeContact) 
            : [];
          
          const normalizedTrainings = Array.isArray(trainingsData) 
            ? trainingsData.map(normalizeTraining) 
            : [];
          
          const normalizedOpportunities = Array.isArray(opportunitiesData) 
            ? opportunitiesData.map(normalizeOpportunity) 
            : [];
          
          const normalizedLogins = Array.isArray(loginsData) 
            ? loginsData.map(normalizeLogin) 
            : [];
          
          console.log("👥 Final normalized contacts:", normalizedContacts);
          console.log("🎓 Final normalized trainings:", normalizedTrainings);
          console.log("💼 Final normalized opportunities:", normalizedOpportunities);
          console.log("🔐 Final normalized logins:", normalizedLogins);

          // Set the data based on structure
          if (data.partner) {
            setPartnerData(data.partner);
            setContacts(normalizedContacts);
            setTrainings(normalizedTrainings);
            setOpportunities(normalizedOpportunities);
            setLogins(normalizedLogins);
          } else if (data) {
            setPartnerData(data);
            setContacts(normalizedContacts);
            setTrainings(normalizedTrainings);
            setOpportunities(normalizedOpportunities);
            setLogins(normalizedLogins);
          } else {
            throw new Error("Invalid data format from API");
          }

        } catch (error) {
          console.error("❌ Error fetching partner data:", error);
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
              photoPath: "dummy.png",
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
            notes: "Sample partner notes",
          };

          setPartnerData(sampleData);
          setContacts([]);
          setTrainings([]);
          setOpportunities([]);
          setLogins([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPartnerData();
  }, [partnerId, normalizeContact, normalizeTraining, normalizeOpportunity, normalizeLogin, findTrainingsInObject, findOpportunitiesInObject, findLoginsInObject]);

  // Show toast notification
  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Handle form changes
  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleTrainingChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setTrainingForm({ ...trainingForm, [name]: checked });
    } else if (type === 'date') {
      setTrainingForm({ ...trainingForm, [name]: value });
    } else {
      setTrainingForm({ ...trainingForm, [name]: value });
    }
  };

  // Handle form input changes
  const handlePartnerChange = (e) => {
    const { name, value } = e.target;
    setPartnerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpportunityChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setOpportunityForm({ ...opportunityForm, [name]: checked });
    } else if (type === 'number') {
      setOpportunityForm({ ...opportunityForm, [name]: parseFloat(value) || 0 });
    } else {
      setOpportunityForm({ ...opportunityForm, [name]: value });
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // API call to create contact
  const handleAddContact = async () => {
    try {
      // Prepare the contact data matching the backend model EXACTLY
      const contactData = {
        PartnerID: parseInt(partnerId),
        ContactName: contactForm.contactName || "",
        ContactRole: contactForm.contactRole || "",
        Email: contactForm.email || "",
        Phone: contactForm.phone || "",
        AddressLine1: contactForm.address || "",
        City: contactForm.city || "",
        State: contactForm.state || "",
        PostalCode: contactForm.postalCode || "",
        Country: contactForm.country || "",
        Notes: contactForm.notes || "",
      };

      // Validation
      if (!contactForm.contactName) {
        showNotification("Contact Name is required", "danger");
        return;
      }

      console.log("📤 Creating contact with data:", contactData);

      const response = await fetch(
        "https://localhost:7224/api/PartnerManagement/CreateContact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        }
      );

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success || response.status === 200 || response.status === 201) {
        // Add new contact to local state with the ID from API response
        const newContactId = result.contactID || result.id || result.ContactID || Date.now();
        const newContact = {
          ...normalizeContact(contactForm),
          contactID: newContactId,
        };
        setContacts([...contacts, newContact]);
        showNotification("Contact created successfully");
        
        setShowAddContactModal(false);
        setContactForm({});
      } else {
        throw new Error(result.message || "Failed to create contact");
      }
    } catch (error) {
      console.error("❌ Error creating contact:", error);
      showNotification(`Failed to create contact: ${error.message}`, "danger");
    }
  };

  // API call to update contact
  const handleEditContact = async () => {
    try {
      console.log("✏️ Edit contact form data:", contactForm);
      
      if (!contactForm.contactID) {
        showNotification("Contact ID is missing. Cannot update contact.", "danger");
        console.error("❌ Missing Contact ID in form data");
        return;
      }

      // Prepare the contact data matching the backend model EXACTLY
      const contactData = {
        ContactID: contactForm.contactID,
        PartnerID: parseInt(partnerId),
        ContactName: contactForm.contactName || "",
        ContactRole: contactForm.contactRole || "",
        Email: contactForm.email || "",
        Phone: contactForm.phone || "",
        AddressLine1: contactForm.address || "",
        City: contactForm.city || "",
        State: contactForm.state || "",
        PostalCode: contactForm.postalCode || "",
        Country: contactForm.country || "",
        Notes: contactForm.notes || "",
      };

      // Validation
      if (!contactForm.contactName) {
        showNotification("Contact Name is required", "danger");
        return;
      }

      console.log("📤 Updating contact with data:", contactData);

      const response = await fetch(
        `https://localhost:7224/api/PartnerManagement/EditContact/${contactForm.contactID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        }
      );

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success || response.status === 200) {
        // Update local state for existing contact
        const updatedContacts = contacts.map((contact) =>
          contact.contactID === contactForm.contactID 
            ? { ...normalizeContact(contactForm) }
            : contact
        );
        setContacts(updatedContacts);
        showNotification("Contact updated successfully");
        
        setShowEditContactModal(false);
        setContactForm({});
      } else {
        throw new Error(result.message || "Failed to update contact");
      }
    } catch (error) {
      console.error("❌ Error updating contact:", error);
      showNotification(`Failed to update contact: ${error.message}`, "danger");
    }
  };

  // API call to create training
  const handleAddTraining = async () => {
    try {
      // Prepare the training data matching the backend model EXACTLY
      const trainingData = {
        PartnerID: parseInt(partnerId),
        TrainingName: trainingForm.trainingName || "",
        TrainingType: trainingForm.trainingType || "",
        CompletionDate: trainingForm.completionDate || null,
        CertIssuedTo: trainingForm.certIssuedTo || false,
        CertificateUploaded: trainingForm.certificateUploaded || false,
      };

      // Validation
      if (!trainingForm.trainingName) {
        showNotification("Training Name is required", "danger");
        return;
      }

      console.log("📤 Creating training with data:", trainingData);

      const response = await fetch(
        "https://localhost:7224/api/PartnerManagement/CreateTraining",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trainingData),
        }
      );

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success || response.status === 200 || response.status === 201) {
        // Add new training to local state with the ID from API response
        const newTrainingId = result.trainingID || result.id || result.TrainingID || Date.now();
        const newTraining = {
          ...normalizeTraining(trainingForm),
          trainingID: newTrainingId,
        };
        setTrainings([...trainings, newTraining]);
        showNotification("Training created successfully");
        
        setShowAddTrainingModal(false);
        setTrainingForm({});
      } else {
        throw new Error(result.message || "Failed to create training");
      }
    } catch (error) {
      console.error("❌ Error creating training:", error);
      showNotification(`Failed to create training: ${error.message}`, "danger");
    }
  };

  // API call to update training
  const handleEditTraining = async () => {
    try {
      console.log("✏️ Edit training form data:", trainingForm);
      
      if (!trainingForm.trainingID) {
        showNotification("Training ID is missing. Cannot update training.", "danger");
        console.error("❌ Missing Training ID in form data");
        return;
      }

      // Prepare the training data matching the backend model EXACTLY
      const trainingData = {
        TrainingID: trainingForm.trainingID,
        PartnerID: parseInt(partnerId),
        TrainingName: trainingForm.trainingName || "",
        TrainingType: trainingForm.trainingType || "",
        CompletionDate: trainingForm.completionDate || null,
        CertIssuedTo: trainingForm.certIssuedTo || false,
        CertificateUploaded: trainingForm.certificateUploaded || false,
      };

      // Validation
      if (!trainingForm.trainingName) {
        showNotification("Training Name is required", "danger");
        return;
      }

      console.log("📤 Updating training with data:", trainingData);

      const response = await fetch(
        `https://localhost:7224/api/PartnerManagement/EditTraining/${trainingForm.trainingID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trainingData),
        }
      );

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success || response.status === 200) {
        // Update local state for existing training
        const updatedTrainings = trainings.map((training) =>
          training.trainingID === trainingForm.trainingID 
            ? { ...normalizeTraining(trainingForm) }
            : training
        );
        setTrainings(updatedTrainings);
        showNotification("Training updated successfully");
        
        setShowEditTrainingModal(false);
        setTrainingForm({});
      } else {
        throw new Error(result.message || "Failed to update training");
      }
    } catch (error) {
      console.error("❌ Error updating training:", error);
      showNotification(`Failed to update training: ${error.message}`, "danger");
    }
  };

  // API call to create opportunity - FIXED based on backend model
  const handleAddOpportunity = async () => {
    try {
      // Prepare the opportunity data matching the backend model EXACTLY
      const opportunityData = {
        PartnerID: parseInt(partnerId),
        OpportunityName: opportunityForm.opportunityName || "",
        OpportunityType: opportunityForm.opportunityType || "",
        ProductName: opportunityForm.productName || "",
        SerialNumber: opportunityForm.serialNumber || "",
        FortiCareID: opportunityForm.fortiCareID || "",
        CoTermQuoteID: opportunityForm.coTermQuoteID || "",
        TradeUpID: opportunityForm.tradeUpID || "",
        IsSDWANOpportunity: opportunityForm.isSDWANOpportunity || false,
        IsOperationalTechnologyOpportunity: opportunityForm.isOperationalTechnologyOpportunity || "No",
        EstimatedValue: opportunityForm.estimatedValue || 0,
        StatusID: opportunityForm.statusID || 1,
        DealRegOOT: opportunityForm.dealRegOOT || false,
        IsRenewalOver9999: opportunityForm.isRenewalOver9999 || false,
        FedDeal: opportunityForm.fedDeal || false,
        TradeIn: opportunityForm.tradeIn || false,
        DealType: opportunityForm.dealType || "New",
        Description: opportunityForm.description || "",
        Notes: opportunityForm.notes || "",
        ChangedBy: opportunityForm.changedBy || "admin@example.com",
      };

      // Validation
      if (!opportunityForm.opportunityName) {
        showNotification("Opportunity Name is required", "danger");
        return;
      }

      console.log("📤 Creating opportunity with data:", opportunityData);

      const response = await fetch(
        "https://localhost:7224/api/PartnerManagement/CreateOpportunity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(opportunityData),
        }
      );

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success || response.status === 200 || response.status === 201) {
        // Add new opportunity to local state with the ID from API response
        const newOpportunityId = result.opportunityID || result.id || result.OpportunityID || Date.now();
        const newOpportunity = {
          ...normalizeOpportunity(opportunityForm),
          opportunityID: newOpportunityId,
        };
        setOpportunities([...opportunities, newOpportunity]);
        showNotification("Opportunity created successfully");
        
        setShowAddOpportunityModal(false);
        setOpportunityForm({});
      } else {
        throw new Error(result.message || "Failed to create opportunity");
      }
    } catch (error) {
      console.error("❌ Error creating opportunity:", error);
      showNotification(`Failed to create opportunity: ${error.message}`, "danger");
    }
  };

  // API call to update opportunity - FIXED based on backend model
  const handleEditOpportunity = async () => {
    try {
      console.log("✏️ Edit opportunity form data:", opportunityForm);
      
      if (!opportunityForm.opportunityID) {
        showNotification("Opportunity ID is missing. Cannot update opportunity.", "danger");
        console.error("❌ Missing Opportunity ID in form data");
        return;
      }

      // Prepare the opportunity data matching the backend model EXACTLY
      const opportunityData = {
        OpportunityID: opportunityForm.opportunityID,
        PartnerID: parseInt(partnerId),
        OpportunityName: opportunityForm.opportunityName || "",
        OpportunityType: opportunityForm.opportunityType || "",
        ProductName: opportunityForm.productName || "",
        SerialNumber: opportunityForm.serialNumber || "",
        FortiCareID: opportunityForm.fortiCareID || "",
        CoTermQuoteID: opportunityForm.coTermQuoteID || "",
        TradeUpID: opportunityForm.tradeUpID || "",
        IsSDWANOpportunity: opportunityForm.isSDWANOpportunity || false,
        IsOperationalTechnologyOpportunity: opportunityForm.isOperationalTechnologyOpportunity || "No",
        EstimatedValue: opportunityForm.estimatedValue || 0,
        StatusID: opportunityForm.statusID || 1,
        DealRegOOT: opportunityForm.dealRegOOT || false,
        IsRenewalOver9999: opportunityForm.isRenewalOver9999 || false,
        FedDeal: opportunityForm.fedDeal || false,
        TradeIn: opportunityForm.tradeIn || false,
        DealType: opportunityForm.dealType || "New",
        Description: opportunityForm.description || "",
        Notes: opportunityForm.notes || "",
        ChangedBy: opportunityForm.changedBy || "admin@example.com",
      };

      // Validation
      if (!opportunityForm.opportunityName) {
        showNotification("Opportunity Name is required", "danger");
        return;
      }

      console.log("📤 Updating opportunity with data:", opportunityData);

      const response = await fetch(
        `https://localhost:7224/api/PartnerManagement/EditOpportunity/${opportunityForm.opportunityID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(opportunityData),
        }
      );

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success || response.status === 200) {
        // Update local state for existing opportunity
        const updatedOpportunities = opportunities.map((opportunity) =>
          opportunity.opportunityID === opportunityForm.opportunityID 
            ? { ...normalizeOpportunity(opportunityForm) }
            : opportunity
        );
        setOpportunities(updatedOpportunities);
        showNotification("Opportunity updated successfully");
        
        setShowEditOpportunityModal(false);
        setOpportunityForm({});
      } else {
        throw new Error(result.message || "Failed to update opportunity");
      }
    } catch (error) {
      console.error("❌ Error updating opportunity:", error);
      showNotification(`Failed to update opportunity: ${error.message}`, "danger");
    }
  };

  // API call to create login - FIXED based on backend model
  const handleAddLogin = async () => {
    try {
      // Prepare the login data matching the backend model EXACTLY
      const loginData = {
        PartnerID: parseInt(partnerId),
        Username: loginForm.username || "",
        Password: loginForm.password || "",
        LoginURL: loginForm.loginURL || "",
      };

      // Validation
      if (!loginForm.username) {
        showNotification("Username is required", "danger");
        return;
      }

      console.log("📤 Creating login with data:", loginData);

      const response = await fetch(
        "https://localhost:7224/api/PartnerManagement/CreateLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success || response.status === 200 || response.status === 201) {
        // Add new login to local state with the ID from API response
        const newLoginId = result.loginID || result.id || result.LoginID || Date.now();
        const newLogin = {
          ...normalizeLogin(loginForm),
          loginID: newLoginId,
        };
        setLogins([...logins, newLogin]);
        showNotification("Login created successfully");
        
        setShowAddLoginModal(false);
        setLoginForm({});
      } else {
        throw new Error(result.message || "Failed to create login");
      }
    } catch (error) {
      console.error("❌ Error creating login:", error);
      showNotification(`Failed to create login: ${error.message}`, "danger");
    }
  };

  // API call to update login - FIXED based on backend model
  const handleEditLogin = async () => {
    try {
      console.log("✏️ Edit login form data:", loginForm);
      
      if (!loginForm.loginID) {
        showNotification("Login ID is missing. Cannot update login.", "danger");
        console.error("❌ Missing Login ID in form data");
        return;
      }

      // Prepare the login data matching the backend model EXACTLY
      const loginData = {
        LoginID: loginForm.loginID,
        PartnerID: parseInt(partnerId),
        Username: loginForm.username || "",
        Password: loginForm.password || "",
        LoginURL: loginForm.loginURL || "",
      };

      // Validation
      if (!loginForm.username) {
        showNotification("Username is required", "danger");
        return;
      }

      console.log("📤 Updating login with data:", loginData);

      const response = await fetch(
        `https://localhost:7224/api/PartnerManagement/EditLogin/${loginForm.loginID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API Response:", result);

      if (result.success || response.status === 200) {
        // Update local state for existing login
        const updatedLogins = logins.map((login) =>
          login.loginID === loginForm.loginID 
            ? { ...normalizeLogin(loginForm) }
            : login
        );
        setLogins(updatedLogins);
        showNotification("Login updated successfully");
        
        setShowEditLoginModal(false);
        setLoginForm({});
      } else {
        throw new Error(result.message || "Failed to update login");
      }
    } catch (error) {
      console.error("❌ Error updating login:", error);
      showNotification(`Failed to update login: ${error.message}`, "danger");
    }
  };

  // Update Partner API Integration
  const handlePartnerEditSubmit = async () => {
    try {
      // Convert renewal value to boolean
      const renewalValue =
        partnerForm.renewal !== undefined
          ? partnerForm.renewal === "true" || partnerForm.renewal === true
          : partnerData.renewal || false;

      // Format minDealValue as number
      let minDealValue = partnerData.minDealValue || 0;
      if (partnerForm.minDealValue !== undefined) {
        if (typeof partnerForm.minDealValue === "string") {
          minDealValue =
            parseFloat(
              partnerForm.minDealValue.replace("$", "").replace(",", "")
            ) || 0;
        } else {
          minDealValue = partnerForm.minDealValue || 0;
        }
      }

      // Format registrationDate
      const registrationDate =
        partnerForm.registrationDate || partnerData.registrationDate || "";

      // Create the data object with exact property names that match PartnerUpdateDto
      const updatedPartnerData = {
        PartnerID: parseInt(partnerId),
        Name: partnerForm.name || partnerData.name || "",
        Email: partnerForm.email || partnerData.email || "",
        Phone: partnerForm.phone || partnerData.phone || "",
        ContactCompanyID: partnerForm.contactCompanyID
          ? parseInt(partnerForm.contactCompanyID)
          : partnerData.contactCompanyID || 0,
        Title: partnerForm.title || partnerData.title || "",
        PartnerShipType:
          partnerForm.partnerShipType || partnerData.partnerShipType || "",
        Address: partnerForm.address || partnerData.address || "",
        City: partnerForm.city || partnerData.city || "",
        State: partnerForm.state || partnerData.state || "",
        PostalCode: partnerForm.postalCode || partnerData.postalCode || "",
        Country: partnerForm.country || partnerData.country || "",
        Website: partnerForm.website || partnerData.website || "",
        Industry: partnerForm.industry || partnerData.industry || "",
        Renewal: renewalValue,
        MinDealValue: minDealValue,
        RegistrationDate: registrationDate,
        Notes: partnerForm.notes || partnerData.notes || "",
        ChangedBy: "admin@example.com",
      };

      const apiUrl = `https://localhost:7224/api/PartnerManagement/EditPartner/${partnerId}`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPartnerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      await response.json();
      showNotification("Partner updated successfully");
      setShowEditPartnerModal(false);

      // Refresh partner data
      const refreshResponse = await fetch(
        `https://localhost:7224/api/PartnerManagement/GetPartnerEditData/${partnerId}`
      );
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setPartnerData(refreshedData.partner || refreshedData);
      }
    } catch (error) {
      console.error("Error updating partner:", error);
      showNotification(`Failed to update partner: ${error.message}`, "danger");
    }
  };

  // Open edit modals with data
  const openEditContact = (contact) => {
    console.log("🖊️ Editing contact raw data:", contact);
    
    // Use the normalized contact data
    const normalizedContact = normalizeContact(contact);
    console.log("🖊️ Normalized contact for editing:", normalizedContact);
    
    setContactForm(normalizedContact);
    setShowEditContactModal(true);
  };

  const openAddContact = () => {
    setContactForm({
      contactName: "",
      contactRole: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      notes: ""
    });
    setShowAddContactModal(true);
  };

  // Enhanced TrainingID extraction for edit modal
  const openEditTraining = (training) => {
    console.log("🖊️ Editing training raw data:", training);
    
    const normalizedTraining = normalizeTraining(training);
    console.log("🖊️ Normalized training for editing:", normalizedTraining);
    
    // Additional debug to ensure TrainingID is captured
    if (!normalizedTraining.trainingID) {
      console.warn("⚠️ No TrainingID found in normalized training. Available keys:", Object.keys(training));
      // Try alternative ID extraction methods
      const alternativeId = training.training_ID || training.Training_ID || training.trainingId || training.TrainingId;
      if (alternativeId) {
        normalizedTraining.trainingID = alternativeId;
        console.log("🔄 Using alternative TrainingID:", alternativeId);
      }
    }
    
    setTrainingForm(normalizedTraining);
    setShowEditTrainingModal(true);
  };

  const openAddTraining = () => {
    setTrainingForm({
      trainingName: "",
      trainingType: "",
      completionDate: "",
      certIssuedTo: false,
      certificateUploaded: false
    });
    setShowAddTrainingModal(true);
  };

  const openEditOpportunity = (opportunity) => {
    console.log("🖊️ Editing opportunity raw data:", opportunity);
    
    const normalizedOpportunity = normalizeOpportunity(opportunity);
    console.log("🖊️ Normalized opportunity for editing:", normalizedOpportunity);
    
    setOpportunityForm(normalizedOpportunity);
    setShowEditOpportunityModal(true);
  };

  const openAddOpportunity = () => {
    setOpportunityForm({
      opportunityName: "",
      opportunityType: "",
      productName: "",
      serialNumber: "",
      fortiCareID: "",
      coTermQuoteID: "",
      tradeUpID: "",
      isSDWANOpportunity: false,
      isOperationalTechnologyOpportunity: "No",
      estimatedValue: 0,
      statusID: 1,
      dealRegOOT: false,
      isRenewalOver9999: false,
      fedDeal: false,
      tradeIn: false,
      dealType: "New",
      description: "",
      notes: "",
      changedBy: "admin@example.com"
    });
    setShowAddOpportunityModal(true);
  };

  const openEditLogin = (login) => {
    console.log("🖊️ Editing login raw data:", login);
    
    const normalizedLogin = normalizeLogin(login);
    console.log("🖊️ Normalized login for editing:", normalizedLogin);
    
    setLoginForm(normalizedLogin);
    setShowEditLoginModal(true);
  };

  const openAddLogin = () => {
    setLoginForm({
      username: "",
      password: "",
      loginURL: "",
    });
    setShowAddLoginModal(true);
  };

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div
        className="content-wrap d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div>Loading partner data...</div>
      </div>
    );
  }

  // Show error state if no partner data is available
  if (!partnerData) {
    return (
      <div
        className="content-wrap d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <div>Failed to load partner data.</div>
      </div>
    );
  }

  return (
    <div
      className="content-wrap"
      style={{ marginTop: "1%", alignItems: "center" }}
    >
      <Container fluid className="data-table-list">
        <Row>
          <Col md={12}>
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
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
                {/* Partner Tab - Content remains the same */}
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
                              <h4 className="card-title mb-2">
                                {partnerData.contactCompany?.companyName || "N/A"}
                              </h4>
                            </a>
                          )}
                          <div className="stat-text text-muted">
                            Contact Company
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card className="summary-card h-100">
                        <Card.Body>
                          <Row className="align-items-center h-100">
                            <Col xs={4}>
                              <img
                                src={
                                  partnerData &&
                                  partnerData.contactCompany &&
                                  partnerData.contactCompany.photoPath
                                    ? `/DesignImg/ContactCompanys/${partnerData.contactCompany.photoPath}`
                                    : "/DesignImg/ContactCompanys/dummy.png"
                                }
                                className="img-fluid rounded"
                                alt="Partner Logo"
                                style={{ maxHeight: "80px" }}
                              />
                            </Col>
                            <Col xs={8}>
                              <h4 className="card-title mb-1 text-center">
                                {partnerData.name || "N/A"}
                              </h4>
                              <div className="stat-text text-muted text-center">
                                Partner Name
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card className="summary-card h-100">
                        <Card.Body className="text-center d-flex flex-column justify-content-center">
                          <h4 className="card-title mb-2">
                            {partnerData.partnerShipType || "N/A"}
                          </h4>
                          <div className="stat-text text-muted">
                            Partnership Type
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Contact Info */}
                  <Card className="mb-4">
                    <Card.Body>
                      <div className="row align-items-center mb-4">
                        <div key="contact-info-title" className="col">
                          <h5 className="card-title mb-0">
                            Contact Information
                          </h5>
                        </div>
                        <div key="edit-partner-button" className="col-auto">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setPartnerForm({
                                name: partnerData.name || "",
                                email: partnerData.email || "",
                                phone: partnerData.phone || "",
                                contactCompanyID:
                                  partnerData.contactCompanyID ||
                                  partnerData.contactCompanyId ||
                                  "",
                                title: partnerData.title || "",
                                partnerShipType:
                                  partnerData.partnerShipType || "",
                                address: partnerData.address || "",
                                city: partnerData.city || "",
                                state: partnerData.state || "",
                                postalCode: partnerData.postalCode || "",
                                country: partnerData.country || "",
                                website: partnerData.website || "",
                                industry: partnerData.industry || "",
                                renewal:
                                  partnerData.renewal !== null &&
                                  partnerData.renewal !== undefined
                                    ? partnerData.renewal.toString()
                                    : "true",
                                minDealValue: partnerData.minDealValue || "",
                                registrationDate:
                                  partnerData.registrationDate || "",
                                notes: partnerData.notes || "",
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
                              <a
                                href={`mailto:${partnerData.email}`}
                                className="text-decoration-none"
                              >
                                {partnerData.email || "N/A"}
                              </a>
                            </div>
                          </div>
                          <div className="info-group mb-3">
                            <label className="text-muted small">Phone</label>
                            <div className="info-value">
                              {partnerData.phone || "N/A"}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-group">
                            <label className="text-muted small">Address</label>
                            <div className="info-value">
                              {partnerData.address ? (
                                <>
                                  <div>{partnerData.address}</div>
                                  <div>
                                    {partnerData.city}, {partnerData.state}{" "}
                                    {partnerData.postalCode}
                                  </div>
                                  <div>{partnerData.country}</div>
                                </>
                              ) : (
                                <div className="text-muted">
                                  No address provided
                                </div>
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
                                  <a
                                    href={partnerData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary"
                                  >
                                    {partnerData.website}
                                  </a>
                                )}
                              </td>
                              <td>{partnerData.industry || "N/A"}</td>
                              <td>{partnerData.renewal ? "Yes" : "No"}</td>
                              <td>
                                {partnerData.minDealValue
                                  ? `$${partnerData.minDealValue}`
                                  : "N/A"}
                              </td>
                              <td>{partnerData.registrationDate || "N/A"}</td>
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

                {/* Contact Tab - Content remains the same */}
                <Tab.Pane eventKey="contact" className="p-3">
                  <Row className="d-flex flex-wrap">
                    {contacts.length > 0 ? (
                      contacts.map((contact, index) => (
                        <Col md={4} key={contact.contactID || index} className="mb-3">
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
                                <h5 className="card-title text-dark mb-3">
                                  {contact.contactName || "No Name"}
                                </h5>
                              </div>

                              <div className="contact-info">
                                <div className="d-flex align-items-center mb-2">
                                  <span className="text-dark">
                                    {contact.contactRole || "No Role"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="text-dark">
                                    {contact.email || "No Email"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center mt-2">
                                  <small className="text-muted">
                                    ID: {contact.contactID ? contact.contactID : "Not available"}
                                  </small>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col md={12}>
                        <Card
                          className="empty-card d-flex justify-content-center align-items-center"
                          style={{ height: "150px" }}
                        >
                          <Card.Body className="text-center text-muted">
                            <p className="mt-2 text-dark">No Contacts Added</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}

                    <Col md={4} className="mb-3">
                      <Card
                        className="add-contact-card h-100"
                        style={{ cursor: "pointer" }}
                        onClick={openAddContact}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                          <i
                            className="bi bi-plus-circle text-primary"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          <p className="card-text mt-2 text-primary">
                            Add New Contact
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* Training Tab - Content remains the same */}
                <Tab.Pane eventKey="training" className="p-3">
                  <Row className="d-flex flex-wrap">
                    {trainings.length > 0 ? (
                      trainings.map((training) => (
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
                                <h5 className="card-title text-dark mb-3">
                                  {training.trainingName || "No Name"}
                                </h5>
                              </div>

                              <div className="training-info">
                                <div className="d-flex align-items-center mb-2">
                                  <span className="text-dark">
                                    {training.trainingType || "No Type"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="text-dark">
                                    {training.completionDate ? (
                                      new Date(
                                        training.completionDate
                                      ).toLocaleDateString()
                                    ) : (
                                      <span>No date set</span>
                                    )}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center mt-2">
                                  <small className="text-muted">
                                    Cert Issued: {training.certIssuedTo ? "Yes" : "No"} | 
                                    Uploaded: {training.certificateUploaded ? "Yes" : "No"}
                                  </small>
                                </div>
                                <div className="d-flex align-items-center mt-1">
                                  <small className="text-muted">
                                    ID: {training.trainingID ? training.trainingID : "Not available"}
                                  </small>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col md={12}>
                        <Card
                          className="empty-card d-flex justify-content-center align-items-center"
                          style={{ height: "150px" }}
                        >
                          <Card.Body className="text-center text-muted">
                            <Book className="fs-1" />
                            <p className="mt-2 text-dark">No Training Added</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}

                    <Col md={4} className="mb-3">
                      <Card
                        className="add-training-card h-100"
                        style={{ cursor: "pointer" }}
                        onClick={openAddTraining}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                          <i
                            className="bi bi-plus-circle text-primary"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          <p className="card-text mt-2 text-primary">
                            Add New Training
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* Opportunity Tab - Content remains the same */}
                <Tab.Pane eventKey="opportunity" className="p-3">
                  <Row className="d-flex flex-wrap">
                    {opportunities.length > 0 ? (
                      opportunities.map((opportunity) => (
                        <Col
                          md={4}
                          key={opportunity.opportunityID}
                          className="mb-3"
                        >
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
                                <h5 className="card-title text-dark mb-3">
                                  {opportunity.opportunityName || "No Name"}
                                </h5>
                              </div>

                              <div className="opportunity-info">
                                <div className="d-flex align-items-center mb-2">
                                  <span className="text-dark">
                                    {opportunity.productName || "No Product"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <span className="text-dark">
                                    {opportunity.opportunityType || "No Type"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center mt-2">
                                  <small className="text-muted">
                                    Value: ${opportunity.estimatedValue || 0} | Deal Type: {opportunity.dealType || "N/A"}
                                  </small>
                                </div>
                                <div className="d-flex align-items-center mt-1">
                                  <small className="text-muted">
                                    ID: {opportunity.opportunityID ? opportunity.opportunityID : "Not available"}
                                  </small>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col md={12}>
                        <Card
                          className="empty-card d-flex justify-content-center align-items-center"
                          style={{ height: "150px" }}
                        >
                          <Card.Body className="text-center text-muted">
                            <i className="bi bi-lightbulb fs-1"></i>
                            <p className="mt-2 text-dark">
                              No Opportunities Added
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}

                    <Col md={4} className="mb-3">
                      <Card
                        className="add-opportunity-card h-100"
                        style={{ cursor: "pointer" }}
                        onClick={openAddOpportunity}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                          <i
                            className="bi bi-plus-circle text-primary"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          <p className="card-text mt-2 text-primary">
                            Add New Opportunity
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab.Pane>

                {/* Logins Tab - Content remains the same */}
                <Tab.Pane eventKey="logins" className="p-3">
                  <Row className="d-flex flex-wrap">
                    {logins.length > 0 ? (
                      logins.map((login) => (
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
                                <h5 className="card-title text-dark mb-3">
                                  {login.username || "No Username"}
                                </h5>
                              </div>

                              <div className="login-info">
                                <div className="d-flex align-items-center mb-2">
                                  <span className="text-dark">
                                    URL: {login.loginURL || "No URL"}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center mt-1">
                                  <small className="text-muted">
                                    ID: {login.loginID ? login.loginID : "Not available"}
                                  </small>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col md={12}>
                        <Card
                          className="empty-card d-flex justify-content-center align-items-center"
                          style={{ height: "150px" }}
                        >
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
                        style={{ cursor: "pointer" }}
                        onClick={openAddLogin}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                          <i
                            className="bi bi-plus-circle text-primary"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          <p className="card-text mt-2 text-primary">
                            Add New Login
                          </p>
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

      {/* Add Contact Modal - Content remains the same */}
      <Modal
        show={showAddContactModal}
        onHide={() => {
          setShowAddContactModal(false);
          setContactForm({});
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Add New Contact</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65vh", overflowY: "auto" }}>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control type="text" disabled value={partnerData.name} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Contact Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactName"
                    placeholder="Enter Contact Name"
                    value={contactForm.contactName || ""}
                    onChange={handleContactChange}
                    required
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
                    value={contactForm.contactRole || ""}
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
                    value={contactForm.email || ""}
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
                    value={contactForm.phone || ""}
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
                    value={contactForm.address || ""}
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
                    value={contactForm.city || ""}
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
                    value={contactForm.state || ""}
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
                    value={contactForm.postalCode || ""}
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
                    value={contactForm.country || ""}
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
                    value={contactForm.notes || ""}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleAddContact}>
            Create Contact
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowAddContactModal(false);
              setContactForm({});
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Contact Modal - Content remains the same */}
      <Modal
        show={showEditContactModal}
        onHide={() => {
          setShowEditContactModal(false);
          setContactForm({});
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Edit Contact </b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65vh", overflowY: "auto" }}>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control type="text" disabled value={partnerData.name} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Contact Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactName"
                    placeholder="Enter Contact Name"
                    value={contactForm.contactName || ""}
                    onChange={handleContactChange}
                    required
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
                    value={contactForm.contactRole || ""}
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
                    value={contactForm.email || ""}
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
                    value={contactForm.phone || ""}
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
                    value={contactForm.address || ""}
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
                    value={contactForm.city || ""}
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
                    value={contactForm.state || ""}
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
                    placeholder="Postal Code"
                    value={contactForm.postalCode || ""}
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
                    value={contactForm.country || ""}
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
                    value={contactForm.notes || ""}
                    onChange={handleContactChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={handleEditContact}
            disabled={!contactForm.contactID}
          >
            {contactForm.contactID ? "Update Contact" : "Missing Contact ID"}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowEditContactModal(false);
              setContactForm({});
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Training Modal - Content remains the same */}
      <Modal
        show={showAddTrainingModal}
        onHide={() => {
          setShowAddTrainingModal(false);
          setTrainingForm({});
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Training</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65vh", overflowY: "auto" }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control type="text" disabled value={partnerData.name} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Training Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="trainingName"
                    placeholder="Enter the Training Name"
                    value={trainingForm.trainingName || ""}
                    onChange={handleTrainingChange}
                    required
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
                    value={trainingForm.trainingType || ""}
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
                    value={trainingForm.completionDate || ""}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="certIssuedTo"
                    label="Certificate Issued"
                    checked={trainingForm.certIssuedTo || false}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="certificateUploaded"
                    label="Certificate Uploaded"
                    checked={trainingForm.certificateUploaded || false}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={handleAddTraining}
            disabled={!trainingForm.trainingName}
          >
            Create Training
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowAddTrainingModal(false);
              setTrainingForm({});
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Training Modal - TrainingID field hidden as requested */}
      <Modal
        show={showEditTrainingModal}
        onHide={() => {
          setShowEditTrainingModal(false);
          setTrainingForm({});
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Training</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65vh", overflowY: "auto" }}>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control type="text" disabled value={partnerData.name} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Training Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="trainingName"
                    placeholder="Enter the Training Name"
                    value={trainingForm.trainingName || ""}
                    onChange={handleTrainingChange}
                    required
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
                    value={trainingForm.trainingType || ""}
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
                    value={trainingForm.completionDate || ""}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="certIssuedTo"
                    label="Certificate Issued"
                    checked={trainingForm.certIssuedTo || false}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="certificateUploaded"
                    label="Certificate Uploaded"
                    checked={trainingForm.certificateUploaded || false}
                    onChange={handleTrainingChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={handleEditTraining}
            disabled={!trainingForm.trainingName || !trainingForm.trainingID}
          >
            {trainingForm.trainingID ? "Update Training" : "Missing Training ID"}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowEditTrainingModal(false);
              setTrainingForm({});
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Opportunity Modal - UPDATED with all required fields */}
      <Modal
        show={showAddOpportunityModal}
        onHide={() => {
          setShowAddOpportunityModal(false);
          setOpportunityForm({});
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Add New Opportunity</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65vh", overflowY: "auto" }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control type="text" disabled value={partnerData.name} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Opportunity Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="opportunityName"
                    placeholder="Enter Opportunity Name"
                    value={opportunityForm.opportunityName || ""}
                    onChange={handleOpportunityChange}
                    required
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
                    value={opportunityForm.productName || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Opportunity Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="opportunityType"
                    placeholder="Enter Opportunity Type"
                    value={opportunityForm.opportunityType || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Serial Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="serialNumber"
                    placeholder="Enter Serial Number"
                    value={opportunityForm.serialNumber || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>FortiCare ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="fortiCareID"
                    placeholder="Enter FortiCare ID"
                    value={opportunityForm.fortiCareID || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Co-Term Quote ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="coTermQuoteID"
                    placeholder="Enter Co-Term Quote ID"
                    value={opportunityForm.coTermQuoteID || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trade-Up ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="tradeUpID"
                    placeholder="Enter Trade-Up ID"
                    value={opportunityForm.tradeUpID || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Deal Type *</Form.Label>
                  <Form.Select
                    name="dealType"
                    value={opportunityForm.dealType || "New"}
                    onChange={handleOpportunityChange}
                    required
                  >
                    <option value="New">New</option>
                    <option value="Renewal">Renewal</option>
                    <option value="Upgrade">Upgrade</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Operational Technology Opportunity *</Form.Label>
                  <Form.Select
                    name="isOperationalTechnologyOpportunity"
                    value={opportunityForm.isOperationalTechnologyOpportunity || "No"}
                    onChange={handleOpportunityChange}
                    required
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Estimated Value</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimatedValue"
                    placeholder="Enter Estimated Value"
                    value={opportunityForm.estimatedValue || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="statusID"
                    placeholder="Enter Status ID"
                    value={opportunityForm.statusID || 1}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    placeholder="Enter Description"
                    value={opportunityForm.description || ""}
                    onChange={handleOpportunityChange}
                    required
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
                    rows={2}
                    name="notes"
                    placeholder="Enter Notes"
                    value={opportunityForm.notes || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isSDWANOpportunity"
                    label="SD-WAN Opportunity"
                    checked={opportunityForm.isSDWANOpportunity || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="dealRegOOT"
                    label="Deal Reg OOT"
                    checked={opportunityForm.dealRegOOT || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isRenewalOver9999"
                    label="Renewal Over $9999"
                    checked={opportunityForm.isRenewalOver9999 || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="fedDeal"
                    label="Federal Deal"
                    checked={opportunityForm.fedDeal || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="tradeIn"
                    label="Trade-In"
                    checked={opportunityForm.tradeIn || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={handleAddOpportunity}
            disabled={!opportunityForm.opportunityName}
          >
            Create Opportunity
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowAddOpportunityModal(false);
              setOpportunityForm({});
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Opportunity Modal - UPDATED with all required fields */}
      <Modal
        show={showEditOpportunityModal}
        onHide={() => {
          setShowEditOpportunityModal(false);
          setOpportunityForm({});
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Edit Opportunity</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65vh", overflowY: "auto" }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control type="text" disabled value={partnerData.name} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Opportunity Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="opportunityName"
                    placeholder="Enter Opportunity Name"
                    value={opportunityForm.opportunityName || ""}
                    onChange={handleOpportunityChange}
                    required
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
                    value={opportunityForm.productName || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Opportunity Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="opportunityType"
                    placeholder="Enter Opportunity Type"
                    value={opportunityForm.opportunityType || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Serial Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="serialNumber"
                    placeholder="Enter Serial Number"
                    value={opportunityForm.serialNumber || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>FortiCare ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="fortiCareID"
                    placeholder="Enter FortiCare ID"
                    value={opportunityForm.fortiCareID || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Co-Term Quote ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="coTermQuoteID"
                    placeholder="Enter Co-Term Quote ID"
                    value={opportunityForm.coTermQuoteID || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trade-Up ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="tradeUpID"
                    placeholder="Enter Trade-Up ID"
                    value={opportunityForm.tradeUpID || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Deal Type *</Form.Label>
                  <Form.Select
                    name="dealType"
                    value={opportunityForm.dealType || "New"}
                    onChange={handleOpportunityChange}
                    required
                  >
                    <option value="New">New</option>
                    <option value="Renewal">Renewal</option>
                    <option value="Upgrade">Upgrade</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Operational Technology Opportunity *</Form.Label>
                  <Form.Select
                    name="isOperationalTechnologyOpportunity"
                    value={opportunityForm.isOperationalTechnologyOpportunity || "No"}
                    onChange={handleOpportunityChange}
                    required
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Estimated Value</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimatedValue"
                    placeholder="Enter Estimated Value"
                    value={opportunityForm.estimatedValue || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="statusID"
                    placeholder="Enter Status ID"
                    value={opportunityForm.statusID || 1}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    placeholder="Enter Description"
                    value={opportunityForm.description || ""}
                    onChange={handleOpportunityChange}
                    required
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
                    rows={2}
                    name="notes"
                    placeholder="Enter Notes"
                    value={opportunityForm.notes || ""}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isSDWANOpportunity"
                    label="SD-WAN Opportunity"
                    checked={opportunityForm.isSDWANOpportunity || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="dealRegOOT"
                    label="Deal Reg OOT"
                    checked={opportunityForm.dealRegOOT || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="isRenewalOver9999"
                    label="Renewal Over $9999"
                    checked={opportunityForm.isRenewalOver9999 || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="fedDeal"
                    label="Federal Deal"
                    checked={opportunityForm.fedDeal || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    name="tradeIn"
                    label="Trade-In"
                    checked={opportunityForm.tradeIn || false}
                    onChange={handleOpportunityChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={handleEditOpportunity}
            disabled={!opportunityForm.opportunityName || !opportunityForm.opportunityID}
          >
            {opportunityForm.opportunityID ? "Update Opportunity" : "Missing Opportunity ID"}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowEditOpportunityModal(false);
              setOpportunityForm({});
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Login Modal - UPDATED based on backend model */}
      <Modal
        show={showAddLoginModal}
        onHide={() => {
          setShowAddLoginModal(false);
          setLoginForm({});
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Add New Login</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65vh", overflowY: "auto" }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control type="text" disabled value={partnerData.name} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username *</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={loginForm.username || ""}
                    onChange={handleLoginChange}
                    required
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
                    value={loginForm.password || ""}
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
                    value={loginForm.loginURL || ""}
                    onChange={handleLoginChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={handleAddLogin}
            disabled={!loginForm.username}
          >
            Create Login
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowAddLoginModal(false);
              setLoginForm({});
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Login Modal - UPDATED based on backend model */}
      <Modal
        show={showEditLoginModal}
        onHide={() => {
          setShowEditLoginModal(false);
          setLoginForm({});
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Edit Login</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "65vh", overflowY: "auto" }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Partner</Form.Label>
                  <Form.Control type="text" disabled value={partnerData.name} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username *</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={loginForm.username || ""}
                    onChange={handleLoginChange}
                    required
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
                    value={loginForm.password || ""}
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
                    value={loginForm.loginURL || ""}
                    onChange={handleLoginChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={handleEditLogin}
            disabled={!loginForm.username || !loginForm.loginID}
          >
            {loginForm.loginID ? "Update Login" : "Missing Login ID"}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowEditLoginModal(false);
              setLoginForm({});
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Partner Modal - Content remains the same */}
      <Modal
        show={showEditPartnerModal}
        onHide={() => setShowEditPartnerModal(false)}
        size="lg"
      >
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
                    value={
                      partnerForm.name ||
                      (partnerData ? partnerData.name : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.email ||
                      (partnerData ? partnerData.email : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.phone ||
                      (partnerData ? partnerData.phone : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.contactCompanyID ||
                      partnerData.contactCompanyID ||
                      ""
                    }
                    onChange={handlePartnerChange}
                  >
                    <option value="">Select Contact Company</option>
                    {contactCompanies.map((company) => (
                      <option
                        key={company.contactCompanyId}
                        value={company.contactCompanyId}
                      >
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
                    value={
                      partnerForm.title ||
                      (partnerData ? partnerData.title : "") ||
                      ""
                    }
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Partner Type</Form.Label>
                  <Form.Select
                    name="partnerShipType"
                    value={
                      partnerForm.partnerShipType ||
                      (partnerData ? partnerData.partnerShipType : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.address ||
                      (partnerData ? partnerData.address : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.city ||
                      (partnerData ? partnerData.city : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.state ||
                      (partnerData ? partnerData.state : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.postalCode ||
                      (partnerData ? partnerData.postalCode : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.country ||
                      (partnerData ? partnerData.country : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.website ||
                      (partnerData ? partnerData.website : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.industry ||
                      (partnerData ? partnerData.industry : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.renewal ??
                      (partnerData?.renewal !== null &&
                      partnerData?.renewal !== undefined
                        ? partnerData.renewal.toString()
                        : "true")
                    }
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
                    value={
                      partnerForm.minDealValue ||
                      (partnerData ? partnerData.minDealValue : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.registrationDate ||
                      (partnerData ? partnerData.registrationDate : "") ||
                      ""
                    }
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
                    value={
                      partnerForm.notes ||
                      (partnerData ? partnerData.notes : "") ||
                      ""
                    }
                    onChange={handlePartnerChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handlePartnerEditSubmit}>
            Save
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowEditPartnerModal(false)}
          >
            Close
          </Button>
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
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default EditPartner;