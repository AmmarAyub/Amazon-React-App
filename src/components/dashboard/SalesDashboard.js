import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SalesDashboard.css';

const SalesDashboard = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://localhost:7224/api/AmazonOrders/SaleDashboard');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        // Fallback to mock data if API fails
        const mockData = {
          companiesPayableSummary: [
            { name: "ConformityTech", totalBill: 25402, id: 22 },
            { name: "Amazon DTS", totalBill: 23128.37, id: 24 },
            { name: "DeltaTechStore, LLC.", totalBill: 4447.71, id: 23 }
          ],
          companiesSummary: [
            { name: "DeltaTechStore, LLC.", totalInv: 97882.08, id: 23 },
            { name: "Amazon DTS", totalInv: 31223.73, id: 24 },
            { name: "GetTapes", totalInv: 8173.55, id: 4 }
          ],
          total: 137279.36,
          payableTotal: 52978.08,
          amazonOrderUnshipped: [
            {
              amazonOrderID: "112-8413555-8761855",
              sellerSKU: "DTS-AMZ-001",
              stock: 45,
              cost: 29.99,
              sold: 39.99,
              gp: 10.00,
              code: "Processing",
              amazonOrderStatus: "Unshipped",
              daysInProcess: 2,
              responseDateTime: "2023-05-15"
            },
            {
              amazonOrderID: "112-8413555-8761856",
              sellerSKU: "DTS-AMZ-002",
              stock: 32,
              cost: 45.50,
              sold: 59.99,
              gp: 14.49,
              code: "Pending",
              amazonOrderStatus: "Unshipped",
              daysInProcess: 1,
              responseDateTime: "2023-05-16"
            },
            {
              amazonOrderID: "112-8413555-8761859",
              sellerSKU: "DTS-AMZ-003",
              stock: 18,
              cost: 22.75,
              sold: 34.99,
              gp: 12.24,
              code: "Processing",
              amazonOrderStatus: "Unshipped",
              daysInProcess: 3,
              responseDateTime: "2023-05-14"
            }
          ],
          amazonOrderShipped: [
            {
              amazonOrderID: "112-8413555-8761857",
              poNumber: "PO-12345",
              poTotal: 159.98,
              shipDatetime: "2023-05-10",
              poDatetime: "2023-05-08",
              daysTook: 2,
              shipMethodDescription: "UPS Ground",
              trackingNumber: "1Z12345E0392753675",
              amazonOrderStatus: "Shipped"
            },
            {
              amazonOrderID: "112-8413555-8761858",
              poNumber: "PO-12346",
              poTotal: 229.50,
              shipDatetime: "2023-05-12",
              poDatetime: "2023-05-10",
              daysTook: 2,
              shipMethodDescription: "FedEx 2Day",
              trackingNumber: "789123456789",
              amazonOrderStatus: "Shipped"
            },
            {
              amazonOrderID: "112-8413555-8761860",
              poNumber: "PO-12347",
              poTotal: 89.99,
              shipDatetime: "2023-05-11",
              poDatetime: "2023-05-09",
              daysTook: 2,
              shipMethodDescription: "USPS Priority",
              trackingNumber: "94001118992213456784",
              amazonOrderStatus: "Shipped"
            }
          ],
          amazonOrderStats: [
            { orderStatus: "Canceled", orderCounts: 117, orderTotal: "$41,363.30" },
            { orderStatus: "Cancelled", orderCounts: 3, orderTotal: "$80.24" },
            { orderStatus: "PartiallyShipped", orderCounts: 1, orderTotal: "$2,962.06" },
            { orderStatus: "Pending", orderCounts: 4, orderTotal: "$2,344.48" },
            { orderStatus: "Shipped", orderCounts: 1010, orderTotal: "$239,823.41" },
            { orderStatus: "Unshipped", orderCounts: 60, orderTotal: "$21,007.90" }
          ],
          invoicesListView: [
            {
              date: "2023-05-15",
              companyName: "DeltaTechStore",
              total: 1250.75,
              status: "Paid"
            },
            {
              date: "2023-05-14",
              companyName: "Amazon DTS",
              total: 875.50,
              status: "Pending"
            },
            {
              date: "2023-05-13",
              companyName: "GetTapes",
              total: 420.25,
              status: "Paid"
            }
          ]
        };
        setDashboardData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '$0.00';
    return '$' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <Container fluid className="py-4 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-2 py-md-3 dashboard-container">
      {error && (
        <Alert variant="warning" className="mb-3">
          API connection failed: {error}. Showing mock data instead.
        </Alert>
      )}
      
      <div className="dashboard-header mb-3">FINANCIAL & SALES DASHBOARD</div>
      
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
                    {dashboardData.companiesSummary.map((item, index) => (
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
                    {dashboardData.companiesPayableSummary.map((item, index) => (
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
                    {dashboardData.invoicesListView.map((item, index) => (
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
                    {dashboardData.amazonOrderStats.map((stats, index) => (
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
                    {dashboardData.amazonOrderUnshipped.map((item, index) => (
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
                    {dashboardData.amazonOrderShipped.map((item, index) => (
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

export default SalesDashboard;