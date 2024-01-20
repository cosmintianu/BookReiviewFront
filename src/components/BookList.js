import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortBy, setSortBy] = useState({ key: 'none', order: 'asc' }); // Default sorting by title in ascending order
  const [filterBy, setFilterBy] = useState('all'); // Default filtering option
   const [filterByAuthors, setFilterByAuthors] = useState('allAuthors');
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch books data
        const response = await fetch('http://localhost:8080/book/all');
        const data = await response.json();

        // Fetch reviews and calculate average rating for each book
        const booksWithAverageRating = await Promise.all(
          data.map(async book => {
            const reviewsResponse = await fetch(`http://localhost:8080/review/book/${book.id}`);
            const reviewsData = await reviewsResponse.json();

            if (reviewsData.length > 0) {
              const averageRating =
                reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
              return { ...book, averageRating: averageRating.toFixed(1), nrOfReviews: reviewsData.length };
            } else {
              return { ...book, averageRating: 'N/A', nrOfReviews: 0 };
            }
          })
        );
        //fetch publishers
        const publishersResponse = await fetch('http://localhost:8080/publisher/all');
        const publishersData = await publishersResponse.json();
        
        //fetch authors
        const authorsResponse = await fetch('http://localhost:8080/author/all');
        const authorsData = await authorsResponse.json();

        setAuthors(authorsData);
        setPublishers(publishersData);  
        setBooks(booksWithAverageRating);
        setFilteredBooks(booksWithAverageRating);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    
    // Fetch books and reviews on mount
    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on mount

  const handleSearch = () => {
    const lowercasedInput = searchInput.toLowerCase();
    const filtered = books.filter(
      book =>
        book.title.toLowerCase().includes(lowercasedInput) ||
        book.authors.some(
          author =>
            author.firstName.toLowerCase().includes(lowercasedInput) ||
            author.lastName.toLowerCase().includes(lowercasedInput)
        )
    );
    setFilteredBooks(filtered);
  };

  const handleSortChange = e => {
    const selectedSort = e.target.value;
    const order = sortBy.key === selectedSort && sortBy.order === 'asc' ? 'desc' : 'asc';
    setSortBy({ key: selectedSort, order });
    handleSort(selectedSort, order);
  };
  
  const handleSort = (sortByOption, sortOrder) => {
    const sorted = [...filteredBooks].sort((a, b) => {
      
      if (sortByOption === 'title') {
        return a.title.localeCompare(b.title) * 1;
      } else if (sortByOption === 'averageRating') {
        return (parseFloat(a.averageRating) - parseFloat(b.averageRating)) * 1;
      } else if(sortByOption === 'titleDesc'){
         return a.title.localeCompare(b.title) * -1;
      } else if(sortByOption === 'averageRatingDesc'){
        return (parseFloat(a.averageRating) - parseFloat(b.averageRating)) * -1;
     } else{
        // Add more sorting options as needed
        return 0;
      }
    });
    setFilteredBooks(sorted);
  };

  const handleFilterChange = e => {
    setFilterBy(e.target.value);
    handleFilter(e.target.value);
  };

  const handleFilter = filterOption => {
    if (filterOption === 'all') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(book => book.publisher.name.toLowerCase() === filterOption.toLowerCase());
      setFilteredBooks(filtered);
    }
  };

   const handleAuthorFilterChange = (e) => {
    const value = e.target.value;
    setFilterByAuthors([value]); // Allow only one checkbox to be checked at a time

    // Automatically apply the filter when a checkbox is pressed
    filterBooks(value);
  };

  const filterBooks = (filterOption) => {
    if (filterOption === 'allAuthors') {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        book.authors.some(
          (author) =>
            `${author.firstName} ${author.lastName}`.toLowerCase() === filterOption.toLowerCase()
        )
      );
      setFilteredBooks(filtered);
    }
  };


  const handleInputChange = e => {
    setSearchInput(e.target.value);
    //handleSearch(); // Trigger search on every input change
  };

  const handleReset = () => {
    setSearchInput('');
    setSortBy({ key: 'none', order: 'asc' });
    setFilterBy('all');
    setFilteredBooks(books); // Reset filtered books to all books
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching books: {error.message}</div>;
  }

  return (
    <div>
      <h2 style={{marginLeft:30}}>Book List</h2>
      <div>
        <input
          type="text"
          placeholder="Search by name or author"
          value={searchInput}
          onChange={handleInputChange}
          style={{position: 'relative',left:'500px',width:'400px',height:'30px'}}
        />
        <button onClick={handleSearch} style={{position: 'relative',left:'520px',width:'80px',height:'30px'}}
        >Search</button>
        <button onClick={handleReset} style={{position: 'relative',left:'540px',width:'80px',height:'30px'}}
        >Reset</button>
      </div>
      <div style={{backgroundColor:'',maxWidth:'260px',position:'relative',left:'33px',top:'50px'}}>
      <div>
        <label htmlFor="sort">Sort By:</label>
        <select id="sort" value={sortBy.key} onChange={handleSortChange} style={{maxWidth:'100px',position:'relative',left :'50px'}}>
          <option value="none">None</option>
          <option value="title">Title (Ascending)</option>
          <option value="titleDesc">Title (Descending)</option>
          <option value="averageRating">Average Rating (Ascending)</option>
          <option value="averageRatingDesc">Average Rating (Descending)</option>
          {/* Add more sorting options as needed */}
        </select>
      </div>
      <div style={{position:'relative',top:'50px'}}>
        <label>Filter By Publisher:</label>
        <div>
          <input
            type="checkbox"
            id="all"
            value="all"
            checked={filterBy.includes('all')}
            onChange={handleFilterChange}
          />
          <label htmlFor="all">All</label>
        </div>
        {publishers.map((publisher) => (
          <div key={publisher.id}>
            <input
              type="checkbox"
              id={publisher.id}
              value={publisher.name}
              checked={filterBy.includes(publisher.name)}
              onChange={handleFilterChange}
            />
            <label htmlFor={publisher.id}>{publisher.name}</label>
          </div>
        ))}
      </div>
      <div style={{position:'relative',top:'100px'}}>
      <label>Filter By Author:</label>
      <div>
        <input
          type="checkbox"
          id="allAuthors"
          value="allAuthors"
          checked={filterByAuthors.includes('allAuthors')}
          onChange={() => handleAuthorFilterChange({ target: { value: 'allAuthors' } })}
        />
        <label htmlFor="allAuthors">All Authors</label>
      </div>
      {authors.map((author) => (
        <div key={author.id}>
          <input
            type="checkbox"
            id={author.id}
            value={`${author.firstName} ${author.lastName}`}
            checked={filterByAuthors.includes(`${author.firstName} ${author.lastName}`)}
            onChange={(e) => handleAuthorFilterChange(e)}
          />
          <label htmlFor={author.id}>{`${author.firstName} ${author.lastName}`}</label>
        </div>
      ))}

      </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginLeft :'300px',marginRight :'300px',position:'absolute',top:'225px' }}>
        {filteredBooks.map(book => (
          <div key={book.id}>
            <Link to={`/book/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', cursor: 'pointer',minHeight:'200px' }}>
                <h3>{book.title}</h3>
                {//<p>ID: {book.id}</p>
                }
                <p>
                  Authors: {book.authors.map(author => `${author.firstName} ${author.lastName}`).join(', ')}
                </p>
                <p>Publisher: {book.publisher.name}</p>
                <p>Average Rating: {book.averageRating} ({book.nrOfReviews})</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
