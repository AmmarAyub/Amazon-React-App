import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline,Toolbar  } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

// Define drawerWidth constant here or in a separate constants file
const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Toolbar /> {/* This pushes content below the app bar */}
        <Outlet /> {/* This is where child routes will render */}
      </Box>
    </Box>
  );
};

export default Layout;