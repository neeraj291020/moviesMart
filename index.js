const express=require("express");
const mongoose=require("mongoose");
const mongoURI="mongodb://localhost:27017/moviesMart";
mongoose.connect(mongoURI);
const { body, validationResult } = require('express-validator');
mongoose.set("strictQuery", true);

const bodyParser=require("body-parser");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});
const muser= mongoose.model('muser',userSchema);

app.post("/signup",function(req,res){
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const person1=new muser({name:name,email:email,password:hash});
        person1.save(function(err){
            if (err) {
                console.log(err);
              } else {
                res.render("login");
              }
        })
      
    })
})
app.post("/login",function(req,res){
    const email=req.body.el;
    const password=req.body.pass;
   
    muser.findOne({email:email},function(err,found){
        if(!found){
            res.render("failure");
        }
        else{
            if(found){
             bcrypt.compare(password,found.password, function(err, result) {
     if(result===true){
        res.render("./success");
     }
    
     else{
        res.render("./failure");
     }
    })
    
    }
    }
    })
})


app.get('/', (req, res) => {
  res.render('home');
});
app.get("/login",(req,res)=>{
res.render('login');
})
app.get("/signup",(req,res)=>{
    res.render('signup');
    })
app.listen(3000,function(){
    console.log("server is running on port 3000");
})