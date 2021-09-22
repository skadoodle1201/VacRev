const express =  require('express');
const app =  express();
const path = require('path');
const axios = require('axios');
const ejsMate = require('ejs-mate')
let states = [];

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

/* const apiData = () => {

}; */


app.get('/',(req,res)=>{
        res.render('home');
})

app.get('/findCenter',(req,res)=>{
        axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states')
        .then(function (response) {
                states =  response.data.states.state_name;
                console.log(states);
        })
        .catch(function (error) {
                console.log(error);
        })
        res.render('findCenter',{states});        
})


app.listen(3000,() =>{
        console.log("Listening on Port 3000");
})
