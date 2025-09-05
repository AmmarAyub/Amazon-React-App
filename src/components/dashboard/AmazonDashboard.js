import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AmazonDashboard.css';

const AmazonDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    companiesPayableSummary: [],
    companiesSummary: [],
    total: 0,
    payableTotal: 0,
    amazonOrderUnshipped: [],
    amazonOrderShipped: [],
    amazonOrderStats: [],
    invoicesListView: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(120); // 2 minutes in seconds

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7224/api/AmazonOrders/AmazonDashboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setDashboardData(data);
      setLastUpdated(new Date());
      setTimeUntilRefresh(120); // Reset the timer
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial data fetch
    fetchDashboardData();

    // Set up interval for auto-refresh every 2 minutes
    const refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 120000); // 120000 ms = 2 minutes

    // Set up interval for countdown timer
    const countdownInterval = setInterval(() => {
      setTimeUntilRefresh(prev => {
        if (prev <= 1) {
          return 120; // Reset to 2 minutes when it reaches 0
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdownInterval);
    };
  }, [fetchDashboardData]);

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0.00';
    return '$' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading && !lastUpdated) {
    return (
      <Container fluid className="py-2 py-md-3 dashboard-container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary" className="mb-3" />
          <p>Loading dashboard data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-2 py-md-3 dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="dashboard-header">AMAZON DASHBOARD</div>
        <div className="d-flex align-items-center">
          {lastUpdated && (
            <Badge bg="light" text="dark" className="me-2">
              Last updated: {formatTime(lastUpdated)}
            </Badge>
          )}
          <Badge bg="info">
            Refreshing in: {formatCountdown(timeUntilRefresh)}
          </Badge>
          <button 
            className="btn btn-sm btn-outline-primary ms-2"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Refresh Now'}
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          <Alert.Heading>Error Loading Data</Alert.Heading>
          <p>Failed to fetch dashboard data: {error}</p>
          <p>Please check your connection and try again.</p>
        </Alert>
      )}
      
      {/* Summary Cards Row */}
      <Row className="mb-4">
        {/* AR Summary */}
        <Col xl={3} lg={6} md={6} className="mb-3">
          <Card className="card-custom h-100">
            <Card.Body className="p-2">
              <div className="text-center mb-2">
                <Row className="align-items-center">
                  <span className="col-6" style={{ fontSize: '0.8rem' }}>AR SUMMARY</span>
                  <span className="col-6" style={{ fontSize: '1rem', color: '#28a745' }}>
                    <b>{formatCurrency(dashboardData.total)}</b>
                  </span>
                </Row>
              </div>
              <div className="table-container">
                <Table striped hover size="sm" className="table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th className="text-end">Invoices</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.companiesSummary && dashboardData.companiesSummary.map((item, index) => (
                      <tr key={index}>
                        <td className="text-truncate" style={{ maxWidth: '100px' }}>
                          <a href={`/AccountsPayable/AccountsRecieveableList?id=${item.id}`} target="_blank" rel="noopener noreferrer">
                            {item.name}
                          </a>
                        </td>
                        <td className="text-end currency-usd">{formatCurrency(item.totalInv)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* AP Summary */}
        <Col xl={3} lg={6} md={6} className="mb-3">
          <Card className="card-custom h-100">
            <Card.Body className="p-2">
              <div className="text-center mb-2">
                <Row className="align-items-center">
                  <span className="col-6" style={{ fontSize: '0.8rem' }}>AP SUMMARY</span>
                  <span className="col-6" style={{ fontSize: '1rem', color: 'red' }}>
                    <b>{formatCurrency(dashboardData.payableTotal)}</b>
                  </span>
                </Row>
              </div>
              <div className="table-container">
                <Table striped hover size="sm" className="table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th className="text-end">Bills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.companiesPayableSummary && dashboardData.companiesPayableSummary.map((item, index) => (
                      <tr key={index}>
                        <td className="text-truncate" style={{ maxWidth: '100px' }}>
                          <a href={`/AccountsPayable/Index?id=${item.id}`} target="_blank" rel="noopener noreferrer">
                            {item.name}
                          </a>
                        </td>
                        <td className="text-end currency-usd">{formatCurrency(item.totalBill)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Invoices */}
        <Col xl={3} lg={6} md={6} className="mb-3">
          <Card className="card-custom h-100">
            <Card.Body className="p-2">
              <div className="text-center mb-2">
                <h6><b>TOP INVOICES</b></h6>
              </div>
              <div className="table-container">
                <Table striped size="sm" className="table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Company</th>
                      <th className="text-end">Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.invoicesListView && dashboardData.invoicesListView.map((item, index) => (
                      <tr key={index}>
                        <td>{formatDate(item.date)}</td>
                        <td className="text-truncate" style={{ maxWidth: '80px' }}>{item.companyName}</td>
                        <td className="text-end currency-usd">{formatCurrency(item.total)}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Stats */}
        <Col xl={3} lg={6} md={6} className="mb-3">
          <Card className="card-custom h-100">
            <Card.Body className="p-2">
              <div className="text-center mb-2">
                <h6><b>ORDER STATS</b></h6>
              </div>
              <div className="table-container">
                <Table striped size="sm" className="table-custom mb-0">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.amazonOrderStats && dashboardData.amazonOrderStats.map((stats, index) => (
                      <tr key={index}>
                        <td className="text-truncate" style={{ maxWidth: '100px' }}>{stats.orderStatus}</td>
                        <td className="text-center">{stats.orderCounts}</td>
                        <td className="text-end currency-usd">{stats.orderTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Amazon Orders Row - Original Layout */}
      <Row>
        {/* Unshipped Orders */}
        <Col xl={6} lg={6} className="mb-3">
          <Card className="card-custom h-100">
            <Card.Body className="p-2">
              <h5 className="text-center mb-3"><b>AMAZON UNSHIPPED ORDERS</b></h5>
              <div className="table-responsive">
                <Table striped bordered hover size="sm" className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th className="d-none d-md-table-cell">SKU</th>
                      <th>Cost</th>
                      <th>Sold</th>
                      <th>GP</th>
                      <th className="d-none d-lg-table-cell">Status</th>
                      <th className="d-none d-xl-table-cell">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.amazonOrderUnshipped && dashboardData.amazonOrderUnshipped.map((item, index) => (
                      <tr key={index}>
                        <td className="text-truncate" style={{ maxWidth: '120px' }}>{item.amazonOrderID}</td>
                        <td className="d-none d-md-table-cell text-truncate" style={{ maxWidth: '100px' }}>{item.sellerSKU}</td>
                        <td className="currency-usd">{formatCurrency(item.cost)}</td>
                        <td className="currency-usd">{formatCurrency(item.sold)}</td>
                        <td className={`currency-usd ${item.gp < 0 ? 'text-danger' : ''}`}>
                          {formatCurrency(item.gp)}
                        </td>
                        <td className="d-none d-lg-table-cell">{item.code}</td>
                        <td className="d-none d-xl-table-cell">{item.daysInProcess}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Shipped Orders */}
        <Col xl={6} lg={6} className="mb-3">
          <Card className="card-custom h-100">
            <Card.Body className="p-2">
              <h5 className="text-center mb-3"><b>AMAZON SHIPPED ORDERS</b></h5>
              <div className="table-responsive">
                <Table striped bordered hover size="sm" className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th className="d-none d-md-table-cell">PO #</th>
                      <th>Total</th>
                      <th className="d-none d-lg-table-cell">Ship Date</th>
                      <th>Days</th>
                      <th className="d-none d-xl-table-cell">Tracking #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.amazonOrderShipped && dashboardData.amazonOrderShipped.map((item, index) => (
                      <tr key={index}>
                        <td className="text-truncate" style={{ maxWidth: '120px' }}>{item.amazonOrderID}</td>
                        <td className="d-none d-md-table-cell">
                          <a 
                            href={`http://portal.weitsolutions.com/PurchaseOrders/DownloadPurchasePdf?id=${item.poNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-truncate d-inline-block"
                            style={{ maxWidth: '100px' }}
                          >
                            {item.poNumber}
                          </a>
                        </td>
                        <td className="currency-usd">{formatCurrency(item.poTotal)}</td>
                        <td className="d-none d-lg-table-cell">{formatDate(item.shipDatetime)}</td>
                        <td>{item.daysTook}</td>
                        <td className="d-none d-xl-table-cell text-truncate" style={{ maxWidth: '150px' }}>{item.trackingNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AmazonDashboard;