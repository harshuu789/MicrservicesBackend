const blacklistTokenModel = require('../models/blackList');
const userModel=require('../models/userModel');
const userServices=require('../services/userServices');
const {validationResult}=require('express-validator');
// const mongoose=require('mongoose');

module.exports.registerUser=async(req,res,next)=>{
 const errors=validationResult(req);

 if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
 }

 const{fullname,email,password}=req.body;
//  console.log(req.body);
const  hashedPassword = await userModel.hashPassword(password);

const user = await userServices.createUser({
  firstname: fullname.firstname,
  lastname: fullname.lastname,
   email,
   password:hashedPassword
   
})
const token=user.generateAuthToken();
res.cookie('token',token).status(201).json({token,user});
}

module.exports.loginUser=async (req,res,next)=>{
   const errors=validationResult(req);
   if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
   }
   const { email, password } = req.body; 
   
   const user=await userModel.findOne({email}).select('+password');


if(!user){
   return res.status(404).json({"message":"user not found"})
}
const isMatch=await user.comparePassword(password);
if(!isMatch){
   return res.status(400).json({"message":"Invalid credentials"});
} 
const token=user.generateAuthToken();
res.cookie('token',token).status(200).json({token,user});
}
module.exports.logoutUser=async(req,res,next)=>{

   res.status(200).clearCookie('token').json({"message":"Logged out successfully"})
   await blacklistTokenModel.create({token:req.cookies.token});
}
module.exports.getUserProfile=async(req,res,next)=>{
   res.status(200).json(req.user);
}

