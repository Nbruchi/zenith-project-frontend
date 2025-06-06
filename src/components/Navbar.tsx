import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const user = sessionStorage.getItem('user')

  return (
    <div>
      {user?.role === "ADMIN" && (
        <Link
          to="/admin/users"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Manage Users
        </Link>
      )}
    </div>
  );
};

export default Navbar; 