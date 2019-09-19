const express = require('express');
const passport = require('passport');
const router = express.Router();

//Model
const Users = require('../model/Users');
//common
const common = require('../common/comUser');

//Template
//@GET Register
router.get('/register',(req,res)=>{
  res.render('user/register');
})

//@GET Login
router.get('/login',(req,res)=>{
  res.render('user/login');
})
////////////////////

//Server
//@POST Register
router.post('/register',(req,res)=>{
  //send common
  common
    .addUser(req.body,(err,user)=>{
      if(err){
        res.render('user/register',{err,user});
      }else{
        const { name,username,email,password } = user;
        
        //new user
        let newUser = new Users({
          name,
          username,
          email,
          password
        })
        //save
        newUser
          .save()
          .then(user => {
            //msg
            req.flash('success','Registed you are now login');
            //redirect
            res.redirect('/user/login')
          });
      }
    })
})

//@POST Login
router.post('/login',
passport.authenticate('local',
  {
  successRedirect:'/',
  failureRedirect:'/user/login',
  failureFlash:true
  }
),(req,res)=>{
  
  // res.redirect('/user/login');
})

//@GET Logout
router.get('/logout',(req,res)=>{
  //session logout
  req.logout();
  //msg
  req.flash('success','User Logout');
  //send login
  res.redirect('/user/login');
})


module.exports = router;