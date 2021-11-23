const express =  require('express');
const app =  express();
const path = require('path');
const ejsMate = require('ejs-mate')
const cookieparser = require("cookie-parser");
const mongoose = require('mongoose');
const methodOverride =require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const centerRoutes = require('./routes/centerRouters')


const passport = require('passport');
const User = require('./models/users');
const LocalStrategy = require('passport-local');

const dbUrl = 'mongodb://localhost:27017/vac-rev';


mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
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
//  console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get('/',(req,res)=>{
  res.render('home');
})

app.use('/findingCenters',centerRoutes);  

app.listen(3000,() =>{
        console.log("Listening on Port 3000");
})
