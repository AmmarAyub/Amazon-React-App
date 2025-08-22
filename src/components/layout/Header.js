import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import { Avatar } from '@mui/material';
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle, BoxArrowRight, List } from "react-bootstrap-icons";
// import "./Header.css";

const Header = ({ handleDrawerToggle, sidebarCollapsed }) => {
  const user = authService.getCurrentUser();
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <div className={`header-container ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <Navbar
        bg="white"
        variant="light"
        fixed="top"
        expand="sm"
        className="border-bottom py-2 shadow-sm"
      >
        <Container fluid className="px-3">
          {/* Sidebar toggle button */}
          <button
            onClick={handleDrawerToggle}
            className="btn btn-link text-decoration-none p-0 me-3 d-flex align-items-center"
            style={{ 
              width: "40px", 
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6"
            }}
          >
            <List className="fs-5" style={{ color: "#495057" }} />
          </button>

          {/* Spacer to balance the layout */}
          <div className="flex-grow-1"></div>

          {/* User controls */}
          {currentUser ? (
            <Nav className="align-items-center">
              <Dropdown
                show={showDropdown}
                onToggle={(isOpen) => setShowDropdown(isOpen)}
                align="end"
              >
                <Dropdown.Toggle
                  variant="link"
                  className="d-flex align-items-center text-decoration-none p-0 user-dropdown-toggle"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                >
                  <div className="d-flex align-items-center">
                    <div className="d-none d-md-flex flex-column align-items-end me-3">
                      <span className="fw-medium text-dark small">
                        {currentUser.email.split("@")[0]}
                      </span>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                        Administrator
                      </span>
                    </div>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: '#326ea2',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {currentUser.email.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="mt-2 border-0 shadow-lg" style={{ minWidth: '200px' }}>
                  <Dropdown.ItemText className="small text-muted px-3 py-2 border-bottom">
                    Signed in as<br />
                    <strong>{currentUser.email}</strong>
                  </Dropdown.ItemText>
                  <Dropdown.Item 
                    as={Link} 
                    to="/profile" 
                    className="px-3 py-2 d-flex align-items-center"
                  >
                    <PersonCircle className="me-2 text-primary" />
                    Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Divider className="my-1" />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="px-3 py-2 d-flex align-items-center text-danger"
                  >
                    <BoxArrowRight className="me-2" />
                    Sign out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          ) : (
            <Nav className="align-items-center gap-3">
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'primary.main',
                  color: 'white'
                }}
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Link
                to="/user"
                className="text-decoration-none fw-medium text-dark"
              >
                {user?.fullName || user?.userName || 'User'}
              </Link>
              {/* <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm d-flex align-items-center"
                style={{
                  transition: "all 0.2s ease",
                }}
              >
                <BoxArrowRight className="me-1" />
                <span>Sign Out</span>
              </button> */}
                 <button
              onClick={handleLogout}
              className="btn btn-link text-decoration-none p-0"
              style={{
                color: "#6c757d",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#dc3545")}
              onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
            >
              <BoxArrowRight className="me-1" />
              <span>Sign Out</span>
            </button>
            </Nav>
          )}
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;