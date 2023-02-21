const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: `User ${username} successfully registred. Now you can login`});
    } else {
      return res.status(400).json({ message: `User ${username} already exists!` });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Please make sure you provide both a username and a password" });
});

const listBooks = async () => {
	try{
		const getBooks = await Promise.resolve(books)
		if (getBooks) {
			return getBooks
		} else {
			return Promise.reject (new error("Sorry, we are having trouble retrieving books at the moment"))
		}
	} catch (error) {
		console.log (error)
	}
}

// Get the book list available in the shop
public_users.get("/", async (req,res) => {
  const allBooks = await listBooks()
  res.send(JSON.stringify(allBooks, null, 4))
});

const getBookByISBN = async(isbn) => {
    try{
      const getByISBN = await Promise.resolve(books[isbn]);
      if(getByISBN){
        return getByISBN
      }
      else{
        return Promise.reject(new error("Sorry, we can't find any books with that ISBN."));
      }
    }
    catch(error){
      console.log(error);
    }
  }

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = await getBookByISBN(req.params.isbn)
  res.send(isbn);
});

const getBookByAuthor = async(author) => {
    try{
      if(author){
        let booksKeys = Object.keys(books);
        let book;
        for (let i = 1; i < booksKeys.length; i++) {
            if (books[i].author === author) {
                book = JSON.stringify(books[i]);
             }
        }
        return Promise.resolve(book);
      }
      else{
        return Promise.reject(new error("Sorry, we can't find any books by that author."));
      }
    }
    catch(error){
      console.log(error);
    }
  }

// Get book details based on author
public_users.get("/author/:author", async (req, res)  => {
    const authorBooks = await getBookByAuthor(req.params.author);
    res.send(authorBooks);
});

const getBookByTitle = async(title) => {
    try{
        if(title){
            let booksKeys = Object.keys(books);
            let bookTitle;
            for (let i = 1; i < booksKeys.length; i++) {
                if (books[i].title === title) {
                    bookTitle = JSON.stringify(books[i]);
                }
            }
            return Promise.resolve(bookTitle);
        }
        else{
            return Promise.reject(new error("Sorry, we can't find any books with that title."));
        }
    }
    catch(error){
        console.log(error);
    }
}

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
    const titleBooks = await getBookByTitle(req.params.title);
    res.send(titleBooks);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
