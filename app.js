const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const sha256=require("sha256");
// const encrypt=require("mongoose-encryption");
const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/secretDB" ,{useNewUrlParser:true},
{ useUnifiedTopology: true });

const secretSchema=new mongoose.Schema({
    email:String,
    password:String
});

const key="Thisisaprivatekey";
// secretSchema.plugin(encrypt,{secret:key, encryptedFields:["password"]});
const User=new mongoose.model("Secret",secretSchema);


app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/logout",(req,res)=>{
    res.render("home");
});

app.post("/register",(req,res)=>{
    const newUser=User({
        email: req.body.username,
        password:sha256(req.body.password)
    });

    newUser.save(function(err){
        if(err){
             console.log(err);
            // res.render("error");
        }else{
            res.render("registered");
        }
    });
});

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=sha256(req.body.password);

    
    User.findOne({email:username},function(err,foundUser){
        if (err){
            // console.log(err);
            console.log("Invalid credentials!");
        }
        else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("success");
                }
            }
        }    
    });
});


app.listen(3000,function(){
    console.log("App is running at port 3000.");
});
