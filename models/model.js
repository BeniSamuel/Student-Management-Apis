const express=require("express");
const mongoose=require("mongoose");


mongoose.connect("mongodb://localhost/Course",{})
.then(()=>console.log("connection made successfully"))
.catch((err)=>console.log("failed due to the following:",err));

const coureSchema=new mongoose.Schema({
    name:{
        type:String,
        minLength:5
    },
    description:{
        type:String,
    }
})

const Course=mongoose.model("Course",courseSchema);

module.exports=Course;