import React, { useState, useEffect } from "react";
import "./Products.css";

const Product = (sidebarCollapsed) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
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

    fetchProducts();
  }, []);

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

  const handleViewDetails = (productId) => {
    fetchProductDetails(productId);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalError(null);
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
      </div>

      <div className="search-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products by name, item code, ID, or price..."
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
        <div className="search-results-info">
          <span className="results-count">{filteredProducts.length}</span> of{" "}
          <span className="total-count">{products.length}</span> products
          {searchTerm && (
            <span className="search-term"> matching "{searchTerm}"</span>
          )}
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
                    .slice(0, 2) // Limit to maximum 2 features
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
    </div>
  );
};

export default Product;
