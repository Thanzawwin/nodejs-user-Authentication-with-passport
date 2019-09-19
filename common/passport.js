const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');

module.exports = (passport) =>{
  //new localStrategy
  let strategy = new Strategy((username,password,done)=>{
   
    //find user
    Users
      .findOne({username})
      .then(user =>{
        if(user){
          //check password
          let match = bcrypt.compareSync(password,user.password);
          if(match){
            done(null,user);
          }else{
            //password wrong
            done(null,false,{message:'User password Not Match'});
          }
        }else{
          //not found
          done(null,false,{message:'User not found'});
        }
      })
      // SerializeUser && deSerializeUser
      passport.serializeUser((user,done)=> done(null,user.id));

      passport.deserializeUser((id,done)=>{
        Users
          .findById(id)
          .then(user => {
            done(null,user);
          })
      })
  })


  passport.use(strategy)
}