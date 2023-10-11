const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.find((user) => user.username === username) == undefined;
};

const authenticatedUser = (username, password) => {
  return (
    users.filter((el) => el.username === username && el.password === password)
      .length === 1
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username or password are Missing" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  const accessToken = jwt.sign({ username: username }, "fingerprint_customer");
  req.session.accessToken = accessToken;

  return res.json({ message: "Login successful.", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.user.username;
  const isbn = req.params.isbn;
  const review = req.query.review;
  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: "The book you are trying to review not found" });
  }
  if (!review) {
    return res.status(400).json({ message: "Please provide a review" });
  }
  let isReviewedBefore = books[isbn].reviews[username];
  books[isbn].reviews[username] = review;

  return isReviewedBefore
    ? res.status(200).json({ message: "Review modified successfully" })
    : res.status(201).json({ message: "Review added successfully" });
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.user.username;
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res
      .status(404)
      .json({
        message: "The book you are trying to delete review of it not found",
      });
  }

  if (!books[isbn].reviews[username]) {
    return res
      .status(400)
      .json({ message: "Review not found for the given ISBN and username" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
