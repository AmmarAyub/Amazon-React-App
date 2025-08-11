import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Check if current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>AmazonAPI</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={isActive('/dashboard') ? 'active' : ''}>
            <Link to="/dashboard">
              <i className="icon-dashboard"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          
          {currentUser && (
            <>
              <li className={isActive('/products') ? 'active' : ''}>
                <Link to="/products">
                  <i className="icon-products"></i>
                  <span>Products</span>
                </Link>
              </li>
              <li className={isActive('/orders') ? 'active' : ''}>
                <Link to="/orders">
                  <i className="icon-orders"></i>
                  <span>Orders</span>
                </Link>
              </li>
              <li className={isActive('/profile') ? 'active' : ''}>
                <Link to="/profile">
                  <i className="icon-profile"></i>
                  <span>Profile</span>
                </Link>
              </li>
            </>
          )}
          
          {currentUser?.isAdmin && (
            <li className={isActive('/admin') ? 'active' : ''}>
              <Link to="/admin">
                <i className="icon-admin"></i>
                <span>Admin Panel</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="sidebar-footer">
        {currentUser && (
          <div className="user-info">
            <div className="user-avatar">
              {currentUser.email.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{currentUser.email}</span>
              <span className="user-role">{currentUser.isAdmin ? 'Admin' : 'User'}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;