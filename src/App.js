// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AddBookForm from './components/AddBookForm';
import AppBar from './components/AppBar';
import BookList from './components/BookList'; 
import IndividualBookPage from './components/IndividualBookPage';
import Profile from './components/Profile'; // Import the Profile component
import { AuthProvider } from './components/AuthContext';
import CreateAccountPage from './components/CreateAccount';
import Home from './components/Home';

//const Home = () => <div>Home Page</div>;

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div>
          <AppBar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add-book" element={<AddBookForm />} />
            <Route path="/book-list" element={<BookList />} />
            <Route path="/book/:id" element={<IndividualBookPage />} />
            {/* Add a new route for the user profile */}
            <Route path="/profile" element={<Profile />} />
            {/* Redirect to the login page if no matching route */}
            <Route path="/*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
