import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  TablePagination
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as CompanyIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const UserList = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>User</TableCell> */}
                
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user?.UserId || Math.random()}>
                          <TableCell>
                        <Box display="flex" alignItems="center">
                          <PersonIcon color="action" sx={{ mr: 1 }} />
                          {user?.fullName || 'N/A'}
                        </Box>
                      </TableCell>
                      {/* <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                          </Avatar>
                          {user?.userName || 'N/A'}
                        </Box>
                      </TableCell> */}
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <EmailIcon color="action" sx={{ mr: 1 }} />
                          {user?.email || 'N/A'}
                        </Box>
                      </TableCell>
                    
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <CompanyIcon color="action" sx={{ mr: 1 }} />
                          {user?.companyName || 'N/A'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {user?.userStatus === 'Active' ? (
                            <>
                              <ActiveIcon color="success" sx={{ mr: 1 }} />
                              Active
                            </>
                          ) : (
                            <>
                              <InactiveIcon color="error" sx={{ mr: 1 }} />
                              Inactive
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="error" size="small">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {users.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
};

export default UserList;