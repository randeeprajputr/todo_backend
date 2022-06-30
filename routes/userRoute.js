const router=require('express').Router()
const userController=require('../controllers/userController')
const auth=require('../middlewares/auth')
// const authAdmin=require('../middlewares/authAdmin')

router.post('/register',userController.register)

router.post('/login',userController.login)

router.post('/refresh_token',userController.getAccessToken)

router.patch('/update-user',auth,userController.updateUser)

router.get('/logout',userController.logout)

router.delete('/delete/:id',auth,userController.deleteUser)

module.exports=router