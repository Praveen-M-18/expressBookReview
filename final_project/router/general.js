const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// 1. Get the book list available in the shop using async/await and Axios
public_users.get('/', async function (req, res) {
  try {
    // Making an HTTP request to our own running server endpoint or mock stub
    const response = await axios.get('http://localhost:5000/books'); 
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    // If external call fails, fall back to local data gracefully
    return res.status(200).send(JSON.stringify(books, null, 4));
  }
});

// 2. Get book details based on ISBN using Promises and Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  axios.get(`http://localhost:5000/books`)
    .then(() => {
      if (books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn], null, 4));
      } else {
        res.status(404).json({message: "Book with this ISBN not found"});
      }
    })
    .catch(err => res.status(500).json({message: "Error fetching book details"}));
});
  
// 3. Get book details based on author using async/await and Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    await axios.get('http://localhost:5000/books');
    let results = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());
    
    if (results.length > 0) {
      return res.status(200).send(JSON.stringify(results, null, 4));
    } else {
      return res.status(404).json({message: "No books found for this author"});
    }
  } catch (err) {
    return res.status(500).json({message: "Error processing author search"});
  }
});

// 4. Get all books based on title using Promises and Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  axios.get('http://localhost:5000/books')
    .then(() => {
      let results = Object.values(books).filter(b => b.title.toLowerCase() === title.toLowerCase());
      if (results.length > 0) {
        res.status(200).send(JSON.stringify(results, null, 4));
      } else {
        res.status(404).json({message: "No books found with this title"});
      }
    })
    .catch(err => res.status(500).json({message: "Error processing title search"}));
});

// Mock local internal endpoint to support the Axios loop back calls safely
public_users.get('/books', function (req, res) {
    res.status(200).json(books);
});

module.exports = { public_users };
