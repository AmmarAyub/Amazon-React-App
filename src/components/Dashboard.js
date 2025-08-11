import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TableSortLabel
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const [orderStats, setOrderStats] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalProfit: 0,
    totalLoss: 0,
    netProfit: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    profitChange: 0,
    orderChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('OrderCounts');
  const [order, setOrder] = useState('desc');

  // Fetch order statistics from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch order stats
        const statsResponse = await fetch('https://localhost:7224/api/AmazonOrders/stats');
        debugger;
       if (!statsResponse.ok) throw new Error('Failed to fetch');
        const statsData = await statsResponse.json();
        setOrderStats(statsData);

     
        debugger;
        // Calculate dashboard metrics from the stats
             const totalOrders = statsData.reduce((sum, item) => sum + (item.orderCounts || 0), 0);
        // const totalOrders = statsData.reduce((sum, item) => sum + item.orderCounts, 0);
        const shippedOrders = statsData.find(item => item.orderStatus === 'Shipped')?.orderCounts || 0;
        const pendingOrders = statsData.find(item => item.orderStatus === 'Pending')?.orderCounts || 0;

        // Parse currency values (assuming format like "$1,250.00")
        // const parseCurrency = (value) =>
        //   parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;

        // const totalValue = statsData.reduce(
        //   (sum, item) => sum + parseCurrency(item.OrderTotal), 0
        // );
        const totalValue = statsData.reduce((total, item) => {
          const orderTotal = item.OrderTotal?.toString() || '0'; // Handle undefined/null
          return total + (parseFloat(orderTotal.replace(/[^0-9.-]+/g, '')) || 0);
        }, 0);
        debugger;
        setDashboardData(prev => ({
          ...prev,
          totalProfit: totalValue * 0.3, // Example calculation
          totalLoss: totalValue * 0.05,  // Example calculation
          netProfit: totalValue * 0.25,  // Example calculation
          totalOrders: totalOrders,
          shippedOrders,
          pendingOrders,
          profitChange: 12, // Hardcoded for example
          orderChange: 5    // Hardcoded for example
          }));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedStats = [...orderStats].sort((a, b) => {
    // Special handling for currency values
    if (orderBy === 'OrderTotal') {
      const aValue = parseFloat(a[orderBy].replace(/[^0-9.-]+/g, '')) || 0;
      const bValue = parseFloat(b[orderBy].replace(/[^0-9.-]+/g, '')) || 0;
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return order === 'asc'
      ? a[orderBy] > b[orderBy] ? 1 : -1
      : a[orderBy] < b[orderBy] ? 1 : -1;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Welcome, {user?.fullName || user?.userName}!
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Net Profit Card */}
        <Grid xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Avatar sx={{ bgcolor: 'success.light', mb: 2 }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Typography color="textSecondary" gutterBottom>
                  Net Profit
                </Typography>
              </Box>
              <Typography variant="h5" component="div">
                ${dashboardData.netProfit.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                {dashboardData.profitChange > 0 ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Typography
                  variant="body2"
                  sx={{ ml: 1, color: dashboardData.profitChange > 0 ? 'success.main' : 'error.main' }}
                >
                  {dashboardData.profitChange}% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Orders Card */}
        <Grid xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Avatar sx={{ bgcolor: 'info.light', mb: 2 }}>
                  <ShoppingCartIcon />
                </Avatar>
                <Typography color="textSecondary" gutterBottom>
                  Total Orders
                </Typography>
              </Box>
              <Typography variant="h5" component="div">
                {dashboardData.totalOrders}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                {dashboardData.orderChange > 0 ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Typography
                  variant="body2"
                  sx={{ ml: 1, color: dashboardData.orderChange > 0 ? 'success.main' : 'error.main' }}
                >
                  {dashboardData.orderChange}% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Status Card */}
        <Grid xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Order Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Completed: {dashboardData.shippedOrders} (
                  {dashboardData.totalOrders > 0
                    ? Math.round((dashboardData.shippedOrders / dashboardData.totalOrders) * 100)
                    : 0
                  }%)
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    dashboardData.totalOrders > 0
                      ? (dashboardData.shippedOrders / dashboardData.totalOrders) * 100
                      : 0
                  }
                  color="success"
                  sx={{ height: 8, mt: 1 }}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Pending: {dashboardData.pendingOrders} (
                  {dashboardData.totalOrders > 0
                    ? Math.round((dashboardData.pendingOrders / dashboardData.totalOrders) * 100)
                    : 0
                  }%)
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    dashboardData.totalOrders > 0
                      ? (dashboardData.pendingOrders / dashboardData.totalOrders) * 100
                      : 0
                  }
                  color="warning"
                  sx={{ height: 8, mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Statistics Table */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Status Statistics
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 2 }}>
              Error loading data: {error}
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'OrderStatus'}
                        direction={orderBy === 'OrderStatus' ? order : 'asc'}
                        onClick={() => handleSort('OrderStatus')}
                      >
                        Order Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'OrderCounts'}
                        direction={orderBy === 'OrderCounts' ? order : 'desc'}
                        onClick={() => handleSort('OrderCounts')}
                      >
                        Order Count
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">
                      <TableSortLabel
                        active={orderBy === 'OrderTotal'}
                        direction={orderBy === 'OrderTotal' ? order : 'desc'}
                        onClick={() => handleSort('OrderTotal')}
                      >
                        Total Value
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell>{stat.orderStatus}</TableCell>
                      <TableCell align="right">{stat.orderCounts}</TableCell>
                      <TableCell align="right">{stat.orderTotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* User Details Section */}
      <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Typography variant="body1" paragraph>
              <strong>Company:</strong> {user?.companyName || 'N/A'}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Email:</strong> {user?.email || 'N/A'}
            </Typography>
          </Grid>
          <Grid xs={12} md={6}>
            <Typography variant="body1" paragraph>
              <strong>Account Type:</strong> {user?.isAdmin ? 'Admin' : 'Standard'}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Last Login:</strong> {user?.lastLogin || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;