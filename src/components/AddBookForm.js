import React, { useState } from 'react';
import axios from 'axios';

const AddBookForm = () => {
  const [book, setBook] = useState({
    title: '',
    authors: [],
    publisher: '',
    genres: [],
    newAuthor: {
      firstName: '',
      lastName: '',
    },
    newGenre: {
      name: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  const handleAuthorChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      newAuthor: {
        ...prevBook.newAuthor,
        [name]: value,
      },
    }));
  };

  const addAuthor = () => {
    setBook((prevBook) => ({
      ...prevBook,
      authors: [...prevBook.authors, { ...prevBook.newAuthor }],
      newAuthor: { firstName: '', lastName: '' },
    }));
  };

  const handleGenreChange = (e) => {
    const { value } = e.target;
    setBook((prevBook) => ({ ...prevBook, newGenre: { name: value } }));
  };

  const addGenre = () => {
    setBook((prevBook) => ({
      ...prevBook,
      genres: [...prevBook.genres, { ...prevBook.newGenre }],
      newGenre: { name: '' },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (book.authors.length === 0 || book.genres.length === 0) {
      alert('Please add at least one author and one genre.');
      return;
    }

    try {
      // Create a single DTO for the entire Book entity
      const bookDto = {
        title: book.title,
        authors: book.authors,
        publisher: book.publisher,
        genres: book.genres,
      };

      // Send a POST request with the Book DTO
      await axios.post('http://localhost:8080/book/add', bookDto, { headers: { 'Content-Type': 'application/json' } });

      // Clear the form after successful submission
      setBook({
        title: '',
        authors: [],
        publisher: '',
        genres: [],
        newAuthor: {
          firstName: '',
          lastName: '',
        },
        newGenre: {
          name: '',
        },
      });

      console.log('Book added successfully!');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const isValidAuthorInput = () => {
    return book.newAuthor.firstName.trim() !== '' && book.newAuthor.lastName.trim() !== '';
  };

  const isValidGenreInput = () => {
    return book.newGenre.name.trim() !== '';
  };

  return (
    <div style={{ maxWidth : '400px',marginTop:'50px',marginLeft :'185px',marginRight :'300px',backgroundColor:'' }}>
      <h2>Add a book</h2>
    
    <form onSubmit={handleSubmit} >
      <label>Title:</label>
      <input type="text" name="title" value={book.title} onChange={handleChange} 
      style={{position:'relative',left:"110px"}}
      required/>
      <br /><br />
      <div style={{position:'relative',left:500,top:-45}}>
      <div>
        <label style={{marginRight:10}}>Author's First Name:</label>
        <input type="text" name="firstName" value={book.newAuthor.firstName} onChange={handleAuthorChange}  />
      </div>
      <br />
      <div>
        <label style={{marginRight:10}}>Author's Last Name:</label>
        <input type="text" name="lastName" value={book.newAuthor.lastName} onChange={handleAuthorChange}  
        style={{position:'relative',left:"2px"}}/>
      </div>
      <br />
      <button type="button" onClick={addAuthor}   
      disabled={!isValidAuthorInput()} 
      style={{marginLeft : '245px'}}>
        Add Author
      </button>
      <br />
      <div style = {{ position : 'absolute',top : 0,left : 400,background:'',maxWidth:100}}>
        <label style={{position:'relative',top:-20}}>Authors:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginRight:1,background:''}}>
          {book.authors.map((author, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '20px',maxHeight:50,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
             }}>{`${author.firstName} ${author.lastName}`}</div>
          ))}
        </div>
      </div>
      </div>
      <br />
      <div style={{position:'relative',top:-135}}>
        <label>Publisher:</label>
        <input type="text" name="publisher" value={book.publisher} onChange={handleChange} 
        style={{position : 'relative',left:'75px'}} required/>
      </div>
      <br />
      <div style={{position:'relative',left:500,top:-45}}>
        <label style={{marginRight:10}}>Genre:</label>
        <input type="text" value={book.newGenre.name} onChange={handleGenreChange}
        style ={{position:'relative',left:'97px'}} 
        />
        <br /><br />
        <button type="button" onClick={addGenre}
        style ={{position : 'relative', left:'246px'}} 
        disabled={!isValidGenreInput()}
        
        >
          Add Genre
        </button>
      </div>
      <br />
      <div style = {{ position : 'absolute',top : 310,left : 1090}}>
        <label>Genres:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop:20}}>
          {book.genres.map((genre, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '20px' }}>{genre.name}</div>
          ))}
        </div>
      </div>
      <div style={{position:'relative',top:-225}}>
        <label>Description:</label>
        <textarea
  name="description"
  value={book.description}
  onChange={handleChange}
  style={{
    width: '100%',  
    height: '150px',
    padding: '10px',  
    boxSizing: 'border-box',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    lineHeight: '1.5',
    position: 'relative',
    left: '0px',
    top: '20px',
    resize: 'none',
    marginBottom: '20px',
    overflowY: 'auto',  // Allow vertical scrolling if the content exceeds the height
  }}
  maxLength={1500}
  required
  placeholder="Write a brief description (maximum 1500 characters)"
/>

      </div>

      <button type="submit" style={{position:'absolute',left:770,top:600,width:100,height:50}}>Add Book</button>
    </form>
    </div>
  );
};

export default AddBookForm;
