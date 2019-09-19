const express = require('express');
const router = express.Router();


//@GET Home
router.get('/',isAuthenticated,(req,res)=>{
  res.render('index');
})


//user authenticated
function isAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    next();
  }else{
    //not user
    res.redirect('/user/login');
  }
}


module.exports = router;