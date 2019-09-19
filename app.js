const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//express init
const app = express();

//db
const db = require('./config/db').mongoURI;
mongoose
  .connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
  .then(()=> console.log('mongodb connected'))
  .catch(err => console.log('mongodb error'));

//ejs layout
app.use(expressLayouts);
//template engine
app.set('view engine','ejs');
// app.set('views',path.join(__dirname,'views'));



//express session
app.use(session({
  secret:'my',
  saveUninitialized:true,
  resave:true
}))

//passport session
app.use(passport.initialize());
app.use(passport.session());

//passport local strategy
require('./common/passport')(passport)


//flash
app.use(flash());

//local variable
app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  //go
  next();
})

//static folder
app.use(express.static(path.join(__dirname,'public')));

//middleware
//if you using text size low && you should used 'extended:true'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

//if you using text size Height && you should used 'extended:false'
// app.use(bodyParser.urlencoded({
//   limit:'1mb',
//   parameterLimit:1000000,
//   extended:false
// }))

//routes
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));

//server
const port = process.env.PORT || 5000;
app.listen(port,()=> console.log(`server is running on port ${port}`));