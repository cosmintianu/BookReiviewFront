// Import React and necessary components
import React from 'react';

// Functional component for the Home page
const Home = () => {
  return (
    <div className="home-container" style={{background:'',marginTop:50,maxWidth:1500,marginLeft:50}}>
      <header>
        <h1>Book Review Site</h1>
        <p>Welcome to our book review platform!</p>
      </header>

      <section className="featured-books">
        <h2>Upcoming Releases</h2>
        <div className="book-list">
          {/* Display some featured books here */}
          <div className="book-card">
            {/* <img src="book1.jpg" alt="Book 1" /> */}
            <h3>The Art of Time Travel</h3>
            <p>Author: Kate Aron</p>
            <p>A fascinating exploration of time travel theories and their impact on culture.</p>
          </div>
          <div className="book-card">
            {/* <img src="book2.jpg" alt="Book 2" /> */}
            <h3>Beyond the Stars</h3>
            <p>Author: Alex Celestial</p>
            <p>An intergalactic adventure that takes readers on a journey through distant galaxies.</p>
          </div>
        </div>
      </section>

      <section className="about-us">
        <h2>About Us</h2>
        <p>
          Welcome to Book Review Site, your go-to platform for insightful book reviews and literary discussions. 
          Our mission is to connect book enthusiasts, share diverse perspectives, and inspire a love for reading.
        </p>
        <p>
          At Book Review Site, we believe in the power of storytelling to broaden minds and foster empathy. 
          Whether you're a seasoned reader or just starting your literary journey, you'll find a community of 
          like-minded individuals who share your passion for the written word.
        </p>
      </section>
    </div>
  );
};

export default Home;
