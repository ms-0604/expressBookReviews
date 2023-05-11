const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
regd_users.use(express.urlencoded());
regd_users.use(express.json());

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
console.log(users)
Object.keys(users).forEach(i=> {
    console.log(users.username);
    if(users[i].username == username && users[i].password == password){
        return true
    }
});
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const user = req.body.username;
  const registereduser = isValid(req.body.username);
  console.log(req.body.username)
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
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
