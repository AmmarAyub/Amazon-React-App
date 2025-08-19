import React, { useState, useEffect } from 'react';
import {
  Table,
  Container,
  Spinner,
  Alert,
  Form,
  Pagination,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://localhost:7224/api/ManageOrders/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    Object.values(order).some(
      value => value && 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  ));

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col>
              <h2 className="mb-0">ORDERS LIST</h2>
            </Col>
            <Col md={4}>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ps-5"
                />
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              </div>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Amazon Order ID</th>
                  <th>Status</th>
                  <th>Purchase Date</th>
                  <th>Total Amount</th>
                  <th>Items Shipped</th>
                  <th>Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.amazonOrderId}</td>
                      <td>
                        <span className={`badge ${
                          order.orderStatus === 'Shipped' ? 'bg-success' : 
                          order.orderStatus === 'Pending' ? 'bg-warning text-dark' : 'bg-secondary'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>{order.purchaseDate}</td>
                      <td>
                        {order.orderTotalAmount} {order.orderTotalCurrencyCode}
                      </td>
                      <td>
                        {order.numberOfItemsShipped} / {order.numberOfItemsShipped + (order.numberOfItemsUnshipped || 0)}
                      </td>
                      <td>{order.fulfillmentChannel}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <Row className="align-items-center mt-3">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <span className="me-2">Show</span>
                <Form.Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  style={{ width: '80px' }}
                  size="sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </Form.Select>
                <span className="ms-2">entries</span>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-end">
                <Pagination>
                  <Pagination.First 
                    onClick={() => paginate(1)} 
                    disabled={currentPage === 1} 
                  />
                  <Pagination.Prev 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1} 
                  />
                  
                  {Array.from({ length: totalPages }, (_, i) => {
                    if (
                      i === 0 || 
                      i === totalPages - 1 || 
                      (i >= currentPage - 2 && i <= currentPage + 2)
                    ) {
                      return (
                        <Pagination.Item
                          key={i + 1}
                          active={i + 1 === currentPage}
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      );
                    } else if (i === 1 || i === totalPages - 2) {
                      return <Pagination.Ellipsis key={i + 1} />;
                    }
                    return null;
                  })}
                  
                  <Pagination.Next 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                  />
                  <Pagination.Last 
                    onClick={() => paginate(totalPages)} 
                    disabled={currentPage === totalPages} 
                  />
                </Pagination>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Orders;