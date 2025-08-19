import React, { useState, useEffect } from "react";
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
  const [amazonOrdersLoading, setAmazonOrdersLoading] = useState(true);
  const [amazonOrdersError, setAmazonOrdersError] = useState(null);

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

  // Fetch Dashboard Overview data
  useEffect(() => {
    const fetchData = async () => {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Amazon Orders data
  useEffect(() => {
    const fetchAmazonOrders = async () => {
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
      } catch (err) {
        setAmazonOrdersError(err.message);
        console.error("Error fetching Amazon orders:", err);
      } finally {
        setAmazonOrdersLoading(false);
      }
    };

    fetchAmazonOrders();
  }, [selectedPeriod]);

  const handleTabChange = (key) => {
    setTabValue(key);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedStats = [...orderStats].sort((a, b) => {
    if (orderBy === "OrderTotal") {
      const aValue = parseFloat(a[orderBy].replace(/[^0-9.-]+/g, "")) || 0;
      const bValue = parseFloat(b[orderBy].replace(/[^0-9.-]+/g, "")) || 0;
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

  return (
    <Container fluid>
      <Tabs activeKey={tabValue} onSelect={handleTabChange} className="mb-4">
        {/* Dashboard Overview Tab */}
        <Tab eventKey="dashboard" title="Dashboard Overview">
          <Row className="g-4 mb-4">
            {/* Net Profit Card */}
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 p-2 rounded">
                      <CurrencyDollar size={24} className="text-success" />
                    </div>
                    <small className="text-muted">Net Profit</small>
                  </div>
                  <h3 className="mb-3">
                    {formatCurrency(dashboardData.netProfit)}
                  </h3>
                  <div className="d-flex align-items-center">
                    {dashboardData.profitChange > 0 ? (
                      <GraphUp size={20} className="text-success me-2" />
                    ) : (
                      <GraphDown size={20} className="text-danger me-2" />
                    )}
                    <small
                      className={
                        dashboardData.profitChange > 0
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {dashboardData.profitChange}% from last month
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Total Orders Card */}
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="bg-info bg-opacity-10 p-2 rounded">
                      <Cart size={24} className="text-info" />
                    </div>
                    <small className="text-muted">Total Orders</small>
                  </div>
                  <h3 className="mb-3">{dashboardData.totalOrders}</h3>
                  <div className="d-flex align-items-center">
                    {dashboardData.orderChange > 0 ? (
                      <GraphUp size={20} className="text-success me-2" />
                    ) : (
                      <GraphDown size={20} className="text-danger me-2" />
                    )}
                    <small
                      className={
                        dashboardData.orderChange > 0
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {dashboardData.orderChange}% from last month
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Order Status Card */}
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <small className="text-muted">Order Status</small>
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
                      variant="success"
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
                      variant="warning"
                      style={{ height: "8px" }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Account Information Card */}
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <small className="text-muted">Account Information</small>
                  <div className="mt-3">
                    <div className="d-flex align-items-center mb-2">
                      <Person size={16} className="text-primary me-2" />
                      <small>{user?.fullName || user?.userName || "N/A"}</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <Envelope size={16} className="text-primary me-2" />
                      <small>{user?.email || "N/A"}</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <ShieldShaded size={16} className="text-primary me-2" />
                      <small>{user?.isAdmin ? "Admin" : "Standard"}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <BoxArrowInRight
                        size={16}
                        className="text-primary me-2"
                      />
                      <small>{user?.lastLogin || "N/A"}</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Order Statistics Table */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Order Status Statistics</h5>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th onClick={() => handleSort("OrderStatus")}>
                          <div className="d-flex align-items-center cursor-pointer">
                            Order Status
                            {orderBy === "OrderStatus" && (
                              <span className="ms-1">
                                {order === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          className="text-end"
                          onClick={() => handleSort("OrderCounts")}
                        >
                          <div className="d-flex align-items-center justify-content-end cursor-pointer">
                            Order Count
                            {orderBy === "OrderCounts" && (
                              <span className="ms-1">
                                {order === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          className="text-end"
                          onClick={() => handleSort("OrderTotal")}
                        >
                          <div className="d-flex align-items-center justify-content-end cursor-pointer">
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
                      {sortedStats.map((stat, index) => (
                        <tr key={index}>
                          <td>{stat.orderStatus}</td>
                          <td className="text-end">{stat.orderCounts}</td>
                          <td className="text-end">{stat.orderTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Amazon Shipped Orders Tab */}
        <Tab eventKey="analytics" title="Amazon Shipped Orders">
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">
                  <FaTruck className="me-2" />
                  AMAZON SHIPPED ORDERS DASHBOARD
                </h2>
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
                      <Card bg="primary" text="white">
                        <Card.Body>
                          <h6 className="card-title">
                            {getAmazonPeriodTitle()}
                          </h6>
                          <h3>
                            {amazonMetrics.OrderCount.toLocaleString("en-US")}
                          </h3>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={2} sm={6}>
                      <Card
                        bg={
                          amazonMetrics.TotalProfit >= 0 ? "success" : "danger"
                        }
                        text="white"
                      >
                        <Card.Body>
                          <h6 className="card-title">Total Profit</h6>
                          <h3>{formatCurrency(amazonMetrics.TotalProfit)}</h3>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={2} sm={6}>
                      <Card bg="info" text="white">
                        <Card.Body>
                          <h6 className="card-title">Total Sales</h6>
                          <h3>{formatCurrency(amazonMetrics.TotalSales)}</h3>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={2} sm={6}>
                      <Card bg="warning" text="dark">
                        <Card.Body>
                          <h6 className="card-title">Total Purchases</h6>
                          <h3>
                            {formatCurrency(amazonMetrics.TotalPurchases)}
                          </h3>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={2} sm={6}>
                      <Card bg="secondary" text="white">
                        <Card.Body>
                          <h6 className="card-title">Marketplace Fees</h6>
                          <h3>
                            {formatCurrency(amazonMetrics.TotalMarketplaceFee)}
                          </h3>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={2} sm={6}>
                      <Card bg="dark" text="white">
                        <Card.Body>
                          <h6 className="card-title">Total Freight</h6>
                          <h3>{formatCurrency(amazonMetrics.TotalFreight)}</h3>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  {/* Orders Table */}
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead className="table-dark">
                        <tr>
                          <th>Order ID</th>
                          <th>Purchase Date</th>
                          <th>Latest Ship Date</th>
                          <th>SKU</th>
                          <th>Title</th>
                          <th className="text-end">Qty</th>
                          <th className="text-end">Price</th>
                          <th className="text-end">Total</th>
                          <th className="text-end">Tax</th>
                          <th className="text-end">Cost</th>
                          <th className="text-end">Profit</th>
                          <th>Status</th>
                          <th>Tracking</th>
                          <th>Vendor</th>
                          <th>Ship Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amazonOrders.length > 0 ? (
                          amazonOrders.map((item, index) => (
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
                              No orders found for the selected period
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Dashboard;
