import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Box,
  Avatar,
  Typography,
  styled,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  People as UsersIcon,
  ChevronLeft,
  ChevronRight,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;
const collapsedWidth = 70;

const AmazonLogo = styled(Box)(({ theme, collapsed }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2, 1),
  minHeight: '64px',
  '& .amazon-logo': {
    width: collapsed ? '30px' : '120px',
    height: '30px',
    backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    transition: 'width 0.3s ease'
  }
}));

const ToggleButton = styled(IconButton)(({ theme, collapsed }) => ({
  position: 'absolute',
  top: '70px',
  right: '-16px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  zIndex: 1200,
  width: '32px',
  height: '32px',
  '&:hover': {
    backgroundColor: theme.palette.grey[100]
  }
}));

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

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
      backgroundColor: (theme) => theme.palette.background.paper,
      overflow: 'hidden',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      msOverflowStyle: 'none',
      scrollbarWidth: 'none'
    }}>
      {/* Logo Section - Centered */}
      <AmazonLogo collapsed={collapsed}>
        <div className="amazon-logo" />
      </AmazonLogo>
      
      <Divider />
      
      {/* Menu Items */}
      <List sx={{ 
        flexGrow: 1,
        overflow: 'hidden',
        '&:hover': {
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '2px'
          }
        }
      }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              justifyContent: collapsed ? 'center' : 'flex-start',
              minHeight: '48px',
              '&.Mui-selected': {
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.primary.contrastText,
                '& .MuiListItemIcon-root': {
                  color: (theme) => theme.palette.primary.contrastText,
                },
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                }
              },
              '&:hover': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <Tooltip title={collapsed ? item.text : ''} placement="right">
              <ListItemIcon sx={{ 
                minWidth: 'auto',
                mr: collapsed ? 0 : 2,
                justifyContent: 'center',
                color: 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {!collapsed && (
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.9rem',
                  fontWeight: 'medium' 
                }}
              />
            )}
          </ListItem>
        ))}
      </List>
      
      {/* User Profile Section */}
      <Box sx={{ 
        p: collapsed ? 1 : 2, 
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: (theme) => `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              mr: collapsed ? 0 : 2,
              bgcolor: 'primary.main',
              color: 'white'
            }}
          >
            {currentUser?.email?.charAt(0).toUpperCase()}
          </Avatar>
          {!collapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" fontWeight="medium" noWrap>
                {currentUser?.email}
              </Typography>
              <Typography variant="caption" color="textSecondary" noWrap>
                Admin
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Toggle Button */}
      <ToggleButton 
        collapsed={collapsed} 
        onClick={toggleSidebar}
        sx={{
          display: { xs: 'none', sm: 'flex' }
        }}
      >
        {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
      </ToggleButton>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { 
          sm: collapsed ? collapsedWidth : drawerWidth 
        }, 
        flexShrink: { sm: 0 },
        transition: 'width 0.3s ease'
      }}
    >
      {/* Mobile drawer toggle */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          mr: 2, 
          display: { sm: 'none' },
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1300,
          backgroundColor: 'background.paper',
          boxShadow: 1
        }}
      >
        <MenuIcon />
      </IconButton>
      
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
            width: collapsed ? collapsedWidth : drawerWidth,
            borderRight: 'none',
            boxShadow: (theme) => theme.shadows[3],
            transition: 'width 0.3s ease',
            overflow: 'hidden'
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