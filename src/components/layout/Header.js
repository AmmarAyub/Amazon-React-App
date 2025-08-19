import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import { Avatar} from '@mui/material';
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle, BoxArrowRight } from "react-bootstrap-icons";

const Header = ({ handleDrawerToggle }) => {
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
    <Navbar
      bg="light"
      variant="light"
      fixed="top"
      expand="sm"
      className="border-bottom py-2"
    >
      <Container fluid className="px-3">
        {/* Mobile menu button */}
        <button
          onClick={handleDrawerToggle}
          className="d-sm-none btn btn-link text-decoration-none p-0 me-3"
          style={{ width: "24px", height: "24px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Brand logo */}
        <Navbar.Brand
          as={Link}
          to="/dashboard"
          className="fw-bold fs-4 me-auto"
          style={{ color: "#326ea2" }}
        >
          AMAZON
        </Navbar.Brand>

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
                className="d-flex align-items-center text-decoration-none p-0"
              >
                <div className="d-flex align-items-center">
                  <PersonCircle
                    className="fs-4 me-2"
                    style={{ color: "#326ea2" }}
                  />
                  <span className="d-none d-md-inline me-2 fw-medium">
                    {currentUser.email.split("@")[0]}
                  </span>
                  <div
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "36px", height: "36px" }}
                  >
                    <span className="text-white fw-medium">
                      {currentUser.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="mt-2 border-0 shadow-sm">
                <Dropdown.ItemText className="small text-muted px-3 py-2">
                  Signed in as {currentUser.email}
                </Dropdown.ItemText>
                <Dropdown.Divider className="my-1" />
                <Dropdown.Item
                  onClick={handleLogout}
                  className="d-flex align-items-center px-3 py-2"
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
                          mr: 0,
                          bgcolor: 'primary.main',
                          color: 'white'
                        }}
                      >
                        {currentUser?.email?.charAt(0).toUpperCase()}
                      </Avatar>
            <Link
              to="/user"
              className="text-decoration-none fw-medium"
              style={{ color: "#326ea2" }}
            >
              {user?.fullName || user?.userName}
            </Link>

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
  );
};

export default Header;
