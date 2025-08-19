import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  // Toolbar,
  Box,
  Avatar,
  Typography,
  styled
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 200;

const AmazonLogo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.primary.main,
  padding: theme.spacing(2, 0, 1, 3),
  display: 'flex',
  alignItems: 'center',
  '&:before': {
    content: '""',
    display: 'inline-block',
    width: '150px',
    height: '50px',
    backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    marginRight: theme.spacing(1),
  }
}));

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Products', icon: <ProductsIcon />, path: '/products' },
    { text: 'Orders', icon: <ProductsIcon />, path: '/orders' },
    { text: 'Users', icon: <UsersIcon />, path: '/users' },
  ];

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: (theme) => theme.palette.background.paper
    }}>
      {/* Logo Section */}
      <AmazonLogo variant="h5" />
        
      
      {/* <Toolbar /> */}
      <Divider />
      
      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mx: 0.25,
              my: 0.5,
              '&.Mui-selected': {
                backgroundColor: (theme) => theme.palette.primary.light,
                color: (theme) => theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: (theme) => theme.palette.primary.main,
                },
              },
              '&:hover': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: '30px',
              color: (theme) => theme.palette.text.secondary
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 'medium' }}
            />
          </ListItem>
        ))}
      </List>
      
      {/* User Profile Section */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: (theme) => `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              mr: 2,
              bgcolor: 'primary.main',
              color: 'white'
            }}
          >
            {currentUser?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {currentUser?.email}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Admin
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: (theme) => theme.shadows[4]
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;