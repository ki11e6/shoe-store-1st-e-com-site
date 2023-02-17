const mongoose = require('mongoose')

const UserSchema=new mongoose.Schema({
    username :{
        type:String,
        require:true
    },
   
    email:{
        type:String,
        require:true,
        lowercase:true
   },
   number:{
    type:Number,
    require:true
   },
    password:{
        type:String,
        require:true
   },
   confirmpassword:{
     type:String,
     require:true
   },
   isBlocked:{
     type:Boolean,
     default:false
   }
})
UserSchema.pre('save', async function(next){
  try {
    hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next();
  } catch (error) {
    console.log(error)
  }
})
const Register = mongoose.model('Register',UserSchema)

module.exports = Register