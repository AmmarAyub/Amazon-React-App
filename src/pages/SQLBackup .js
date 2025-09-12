import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./SQLBackup.css";

const SQLBackup = () => {
    const [backupData, setBackupData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const API_URL = 'https://localhost:7224/api/SystemReport/SQLBackup';

    useEffect(() => {
        fetchBackupData();
    }, [retryCount]);

    const fetchBackupData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let response;
            
            // First try POST (common for stored procedures)
            try {
                response = await axios.post(API_URL);
            } catch (postError) {
                // If POST fails, try GET
                try {
                    response = await axios.get(API_URL);
                } catch (getError) {
                    // If both fail, throw the original error
                    throw postError;
                }
            }
            
            // Handle different response structures
            let backupDataResponse;
            if (Array.isArray(response.data)) {
                backupDataResponse = response.data;
            } else if (response.data && response.data.SystemsSQLBackup) {
                backupDataResponse = response.data.SystemsSQLBackup;
            } else if (response.data && response.data.systemsSQLBackup) {
                backupDataResponse = response.data.systemsSQLBackup;
            } else if (response.data) {
                backupDataResponse = response.data;
            } else {
                backupDataResponse = [];
            }
            
            setBackupData(backupDataResponse);
            setLastUpdated(new Date());
            
        } catch (err) {
            console.error('API Error details:', err.response?.data || err.message);
            
            if (err.response?.status === 405) {
                setError('Method not allowed. Please check if the API endpoint requires a specific HTTP method (POST/GET).');
            } else if (err.response?.status === 404) {
                setError('API endpoint not found. Please check the URL.');
            } else if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
                setError('Network error. Please check if the API server is running.');
            } else {
                setError('Failed to fetch backup data. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
        } catch {
            return 'Invalid Date';
        }
    };

    const formatSize = (size) => {
        if (size === null || size === undefined || size === '') return 'N/A';
        try {
            return `${parseFloat(size).toFixed(2)} GB`;
        } catch {
            return size;
        }
    };

    const formatTimeTaken = (timeTaken) => {
        if (timeTaken === null || timeTaken === undefined || timeTaken === '') return 'N/A';
        return `${timeTaken} seconds`;
    };

    const getBackupTypeColor = (type) => {
        if (!type) return '#666';
        type = type.toLowerCase();
        if (type.includes('full')) return '#10b981';
        if (type.includes('differential')) return '#3b82f6';
        if (type.includes('log')) return '#f59e0b';
        return '#666';
    };

    if (loading) {
        return (
            <div className="sql-backup-container">
                <div className="sql-backup-card">
                    <div className="sql-backup-header">
                        <h2>SQL Backup</h2>
                        <div className="backup-count loading">Loading...</div>
                    </div>
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Connecting to database server...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sql-backup-container">
                <div className="sql-backup-card">
                    <div className="sql-backup-header">
                        <h2>SQL Backup</h2>
                        <div className="backup-count error">Error</div>
                    </div>
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <h3>Connection Error</h3>
                        <p>{error}</p>
                        <div className="api-url">
                            API Endpoint: <code>{API_URL}</code>
                        </div>
                        <button onClick={handleRetry} className="retry-button">
                            ↻ Retry Connection
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sql-backup-container">
            <div className="sql-backup-card">
                <div className="sql-backup-header">
                    <div className="header-content">
                        <h2>SQL Backup Status</h2>
                        <div className="header-actions">
                            <div className="backup-count">
                                {backupData.length} backup{backupData.length !== 1 ? 's' : ''}
                            </div>
                            <button onClick={fetchBackupData} className="refresh-button" title="Refresh data">
                                ↻
                            </button>
                        </div>
                    </div>
                    {lastUpdated && (
                        <div className="last-updated">
                            Last updated: {lastUpdated.toLocaleTimeString()}
                        </div>
                    )}
                </div>
                
                <div className="table-container">
                    {backupData.length > 0 ? (
                        <table className="backup-table">
                            <thead>
                                <tr>
                                    <th>Server</th>
                                    <th>Database</th>
                                    <th>Start Date</th>
                                    <th>Finish Date</th>
                                    <th>Duration</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Device Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {backupData.map((item, index) => (
                                    <tr key={index}>
                                        <td data-label="Server">{item.server || 'N/A'}</td>
                                        <td data-label="Database">{item.database_name || 'N/A'}</td>
                                        <td data-label="Start Date">{formatDate(item.backup_start_date)}</td>
                                        <td data-label="Finish Date">{formatDate(item.backup_finish_date)}</td>
                                        <td data-label="Duration">{formatTimeTaken(item.timeTaken)}</td>
                                        <td data-label="Type">
                                            <span 
                                                className="backup-type-badge"
                                                style={{backgroundColor: getBackupTypeColor(item.backup_type)}}
                                            >
                                                {item.backup_type || 'N/A'}
                                            </span>
                                        </td>
                                        <td data-label="Size">{formatSize(item.sizeInGB)}</td>
                                        <td data-label="Device Name" className="device-name">
                                            {item.physical_device_name || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data">
                            <div className="no-data-icon">📂</div>
                            <h3>No backup data found</h3>
                            <p>There are no backups to display at this time.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SQLBackup;