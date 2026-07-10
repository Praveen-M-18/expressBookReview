const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// 1. Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// 2. Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});
  
// 3. Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const filterBooks = () => new Promise((resolve) => {
      let results = Object.values(books).filter(b => b.author === author);
      resolve(results);
    });
    const matchedBooks = await filterBooks();
    return res.status(200).send(JSON.stringify(matchedBooks, null, 4));
  } catch (err) {
    return res.status(500).json({message: "Server error"});
  }
});

// 4. Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve) => {
    let results = Object.values(books).filter(b => b.title === title);
    resolve(results);
  })
  .then((matchedBooks) => res.status(200).send(JSON.stringify(matchedBooks, null, 4)));
});

module.exports = { public_users };
