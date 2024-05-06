const express=require("express")
const router=express.Router()
const config=require("../config");
const Student= require("../models/model");
const Joi=require("joi")
const bcrypt=require("bcrypt")


router.post("/login",async(req,res)=>{
   try{
         const Schema=Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().required()
         })

         const {error}= Joi.validate(req.body,Schema);
         if(error) res.status(400).send(error.details[0].message);

         const student=await Student.findOne({email:req.body.email})
         if(!student)  res.status(400).send("invalid email or password");

         const passwordVerif=await bcrypt.compare(req.body.password,student.password)
         if(!passwordVerif) res.status(400).send("invalid email or password");

         const token= jwt.sign({email:tourist.email},config.secretkey.jwt_secret);
         res.status(200).send(token)
   }catch(error){
    res.status(500).send(error);
   }
})