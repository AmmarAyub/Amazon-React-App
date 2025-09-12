import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Pagination,
  Row,
  Col,
  Button
} from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaPlus } from "react-icons/fa";
import { Link,useNavigate  } from "react-router-dom";
import "./Partners.css";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

   const navigate = useNavigate();

const handleAddPartner = () => {
  navigate('/partnerCreate');
};

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(
          "https://localhost:7224/api/PartnerManagement/Partners"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Debug: Check the structure of the response
        console.log("API Response:", data);

        // Handle different possible response structures
        let partnersData = [];

        if (Array.isArray(data)) {
          // If the response is directly an array
          partnersData = data;
        } else if (data && data.$values && Array.isArray(data.$values)) {
          // If the response has a $values property containing the array
          partnersData = data.$values;
        } else if (data && typeof data === "object") {
          // If it's a single object, wrap it in an array
          partnersData = [data];
        }

        setPartners(partnersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon for column
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ms-1" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="ms-1" />
    ) : (
      <FaSortDown className="ms-1" />
    );
  };

  // Filter and sort data
  const processedPartners = useMemo(() => {
    // Ensure we're working with an array
    let filteredPartners = Array.isArray(partners) ? [...partners] : [];

    // Apply search filter
    if (searchTerm) {
      filteredPartners = filteredPartners.filter((partner) => {
        // Check all properties including nested ones
        const searchableValues = [
          partner.Name,
          partner.PartnerShipType,
          partner.Phone,
          partner.Industry,
          partner.RegistrationDate,
          partner.Email,
          partner.Title,
          partner.Address,
          partner.City,
          partner.State,
          partner.Country,
          partner.Website,
          // Check nested contact company if exists
          partner.ContactCompany ? partner.ContactCompany.CompanyName : "",
        ];

        return searchableValues.some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Apply sorting
    if (sortConfig.key && filteredPartners.length > 0) {
      filteredPartners.sort((a, b) => {
        let aValue = a[sortConfig.key] || "";
        let bValue = b[sortConfig.key] || "";

        // Handle date sorting
        if (sortConfig.key === "RegistrationDate") {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        } else {
          // Convert to string for consistent comparison
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredPartners;
  }, [partners, searchTerm, sortConfig]);

  // Calculate pagination - ensure we're working with an array
  const partnersArray = Array.isArray(processedPartners)
    ? processedPartners
    : [];
  const totalPages = Math.ceil(partnersArray.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = partnersArray.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm]);

  // Pagination items
  const paginationItems = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let number = startPage; number <= endPage; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Error loading partners: {error}</Alert>
      </Container>
    );
  }

  return (
    <div className="content-wrap">
      <Container fluid>
        {/* Header */}
        <Row>
          <Col>
            <h2 className="text-center fw-bold mb-4">PARTNERS LIST</h2>
          </Col>
        </Row>

        {/* Actions Bar */}
        <Row className="mb-3 align-items-center">
          <Col md={6}>
             <Button 
        variant="success" 
        onClick={handleAddPartner}
        className="btn btn-success"
      >
        <FaPlus className="me-2" />
        Add Partner
      </Button>
          </Col>
        </Row>

        {/* Table Info */}
        <Row className="mb-3">
          <Col>
            <div className="d-flex align-items-center">
              <span className="me-2">Show</span>
              <Form.Select
                style={{ width: "80px" }}
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                size="sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Form.Select>
              <span className="ms-2">entries</span>
            </div>
          </Col>
          <Col md={3}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* DataTable */}
        <div className="table-responsive">
          <Table striped hover className="partners-table">
            <thead className="table-header">
              <tr>
                <th
                  onClick={() => handleSort("Name")}
                  className="sortable-header"
                >
                  Name {getSortIcon("Name")}
                </th>
                <th
                  onClick={() => handleSort("PartnerShipType")}
                  className="sortable-header"
                >
                  Type {getSortIcon("PartnerShipType")}
                </th>
                <th
                  onClick={() => handleSort("Phone")}
                  className="sortable-header"
                >
                  Phone {getSortIcon("Phone")}
                </th>
                <th
                  onClick={() => handleSort("Industry")}
                  className="sortable-header"
                >
                  Industry {getSortIcon("Industry")}
                </th>
                <th
                  onClick={() => handleSort("Email")}
                  className="sortable-header"
                >
                  Email {getSortIcon("Email")}
                </th>
                <th
                  onClick={() => handleSort("RegistrationDate")}
                  className="sortable-header"
                >
                  Registration Date {getSortIcon("RegistrationDate")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((partner) => {
                  // Format registration date
                  const formattedDate = partner.RegistrationDate
                    ? new Date(partner.RegistrationDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "";

                  return (
                    <tr key={partner.PartnerId} className="table-row">
                      <td>
                        <Link
                          to={`/PartnerManagement/EditPartner/${partner.PartnerId}`}
                          className="table-link"
                        >
                          {partner.Name || "N/A"}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/PartnerManagement/EditPartner/${partner.PartnerId}`}
                          className="table-link"
                        >
                          {partner.PartnerShipType || "N/A"}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/PartnerManagement/EditPartner/${partner.PartnerId}`}
                          className="table-link"
                        >
                          {partner.Phone || "N/A"}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/PartnerManagement/EditPartner/${partner.PartnerId}`}
                          className="table-link"
                        >
                          {partner.Industry || "N/A"}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/PartnerManagement/EditPartner/${partner.PartnerId}`}
                          className="table-link"
                        >
                          {partner.Email || "N/A"}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to={`/PartnerManagement/EditPartner/${partner.PartnerId}`}
                          className="table-link"
                        >
                          {formattedDate}
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="text-muted">
                      {searchTerm
                        ? "No matching partners found"
                        : "No partners available"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {partnersArray.length > 0 && totalPages > 1 && (
          <Row className="mt-3">
            <Col className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                {/* <Col> */}
                <span className="text-muted">
                  Showing {partnersArray.length > 0 ? startIndex + 1 : 0} to{" "}
                  {Math.min(startIndex + itemsPerPage, partnersArray.length)} of{" "}
                  {partnersArray.length} entries
                  {searchTerm && ` (filtered from ${partners.length} total)`}
                </span>
                {/* </Col> */}
                {/* Page {currentPage} of {totalPages} */}
              </div>
              <Pagination className="mb-0">
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {paginationItems}
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Partners;
