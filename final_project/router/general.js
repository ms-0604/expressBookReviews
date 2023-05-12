const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
public_users.use(express.urlencoded());
public_users.use(express.json());
const axios = require('axios').default;
let prompt = require('prompt-sync')();



public_users.post("/register", (req,res) => {
  //Write your code here
  
  const username = req.body.username;
  const password = req.body.password;
  const user = {"username": username, "password": password };
  
  let message = "";
  if(username == "" || password == ""){
      message = "Please provide credentials";
  }
  var exist = false;
  Object.keys(users).forEach((i)=> {
          
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
  let myPromise = new Promise((resolve,reject) => {
    resolve(books)
  })
  myPromise.then((books) => {
    return res.status(200).json(books);
  })
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve,reject) => {
    resolve(books[isbn])
  })
  myPromise.then((book) =>{

  return res.status(200).json(book);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorname = req.params.author;
  const mybooks = [];
  let myPromise = new Promise((resolve,reject) => {
     Object.keys(books).forEach(i => {
    
      if(books[i].author === authorname)
    {
        mybooks.push(books[i]);
    }     
 
    });
    resolve(mybooks)
})
myPromise.then((mybooks)=>
{
    return res.status(200).json(mybooks);
})
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titlename = req.params.title;
  const mybooks = [];
  let myPromise = new Promise((resolve,reject) =>{
  Object.keys(books).forEach(i => {
    
      if(books[i].title === titlename)
    {
        
        mybooks.push(books[i]);
    } 
    resolve(mybooks) 
})
});
 myPromise.then((mybooks)=> {
    return res.status(200).json(mybooks);
 })
   
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const rev= books[isbn].Review;
  return res.status(200).json(rev);
});


const axios = require('axios').default;
const connectToURL = async(url)=>{
    const outcome = books;
    let listOfbooks = (await outcome).data.books;
    listOfbooks.forEach((book)=>{
      console.log(book);
    });
}


//getBooksList ("https://github.com/ms-0604/expressBookReviews/blob/main/final_project/router/booksdb.js")

const BookPromise = new Promise((resolve,reject)=>{
    let isbn = prompt('What is the isbn number ?');
    try {
        
      const mybook = books[isbn];
        resolve(mybook);
    } catch(err) {
      reject(err)
    }
});

console.log(BookPromise);

BookPromise.then(
  (mybook) => console.log(mybook),
  (err) => console.log("Error reading data") 
);

const BookPromiseAuthor = new Promise((resolve,reject)=>{
    let author = prompt('What is the author name ?');
    try {
        
        const mybooks = [];
        Object.keys(books).forEach(i => {
    
            if(books[i].author === author)
          {
              mybooks.push(books[i]);
          }     
       
          })
        resolve(mybooks);
    } catch(err) {
      reject(err)
    }
});

console.log(BookPromiseAuthor);

BookPromiseAuthor.then(
  (mybook) => console.log(mybook),
  (err) => console.log("Error reading data") 
);


const BookPromiseTitle = new Promise((resolve,reject)=>{
    let title = prompt('What is the title name ?');
    try {
        const mybooks = [];
        Object.keys(books).forEach(i => {
    
            if(books[i].title === title)
          {
              mybooks.push(books[i]);
          }     
       
          })
        resolve(mybooks);
    } catch(err) {
      reject(err)
    }
});

console.log(BookPromiseTitle);

BookPromiseTitle.then(
  (mybook) => console.log(mybook),
  (err) => console.log("Error reading data") 
);


module.exports.general = public_users;
