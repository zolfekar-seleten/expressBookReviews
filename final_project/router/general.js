const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username or password are Missing" });
  }
  // if(  users.find((user) => user.username === username)){
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   return res.status(200).json({
//     // data: Object.values(books),
//     // data: JSON.stringify(books),
//     data: books,
//   });
// });

// Get the book list available in the shop using promise Callback
public_users.get("/", function (req, res) {
  const getBookList = () => {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  };

  getBookList()
    .then((bookList) => {
      return res.status(200).json({ data: bookList });
    })
    .catch((error) => {
      console.error("Error retrieving book list:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    });
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     return res.status(200).json({ book: books[isbn] });
//   } else {
//     return res.status(404).json({ message: "Not found" });
//   }
// });

// Get book details based on ISBN using promise Callback
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const getBookDetails = () => {
    return new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    });
  };

  getBookDetails()
    .then((bookDetails) => {
      return res.status(200).json({ book: bookDetails });
    })
    .catch((error) => {
      console.error("Error retrieving book details:", error);
      return res.status(404).json({ message: "Not found" });
    });
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author;
//   let booksForAuthor = Object.values(books).filter((el) => el.author == author);
//   return booksForAuthor.length > 0
//     ? res.status(200).json({ data: booksForAuthor })
//     : res.status(404).json({ message: "No books for this author" });
// });

// Get book details based on author using promise Callback
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  const getBooksByAuthor = () => {
    return new Promise((resolve, reject) => {
      const booksForAuthor = Object.values(books).filter(
        (book) => book.author === author
      );
      if (booksForAuthor.length > 0) {
        resolve(booksForAuthor);
      } else {
        reject(new Error("No books for this author"));
      }
    });
  };

  getBooksByAuthor()
    .then((booksForAuthor) => {
      return res.status(200).json({ data: booksForAuthor });
    })
    .catch((error) => {
      console.error("Error retrieving books by author:", error);
      return res.status(404).json({ message: "No books for this author" });
    });
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title;
//   let booksWithTitle = Object.values(books).filter((el) => el.title == title);
//   return booksWithTitle.length > 0
//     ? res.status(200).json({ data: booksWithTitle })
//     : res.status(404).json({ message: "No books with this Title" });
// });

// Get all books based on title using promise Callback
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  const getBooksByTitle = () => {
    return new Promise((resolve, reject) => {
      const booksWithTitle = Object.values(books).filter(
        (book) => book.title === title
      );
      if (booksWithTitle.length > 0) {
        resolve(booksWithTitle);
      } else {
        reject(new Error("No books with this Title"));
      }
    });
  };

  getBooksByTitle()
    .then((booksWithTitle) => {
      return res.status(200).json({ data: booksWithTitle });
    })
    .catch((error) => {
      console.error("Error retrieving books by title:", error);
      return res.status(404).json({ message: "No books with this Title" });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
