import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const IndividualBookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [userDataReady, setUserDataReady] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [newComment, setNewComment] = useState({
    text: '',
  });
    const [editedReviewData, setEditedReviewData] = useState({
    rating: 0,
    text: '',
  });
  const [editingReview, setEditingReview] = useState(null);
 
  // State for new review
  const [newReview, setNewReview] = useState({
    user: {
      id: null, // Replace with the actual user ID from authentication
    },
    book: {
      id: id, // Set the book ID to the current page's book ID
    },
    rating: 0,
    text: "",
    date: "16-01-2024", // You can update the date format as needed
    comments: [],
  });

 useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch individual book details based on the ID
      const bookResponse = await fetch(`http://localhost:8080/book/${id}`);
      const bookData = await bookResponse.json();
      setBook(bookData);

      // Update the book ID in newReview when the book data is available
      setNewReview((prevReview) => ({
        ...prevReview,
        book: {
          id: bookData.id,
        },
      }));

      // Fetch reviews for the individual book
      const reviewsResponse = await fetch(`http://localhost:8080/review/book/${id}`);
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData);

      // Fetch comments for each review and update the state
      const commentsPromises = reviewsData.map(async (review) => {
        const commentsResponse = await fetch(`http://localhost:8080/comment/review/${review.id}`);
        const commentsData = await commentsResponse.json();
        return { reviewId: review.id, comments: commentsData };
      });

      const commentsData = await Promise.all(commentsPromises);
      const commentsObject = commentsData.reduce((acc, { reviewId, comments }) => {
        acc[reviewId] = comments;
        return acc;
      }, {});

      setComments(commentsObject);
    } catch (error) {
      console.error(`Error fetching book ${id} details:`, error);
    }

    // Fetch user data
    try {
      const userDataResponse = await axios.get(`http://localhost:8080/user/findByUsername/${localStorage.getItem('username')}`);
      setUserData(userDataResponse.data);
      setUserDataReady(true); // Indicate that user data is ready
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    setLoadingReviews(false);
  };

  fetchData();
}, [id]);


useEffect(() => {
    if (userDataReady && newReview.user.id === null) {
      setNewReview((prevReview) => ({
        ...prevReview,
        user: {
          id: userData.id,
        },
      }));
    }
  }, [userDataReady, newReview, userData]);


  

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      // Set the current date
      const currentDate = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const formattedDate = currentDate.toLocaleDateString('en-GB', options);

      // Update the newReview object with the current date
      setNewReview((prevReview) => ({
        ...prevReview,
        date: formattedDate,
      }));

      // Send the new review to the server using Axios
      await axios.post('http://localhost:8080/review/add', newReview, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Refetch reviews from the server after submitting a new review
      const updatedReviewsResponse = await fetch(`http://localhost:8080/review/book/${id}`);
      const updatedReviewsData = await updatedReviewsResponse.json();

      setReviews(updatedReviewsData);

      const lastAddedReview = updatedReviewsData[updatedReviewsData.length - 1];
      const updatedCommentsResponse = await fetch(`http://localhost:8080/comment/review/${lastAddedReview.id}`);
      const updatedCommentsData = await updatedCommentsResponse.json();

      // Update comments state by adding comments for the last added review
      setComments((prevComments) => ({
        ...prevComments,
        [lastAddedReview.id]: updatedCommentsData,
      }));

      // Clear the new review form
      setNewReview({
        user: {
          id: userData.id,
        },
        book: {
          id: id,
        },
        rating: 0,
        text: "",
        date: formattedDate, // Set the date to the current date
        comments:[],
      });
    
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error as needed
    }
  };
  

  const handleDeleteBook = () => {
  if (isAdmin) {

    axios.delete('http://localhost:8080/book/deleteByTitle', {
      data: { title : book.title }, // Pass the bookId as data for the DELETE request
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Book deleted successfully:', response.data);
        navigate('/book-list');
        // You may want to navigate to a different page or update the UI as needed
      })
      .catch(error => {
        console.error('Error deleting book:', error);
        // Handle the error, e.g., display an error message to the user
      });
  } else {
    console.log('User does not have the required role for deletion.');
    // Optionally, you can provide feedback to the user that they don't have the required role
  }
};

const handleBackToBook = () => {
  navigate('/book-list');
}  

  const isAdmin = userData?.roles?.some(role => role.roleName === 'ADMIN') ?? false;
  const isLoggedIn = userData ?? false;

  if (!book || loadingReviews) {
    return <div>Loading...</div>;
  }

   const handleCommentSubmit = async (reviewId) => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

      const commentData = {
        user: {
          id: userData.id,
        },
        review: {
          id: reviewId,
        },
        text: newComment.text,
        date: formattedDate,
      };

      // Make a POST request to add the comment
      await axios.post('http://localhost:8080/comment/add', commentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Refetch comments for the selected review
      const updatedCommentsResponse = await fetch(`http://localhost:8080/comment/review/${reviewId}`);
      const updatedCommentsData = await updatedCommentsResponse.json();

      setComments(prevComments => ({
        ...prevComments,
        [reviewId]: updatedCommentsData,
      }));

      // Clear the new comment form
      setNewComment({
        text: '',
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Handle error as needed
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      // Send a DELETE request to delete the review
      await axios.delete(`http://localhost:8080/review/delete/${reviewId}`);

      // Refetch reviews from the server after deleting the review
      const updatedReviewsResponse = await fetch(`http://localhost:8080/review/book/${id}`);
      const updatedReviewsData = await updatedReviewsResponse.json();
      setReviews(updatedReviewsData);

      // Clear the comments for the deleted review
      setComments((prevComments) => {
        const newComments = { ...prevComments };
        delete newComments[reviewId];
        return newComments;
      });

      // Clear the editingReviewId to exit edit mode
      setEditingReview(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      // Handle error as needed
    }
  };

   const handleEditSubmit = async (e) => {
  e.preventDefault();
  //console.log(editingReviewId);
  try {
    // Send a PUT request to update the review
    await axios.put(`http://localhost:8080/review/update/${editedReviewData.id}`, editedReviewData);

    // Refetch reviews from the server after updating the review
    const updatedReviewsResponse = await fetch(`http://localhost:8080/review/book/${id}`);
    const updatedReviewsData = await updatedReviewsResponse.json();
    setReviews(updatedReviewsData);

    // Clear the editingReviewId to exit edit mode
    setEditingReview(null);
  } catch (error) {
    console.error('Error updating review:', error);
    // Handle error as needed
  }
};

const handleEditReview = (review) => {
  
  setEditingReview(review.id);
  setEditedReviewData({
    id: review.id,
    rating: review.rating,
    text: review.text,
  });
};

  return (
    <div style={{ marginLeft :'400px',marginRight :'200px',backgroundColor:'' }}>
      <div style={{marginRight:300}}>
      <h2>{book.title}</h2>
      <p>Author: {book.authors.map(author => `${author.firstName} ${author.lastName}`).join(', ')}</p>
      {book.publisher && (
        <p>Publisher: {book.publisher.name}</p>
      )}
      <p>Genres: {book.genres.map(genre => genre.name).join(', ')}</p>
      <p style={{ textAlign: 'justify', lineHeight: '1.5', fontSize: '16px', color: '#333' }}>Description: {book.description}</p>
      </div>
      <h3>Reviews:</h3>
      {Array.isArray(reviews) && reviews.length === 0 ? (
        <p>No reviews available for this book.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px', marginRight:300}}>
          {reviews.map(review => (
            <div key={review.id}style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',position:'relative', top:'-10px' }}>
                <div style={{ marginRight: '30px' }}>
                  <p>User: {review.user.username}</p>
                </div>
              <div>
                <p>Date: {review.date}</p>
              </div>
              </div>
              <p>Rating: {review.rating}</p>
              <p>{review.text}</p>
              {//<p>Date: {review.date}</p>
              }
             {/* Dropdown to toggle comments visibility */}
              <button onClick={() => setSelectedReviewId(selectedReviewId === review.id ? null : review.id)}>
                {selectedReviewId === review.id ? 'Hide Comments' : 'Show Comments'}
              </button>
                {review.user.id === userData?.id && ( 
               <>
              
                <button onClick={() => handleEditReview(review)}>Edit Review</button>
                <button onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
               
              </>
              )}

              {/* Display comments for the review if it's selected */}
              {selectedReviewId === review.id && (
                <div>
                  <h4>Comments:</h4>
                  <ul>
                    {Array.isArray(comments[review.id]) && comments[review.id].length === 0 ? (
                      <li>No comments available for this review.</li>
                    ) : (
                      comments[review.id].map(comment => (
                        <li key={comment.id}>
                          {comment.text} - {comment.date} by {comment.user.username}
                        </li>
                      ))
                    )}
                  </ul>
                   {/* Form for adding a new comment */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCommentSubmit(review.id);
                  }}>
                    <label>Add a Comment:</label>
                    <br />
                    <textarea
                      rows="3"
                      cols="40"
                      value={newComment.text}
                      onChange={(e) => setNewComment({ text: e.target.value })}
                      required
                    />
                    <br />
                    <button type="submit">Submit Comment</button>
                  </form>
               </div>
              )}
            </div>
              
          ))}
          
        </div>
      )}

      
      {isLoggedIn && (
      <div style={{ marginLeft :'',marginRight :'',backgroundColor:'',position: 'absolute', top: 150, left: 1240 }}>
      {/* Form for adding a new review */}
      
      <h3>Add a Review:</h3>
      <form onSubmit={handleReviewSubmit}>
        <label style={{ marginRight :'10px'}}>Rating:</label>
        <input style={{ marginLeft :'10px'}}
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
          required
        />
        <br />
    
        <br ></br>
        <label >Review:</label>
        <br></br>
        <br></br>
        <textarea rows= "5" cols = "40"
          value={newReview.text}
          onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
          required
        />
        <br></br>
        <br />
        <button type="submit" style = {{ position :'absolute', left : 250}}>Submit Review</button>
      </form>
      </div>
      )}

      {isAdmin && (
        <div>
        <button bookId={book.id} on onClick={handleDeleteBook} 
        style={{ position: 'absolute', top: 100, left: 1500 }}
        >Delete Book</button>
        
        {reviews.map((review) => (
      // Assuming this is where you are mapping over reviews
      <div key={review.id}>
        {/* Other review details... */}

        <button
          
          style={{ position: 'absolute', top: 100, left: 1370 }}
        >
          Edit Book(soon)
        </button>
      </div>
    ))}
        </div>
      )}

      {editingReview && (
  <div style={{ marginLeft: '', marginRight: '', backgroundColor: '', position: 'absolute', top: 450, left: 1240 }}>
    <h3>Edit Review:</h3>
    <form onSubmit={handleEditSubmit}>
      {/* Include input fields to edit the review details */}
      <label>Rating:</label>
      <br />
      <input
        type="number"
        min="0"
        max="10"
        step="0.1"
        value={editedReviewData.rating}
        onChange={(e) => setEditedReviewData({ ...editedReviewData, rating: e.target.value })}
        required
      />
      <br />
      <label>Review Text:</label>
      <br />
      <textarea
        rows="5"
        cols="40"
        value={editedReviewData.text}
        onChange={(e) => setEditedReviewData({ ...editedReviewData, text: e.target.value })}
        required
      />
      <br />
      <button type="submit" style={{ position: 'absolute', left: 250 }}>
        Save Changes
      </button>
      <button type="button" onClick={() => setEditingReview(null)} style={{ marginLeft: '10px' }}>
        Cancel
      </button>
    </form>
  </div>
)}

      
      <br />
      <button onClick={handleBackToBook}
      style = {{position : 'absolute', left : 30, top:100}}>Back to Books</button>
    </div>
  );
};

export default IndividualBookPage;
