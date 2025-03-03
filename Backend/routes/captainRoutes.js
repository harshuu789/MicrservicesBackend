const express=require('express')
const router=express.Router();
const { body }=require('express-validator')
const captainController = require('../controllers/captainController');
const authMiddleWare=require('../middleware/authMiddle');

router.post('/registerCaptain',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Enter correct name'),
    body('password').isLength({min:6}).withMessage('Password must be 6 char long')
],captainController.registerCaptain)

router.post('/loginCaptain',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage('Password must be 6 char long')
],captainController.loginCaptain)

router.get('/getCaptainprofile',authMiddleWare.authCaptain,captainController.captainProfile)
router.get('/logoutCaptain',authMiddleWare.authCaptain,captainController.logoutcaptain)
module.exports=router;