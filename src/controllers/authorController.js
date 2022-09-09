const validator = require("email-validator");
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const createAuthor = async function (req, res) {
  try {
    let data = req.body
    let emailId = data.email
    let pass = data.password
    if (!(data.fname && data.lname && data.title && pass && emailId)) {
      res.status(400).send({ status: false, msg: "please Enter required field." })
    } else {
      try {
        let data1 = validator.validate(emailId);
        if (data1 == true) {
          let newData = await authorModel.findOne({ email: emailId })
          if (newData) {
            res.status(409).send({ status: false, msg: "emailId is already exist" })
          } else {
            const hashedPassword = await bcrypt.hash(pass, 10)
            data["password"] = hashedPassword;
            let authorCreated = await authorModel.create(data)
            res.status(201).send({ msg: authorCreated })

          }
        } else {
          res.status(404).send({ status: false, msg: "Invalid mailId" })
        }

      } catch (err) {
        res.status(400).send({ status: false, msg: err.message })
      }



    }

  }
  catch (err) {
    res.status(500).send(err.message)
  }
}




const authorLogin = async function (req, res) {
  try {
    let EmailId = req.body.email;
    let Password = req.body.password;

    let validAuthor = await authorModel.find({ email: EmailId })
    if (validAuthor.length < 1) {
      res.status(403).send({ status: false, msg: "Oops! Authentication Error" })
    } else {
      let password = await bcrypt.compare(Password, validAuthor[0].password)
      if (!password) {
        res.status(403).send({ status: false, msg: "Permission denied." })
      } else {
        let token = jwt.sign({ authorId: validAuthor[0]._id.toString(), email: validAuthor[0].email },
         "Author blog secret-key,functionup", { expiresIn: "1hr" });
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: validAuthor, token: token });
      }


    }

  } catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}


module.exports.createAuthor = createAuthor
module.exports.authorLogin = authorLogin