const jwt=require("jsonwebtoken");
const express=require("express");
const router=express.Router();
const Joi=require("joi");
const Student=require("../models/model")
const bcrypt=require("bcrypt");
const config=require("../config")

router.post("/",async(req,res)=>{

    try{
        const Schema= Joi.object({
            name:Joi.string().min(4).required(),
            email:Joi.string().email().required(),
            password:Joi.string().required().min(6)
         });
    
         const {error}= Joi.validate(req.body,Schema);
         if(error) res.status(400).send(error.details[0].message);
    
    
         const student= await Student.findOne({email:req.body.email});
         if(student) res.status(400).send("student already exist!");
    
        const salt= bcrypt.genSalt(10);
        const hashedpassword= await bcrypt.hash(req.body.password,salt);
    
        const newStudent=new Student({
            name:req.body.name,
            email:req.body.email,
            password:hashedpassword
        })
         newStudent =await newStudent.save()

         const token= await jwt.sign({email:req.body.email},config.secretkey.jwt_secret);
         res.status(200).send(newStudent,token);
    }
    catch(error){
        res.status(500).send(error);
    }
})