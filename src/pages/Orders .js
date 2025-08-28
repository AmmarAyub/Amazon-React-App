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
  Card,
  Button,
  Modal,
  Badge
} from 'react-bootstrap';
import { Search, Plus, Pencil } from 'react-bootstrap-icons';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7224/api/AmazonOrders');
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

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedOrder(null);
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
      {/* Create Order Modal */}
      <CreateOrderModal 
        show={showCreateModal} 
        handleClose={handleCloseCreateModal}
        refreshOrders={fetchOrders}
      />
      
      {/* Update Order Modal */}
      <UpdateOrderModal 
        show={showUpdateModal} 
        handleClose={handleCloseUpdateModal}
        refreshOrders={fetchOrders}
        order={selectedOrder}
      />
      
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col>
              <h2 className="mb-0">ORDERS LIST</h2>
            </Col>
            <Col md={4} className="d-flex justify-content-end">
              <Button 
                variant="primary" 
                onClick={handleCreateOrder}
                className="d-flex align-items-center"
              >
                <Plus size={20} className="me-2" />
                Create Order
              </Button>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.amazonOrderId}</td>
                      <td>
                        <Badge 
                          bg={
                            order.orderStatus === 'Shipped' ? 'success' : 
                            order.orderStatus === 'Pending' ? 'warning' : 
                            order.orderStatus === 'Cancelled' ? 'danger' : 'secondary'
                          }
                          text={order.orderStatus === 'Pending' ? 'dark' : 'white'}
                        >
                          {order.orderStatus}
                        </Badge>
                      </td>
                      <td>{order.purchaseDate ? new Date(order.purchaseDate).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        {order.orderTotalAmount} {order.orderTotalCurrencyCode}
                      </td>
                      <td>
                        {order.numberOfItemsShipped} / {order.numberOfItemsShipped + (order.numberOfItemsUnshipped ? 1 : 0)}
                      </td>
                      <td>{order.fulfillmentChannel}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleUpdateOrder(order)}
                          title="Edit Order"
                        >
                          <Pencil size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
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

// Create Order Modal Component
const CreateOrderModal = ({ show, handleClose, refreshOrders }) => {
  const [formData, setFormData] = useState({
    amazonOrderId: '',
    orderStatus: 'Pending',
    purchaseDate: new Date().toISOString().split('T')[0],
    orderTotalAmount: '',
    orderTotalCurrencyCode: 'USD',
    numberOfItemsShipped: 0,
    numberOfItemsUnshipped: false,
    fulfillmentChannel: 'MFN',
    earliestShipDate: '',
    salesChannel: '',
    orderType: 'StandardOrder',
    isPremiumOrder: false,
    isPrime: false,
    shipmentServiceLevelCategory: '',
    buyerInfoBuyerEmail: '',
    shippingAddressCountryCode: '',
    paymentMethod: 'Other'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      // Create the order object as expected by the API
      const orderPayload = {
        amazonOrderId: formData.amazonOrderId,
        orderStatus: formData.orderStatus,
        purchaseDate: formData.purchaseDate,
        orderTotalAmount: parseFloat(formData.orderTotalAmount),
        orderTotalCurrencyCode: formData.orderTotalCurrencyCode,
        numberOfItemsShipped: parseInt(formData.numberOfItemsShipped),
        numberOfItemsUnshipped: formData.numberOfItemsUnshipped,
        fulfillmentChannel: formData.fulfillmentChannel,
        earliestShipDate: formData.earliestShipDate,
        salesChannel: formData.salesChannel,
        orderType: formData.orderType,
        isPremiumOrder: formData.isPremiumOrder,
        isPrime: formData.isPrime,
        shipmentServiceLevelCategory: formData.shipmentServiceLevelCategory,
        buyerInfoBuyerEmail: formData.buyerInfoBuyerEmail,
        shippingAddressCountryCode: formData.shippingAddressCountryCode,
        paymentMethod: formData.paymentMethod
      };

      const response = await fetch('https://localhost:7224/api/AmazonOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      // Refresh the orders list and close modal
      refreshOrders();
      handleClose();
      
      // Reset form
      setFormData({
        amazonOrderId: '',
        orderStatus: 'Pending',
        purchaseDate: new Date().toISOString().split('T')[0],
        orderTotalAmount: '',
        orderTotalCurrencyCode: 'USD',
        numberOfItemsShipped: 0,
        numberOfItemsUnshipped: false,
        fulfillmentChannel: 'MFN',
        earliestShipDate: '',
        salesChannel: '',
        orderType: 'StandardOrder',
        isPremiumOrder: false,
        isPrime: false,
        shipmentServiceLevelCategory: '',
        buyerInfoBuyerEmail: '',
        shippingAddressCountryCode: '',
        paymentMethod: 'Other'
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Order</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {submitError && (
            <Alert variant="danger" className="mb-3">
              {submitError}
            </Alert>
          )}
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Amazon Order ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="amazonOrderId"
                  value={formData.amazonOrderId}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 123-1234567-1234567"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status *</Form.Label>
                <Form.Select
                  name="orderStatus"
                  value={formData.orderStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Purchase Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fulfillment Channel *</Form.Label>
                <Form.Select
                  name="fulfillmentChannel"
                  value={formData.fulfillmentChannel}
                  onChange={handleChange}
                  required
                >
                  <option value="MFN">Merchant (MFN)</option>
                  <option value="AFN">Amazon (AFN)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Total Amount *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="orderTotalAmount"
                  value={formData.orderTotalAmount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Currency *</Form.Label>
                <Form.Select
                  name="orderTotalCurrencyCode"
                  value={formData.orderTotalCurrencyCode}
                  onChange={handleChange}
                  required
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Items Shipped</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="numberOfItemsShipped"
                  value={formData.numberOfItemsShipped}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Items Unshipped</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="numberOfItemsUnshipped"
                  checked={formData.numberOfItemsUnshipped}
                  onChange={handleChange}
                  label="Has unshipped items"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Order Type</Form.Label>
                <Form.Select
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleChange}
                >
                  <option value="StandardOrder">Standard Order</option>
                  <option value="Preorder">Preorder</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="Other">Other</option>
                  <option value="CreditCard">Credit Card</option>
                  <option value="DebitCard">Debit Card</option>
                  <option value="GiftCard">Gift Card</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Buyer Email</Form.Label>
                <Form.Control
                  type="email"
                  name="buyerInfoBuyerEmail"
                  value={formData.buyerInfoBuyerEmail}
                  onChange={handleChange}
                  placeholder="buyer@example.com"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Country</Form.Label>
                <Form.Control
                  type="text"
                  name="shippingAddressCountryCode"
                  value={formData.shippingAddressCountryCode}
                  onChange={handleChange}
                  placeholder="e.g., US"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              'Create Order'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// Update Order Modal Component
const UpdateOrderModal = ({ show, handleClose, refreshOrders, order }) => {
  const [formData, setFormData] = useState({
    amazonOrderId: '',
    orderStatus: 'Pending',
    purchaseDate: new Date().toISOString().split('T')[0],
    orderTotalAmount: '',
    orderTotalCurrencyCode: 'USD',
    numberOfItemsShipped: 0,
    numberOfItemsUnshipped: false,
    fulfillmentChannel: 'MFN',
    earliestShipDate: '',
    salesChannel: '',
    orderType: 'StandardOrder',
    isPremiumOrder: false,
    isPrime: false,
    shipmentServiceLevelCategory: '',
    buyerInfoBuyerEmail: '',
    shippingAddressCountryCode: '',
    paymentMethod: 'Other'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Update form data when order prop changes
  useEffect(() => {
    if (order) {
      setFormData({
        amazonOrderId: order.amazonOrderId || '',
        orderStatus: order.orderStatus || 'Pending',
        purchaseDate: order.purchaseDate ? new Date(order.purchaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        orderTotalAmount: order.orderTotalAmount || '',
        orderTotalCurrencyCode: order.orderTotalCurrencyCode || 'USD',
        numberOfItemsShipped: order.numberOfItemsShipped || 0,
        numberOfItemsUnshipped: order.numberOfItemsUnshipped || false,
        fulfillmentChannel: order.fulfillmentChannel || 'MFN',
        earliestShipDate: order.earliestShipDate || '',
        salesChannel: order.salesChannel || '',
        orderType: order.orderType || 'StandardOrder',
        isPremiumOrder: order.isPremiumOrder || false,
        isPrime: order.isPrime || false,
        shipmentServiceLevelCategory: order.shipmentServiceLevelCategory || '',
        buyerInfoBuyerEmail: order.buyerInfoBuyerEmail || '',
        shippingAddressCountryCode: order.shippingAddressCountryCode || '',
        paymentMethod: order.paymentMethod || 'Other'
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      // Create the update payload with the correct structure
      const updatePayload = {
        orderId: order.orderId,
        amazonOrderId: formData.amazonOrderId,
        orderStatus: formData.orderStatus,
        purchaseDate: formData.purchaseDate,
        orderTotalAmount: parseFloat(formData.orderTotalAmount),
        orderTotalCurrencyCode: formData.orderTotalCurrencyCode,
        numberOfItemsShipped: parseInt(formData.numberOfItemsShipped),
        numberOfItemsUnshipped: formData.numberOfItemsUnshipped,
        fulfillmentChannel: formData.fulfillmentChannel,
        earliestShipDate: formData.earliestShipDate,
        salesChannel: formData.salesChannel,
        orderType: formData.orderType,
        isPremiumOrder: formData.isPremiumOrder,
        isPrime: formData.isPrime,
        shipmentServiceLevelCategory: formData.shipmentServiceLevelCategory,
        buyerInfoBuyerEmail: formData.buyerInfoBuyerEmail,
        shippingAddressCountryCode: formData.shippingAddressCountryCode,
        paymentMethod: formData.paymentMethod
      };

      const response = await fetch(`https://localhost:7224/api/AmazonOrders/PutOrder?id=${order.orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        // Try to get more detailed error information
        let errorMessage = 'Failed to update order';
        try {
          const errorData = await response.json();
          errorMessage = errorData.title || errorData.message || errorMessage;
          
          // Add validation errors if they exist
          if (errorData.errors) {
            errorMessage += ': ' + Object.entries(errorData.errors)
              .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
              .join('; ');
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Refresh the orders list and close modal
      refreshOrders();
      handleClose();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Order #{order?.orderId}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {submitError && (
            <Alert variant="danger" className="mb-3">
              <strong>Error:</strong> {submitError}
            </Alert>
          )}
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Amazon Order ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="amazonOrderId"
                  value={formData.amazonOrderId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Status *</Form.Label>
                <Form.Select
                  name="orderStatus"
                  value={formData.orderStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Purchase Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fulfillment Channel *</Form.Label>
                <Form.Select
                  name="fulfillmentChannel"
                  value={formData.fulfillmentChannel}
                  onChange={handleChange}
                  required
                >
                  <option value="MFN">Merchant (MFN)</option>
                  <option value="AFN">Amazon (AFN)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Total Amount *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="orderTotalAmount"
                  value={formData.orderTotalAmount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Currency *</Form.Label>
                <Form.Select
                  name="orderTotalCurrencyCode"
                  value={formData.orderTotalCurrencyCode}
                  onChange={handleChange}
                  required
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Items Shipped</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="numberOfItemsShipped"
                  value={formData.numberOfItemsShipped}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Items Unshipped</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="numberOfItemsUnshipped"
                  checked={formData.numberOfItemsUnshipped}
                  onChange={handleChange}
                  label="Has unshipped items"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Order Type</Form.Label>
                <Form.Select
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleChange}
                >
                  <option value="StandardOrder">Standard Order</option>
                  <option value="Preorder">Preorder</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="Other">Other</option>
                  <option value="CreditCard">Credit Card</option>
                  <option value="DebitCard">Debit Card</option>
                  <option value="GiftCard">Gift Card</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Buyer Email</Form.Label>
                <Form.Control
                  type="email"
                  name="buyerInfoBuyerEmail"
                  value={formData.buyerInfoBuyerEmail}
                  onChange={handleChange}
                  placeholder="buyer@example.com"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Shipping Country</Form.Label>
                <Form.Control
                  type="text"
                  name="shippingAddressCountryCode"
                  value={formData.shippingAddressCountryCode}
                  onChange={handleChange}
                  placeholder="e.g., US"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              'Update Order'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default Orders;