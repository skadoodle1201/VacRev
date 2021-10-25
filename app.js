const express =  require('express');
const app =  express();
const path = require('path');
//const axios = require('axios');
const ejsMate = require('ejs-mate')
const cookieparser = require("cookie-parser");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(cookieparser()); 



app.get('/',(req,res)=>{
  res.render('home');
})

app.get('/findCenter',(req,res)=>{
  let districtsId = req.cookies.districtsId;
  res.render('findCenter',{districtsId});    
})

app.get('/centers',(req,res)=>{
  let districtsId = req.cookies.districtsId;
  res.render('centers',{districtsId});
})

app.post("/centers", (req, res) => {
  let  districtsId  = req.body.districts;
  res.cookie("districtsId", districtsId);
  res.redirect("/centers");
})

app.listen(3000,() =>{
        console.log("Listening on Port 3000");
})
