const dotenv=require('dotenv');
dotenv.config();
const express=require('express');
const cors=require('cors')
const app=express();
const connectdb=require('./db/db')
const userRoutes=require('./routes/userRoutes')
connectdb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send('Hello World');
    
});
app.use(express.json());
app.use('/users',userRoutes);
module.exports=app; 
