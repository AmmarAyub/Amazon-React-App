import React from 'react';
import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Assuming you have auth context
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-bold">AmazonAPI</Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {currentUser ? (
          <>
            <span>Welcome, {currentUser.email}</span>
            <button 
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;