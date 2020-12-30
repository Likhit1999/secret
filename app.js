require('dotenv').config()
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const mongooseEncryption=require("mongoose-encryption");

const app=express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useUnifiedTopology: true,useNewUrlParser: true});

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(mongooseEncryption,{secret:process.env.SECRET,encryptedFields:["password"]});


const User=new mongoose.model("User",userSchema);


app.route("/")
  .get(function(req,res){
    res.render("home");
  });
app.route("/register")
  .get(function(req,res){
    res.render("register");
  })
  .post(function(req,res){
    const username=req.body.username
    const password=req.body.password
    const userData= new User({
      email:username,
      password:password
    });
    userData.save(function(err){
      if (!err) {
        res.render("secrets");
      } else {
        res.send(err);
      }
    });
  });

app.route("/login")
  .get(function(req,res){
    res.render("login");
  })
  .post(function(req,res){
    const username=req.body.username
    const password=req.body.password
    User.findOne({email:username},function(err,details){
      if(err){
        console.log(err);
      }else {
        if(details){
          if (details.password===password) {
            res.render("secrets");
          }
        }
      }
    });
  });



app.listen(3000,function(){
  console.log("server started on port 3000");
})
