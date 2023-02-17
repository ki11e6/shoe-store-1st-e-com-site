
const Register = require('../models/user')
 const message = require('../twilio')
 const bcrypt = require('bcrypt')
 const Products = require('../models/products')

module.exports={

 getLogin:(req,res)=>{
   if(req.session.message){
      const message = req.session.message
      req.session.message=""
  return res.render('login',{message})
   }
   else{
     const message = ""
    return res.render('login',{message})
   }
    
 },

 getRegister:(req,res)=>{
   if(req.session.message){
   const message =req.session.message
   req.session.message=""
    return res.render('register',{message})
   }
   else{
      const message =""
      return res.render('register',{message}) 

   }
 },
 getLandingpage:async(req,res)=>{
   const products = await Products.find({isDeleted:false})
   
    return res.render('landingpage',{products})
 },
 getHomepage: async(req,res)=>{
   const products = await Products.find({isDeleted :false})
   return res.render('userhome',{products})
 },
 getOtp:(req,res)=>{
   return res.render('otp')
 },
 
 saveUser:async(req,res)=>{
   const check = req.body.email
   const storeuser =({
      username : req.body.username,
      email : req.body.email,
      number :req.body.number,
      password : req.body.password
     })
   req.session.storeuser= storeuser
   // console.log(req.body.number);
  

   const email = await Register.find({email:req.body.email})
   const number = await Register.find({number:req.body.number})
   if(email.length==0){
      if  (number.length!=0){
          req.session.message="Number already exist"
      return res.redirect('/register')
   }else{
          try{
         await message.sentotp(req.session.storeuser.number)
          res.redirect('./otp')
      }
      catch{
         console.log ("err")
      }
   }
} 
else {
   req.session.message="Email already exist"
     return res.redirect('/register')
   }
 },

 
 addUser:async(req,res)=>{
try{
   const storeuser = new Register ({
      username : req.session.storeuser.username,
      email : req.session.storeuser.email,
      number : req.session.storeuser.number,
      password : req.session.storeuser.password
   })
   const otp =req.body.otp
      
   if(otp.length==0){
      req.session.message="Enter otp"
       return res.redirect('/otp')
   }
   else {
      const check =await message.check(otp,req.session.storeuser.number)
      if(check.status=="approved"){
         storeuser.password =await bcrypt.hash(storeuser.password,10)
         await storeuser.save()
         //req.session.storeuser=null
         req.session.message=""
         res.redirect('./login',)
      }
      else{
         req.session.message = "Invalid otp"
         res.redirect('/otp')
      }
   }
}
catch (err){
   console.log(err)

} 
}, 
redirectHomepage: async(req,res)=>{
const user = await Register.find({email:req.body.email})

  password=req.body.password
  if(user.length !=0){
     const match = await bcrypt.compare(req.body.password, user[0].password)
         if(!match){
            req.session.message="password not correct"
      res.redirect('/login')
            }

      else if(user[0].isBlocked){
         req.session.message="User is Blocked"
         res.redirect('/login')
      }
    else{
      
      req.session.user = user
      return res.redirect('/home')
    }
}
  else{
   req.session.message="Invalid User"
   res.redirect('/login',)
  }
    },

getUserlogout: (req,res)=>{
      req.session.user = null
     res.redirect('/login')
    }
   
}

