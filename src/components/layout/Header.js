import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// import authService from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ handleDrawerToggle }) => {
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    debugger;
      logout();
      navigate('/login');
    };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          AmazonAPI Dashboard
        </Typography>
        
        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              onClick={handleMenuOpen}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1,
                  bgcolor: 'primary.main'
                }}
              >
                {currentUser.email.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {currentUser.email}
              </Typography>
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button 
              component={Link} 
              to="/login" 
              color="inherit"
              sx={{ mr: 1 }}
            >
              Login
            </Button>
            <Button 
              component={Link} 
              to="/register" 
              variant="contained"
              color="primary"
            >
              Register
            </Button>
              <Button
                      variant="contained"
                      color="error"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;