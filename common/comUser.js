const bcrypt = require('bcryptjs');
//Model
const Users = require('../model/Users');

//User Register
function addUser(reqUser,done){
  const { name,username,email,password,confirm } = reqUser;

  //all fields
  if(!name || !username || !email || !password || !confirm ){
    return done({msg:'please fill in all required fields'},reqUser);
  }
  //email
  if(!validateEmail(email)){
    return done({msg:'please use validate email'},reqUser);
  }

  //password length
  if(password.length < 6){
    return done({msg:'password at least 6 character'},reqUser);
  }

  //password and confirm
  if(password != confirm){
    return done({msg:'password not match'},reqUser);
  }

  //username
  Users
    .findOne({username})
    .then(user =>{
      if(user){
        //if user
        done({msg:'please choose another username'},reqUser);
      }else{
        let salt = bcrypt.genSaltSync(10,password);
        let hash = bcrypt.hashSync(password,salt);
        //pass generate
        done(null,{ name,username,email,password:hash })
      }
    })

}

module.exports = {
  addUser
}

//validate email
function validateEmail(email) {
  var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}