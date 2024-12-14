require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodoverride = require('method-override');
const connectDB=require('./server/config/db'); 
const {isActiveRoute} = require('./server/helpers/routeHelpers');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const { check, validationResult } = require('express-validator');

const nodemailer = require('nodemailer');

const app=express();
const port = process.env.PORT || 5000

//connect to DB
connectDB();
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodoverride('_method'));
//app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_uri
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(express.static('public'));

//Tempelating engine
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');


app.locals.isActiveRoute = isActiveRoute;

//Routes
app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));
app.use(cookieParser());
// app.get('',(req,res)=>{
//  res.send("Hello")
// })

app.listen(port,()=> {
    console.log(`App Listening on ${port}`);
});