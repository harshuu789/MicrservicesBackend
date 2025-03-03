const captainModel=require('../models/captainModel');
const captainServices = require('../services/captainServices');
const {validationResult}=require('express-validator');
const blacklistTokenModel = require('../models/blackList');
// const mongoose=require('mongoose');

module.exports.registerCaptain=async(req,res,next)=>{
 const errors=validationResult(req);

 if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
 }

 const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }
 console.log(req.body);
const  hashedPassword = await captainModel.hashPassword(password);

const captain = await captainServices.createCaptain({
   firstname: fullname.firstname,
   lastname: fullname.lastname,
   email,
   password: hashedPassword,
   color: vehicle.color,
   plate: vehicle.plate,
   capacity: vehicle.capacity,
   vehicleType: vehicle.vehicleType
});

const token=captain.generateAuthToken();
res.status(201).json({token,captain});
}

module.exports.loginCaptain=async(req,res,next)=>{
    const errors=validationResult(req);
   if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
   }
      
   const { email , password } =req.body;

   const captain= await captainModel.findOne({email}).select('+password');
   if(!captain){
      return res.status(404).json({"message":"Captain not found"});
   }
   const isMatch=await captain.comparePassword(password);
   if(!isMatch){
      return res.status(400).json({"message":"Invalid Credentials"})
   }

   const token=captain.generateAuthToken();
   res.cookie('token',token).status(201).json({token,captain});



}
module.exports.captainProfile=async(req,res,next)=>{
   res.status(200).json(req.captain);
}
module.exports.logoutcaptain=async(req,res,next)=>{
   res.status(200).clearCookie('token').json({"message":"Logged out Successfully"})
   await blacklistTokenModel.create({token:req.cookies.token});
}
module.exports.updateCaptain=async(req,res,next)=>{
   const errors=validationResult(req);
   if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
   }
   const {fullname,email,password,vehicle}=req.body;
   const captain=await captainModel.findOne({email});
   if(!captain){
      return res.status(404).json({"message":"Captain not found"});
   }
   if(password){
      captain.password=await captainModel.hashPassword(password);
   }
   captain.fullname=fullname;
   captain.vehicle=vehicle;
   await captain.save();
   res.status(200).json(captain);
}