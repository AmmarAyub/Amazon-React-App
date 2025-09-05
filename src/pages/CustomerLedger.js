import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Table, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import "./CustomerLedger.css";

const CustomerLedger = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState({
    customers: false,
    vendors: false,
    transactions: false
  });
  const [counts, setCounts] = useState({
    customers: 0,
    vendors: 0,
    transactions: 0
  });
  const [filters, setFilters] = useState({
    customers: { startDate: '', endDate: '', search: '' },
    vendors: { startDate: '', endDate: '', search: '' },
    transactions: { startDate: '', endDate: '', search: '' }
  });
  const [pagination, setPagination] = useState({
    customers: { page: 1, hasMore: true },
    vendors: { page: 1, hasMore: true },
    transactions: { page: 1, hasMore: true }
  });
  const [loadedTabs, setLoadedTabs] = useState({
    customers: false,
    vendors: false,
    transactions: false
  });
  const [error, setError] = useState(null);

  const customersTableRef = useRef(null);
  const vendorsTableRef = useRef(null);
  const transactionsTableRef = useRef(null);

  // API base URL
  const API_BASE = 'https://localhost:7224/api/CustomerLedger';

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Fetch customers data
  const fetchCustomers = useCallback(async (page = 1, isFiltering = false) => {
    if (loading.customers || (!isFiltering && !pagination.customers.hasMore)) return;
    
    setLoading(prev => ({ ...prev, customers: true }));
    setError(null);
    
    try {
      let url = `${API_BASE}/LoadCustomers`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: page,
          pageSize: 20
        })
      };
      
      if (isFiltering && (filters.customers.startDate || filters.customers.endDate)) {
        url = `${API_BASE}/InvoiceSelectDate`;
        options.body = JSON.stringify({
          startDate: formatDateForAPI(filters.customers.startDate),
          endDate: formatDateForAPI(filters.customers.endDate)
        });
      }
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (isFiltering) {
        setCustomers(data.data || []);
        setCounts(prev => ({ ...prev, customers: data.customercount || 0 }));
        setPagination(prev => ({ ...prev, customers: { page: 1, hasMore: true } }));
      } else {
        setCustomers(prev => [...prev, ...(data.data || [])]);
        setPagination(prev => ({
          ...prev,
          customers: { 
            page: page + 1, 
            hasMore: data.data && data.data.length > 0 
          }
        }));
      }
      
      // Mark customers tab as loaded
      if (!loadedTabs.customers) {
        setLoadedTabs(prev => ({ ...prev, customers: true }));
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError(error.message || 'Failed to fetch customers data');
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  }, [filters.customers, loading.customers, pagination.customers.hasMore, loadedTabs.customers]);

  // Fetch vendors data
  const fetchVendors = useCallback(async (page = 1, isFiltering = false) => {
    if (loading.vendors || (!isFiltering && !pagination.vendors.hasMore)) return;
    
    setLoading(prev => ({ ...prev, vendors: true }));
    setError(null);
    
    try {
      let url = `${API_BASE}/LoadVendors`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: page,
          pageSize: 20
        })
      };
      
      if (isFiltering && (filters.vendors.startDate || filters.vendors.endDate)) {
        url = `${API_BASE}/BillSelectDate`;
        options.body = JSON.stringify({
          startDate: formatDateForAPI(filters.vendors.startDate),
          endDate: formatDateForAPI(filters.vendors.endDate)
        });
      }
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (isFiltering) {
        setVendors(data.data || []);
        setCounts(prev => ({ ...prev, vendors: data.vendorcount || 0 }));
        setPagination(prev => ({ ...prev, vendors: { page: 1, hasMore: true } }));
      } else {
        setVendors(prev => [...prev, ...(data.data || [])]);
        setPagination(prev => ({
          ...prev,
          vendors: { 
            page: page + 1, 
            hasMore: data.data && data.data.length > 0 
          }
        }));
      }
      
      // Mark vendors tab as loaded
      if (!loadedTabs.vendors) {
        setLoadedTabs(prev => ({ ...prev, vendors: true }));
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError(error.message || 'Failed to fetch vendors data');
    } finally {
      setLoading(prev => ({ ...prev, vendors: false }));
    }
  }, [filters.vendors, loading.vendors, pagination.vendors.hasMore, loadedTabs.vendors]);

  // Fetch transactions data
  const fetchTransactions = useCallback(async (page = 1, isFiltering = false) => {
    if (loading.transactions || (!isFiltering && !pagination.transactions.hasMore)) return;
    
    setLoading(prev => ({ ...prev, transactions: true }));
    setError(null);
    
    try {
      let url = `${API_BASE}/LoadTransactions`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: page,
          pageSize: 20
        })
      };
      
      if (isFiltering && (filters.transactions.startDate || filters.transactions.endDate)) {
        url = `${API_BASE}/TransactionDateFilter?startDate=${formatDateForAPI(filters.transactions.startDate)}&endDate=${formatDateForAPI(filters.transactions.endDate)}`;
      } else {
        url = `${url}?page=${page}&pageSize=20`;
      }
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (isFiltering) {
        setTransactions(data.data?.Transactions || []);
        setCounts(prev => ({ ...prev, transactions: data.transaccount || 0 }));
        setPagination(prev => ({ ...prev, transactions: { page: 1, hasMore: true } }));
      } else {
        setTransactions(prev => [...prev, ...(data.data?.Transactions || [])]);
        setPagination(prev => ({
          ...prev,
          transactions: { 
            page: page + 1, 
            hasMore: data.data && data.data.Transactions && data.data.Transactions.length > 0 
          }
        }));
      }
      
      // Mark transactions tab as loaded
      if (!loadedTabs.transactions) {
        setLoadedTabs(prev => ({ ...prev, transactions: true }));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.message || 'Failed to fetch transactions data');
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  }, [filters.transactions, loading.transactions, pagination.transactions.hasMore, loadedTabs.transactions]);

  // Handle tab change
  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    
    // Load data when switching to a tab that hasn't been loaded yet
    if (tab === 'vendors' && !loadedTabs.vendors) {
      fetchVendors(1, false);
    } else if (tab === 'transactions' && !loadedTabs.transactions) {
      fetchTransactions(1, false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (tab, field, value) => {
    setFilters(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  // Apply filters
  const applyFilters = (tab) => {
    if (tab === 'customers') {
      fetchCustomers(1, true);
    } else if (tab === 'vendors') {
      fetchVendors(1, true);
    } else if (tab === 'transactions') {
      fetchTransactions(1, true);
    }
  };

  // Filter data based on search term
  const filterData = (data, tab) => {
    const searchTerm = filters[tab].search.toLowerCase();
    if (!searchTerm) return data;
    
    return data.filter(item => {
      if (tab === 'customers') {
        return (
          (item.Name || '').toLowerCase().includes(searchTerm) ||
          (item.CompanyName || '').toLowerCase().includes(searchTerm)
        );
      } else if (tab === 'vendors') {
        return (
          (item.Name || '').toLowerCase().includes(searchTerm) ||
          (item.CompanyName || '').toLowerCase().includes(searchTerm)
        );
      } else if (tab === 'transactions') {
        return (
          (item.Original_Description || '').toLowerCase().includes(searchTerm) ||
          (item.CompanyCharged || '').toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Set up scroll listeners with proper dependency handling
  useEffect(() => {
    // Handle scroll for infinite loading
    const handleScroll = (ref, tab) => {
      if (!ref.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
      
      if (isNearBottom && !loading[tab]) {
        if (tab === 'customers') {
          fetchCustomers(pagination.customers.page, false);
        } else if (tab === 'vendors') {
          fetchVendors(pagination.vendors.page, false);
        } else if (tab === 'transactions') {
          fetchTransactions(pagination.transactions.page, false);
        }
      }
    };

    const customersScrollHandler = () => handleScroll(customersTableRef, 'customers');
    const vendorsScrollHandler = () => handleScroll(vendorsTableRef, 'vendors');
    const transactionsScrollHandler = () => handleScroll(transactionsTableRef, 'transactions');

    const customersTable = customersTableRef.current;
    const vendorsTable = vendorsTableRef.current;
    const transactionsTable = transactionsTableRef.current;

    if (customersTable) {
      customersTable.addEventListener('scroll', customersScrollHandler);
    }
    if (vendorsTable) {
      vendorsTable.addEventListener('scroll', vendorsScrollHandler);
    }
    if (transactionsTable) {
      transactionsTable.addEventListener('scroll', transactionsScrollHandler);
    }

    // Initial data load - only customers
    if (!loadedTabs.customers) {
      fetchCustomers(1, false);
    }

    return () => {
      if (customersTable) {
        customersTable.removeEventListener('scroll', customersScrollHandler);
      }
      if (vendorsTable) {
        vendorsTable.removeEventListener('scroll', vendorsScrollHandler);
      }
      if (transactionsTable) {
        transactionsTable.removeEventListener('scroll', transactionsScrollHandler);
      }
    };
  }, [fetchCustomers, fetchVendors, fetchTransactions, loading, pagination, loadedTabs.customers]);

  return (
    <Container fluid className="content-wrap py-3">
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
                <Nav variant="tabs" className="nav-tabs-custom nav-justified mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="customers">Customers</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="vendors">Vendors</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="transactions">Transactions</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* Customers Tab */}
                  <Tab.Pane eventKey="customers">
                    <div className="px-3 pb-3">
                      <Row className="align-items-end mb-3">
                        <Col lg={7} md={7} sm={12} className="mb-2">
                          <Row className="g-2 align-items-end">
                            <Col lg={5} md={5} sm={5}>
                              <Form.Label className="small mb-1">From</Form.Label>
                              <Form.Control
                                type="date"
                                value={filters.customers.startDate}
                                onChange={(e) => handleFilterChange('customers', 'startDate', e.target.value)}
                                size="sm"
                              />
                            </Col>
                            <Col lg={5} md={5} sm={5}>
                              <Form.Label className="small mb-1">To</Form.Label>
                              <Form.Control
                                type="date"
                                value={filters.customers.endDate}
                                onChange={(e) => handleFilterChange('customers', 'endDate', e.target.value)}
                                size="sm"
                              />
                            </Col>
                            <Col lg={2} md={2} sm={2} className="mb-1">
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => applyFilters('customers')}
                                disabled={loading.customers}
                                className="w-100"
                              >
                                {loading.customers ? <Spinner animation="border" size="sm" /> : 'Filter'}
                              </Button>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={5} md={5} sm={12} className="ps-lg-4 mb-2 border-start border-secondary">
                          <Row className="g-2 align-items-end">
                            <Col lg={7} md={7} sm={7}>
                              <Form.Label className="small mb-1">Search Customers</Form.Label>
                              <InputGroup size="sm">
                                <InputGroup.Text className="bg-light">
                                  <i className="fas fa-search"></i>
                                </InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  placeholder="Search customers..."
                                  value={filters.customers.search}
                                  onChange={(e) => handleFilterChange('customers', 'search', e.target.value)}
                                />
                              </InputGroup>
                            </Col>
                            <Col lg={5} md={5} sm={5} className="text-nowrap">
                              <h6 className="mb-0">Total: <span className="fw-bold">{counts.customers}</span></h6>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <div className="table-responsive">
                        <Table striped bordered hover size="sm" className="mb-0">
                          <thead className="table-dark">
                            <tr>
                              <th width="17%">Name</th>
                              <th width="30%">Company Name</th>
                              <th width="6%">Type</th>
                              <th width="12%">Reference</th>
                              <th width="8%">Invoice ID</th>
                              <th width="10%">Date</th>
                              <th width="17%">Invoice Total</th>
                            </tr>
                          </thead>
                        </Table>
                        <div 
                          ref={customersTableRef} 
                          className="table-scroll-container"
                          style={{ maxHeight: '500px', overflowY: 'auto' }}
                        >
                          <Table striped bordered hover size="sm" className="mb-0">
                            <tbody>
                              {filterData(customers, 'customers').map((customer, index) => (
                                <tr key={index}>
                                  <td width="17%" className="align-middle">
                                    {customer.name || '-'}
                                  </td>
                                  <td width="30%" className="align-middle">
                                    {customer.companyName || '-'}
                                  </td>
                                  <td width="6%" className="align-middle text-center">
                                    {customer.typeofTran || '-'}
                                  </td>
                                  <td width="12%" className="align-middle">
                                    {customer.ref || '-'}
                                  </td>
                                  <td width="8%" className="align-middle">
                                    {customer.invoiceID || '-'}
                                  </td>
                                  <td width="10%" className="align-middle">
                                    {formatDate(customer.dates)}
                                  </td>
                                  <td width="17%" className="align-middle text-end">
                                    {formatCurrency(customer.invoiceTotal)}
                                  </td>
                                </tr>
                              ))}
                              {loading.customers && (
                                <tr>
                                  <td colSpan={7} className="text-center py-3">
                                    <Spinner animation="border" size="sm" />
                                  </td>
                                </tr>
                              )}
                              {customers.length === 0 && !loading.customers && (
                                <tr>
                                  <td colSpan={7} className="text-center py-3">No customers found</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>

                  {/* Vendors Tab */}
                  <Tab.Pane eventKey="vendors">
                    <div className="px-3 pb-3">
                      <Row className="align-items-end mb-3">
                        <Col lg={7} md={7} sm={12} className="mb-2">
                          <Row className="g-2 align-items-end">
                            <Col lg={5} md={5} sm={5}>
                              <Form.Label className="small mb-1">From</Form.Label>
                              <Form.Control
                                type="date"
                                value={filters.vendors.startDate}
                                onChange={(e) => handleFilterChange('vendors', 'startDate', e.target.value)}
                                size="sm"
                              />
                            </Col>
                            <Col lg={5} md={5} sm={5}>
                              <Form.Label className="small mb-1">To</Form.Label>
                              <Form.Control
                                type="date"
                                value={filters.vendors.endDate}
                                onChange={(e) => handleFilterChange('vendors', 'endDate', e.target.value)}
                                size="sm"
                              />
                            </Col>
                            <Col lg={2} md={2} sm={2} className="mb-1">
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => applyFilters('vendors')}
                                disabled={loading.vendors}
                                className="w-100"
                              >
                                {loading.vendors ? <Spinner animation="border" size="sm" /> : 'Filter'}
                              </Button>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={5} md={5} sm={12} className="ps-lg-4 mb-2 border-start border-secondary">
                          <Row className="g-2 align-items-end">
                            <Col lg={7} md={7} sm={7}>
                              <Form.Label className="small mb-1">Search Vendors</Form.Label>
                              <InputGroup size="sm">
                                <InputGroup.Text className="bg-light">
                                  <i className="fas fa-search"></i>
                                </InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  placeholder="Search vendors..."
                                  value={filters.vendors.search}
                                  onChange={(e) => handleFilterChange('vendors', 'search', e.target.value)}
                                />
                              </InputGroup>
                            </Col>
                            <Col lg={5} md={5} sm={5} className="text-nowrap">
                              <h6 className="mb-0">Total: <span className="fw-bold">{counts.vendors}</span></h6>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <div className="table-responsive">
                        <Table striped bordered hover size="sm" className="mb-0">
                          <thead className="table-dark">
                            <tr>
                              <th width="16%">Name</th>
                              <th width="28%">Company Name</th>
                              <th width="10%">Type</th>
                              <th width="10%">Reference</th>
                              <th width="8%">Bill ID</th>
                              <th width="10%">Date</th>
                              <th width="18%">Bill Total</th>
                            </tr>
                          </thead>
                        </Table>
                        <div 
                          ref={vendorsTableRef} 
                          className="table-scroll-container"
                          style={{ maxHeight: '500px', overflowY: 'auto' }}
                        >
                          <Table striped bordered hover size="sm" className="mb-0">
                            <tbody>
                              {!loadedTabs.vendors && !loading.vendors && (
                                <tr>
                                  <td colSpan={7} className="text-center py-3">
                                    <p className="mb-0">Click "Filter" to load vendors or switch to this tab to load automatically</p>
                                  </td>
                                </tr>
                              )}
                              {filterData(vendors, 'vendors').map((vendor, index) => (
                                <tr key={index}>
                                  <td width="16%" className="align-middle">
                                    {vendor.name || '-'}
                                  </td>
                                  <td width="28%" className="align-middle">
                                    {vendor.companyName || '-'}
                                  </td>
                                  <td width="10%" className="align-middle text-center">
                                    {vendor.typeofTran || '-'}
                                  </td>
                                  <td width="10%" className="align-middle">
                                    {vendor.ref || '-'}
                                  </td>
                                  <td width="8%" className="align-middle">
                                    {vendor.billID || '-'}
                                  </td>
                                  <td width="10%" className="align-middle">
                                    {formatDate(vendor.date)}
                                  </td>
                                  <td width="18%" className="align-middle text-end">
                                    {formatCurrency(vendor.billTotal)}
                                  </td>
                                </tr>
                              ))}
                              {loading.vendors && (
                                <tr>
                                  <td colSpan={7} className="text-center py-3">
                                    <Spinner animation="border" size="sm" />
                                  </td>
                                </tr>
                              )}
                              {vendors.length === 0 && loadedTabs.vendors && !loading.vendors && (
                                <tr>
                                  <td colSpan={7} className="text-center py-3">No vendors found</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>

                  {/* Transactions Tab */}
                  <Tab.Pane eventKey="transactions">
                    <div className="px-3 pb-3">
                      <Row className="align-items-end mb-3">
                        <Col lg={7} md={7} sm={12} className="mb-2">
                          <Row className="g-2 align-items-end">
                            <Col lg={5} md={5} sm={5}>
                              <Form.Label className="small mb-1">From</Form.Label>
                              <Form.Control
                                type="date"
                                value={filters.transactions.startDate}
                                onChange={(e) => handleFilterChange('transactions', 'startDate', e.target.value)}
                                size="sm"
                              />
                            </Col>
                            <Col lg={5} md={5} sm={5}>
                              <Form.Label className="small mb-1">To</Form.Label>
                              <Form.Control
                                type="date"
                                value={filters.transactions.endDate}
                                onChange={(e) => handleFilterChange('transactions', 'endDate', e.target.value)}
                                size="sm"
                              />
                            </Col>
                            <Col lg={2} md={2} sm={2} className="mb-1">
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => applyFilters('transactions')}
                                disabled={loading.transactions}
                                className="w-100"
                              >
                                {loading.transactions ? <Spinner animation="border" size="sm" /> : 'Filter'}
                              </Button>
                            </Col>
                          </Row>
                        </Col>

                        <Col lg={5} md={5} sm={12} className="ps-lg-4 mb-2 border-start border-secondary">
                          <Row className="g-2 align-items-end">
                            <Col lg={7} md={7} sm={7}>
                              <Form.Label className="small mb-1">Search Transactions</Form.Label>
                              <InputGroup size="sm">
                                <InputGroup.Text className="bg-light">
                                  <i className="fas fa-search"></i>
                                </InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  placeholder="Search transactions..."
                                  value={filters.transactions.search}
                                  onChange={(e) => handleFilterChange('transactions', 'search', e.target.value)}
                                />
                              </InputGroup>
                            </Col>
                            <Col lg={5} md={5} sm={5} className="text-nowrap">
                              <h6 className="mb-0">Total: <span className="fw-bold">{counts.transactions}</span></h6>
                            </Col>
                          </Row>
                        </Col>
                      </Row>

                      <div className="table-responsive">
                        <Table striped bordered hover size="sm" className="mb-0">
                          <thead className="table-dark">
                            <tr>
                              <th width="10%">Date</th>
                              <th width="38%">Description</th>
                              <th width="10%">Account ID</th>
                              <th width="23%">Company Charged</th>
                              <th width="7%">Type</th>
                              <th width="12%">Amount</th>
                            </tr>
                          </thead>
                        </Table>
                        <div 
                          ref={transactionsTableRef} 
                          className="table-scroll-container"
                          style={{ maxHeight: '500px', overflowY: 'auto' }}
                        >
                          <Table striped bordered hover size="sm" className="mb-0">
                            <tbody>
                              {!loadedTabs.transactions && !loading.transactions && (
                                <tr>
                                  <td colSpan={6} className="text-center py-3">
                                    <p className="mb-0">Click "Filter" to load transactions or switch to this tab to load automatically</p>
                                  </td>
                                </tr>
                              )}
                              {filterData(transactions, 'transactions').map((transaction, index) => (
                                <tr key={index}>
                                  <td width="10%" className="align-middle">
                                    {formatDate(transaction.date)}
                                  </td>
                                  <td width="38%" className="align-middle">
                                    {transaction.original_Description || '-'}
                                  </td>
                                  <td width="10%" className="align-middle">
                                    {transaction.account_Id || '-'}
                                  </td>
                                  <td width="23%" className="align-middle">
                                    {transaction.companyCharged || '-'}
                                  </td>
                                  <td width="7%" className="align-middle text-center">
                                    {transaction.transaction_Type || '-'}
                                  </td>
                                  <td width="12%" className="align-middle text-end">
                                    {formatCurrency(transaction.amount)}
                                  </td>
                                </tr>
                              ))}
                              {loading.transactions && (
                                <tr>
                                  <td colSpan={6} className="text-center py-3">
                                    <Spinner animation="border" size="sm" />
                                  </td>
                                </tr>
                              )}
                              {transactions.length === 0 && loadedTabs.transactions && !loading.transactions && (
                                <tr>
                                  <td colSpan={6} className="text-center py-3">No transactions found</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerLedger;