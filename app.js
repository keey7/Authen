//jshint esversion:6
require('dotenv').config();
const express= require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const encrypt= require("mongoose-encryption");

const app= express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});
//without the new... is just an bject
const userSchema= new mongoose.Schema({//now is a mong shcema class
  email: String, password: String
});
                    //ADD ENVIRONEMTN VARIABLES
                    //make a secret String to encrypt our DB
                    // const secret="";
//plugin to the schema before the mongoose model
//this will encrypt our entire DB
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });//to specidy which field want to encrypt

const User= new mongoose.model("User", userSchema);


app.get("/", function(req,res){
  res.render("home");
});
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req,res){
  //inserting a doc
  const newUser= new User({
    email: req.body.username ,password:req.body.password
  });
   newUser.save(function(err){
     if(err){
       console.log(err);
     }else{
       res.render("secrets");
     }
   });
});

app.post("/login", function(req,res){
  //req. Those are the credentials the user entered the fst time
  const username= req.body.username;
  const password= req.body.password;
  // We are looking if those consts are the same with this particular user
  User.findOne({email: username}, function(err,foundUser){//username comes from the user who's trying to log in and the email is the one in our DB
    if(err){
      console.log(err);
    }else{
      if(foundUser){//So does that user with that email exist? if theres such user
        if(foundUser.password===password){//if the password user we found is equal to the password the user typed in the log in page
          res.render("secrets");
      }
    }
  }
});
});








app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
