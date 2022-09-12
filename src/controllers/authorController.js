const express = require('express');
const router = express.Router();
const validator = require("email-validator");
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

const bcrypt = require('bcryptjs');


//=========================(Author creat)================================//


const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let email = data.email
        let pass = data.password
        if (!(data.fname && data.lname && data.title && data.email && data.password)) {
            res.status(400).send({ status: false, msg: "please Enter all data." })
        } else {
            try {
                let emailId = validator.validate(email);
                if (emailId == true) {
                    let EmailId = await authorModel.findOne({ email: email })
                    if (EmailId) res.status(409).send({ status: false, msg: "Email Id alredy exist.." })
                    else {
                        const hashedPassword = await bcrypt.hash(pass, 10)
                        data["password"] = hashedPassword;
                        let savedData = await authorModel.create(data)
                        res.status(201).send({ status: true, data: savedData })
                    }
                } else {
                    res.status(400).send({ status: false, msg: "Invalid Email Id." })
                }
            } catch (error) {
                res.status(400).send({ status: false, msg: error.message })
            }
        }
    } catch (error) {
        res.status(500).send({ status: false, msgs: error.message })
    }
}

//=========================(Author Login)================================//

const authorLogin = async function (req, res) {
    try {
        let EmailId = req.body.email;
        let Password = req.body.password;
        if (!(EmailId && Password)) res.status(400).send({ status: false, msg: "Please inpute all data." })
        else {
            let value = await authorModel.find({ email: EmailId })
            if (value.length < 1) {
                res.status(403).send({ status: false, msg: "Oops...Your authentication failed..!" })
            } else {
                let password = await bcrypt.compare(Password, value[0].password)
                if (!password) {
                    res.status(403).send({ status: false, msg: "Permission denide." })
                } else {
                    let token = jwt.sign({ authorId: value[0]._id.toString(), email: value[0].email, password: value[0].password, }, process.env.TOKEN, { expiresIn: "1hr" });
                    res.setHeader("x-api-key", token);
                    res.status(200).send({ status: true, data: value, token: token });
                }

            }
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

//====================================================================================//



module.exports.createAuthor = createAuthor
module.exports.authorLogin = authorLogin
