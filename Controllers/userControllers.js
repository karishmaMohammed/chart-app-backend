const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const {userModelSchema} = require('../modals/userModel');

const loginController = async(req, res) => {

}

const registerController = expressAsyncHandler(
    async(req, res) => {
        const {name, email, password} = req.body;
       //  check for all fields
           if(!name || !email || !password){
               res.send(400);
               throw Error("All fields need to be filled")
           }
       
           // pre existing user
           const userExist = await userModelSchema.findOne({email})
           if(userExist){
               throw new Error("User already Exists");
           }
           const userNameExist = await userModelSchema.findOne({name})
           if(userNameExist){
               throw new Error("UserName already Exists");
           }
       
           // create an entry in DB for user
           const user = await userModelSchema.create({name, email, password });
       }
)



module.exports ={
    loginController,
    registerController
}