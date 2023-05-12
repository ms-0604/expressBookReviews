const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
regd_users.use(express.urlencoded());
regd_users.use(express.json());
const session = require('express-session')

let users = require("./users.js");
//[{"username":"admin1", "password": "admin1pass"},]

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
Object.keys(users).forEach(i=> {
    if(users[i].username == username){
        return true
    }
});
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

let authenticated = false;
Object.keys(users).forEach(i=> {
    
    if(users[i].username == username && users[i].password == password){
        console.log(true)
        authenticated = true;
    }
});
return authenticated
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const user = req.body.username;
  const registereduser = isValid(req.body.username);
  
  const authenticateuser = authenticatedUser(req.body.username, req.body.password)
    if (!authenticateuser) {
        return res.status(404).json({message: "Body not Empty"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken
    }
    req.session.username = user;
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  
  const loggedinuser = req.session.username;
  let book = books[isbn];
  const newrev = {"user": loggedinuser, "review": req.body.review}
 let bookreviews = []
 bookreviews = books[isbn].reviews;
 let addnewrev = true;
 Object.keys(bookreviews).forEach(i =>{
    if(bookreviews[i].user = loggedinuser){
      bookreviews[i].review = req.body.review;
      addnewrev = false;
    }
 });
if(addnewrev){bookreviews.push(newrev);}
 
 require('fs').writeFile('./router/booksdb.js',("let books =" + JSON.stringify(books) + "\n module.exports=books;"), (error) => {
    if (error) {
        throw error;
    }
});
 return res.status(200).json({message: "Added the review"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    
    const loggedinuser = req.session.username;
    let book = books[isbn];
    let bookreviews = []
    let message = "";
   let deleted = false;
   if(books[isbn].reviews != null){bookreviews = books[isbn].reviews;
    Object.keys(bookreviews).forEach(i =>{
        if(bookreviews[i].user = loggedinuser){
          delete bookreviews[i]
          deleted = true;
          message = "deleted your review"
        }
     });
}
   
   
   
  if(!deleted){message="You do not have any reviews for this book"}
   
   require('fs').writeFile('./router/booksdb.js',("let books =" + JSON.stringify(books) + "\n module.exports=books;"), (error) => {
      if (error) {
          throw error;
      }
  });
  return res.status(200).json(message);
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
