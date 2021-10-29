const express =  require('express');
const app =  express();
const path = require('path');
const axios = require('axios');
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

app.get('/center',async(req,res)=>{
  let centerId = req.cookies.centerId;
  let d = new Date();
  let month = d.getMonth()+1;
  let day = d.getDate();
  let output = (day<10 ? '0' : '') + day + '-' +(month<10 ? '0' : '') + month + '-'+ d.getFullYear();
  const response = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id=${centerId}&date=${output}`);
  let center = response.data.centers;
  res.render('center',{centerId,center});
})

app.post("/centers", (req, res) => {
  let  districtsId  = req.body.districts;
  res.cookie("districtsId", districtsId);
  res.redirect("/centers");
})

app.post("/center", (req, res) => {
  let  centerId  = req.body.centerId;
  res.cookie("centerId", centerId);
  res.redirect("/center");
})

app.listen(3000,() =>{
        console.log("Listening on Port 3000");
})
