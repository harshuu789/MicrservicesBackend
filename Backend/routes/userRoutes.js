const express=require('express')
const router=express.Router();
const { body }=require('express-validator')
const userController = require('../controllers/userController');

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Enter correct name'),
    body('password').isLength({min:6}).withMessage('Password must be 6 char long')
],userController.registerUser)


module.exports=router;