const express =  require('express');
const app =  express();
const path = require('path');
const axios = require('axios');
const ejsMate = require('ejs-mate')
const cookieparser = require("cookie-parser");
const mongoose = require('mongoose');
const methodOverride =require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const User = require('./models/users');
const LocalStrategy = require('passport-local');

const dbUrl = 'mongodb://localhost:27017/vac-rev';


mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true, works for older version of mongo
    //useFindAndModify: false works for older version of mongo
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("database connected");
});




app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(methodOverride('_method'));


app.use(cookieparser());
const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get('/',(req,res)=>{
  res.render('home');
})

app.get('/findingCenters/findCenter',(req,res)=>{
  let districtsId = req.cookies.districtsId;
  res.render('findingCenters/findCenter',{districtsId});    
})

app.get('/findingCenters/centers',(req,res)=>{
  let districtsId = req.cookies.districtsId;
  res.render('findingCenters/centers',{districtsId});
})

app.get('/findingCenters/center',async(req,res)=>{
  let centerId = req.cookies.centerId;
  let d = new Date();
  let month = d.getMonth()+1;
  let day = d.getDate();
  let output = (day<10 ? '0' : '') + day + '-' +(month<10 ? '0' : '') + month + '-'+ d.getFullYear();
  const response = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id=${centerId}&date=${output}`);
  let center = response.data.centers;
  res.render('findingCenters/center',{centerId,center});
})

app.post("/findingCenters/centers", (req, res) => {
  let  districtsId  = req.body.districts;
  res.cookie("districtsId", districtsId);
  res.redirect("/findingCenters/centers");
})

app.post("/findingCenters/center", (req, res) => {
  let  centerId  = req.body.centerId;
  res.cookie("centerId", centerId);
  res.redirect("/findingCenters/center");
})

app.get

app.listen(3000,() =>{
        console.log("Listening on Port 3000");
})
