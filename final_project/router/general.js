const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
public_users.use(express.urlencoded());
public_users.use(express.json());



public_users.post("/register", (req,res) => {
  //Write your code here
  console.log(users);
  const username = req.body.username;
  const password = req.body.password;
  const user = {"username": username, "password": password };
  console.log(user);
  let message = "";
  if(username == "" || password == ""){
      message = "Please provide credentials";
  }
  var exist = false;
  Object.keys(users).forEach((i)=> {
          console.log("checking");
  if(users[i].username == username){
      
      exist= true;
      return exist
  }
});
if(exist){
    message= "user already exists";
}
if(!exist) {
    users.push(user);
    //req.session.users = users;
    console.log("added");
    
    
    require('fs').writeFile('./router/users.js',("let books =" + JSON.stringify(users) + "\n module.exports=books;"), (error) => {
        if (error) {
            throw error;
        }
    });
    message = "successfully registered"
  }
  

  
  console.log(users);
  

  return res.status(200).json(message);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorname = req.params.author;
  const mybooks = [];
  Object.keys(books).forEach(i => {
    console.log(books[i].author)
      if(books[i].author === authorname)
    {
        console.log(books[i].author);
        mybooks.push(books[i]);
    }   
 
    });
  return res.status(200).json(mybooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titlename = req.params.title;
  const mybooks = [];
  Object.keys(books).forEach(i => {
    console.log(books[i].title)
      if(books[i].title === titlename)
    {
        console.log(books[i].title);
        mybooks.push(books[i]);
    }   
 
    });
  return res.status(200).json(mybooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const rev= books[isbn].Review;
  return res.status(200).json(rev);
});

module.exports.general = public_users;
