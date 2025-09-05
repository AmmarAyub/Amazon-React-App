import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  ProgressBar,
  Tab,
  Tabs,
  Spinner,
  Alert,
  ButtonGroup,
  Button,
  Tooltip,
  OverlayTrigger,
  Badge,
  Form,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import {
  CurrencyDollar,
  Cart,
  Person,
  Envelope,
  ShieldShaded,
  BoxArrowInRight,
  GraphUp,
  GraphDown,
  Search,
} from "react-bootstrap-icons";
import authService from "../services/authService";
import { format, parseISO } from "date-fns";
import { FaTruck } from "react-icons/fa";

const Dashboard = () => {
  const user = authService.getCurrentUser();

  // Dashboard Overview Tab States
  const [orderStats, setOrderStats] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalProfit: 0,
    totalLoss: 0,
    netProfit: 0,
    totalOrders: 0,
    shippedOrders: 0,
    pendingOrders: 0,
    profitChange: 0,
    orderChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState("OrderCounts");
  const [order, setOrder] = useState("desc");

  // Order Statistics Table Pagination & Filter
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");

  // Amazon Orders Tab States
  const [tabValue, setTabValue] = useState("dashboard");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [amazonOrders, setAmazonOrders] = useState([]);
  const [amazonMetrics, setAmazonMetrics] = useState({
    OrderCount: 0,
    TotalProfit: 0,
    TotalSales: 0,
    TotalPurchases: 0,
    TotalMarketplaceFee: 0,
    TotalFreight: 0,
  });
  const [amazonOrdersLoading, setAmazonOrdersLoading] = useState(false);
  const [amazonOrdersError, setAmazonOrdersError] = useState(null);

  // Amazon Orders Table States
  const [amazonCurrentPage, setAmazonCurrentPage] = useState(1);
  const [amazonItemsPerPage] = useState(10);
  const [amazonSearchTerm, setAmazonSearchTerm] = useState("");
  const [amazonSortField, setAmazonSortField] = useState("");
  const [amazonSortOrder, setAmazonSortOrder] = useState("asc");

  // Track which tabs have been loaded
  const [loadedTabs, setLoadedTabs] = useState({
    dashboard: false,
    analytics: false
  });

  // Format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "MM/dd/yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  // Shorten title for display
  const shortenTitle = (title) => {
    if (!title) return "N/A";
    return title.length > 20 ? `${title.substring(0, 20)}...` : title;
  };

  // Period title
  const getAmazonPeriodTitle = () => {
    switch (selectedPeriod) {
      case "current":
        return "Orders This Month";
      case "previous":
        return "Orders Previous Month";
      case "yeartodate":
        return "Orders Current Year";
      default:
        return "Orders";
    }
  };

  // Fetch Dashboard Overview data - wrapped in useCallback
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const statsResponse = await fetch(
        "https://localhost:7224/api/AmazonOrders/stats"
      );
      if (!statsResponse.ok) throw new Error("Failed to fetch stats");
      const statsData = await statsResponse.json();
      setOrderStats(statsData);

      const totalOrders = statsData.reduce(
        (sum, item) => sum + (item.orderCounts || 0),
        0
      );
      const shippedOrders =
        statsData.find((item) => item.orderStatus === "Shipped")
          ?.orderCounts || 0;
      const pendingOrders =
        statsData.find((item) => item.orderStatus === "Pending")
          ?.orderCounts || 0;

      const totalValue = statsData.reduce((total, item) => {
        const orderTotal = item.OrderTotal?.toString() || "0";
        return (
          total + (parseFloat(orderTotal.replace(/[^0-9.-]+/g, "")) || 0)
        );
      }, 0);

      setDashboardData({
        totalProfit: totalValue * 0.3,
        totalLoss: totalValue * 0.05,
        netProfit: totalValue * 0.25,
        totalOrders: totalOrders,
        shippedOrders,
        pendingOrders,
        profitChange: 12,
        orderChange: 5,
      });
      
      // Mark dashboard tab as loaded
      setLoadedTabs(prev => ({...prev, dashboard: true}));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Amazon Orders data - wrapped in useCallback
  const fetchAmazonOrders = useCallback(async () => {
    try {
      setAmazonOrdersLoading(true);
      setAmazonOrdersError(null);

      const response = await fetch(
        `https://localhost:7224/api/AmazonOrders/AmazonOrdersstats?period=${selectedPeriod}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${contentType} - ${text}`);
      }

      const data = await response.json();

      if (!data) {
        throw new Error("Empty response from server");
      }

      // Map the orders data
      setAmazonOrders(data.allOrders || []);

      // Map the metrics data
      setAmazonMetrics({
        OrderCount: data.metrics?.orderCount || 0,
        TotalProfit: data.metrics?.totalProfit || 0,
        TotalSales: data.metrics?.totalSales || 0,
        TotalPurchases: data.metrics?.totalPurchases || 0,
        TotalMarketplaceFee: data.metrics?.totalMarketplaceFee || 0,
        TotalFreight: data.metrics?.totalFreight || 0,
      });
      
      // Mark analytics tab as loaded
      setLoadedTabs(prev => ({...prev, analytics: true}));
    } catch (err) {
      setAmazonOrdersError(err.message);
      console.error("Error fetching Amazon orders:", err);
    } finally {
      setAmazonOrdersLoading(false);
    }
  }, [selectedPeriod]);

  // Load dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle period change for Amazon orders
  useEffect(() => {
    if (tabValue === "analytics" && loadedTabs.analytics) {
      fetchAmazonOrders();
    }
  }, [selectedPeriod, tabValue, loadedTabs.analytics, fetchAmazonOrders]);

  // Handle tab change
  const handleTabChange = (key) => {
    setTabValue(key);
    
    // Load data for the selected tab if not already loaded
    if (key === "analytics" && !loadedTabs.analytics) {
      fetchAmazonOrders();
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Filter and sort order stats
  const filteredOrderStats = useMemo(() => {
    return [...orderStats]
      .filter(
        (stat) =>
          statusFilter === "" ||
          stat.orderStatus.toLowerCase().includes(statusFilter.toLowerCase())
      )
      .sort((a, b) => {
        if (orderBy === "OrderTotal") {
          const aValue = parseFloat(a[orderBy]?.replace(/[^0-9.-]+/g, "") || 0);
          const bValue = parseFloat(b[orderBy]?.replace(/[^0-9.-]+/g, "") || 0);
          return order === "asc" ? aValue - bValue : bValue - aValue;
        }

        return order === "asc"
          ? a[orderBy] > b[orderBy]
            ? 1
            : -1
          : a[orderBy] < b[orderBy]
          ? 1
          : -1;
      });
  }, [orderStats, statusFilter, orderBy, order]);

  // Pagination for order stats
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrderStats.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredOrderStats.length / itemsPerPage);

  // Filter and sort Amazon orders
  const filteredAmazonOrders = useMemo(() => {
    let filtered = [...amazonOrders];

    // Apply search filter
    if (amazonSearchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value
              .toString()
              .toLowerCase()
              .includes(amazonSearchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (amazonSortField) {
      filtered.sort((a, b) => {
        let aValue = a[amazonSortField];
        let bValue = b[amazonSortField];

        // Handle numeric values
        if (
          [
            "quantity",
            "sellingPrice",
            "sellingTotal",
            "itemTaxAmount",
            "purchaseTotal",
            "estimatedProfit",
          ].includes(amazonSortField)
        ) {
          aValue = aValue || 0;
          bValue = bValue || 0;
        }

        // Handle string values
        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return amazonSortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return amazonSortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [amazonOrders, amazonSearchTerm, amazonSortField, amazonSortOrder]);

  // Pagination for Amazon orders
  const amazonIndexOfLastItem = amazonCurrentPage * amazonItemsPerPage;
  const amazonIndexOfFirstItem = amazonIndexOfLastItem - amazonItemsPerPage;
  const amazonCurrentItems = filteredAmazonOrders.slice(
    amazonIndexOfFirstItem,
    amazonIndexOfLastItem
  );
  const amazonTotalPages = Math.ceil(
    filteredAmazonOrders.length / amazonItemsPerPage
  );

  // Handle Amazon sort
  const handleAmazonSort = (field) => {
    if (amazonSortField === field) {
      setAmazonSortOrder(amazonSortOrder === "asc" ? "desc" : "asc");
    } else {
      setAmazonSortField(field);
      setAmazonSortOrder("asc");
    }
    setAmazonCurrentPage(1); // Reset to first page when sorting
  };

  // Handle Amazon search change
  const handleAmazonSearchChange = (value) => {
    setAmazonSearchTerm(value);
    setAmazonCurrentPage(1); // Reset to first page when searching
  };

  // Custom pagination component
  const renderPagination = (
    currentPage,
    totalPages,
    setPage,
    totalItems,
    itemsPerPage
  ) => {
    if (totalPages <= 1) return null;

    let items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {currentPage === 1 ? 1 : (currentPage - 1) * itemsPerPage + 1}{" "}
          to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          entries
        </div>
        <Pagination size="sm">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          />
          {items}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          />
        </Pagination>
      </div>
    );
  };

  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (amazonSortField !== field) return null;
    return amazonSortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <Container fluid>
      <Tabs activeKey={tabValue} onSelect={handleTabChange} className="mb-4">
        {/* Dashboard Overview Tab */}
        <Tab eventKey="dashboard" title="Dashboard Overview">
          <Row className="g-4 mb-4 align-items-stretch">
            {/* Net Profit Card */}
            <Col md={3}>
              <Card className="h-100 shadow-sm border-0 bg-success text-white">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="bg-white bg-opacity-25 p-2 rounded">
                      <CurrencyDollar size={24} />
                    </div>
                    <small>Net Profit</small>
                  </div>
                  <h3 className="mb-3">
                    {formatCurrency(dashboardData.netProfit)}
                  </h3>
                  <div className="d-flex align-items-center">
                    {dashboardData.profitChange > 0 ? (
                      <GraphUp size={20} className="me-2" />
                    ) : (
                      <GraphDown size={20} className="me-2" />
                    )}
                    <small>
                      {dashboardData.profitChange}% from last month
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Total Orders Card */}
            <Col md={3}>
              <Card className="h-100 shadow-sm border-0 bg-primary text-white">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="bg-white bg-opacity-25 p-2 rounded">
                      <Cart size={24} />
                    </div>
                    <small>Total Orders</small>
                  </div>
                  <h3 className="mb-3">{dashboardData.totalOrders}</h3>
                  <div className="d-flex align-items-center">
                    {dashboardData.orderChange > 0 ? (
                      <GraphUp size={20} className="me-2" />
                    ) : (
                      <GraphDown size={20} className="me-2" />
                    )}
                    <small>
                      {dashboardData.orderChange}% from last month
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Order Status Card */}
            <Col md={3}>
              <Card className="h-100 shadow-sm border-0 bg-info text-white">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <small>Order Status</small>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>
                        Completed: {dashboardData.shippedOrders} (
                        {dashboardData.totalOrders > 0
                          ? Math.round(
                              (dashboardData.shippedOrders /
                                dashboardData.totalOrders) *
                                100
                            )
                          : 0}
                        %)
                      </small>
                    </div>
                    <ProgressBar
                      now={
                        dashboardData.totalOrders > 0
                          ? (dashboardData.shippedOrders /
                              dashboardData.totalOrders) *
                            100
                          : 0
                      }
                      variant="light"
                      className="mb-3"
                      style={{ height: "8px" }}
                    />
                    <div className="d-flex justify-content-between mb-1">
                      <small>
                        Pending: {dashboardData.pendingOrders} (
                        {dashboardData.totalOrders > 0
                          ? Math.round(
                              (dashboardData.pendingOrders /
                                dashboardData.totalOrders) *
                                100
                            )
                          : 0}
                        %)
                      </small>
                    </div>
                    <ProgressBar
                      now={
                        dashboardData.totalOrders > 0
                          ? (dashboardData.pendingOrders /
                              dashboardData.totalOrders) *
                            100
                          : 0
                      }
                      variant="light"
                      style={{ height: "8px" }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Account Information Card */}
            <Col md={3}>
              <Card className="h-100 shadow-sm border-0 bg-dark text-white">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <small>Account Information</small>
                  <div className="mt-3">
                    <div className="d-flex align-items-center mb-2">
                      <Person size={16} className="me-2" />
                      <small>{user?.fullName || user?.userName || "N/A"}</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <Envelope size={16} className="me-2" />
                      <small>{user?.email || "N/A"}</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <ShieldShaded size={16} className="me-2" />
                      <small>{user?.isAdmin ? "Admin" : "Standard"}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <BoxArrowInRight size={16} className="me-2" />
                      <small>{user?.lastLogin || "N/A"}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Order Statistics Table with Filters and Pagination */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Order Status Statistics</h5>
                <Form.Group
                  controlId="statusFilter"
                  className="mb-0"
                  style={{ width: "300px" }}
                >
                  <div className="d-flex align-items-center">
                    <Search className="me-2" />
                    <Form.Control
                      type="text"
                      placeholder="Filter by status..."
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </Form.Group>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th
                            onClick={() => handleSort("OrderStatus")}
                            className="cursor-pointer"
                          >
                            <div className="d-flex align-items-center">
                              Order Status
                              {orderBy === "OrderStatus" && (
                                <span className="ms-1">
                                  {order === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            className="text-end cursor-pointer"
                            onClick={() => handleSort("OrderCounts")}
                          >
                            <div className="d-flex align-items-center justify-content-end">
                              Order Count
                              {orderBy === "OrderCounts" && (
                                <span className="ms-1">
                                  {order === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </th>
                          <th
                            className="text-end cursor-pointer"
                            onClick={() => handleSort("OrderTotal")}
                          >
                            <div className="d-flex align-items-center justify-content-end">
                              Total Value
                              {orderBy === "OrderTotal" && (
                                <span className="ms-1">
                                  {order === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((stat, index) => (
                          <tr key={index}>
                            <td>{stat.orderStatus}</td>
                            <td className="text-end">{stat.orderCounts}</td>
                            <td className="text-end">{stat.orderTotal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  {renderPagination(
                    currentPage,
                    totalPages,
                    setCurrentPage,
                    filteredOrderStats.length,
                    itemsPerPage
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Amazon Shipped Orders Tab */}
        <Tab eventKey="analytics" title="Amazon Shipped Orders">
          {!loadedTabs.analytics && !amazonOrdersLoading ? (
            <div className="text-center py-5">
              <Button 
                variant="primary" 
                onClick={fetchAmazonOrders}
                disabled={amazonOrdersLoading}
              >
                {amazonOrdersLoading ? <Spinner animation="border" size="sm" /> : "Load Amazon Orders Data"}
              </Button>
            </div>
          ) : (
            <Card className="shadow-sm">
              <Card.Header className="bg-dark text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">
                    <FaTruck className="me-2" />
                    AMAZON SHIPPED ORDERS DASHBOARD
                  </h4>
                  <ButtonGroup>
                    <Button
                      variant={
                        selectedPeriod === "current"
                          ? "primary"
                          : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setSelectedPeriod("current")}
                    >
                      Current Month
                    </Button>
                    <Button
                      variant={
                        selectedPeriod === "previous"
                          ? "primary"
                          : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setSelectedPeriod("previous")}
                    >
                      Previous Month
                    </Button>
                    <Button
                      variant={
                        selectedPeriod === "yeartodate"
                          ? "primary"
                          : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setSelectedPeriod("yeartodate")}
                    >
                      Year to Date
                    </Button>
                  </ButtonGroup>
                </div>
              </Card.Header>

              <Card.Body>
                {amazonOrdersLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading Amazon order data...</p>
                  </div>
                ) : amazonOrdersError ? (
                  <Alert variant="danger">{amazonOrdersError}</Alert>
                ) : (
                  <>
                    {/* Metrics Cards Row */}
                    <Row className="mb-4 g-3">
                      <Col md={2} sm={6}>
                        <Card className="h-100 text-center d-flex flex-column justify-content-center">
                          <Card.Body className="py-3">
                            <h4 className="mb-0" style={{ fontSize: "1.4rem" }}>
                              <strong>
                                {amazonMetrics.OrderCount.toLocaleString("en-US")}
                              </strong>
                            </h4>
                            <h6
                              className="card-title mb-2"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {getAmazonPeriodTitle()}
                            </h6>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={2} sm={6}>
                        <Card
                          className={`h-100 text-center d-flex flex-column justify-content-center ${
                            amazonMetrics.TotalProfit >= 0
                              ? "bg-success text-white"
                              : "bg-danger text-white"
                          }`}
                        >
                          <Card.Body className="py-3">
                            <h4 className="mb-0" style={{ fontSize: "1.4rem" }}>
                              <strong>
                                {" "}
                                {formatCurrency(amazonMetrics.TotalProfit)}
                              </strong>
                            </h4>
                            <h6
                              className="card-title mb-2"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {amazonMetrics.TotalProfit > 0
                                ? "Total Profit"
                                : "Total Loss"}
                            </h6>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={2} sm={6}>
                        <Card className="h-100 text-center d-flex flex-column justify-content-center bg-info text-white">
                          <Card.Body className="py-3">
                            <h4 className="mb-0" style={{ fontSize: "1.4rem" }}>
                              <strong>
                                {" "}
                                {formatCurrency(amazonMetrics.TotalSales)}
                              </strong>
                            </h4>
                            <h6
                              className="card-title mb-2"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Total Sales
                            </h6>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={2} sm={6}>
                        <Card className="h-100 text-center d-flex flex-column justify-content-center bg-warning text-dark">
                          <Card.Body className="py-3">
                            <h4 className="mb-0" style={{ fontSize: "1.4rem" }}>
                              <strong>
                                {" "}
                                {formatCurrency(amazonMetrics.TotalPurchases)}
                              </strong>
                            </h4>
                            <h6
                              className="card-title mb-2"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Total Purchases
                            </h6>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={2} sm={6}>
                        <Card className="h-100 text-center d-flex flex-column justify-content-center bg-secondary text-white">
                          <Card.Body className="py-3">
                            <h4 className="mb-0" style={{ fontSize: "1.4rem" }}>
                              <strong>
                                {" "}
                                {formatCurrency(amazonMetrics.TotalMarketplaceFee)}
                              </strong>
                            </h4>
                            <h6
                              className="card-title mb-2"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Marketplace Fees
                            </h6>
                          </Card.Body>
                        </Card>
                      </Col>

                      <Col md={2} sm={6}>
                        <Card className="h-100 text-center d-flex flex-column justify-content-center bg-dark text-white">
                          <Card.Body className="py-3">
                            <h4 className="mb-0" style={{ fontSize: "1.4rem" }}>
                              <strong>
                                {" "}
                                {formatCurrency(amazonMetrics.TotalFreight)}
                              </strong>
                            </h4>
                            <h6
                              className="card-title mb-2"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Total Freight
                            </h6>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Amazon Orders Table with Search and Pagination */}
                    <div className="mb-3">
                      <Row>
                        <Col md={9}></Col>
                        <Col md={3}>
                          <InputGroup>
                            <InputGroup.Text>
                              <Search />
                            </InputGroup.Text>
                            <Form.Control
                              placeholder="Search by order ID, SKU, title, status, etc."
                              value={amazonSearchTerm}
                              onChange={(e) =>
                                handleAmazonSearchChange(e.target.value)
                              }
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    </div>

                    <div className="table-responsive">
                      <Table striped bordered hover>
                        <thead className="table-dark">
                          <tr>
                            <th
                              onClick={() => handleAmazonSort("orderId")}
                              className="cursor-pointer"
                            >
                              Order ID {renderSortIndicator("orderId")}
                            </th>
                            <th
                              onClick={() => handleAmazonSort("purchaseDate")}
                              className="cursor-pointer"
                            >
                              Purchase Date {renderSortIndicator("purchaseDate")}
                            </th>
                            <th
                              onClick={() => handleAmazonSort("latestShipDate")}
                              className="cursor-pointer"
                            >
                              Latest ShipDate{" "}
                              {renderSortIndicator("latestShipDate")}
                            </th>
                            <th
                              onClick={() => handleAmazonSort("sku")}
                              className="cursor-pointer"
                            >
                              SKU {renderSortIndicator("sku")}
                            </th>
                            <th
                              onClick={() => handleAmazonSort("title")}
                              className="cursor-pointer"
                            >
                              Title {renderSortIndicator("title")}
                            </th>
                            <th
                              className="text-end cursor-pointer"
                              onClick={() => handleAmazonSort("quantity")}
                            >
                              Qty {renderSortIndicator("quantity")}
                            </th>
                            <th
                              className="text-end cursor-pointer"
                              onClick={() => handleAmazonSort("sellingPrice")}
                            >
                              Price {renderSortIndicator("sellingPrice")}
                            </th>
                            <th
                              className="text-end cursor-pointer"
                              onClick={() => handleAmazonSort("sellingTotal")}
                            >
                              Total {renderSortIndicator("sellingTotal")}
                            </th>
                            <th
                              className="text-end cursor-pointer"
                              onClick={() => handleAmazonSort("itemTaxAmount")}
                            >
                              Tax {renderSortIndicator("itemTaxAmount")}
                            </th>
                            <th
                              className="text-end cursor-pointer"
                              onClick={() => handleAmazonSort("purchaseTotal")}
                            >
                              Cost {renderSortIndicator("purchaseTotal")}
                            </th>
                            <th
                              className="text-end cursor-pointer"
                              onClick={() => handleAmazonSort("estimatedProfit")}
                            >
                              Profit {renderSortIndicator("estimatedProfit")}
                            </th>
                            <th
                              onClick={() => handleAmazonSort("sellingStatus")}
                              className="cursor-pointer"
                            >
                              Status {renderSortIndicator("sellingStatus")}
                            </th>
                            <th
                              onClick={() => handleAmazonSort("trackingId")}
                              className="cursor-pointer"
                            >
                              Tracking {renderSortIndicator("trackingId")}
                            </th>
                            <th
                              onClick={() => handleAmazonSort("vendorName")}
                              className="cursor-pointer"
                            >
                              Vendor {renderSortIndicator("vendorName")}
                            </th>
                            <th
                              onClick={() => handleAmazonSort("shipMethod")}
                              className="cursor-pointer"
                            >
                              Ship Method {renderSortIndicator("shipMethod")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {amazonCurrentItems.length > 0 ? (
                            amazonCurrentItems.map((item, index) => (
                              <tr key={index}>
                                <td>{item.orderId}</td>
                                <td>{formatDate(item.purchaseDate)}</td>
                                <td>{formatDate(item.latestShipDate)}</td>
                                <td>{item.sku}</td>
                                <td>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip id={`tooltip-${item.orderId}`}>
                                        {item.title || "N/A"}
                                      </Tooltip>
                                    }
                                  >
                                    <span>{shortenTitle(item.title)}</span>
                                  </OverlayTrigger>
                                </td>
                                <td className="text-end">
                                  {item.quantity?.toLocaleString("en-US") ||
                                    "N/A"}
                                </td>
                                <td className="text-end">
                                  {formatCurrency(item.sellingPrice)}
                                </td>
                                <td className="text-end">
                                  {formatCurrency(item.sellingTotal)}
                                </td>
                                <td className="text-end">
                                  {formatCurrency(item.itemTaxAmount)}
                                </td>
                                <td className="text-end">
                                  {formatCurrency(item.purchaseTotal)}
                                </td>
                                <td
                                  className={`text-end ${
                                    (item.estimatedProfit ?? 0) >= 0
                                      ? "text-success fw-bold"
                                      : "text-danger fw-bold"
                                  }`}
                                >
                                  {formatCurrency(item.estimatedProfit)}
                                </td>
                                <td>
                                  <Badge
                                    bg={
                                      !item.sellingStatus
                                        ? "secondary"
                                        : item.sellingStatus === "Shipped"
                                        ? "success"
                                        : item.sellingStatus === "Pending"
                                        ? "warning"
                                        : "secondary"
                                    }
                                  >
                                    {item.sellingStatus || "Unknown"}
                                  </Badge>
                                </td>
                                <td>{item.trackingId || "N/A"}</td>
                                <td>{item.vendorName || "N/A"}</td>
                                <td>{item.shipMethod || "N/A"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="15" className="text-center py-4">
                                {amazonSearchTerm
                                  ? "No orders found matching your search"
                                  : "No orders found for the selected period"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    {renderPagination(
                      amazonCurrentPage,
                      amazonTotalPages,
                      setAmazonCurrentPage,
                      filteredAmazonOrders.length,
                      amazonItemsPerPage
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Dashboard;