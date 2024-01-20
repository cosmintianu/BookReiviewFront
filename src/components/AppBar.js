// AppBar.js
import React, { useEffect } from 'react';
import { AppBar as MuiAppBar, Toolbar, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the path accordingly

const AppBar = () => {
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth(); // Add isAuthenticated from the AuthContext

  // Check if the current route is "/login"
  const isLoginPage = location.pathname === '/login';
  const isCreatePage =location.pathname === '/create-account';

  useEffect(() => {
    // Force a re-render when the authentication status changes
  }, [isAuthenticated]);

  if (isLoginPage || isCreatePage) {
    return null; // Don't render AppBar on the login page
  }

  return (
    <MuiAppBar position="static" style={{display :'flex', boxShadow:'rgba(0, 0, 0, 0.15)',background:'#e6d9be',color:'#1e1915',
    fontStretch:'expanded'}}>
      <Toolbar>
        <Button color="inherit" component={Link} to="/home">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/add-book">
          Add Book
        </Button>
        <Button color="inherit" component={Link} to="/book-list" style={{marginRight:'1150px'}}>
          Book List
        </Button>
        {isAuthenticated ? (
          <div style={{position : 'relative', left:'40px'}}>
            {/* Button for user profile */}
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            {/* Logout button */}
            <Button color="inherit" onClick={logout} component={Link} to="/home">
              Logout
            </Button>
          </div>
        ) : (
          <div>
          <Button color="inherit" component={Link} to="/create-account"
          style={{position: 'relative',left:'40px',top:0,whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',}}
          >
              Sign Up
            </Button>

          <Button color="inherit" component={Link} to="/login"
          style={{position: 'relative',left:'50px'}}>
            Login
          </Button>
          </div>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
