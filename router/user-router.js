const express = require ('express')
const router = express.Router()
const userControls=require('../controller/user-controller')
const session = require('../middleware/usersession')



router.get('/login',session.notLogged,  userControls.getLogin)

router.get('/otp',session.notLogged,userControls.getOtp)
router.get('/register',session.notLogged,userControls.getRegister)
router.get('/',session.notLogged, userControls.getLandingpage)
router.get('/home',session.isLogged, userControls.getHomepage)

router.get('/logout',userControls.getUserlogout)



router.post('/register',userControls.saveUser)
router.post('/otp',userControls.addUser)
router.post('/login',userControls.redirectHomepage)


module.exports=router