const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});



// Get the book list available in the shop
public_users.get("/books", function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get('http://localhost:5000/');
    const book = response.data[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const authorName = req.params.author;
  try {
    const response = await axios.get('http://localhost:5000/');
    const filteredBooks = Object.values(response.data).filter(book => book.author === authorName);
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const titleName = req.params.title;
  try {
    const response = await axios.get('http://localhost:5000/');
    const filteredBooks = Object.values(response.data).filter(book => book.title === titleName);
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


//  Get book review
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});


module.exports.general = public_users;
