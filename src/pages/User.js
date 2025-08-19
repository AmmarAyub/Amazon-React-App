import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Spinner,
  Alert,
  Button,
  Pagination,
  Card,
  Badge,
  Row,
  Col,
  Form
} from 'react-bootstrap';
import {
  PersonFill,
  EnvelopeFill,
  Building,
  CheckCircleFill,
  XCircleFill,
  // PencilSquare,
  // Trash
} from 'react-bootstrap-icons';
import { useAuth } from '../contexts/AuthContext';

const UserList = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://localhost:7224/api/Auth/Userslist', {
          headers: {
            'Authorization': `Bearer ${currentUser?.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser?.token]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-3">
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
        <Button 
          variant="primary" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-4">User Management</h4>
          
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Status</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((user) => (
                    <tr key={user?.UserId || Math.random()}>
                      <td>
                        <div className="d-flex align-items-center">
                          <PersonFill className="text-primary me-2" />
                          {user?.fullName || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <EnvelopeFill className="text-primary me-2" />
                          {user?.email || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Building className="text-primary me-2" />
                          {user?.companyName || 'N/A'}
                        </div>
                      </td>
                      <td>
                        {user?.userStatus === 'Active' ? (
                          <Badge bg="success" className="d-flex align-items-center">
                            <CheckCircleFill className="me-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge bg="danger" className="d-flex align-items-center">
                            <XCircleFill className="me-1" />
                            Inactive
                          </Badge>
                        )}
                      </td>
                      {/* <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <PencilSquare className="me-1" />
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <Trash className="me-1" />
                          Delete
                        </Button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {users.length > 0 && (
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
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserList;