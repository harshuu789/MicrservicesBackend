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
res.status(201).json({token,user});
}
