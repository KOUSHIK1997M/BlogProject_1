const express = require('express');
const router = express.Router();
const emailValidator = require('deep-email-validator');
const authorModel= require("../models/authorModel")
const jwt = require("jsonwebtoken");


//=========================(Author creat)================================//


const createAuthor= async function (req, res) {
    try {
        let data= req.body
        let email = data.email
        async function isEmailValid(email) { return emailValidator.validate(email)}
        const {valid, reason, validators} = await isEmailValid(email);
        if(valid){
            let EmailId = await authorModel.findOne({email:email})
            if(EmailId) res.status(404).send({status: true, msg: "Email Id alredy exist.."})
            else{
                let savedData= await authorModel.create(data)
                res.status(201).send({status: true, data: savedData})
            }
        }else{
            res.status(404).send({status: false, msg: "Invalid email."})
        }

    }catch (error){
        res.status(500).send({status: false, msg: error.message})
    }
}

//=========================(Author Login)================================//


const  authorLogin = async function (req, res){
    try{
        let EmailId = req.body.email;
        let Password = req.body.password;
        let value = await authorModel.find({email: EmailId, password: Password})
        // res.send(value)
        if(value.length < 1){
            res.status(403).send({status: false, msg: "Oops...Your authentication failed..!"})
        }else{
            let token = jwt.sign(
                {
                  authorId: value[0]._id.toString(),
                  email: value[0].email,
                  password: value[0].password,
                },"functionup-plutonium-very-very-secret-key",{expiresIn: "1hr"});
                res.setHeader("x-api-key", token);
                res.status(200).send({ status: true,data: value ,token: token });
        }
    }catch(error){
        res.status(500).send({status: false, msg: error.message})
    }
}

//====================================================================================//

const user =  async function(req, res, ){
    try{
        const Id = req.Id
        res.send(Id)
    }catch(err){
        res.status(500).send({msg: err.message})
    }
}



module.exports.createAuthor = createAuthor
module.exports.authorLogin = authorLogin
module.exports.user = user