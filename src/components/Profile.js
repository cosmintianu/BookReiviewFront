import React, { useEffect, useState } from 'react';
import { Typography, Paper, TextField } from '@mui/material';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState({});
  const username = localStorage.getItem('username');
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const {logout} = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/findByUsername/${username}`
        );

        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

      if (username) {
      fetchUserData();
    }
  }, [username]);

  const handleEditClick = () => {
    setEditMode(true);
    setEditedUserData(userData);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:8080/user/update/${userData.id}`, editedUserData);
      setEditMode(false);
      localStorage.removeItem('username');
      localStorage.setItem('username', editedUserData.username);
      // Refetch user data after update
      const response = await axios.get(`http://localhost:8080/user/findByUsername/${username}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error updating user data:', error);
      // Handle error as needed
    }
  };

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8080/user/delete/${userData.id}`);
      // Redirect or perform any additional actions after account deletion
      // For now, let's alert a message
      alert('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      // Handle error as needed
    }
    logout();
    navigate('/home');
  };



  return (
    <div style={{ padding: '20px' ,display:'flex',alignContent:'center',alignItems:'center',background:'',height:'100vh'}}>
    <h2 style = {{margin:'20px',position:'relative',top:'-45vh',left:'575px'}}>My Profile</h2>
      <div style={{position:'relative',top:'-20px'}}>
      {userData ? (
        <Paper elevation={0} style={{ padding: '20px', maxWidth: '400px' }}>
          {editMode ? (
            <>
            <div style={{position:'relative',top:'-120px',left:'400px'}}>
              <TextField
                label="Username"
                name="username"
                value={editedUserData.username}
                onChange={handleInputChange}
                fullWidth
                style={{margin:'10px'}}
              />
              <TextField
                label="E-mail"
                name="email"
                value={editedUserData.email}
                onChange={handleInputChange}
                fullWidth
                style={{margin:'10px'}}
              />
              <TextField
                label="Password"
                name="password"
                value={editedUserData.password}
                onChange={handleInputChange}
                fullWidth
                style={{margin:'10px'}}
              />
              <TextField
                label="Age"
                name="age"
                type="number"
                value={editedUserData.age}
                onChange={handleInputChange}
                fullWidth
                style={{margin:'10px'}}
              />
              {/* Add more fields as needed */}
              <button variant="contained" color="primary" onClick={handleSaveChanges}
              style={{position:'relative',left:'307px',top:'20px'}}
              >
                Save Changes
              </button>
              <button variant="outlined" color="secondary" onClick={handleCancelEdit}
              style={{position:'relative',left:'-93px',top:'20px'}}
              >
                Cancel
              </button>
              </div>
            </>
          ) : (
            <Typography variant="h6" gutterBottom style = {{margin:'20px',position:'relative',top:'-15vh',left:'400px'}}>
              <p>Username: {userData.username}</p>
              <p>E-mail: {userData.email}</p>

                  <div>
                    <p>
                      Password: {showPassword ? userData.password : '******'}
                      <button onClick={() => setShowPassword(!showPassword)}
                      style={{position:'absolute',left:'200px',top:'100px'}}
                      >
                        {showPassword ? 'Hide Password' : 'Show Password'}
                      </button>
                    </p>
                  </div>

              
              <p>Age: {userData.age}</p>
              <p>Roles: {userData.roles.map((role, index) => (index === 0 ? role.roleName : `, ${role.roleName}`))}</p>
            </Typography>
          )}
        </Paper>
      ) : (
        <p>Please Login to see your Profile.</p>
      )}
      </div>
      <br />
      {!editMode && (
        <button variant="contained" color="primary" onClick={handleEditClick}
        style={{position:'absolute',left :'815px',top:'120px',height:40}}>
          Edit Profile
        </button>
        
      )}
      <button variant="outlined" color="secondary" onClick={handleDeleteConfirmation}
            style={{ position: 'absolute', left: '915px', top: '120px', height: 40 }}>
            Delete Account
          </button>
       {showDeleteConfirmation && (
        <div style={{ position: 'absolute', top: '200px', left: '815px', backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p>Are you sure you want to delete your account?</p>
          <button onClick={handleDeleteAccount}>Yes</button>
          <button onClick={handleCancelDelete}>No</button>
        </div>
      )}   
    </div>
    
  );
};

export default Profile;
