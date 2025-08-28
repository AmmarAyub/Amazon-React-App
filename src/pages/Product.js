import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  Button,
  Container,
} from "react-bootstrap";
import "./Products.css";

const Product = ({ sidebarCollapsed }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    unitPrice: "",
    status: "1",
    itemCode: "",
    isTrackable: false,
    hstryUserId: "",
  });

  // Update form state
  const [updateFormData, setUpdateFormData] = useState({
    productId: "",
    productName: "",
    unitPrice: "",
    status: "1",
    itemCode: "",
    isTrackable: false,
    hstryUserId: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://localhost:7224/api/Products/Productslist"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchProductDetails = async (productId) => {
    setModalLoading(true);
    setModalError(null);

    try {
      const response = await fetch(
        `https://localhost:7224/api/Products/GetProductById?id=${productId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const productData = await response.json();
      setSelectedProduct(productData);
    } catch (err) {
      setModalError(err.message);
      console.error("Failed to fetch product details:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(false);

    try {
      // Prepare the data for API
      const productData = {
        productName: formData.productName,
        unitPrice: formData.unitPrice ? parseFloat(formData.unitPrice) : null,
        status: parseInt(formData.status),
        itemCode: formData.itemCode || null,
        isTrackable: formData.isTrackable,
        hstryUserId: formData.hstryUserId,
      };

      const response = await fetch(
        "https://localhost:7224/api/Products/CreateProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setCreateSuccess(true);

      // Reset form
      setFormData({
        productName: "",
        unitPrice: "",
        status: "1",
        itemCode: "",
        isTrackable: false,
        hstryUserId: "",
      });

      // Refresh products list after a short delay
      setTimeout(() => {
        fetchProducts();
        setShowCreateModal(false);
        setCreateSuccess(false);
      }, 2000);
    } catch (err) {
      setCreateError(err.message);
      console.error("Failed to create product:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    debugger;
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      // Prepare the data for API
      const productData = {
        productId: parseInt(updateFormData.productId),
        productName: updateFormData.productName,
        unitPrice: updateFormData.unitPrice
          ? parseFloat(updateFormData.unitPrice)
          : null,
        status: parseInt(updateFormData.status),
        itemCode: updateFormData.itemCode || null,
        isTrackable: updateFormData.isTrackable,
        hstryUserId: updateFormData.hstryUserId,
      };
      debugger;
      const response = await fetch(
        "https://localhost:7224/api/Products/UpdateProduct?id=" +
          productData.productId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );
      debugger;
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setUpdateSuccess(true);

      // Refresh products list after a short delay
      setTimeout(() => {
        fetchProducts();
        setShowUpdateModal(false);
        setUpdateSuccess(false);
      }, 2000);
    } catch (err) {
      setUpdateError(err.message);
      console.error("Failed to update product:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleViewDetails = (productId) => {
    fetchProductDetails(productId);
  };

  const handleEditProduct = (product, productId) => {
    setUpdateFormData({
      productId: product.productId,
      productName: product.productName || "",
      unitPrice: product.unitPrice || "",
      status: product.status?.toString() || "1",
      itemCode: product.itemCode || "",
      isTrackable: product.isTrackable || false,
      hstryUserId: product.hstryUserId || "",
    });
    setShowUpdateModal(true);
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalError(null);
  };

  const handleCreateButtonClick = () => {
    setShowCreateModal(true);
    setCreateError(null);
    setCreateSuccess(false);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setFormData({
      productName: "",
      unitPrice: "",
      status: "1",
      itemCode: "",
      isTrackable: false,
      hstryUserId: "",
    });
    setCreateError(null);
    setCreateSuccess(false);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdateFormData({
      productId: "",
      productName: "",
      unitPrice: "",
      status: "1",
      itemCode: "",
      isTrackable: false,
      hstryUserId: "",
    });
    setUpdateError(null);
    setUpdateSuccess(false);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = products.filter(
      (product) =>
        (product.productName &&
          product.productName.toLowerCase().includes(term)) ||
        (product.itemCode && product.itemCode.toLowerCase().includes(term)) ||
        (product.productId && product.productId.toString().includes(term)) ||
        (product.unitPrice && product.unitPrice.toString().includes(term))
    );

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "Price not available";
    }
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const extractFeatures = (productName) => {
    if (!productName) return ["No product name available"];

    const features = [];
    if (productName.includes("USB-C")) features.push("USB-C Connectivity");
    if (
      productName.includes("Dual Display") ||
      productName.includes("Dual display")
    )
      features.push("Dual Display Support");
    if (productName.includes("4K")) features.push("4K Resolution");
    if (productName.includes("100W")) features.push("100W Power Delivery");
    if (
      productName.includes("Travel Dock") ||
      productName.includes("Travel dock") ||
      productName.includes("Mobile")
    )
      features.push("Portable Design");

    const portMatch = productName.match(/(\d+)[-\s]*(?:Ports|ports|in|Port)/);
    if (portMatch) {
      features.push(`${portMatch[1]}-Port Expansion`);
    } else if (productName.includes("Ports") || productName.includes("ports")) {
      features.push("Multi-Port Expansion");
    }

    if (features.length === 0) {
      features.push("Check product description for features");
    }

    return features;
  };

  const getStatusText = (status) => {
    if (status === null || status === undefined) return "Unknown";

    const statusMap = {
      1: "Draft",
      2: "Pending",
      3: "Approved",
      4: "Discontinued",
      5: "Available",
      6: "Out of Stock",
    };

    return statusMap[status] || `Status Code: ${status}`;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      1: "#95a5a6",
      2: "#f39c12",
      3: "#27ae60",
      4: "#e74c3c",
      5: "#2ecc71",
      6: "#e67e22",
    };
    return statusColors[status] || "#95a5a6";
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="products-container">
        <h2>Product Catalog</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <h2>Product Catalog</h2>
        <div className="error">
          <div className="error-icon">⚠️</div>
          <p>Error: {error}</p>
          <p className="info-note">
            Unable to connect to the API. Please check if the server is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`products-container ${
        sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
      }`}
    >
      <div className="products-header">
        <h2>PRODUCT CATALOG</h2>
        <div className="header-controls">
          <button
            className="btn-create-product"
            onClick={handleCreateButtonClick}
          >
            + Create Product
          </button>
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button onClick={clearSearch} className="clear-search">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          {searchTerm ? (
            <>
              <div className="no-products-icon">🔍</div>
              <h3>No products found</h3>
              <p>
                No results for "<strong>{searchTerm}</strong>"
              </p>
              <button onClick={clearSearch} className="clear-search-button">
                Clear search
              </button>
            </>
          ) : (
            <>
              <div className="no-products-icon">📦</div>
              <h3>No products available</h3>
              <p>There are currently no products in the catalog.</p>
              <button
                className="btn-create-product"
                onClick={handleCreateButtonClick}
              >
                + Create Your First Product
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.productId} className="product-card">
              <div className="product-header">
                <div
                  className="product-badge"
                  style={{
                    backgroundColor: getStatusColor(product.status),
                  }}
                >
                  {getStatusText(product.status)}
                </div>
                <h3 className="product-name">
                  {product.productName || "Unnamed Product"}
                </h3>
                <div className="product-price">
                  {formatPrice(product.unitPrice)}
                </div>
              </div>

              <div className="product-details">
                <div className="detail-item">
                  <span className="detail-label">Product ID</span>
                  <span className="detail-value">
                    {product.productId || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Item Code</span>
                  <span className="detail-value code">
                    {product.itemCode || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tracking</span>
                  <span className="detail-value">
                    {product.isTrackable ? "🟢 Enabled" : "🔴 Disabled"}
                  </span>
                </div>
              </div>

              <div className="product-features">
                <h4>Key Features</h4>
                <ul>
                  {extractFeatures(product.productName)
                    .slice(0, 2)
                    .map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                </ul>
                {extractFeatures(product.productName).length > 2 && (
                  <div className="more-features">
                    +{extractFeatures(product.productName).length - 2} more
                    features
                  </div>
                )}
              </div>

              <div className="product-actions">
                <button
                  className="btn-view-details"
                  onClick={() => handleViewDetails(product.productId)}
                >
                  View Details
                </button>
                <button
                  className="btn-update"
                  onClick={() => handleEditProduct(product, product.productId)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h2>PRODUCT INFORMATION</h2>
                <hr />
                <div className="modal-price">
                  {formatPrice(selectedProduct.unitPrice)}
                </div>
                <div className="badge-container">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(selectedProduct.status),
                    }}
                  >
                    {getStatusText(selectedProduct.status)}
                  </span>
                </div>
              </div>
            </div>

            {modalLoading ? (
              <div className="modal-loading">
                <div className="loading-spinner"></div>
                <p>Loading product details...</p>
              </div>
            ) : modalError ? (
              <div className="modal-error">
                <div className="error-icon">⚠️</div>
                <h3>Unable to Load Details</h3>
                <p>{modalError}</p>
                <button
                  className="btn-retry"
                  onClick={() => fetchProductDetails(selectedProduct.productId)}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="modal-body">
                <div className="modal-section">
                  <div className="info-grid">
                    <div className="info-item full-width">
                      <span className="info-label">PRODUCT NAME</span>
                      <span className="info-value">
                        {selectedProduct.productName || "N/A"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">PRODUCT ID</span>
                      <span className="info-value">
                        {selectedProduct.productId || "N/A"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">ITEM CODE</span>
                      <span className="info-value code">
                        {selectedProduct.itemCode || "N/A"}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">INVENTORY TRACKING</span>
                      <span className="info-value">
                        {selectedProduct.isTrackable ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-title">Metadata</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">LAST UPDATED</span>
                      <span className="info-value">
                        {formatDate(selectedProduct.hstryDateTime)}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">UPDATED BY</span>
                      <span className="info-value">
                        {selectedProduct.hstryUserId || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-title">Features</h3>
                  <div className="features-list">
                    {extractFeatures(selectedProduct.productName).map(
                      (feature, index) => (
                        <div key={index} className="feature-item">
                          <span className="feature-icon">✓</span>
                          {feature}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* React Bootstrap Create Product Modal */}
      <Modal
        show={showCreateModal}
        onHide={closeCreateModal}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title as="h2" className="fw-bold">
            CREATE NEW PRODUCT
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleCreateProduct}>
          <Modal.Body className="pt-0">
            {createSuccess ? (
              <Container className="text-center py-4">
                <div className="text-success mb-3" style={{ fontSize: "3rem" }}>
                  ✓
                </div>
                <h3 className="text-success mb-2">
                  Product Created Successfully!
                </h3>
                <p className="text-muted">
                  Your new product has been added to the catalog.
                </p>
              </Container>
            ) : (
              <>
                {createError && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <span className="me-2" style={{ fontSize: "1.2rem" }}>
                      ⚠️
                    </span>
                    <span>{createError}</span>
                  </Alert>
                )}

                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group controlId="productName">
                      <Form.Label>Product Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter product name"
                        disabled={createLoading}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="unitPrice">
                      <Form.Label>Unit Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled={createLoading}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="status">
                      <Form.Label>Status *</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        disabled={createLoading}
                      >
                        <option value={1}>Draft</option>
                        <option value={2}>Pending</option>
                        <option value={3}>Approved</option>
                        <option value={4}>Discontinued</option>
                        <option value={5}>Available</option>
                        <option value={6}>Out of Stock</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="itemCode">
                      <Form.Label>Item Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="itemCode"
                        value={formData.itemCode}
                        onChange={handleInputChange}
                        placeholder="Enter item code"
                        disabled={createLoading}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="hstryUserId">
                      <Form.Label>User ID *</Form.Label>
                      <Form.Control
                        type="text"
                        name="hstryUserId"
                        value={formData.hstryUserId}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your user ID"
                        disabled={createLoading}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Check
                      type="checkbox"
                      id="isTrackable"
                      name="isTrackable"
                      label="Enable Inventory Tracking"
                      checked={formData.isTrackable}
                      onChange={handleInputChange}
                      disabled={createLoading}
                      className="mt-2"
                    />
                  </Col>
                </Row>
              </>
            )}
          </Modal.Body>

          <Modal.Footer className="border-top-0">
            {!createSuccess && (
              <Button
                variant="outline-secondary"
                onClick={closeCreateModal}
                disabled={createLoading}
              >
                Cancel
              </Button>
            )}
            {createSuccess ? (
              <Button variant="primary" onClick={closeCreateModal}>
                Close
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={createLoading}
                className="d-flex align-items-center gap-2"
              >
                {createLoading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    Creating...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>

      {/* React Bootstrap Update Product Modal */}
      <Modal
        show={showUpdateModal}
        onHide={closeUpdateModal}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title as="h2" className="fw-bold">
            UPDATE PRODUCT
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleUpdateProduct}>
          <Modal.Body className="pt-0">
            {updateSuccess ? (
              <Container className="text-center py-4">
                <div className="text-success mb-3" style={{ fontSize: "3rem" }}>
                  ✓
                </div>
                <h3 className="text-success mb-2">
                  Product Updated Successfully!
                </h3>
                <p className="text-muted">
                  The product has been updated in the catalog.
                </p>
              </Container>
            ) : (
              <>
                {updateError && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <span className="me-2" style={{ fontSize: "1.2rem" }}>
                      ⚠️
                    </span>
                    <span>{updateError}</span>
                  </Alert>
                )}

                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group controlId="updateProductName">
                      <Form.Label>Product Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="productName"
                        value={updateFormData.productName}
                        onChange={handleUpdateInputChange}
                        required
                        placeholder="Enter product name"
                        disabled={updateLoading}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="updateUnitPrice">
                      <Form.Label>Unit Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        name="unitPrice"
                        value={updateFormData.unitPrice}
                        onChange={handleUpdateInputChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled={updateLoading}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="updateStatus">
                      <Form.Label>Status *</Form.Label>
                      <Form.Select
                        name="status"
                        value={updateFormData.status}
                        onChange={handleUpdateInputChange}
                        required
                        disabled={updateLoading}
                      >
                        <option value={1}>Draft</option>
                        <option value={2}>Pending</option>
                        <option value={3}>Approved</option>
                        <option value={4}>Discontinued</option>
                        <option value={5}>Available</option>
                        <option value={6}>Out of Stock</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="updateItemCode">
                      <Form.Label>Item Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="itemCode"
                        value={updateFormData.itemCode}
                        onChange={handleUpdateInputChange}
                        placeholder="Enter item code"
                        disabled={updateLoading}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="updateHstryUserId">
                      <Form.Label>User ID *</Form.Label>
                      <Form.Control
                        type="text"
                        name="hstryUserId"
                        value={updateFormData.hstryUserId}
                        onChange={handleUpdateInputChange}
                        required
                        placeholder="Enter your user ID"
                        disabled={updateLoading}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Check
                      type="checkbox"
                      id="updateIsTrackable"
                      name="isTrackable"
                      label="Enable Inventory Tracking"
                      checked={updateFormData.isTrackable}
                      onChange={handleUpdateInputChange}
                      disabled={updateLoading}
                      className="mt-2"
                    />
                  </Col>
                </Row>
              </>
            )}
          </Modal.Body>

          <Modal.Footer className="border-top-0">
            {!updateSuccess && (
              <Button
                variant="outline-secondary"
                onClick={closeUpdateModal}
                disabled={updateLoading}
              >
                Cancel
              </Button>
            )}
            {updateSuccess ? (
              <Button variant="primary" onClick={closeUpdateModal}>
                Close
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={updateLoading}
                className="d-flex align-items-center gap-2"
              >
                {updateLoading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
