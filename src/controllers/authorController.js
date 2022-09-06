var validator = require("email-validator");


const author = require("../models/authorModel")

const createAuthor= async function (req, res) {
   try{
    let data= req.body
    let emaiId= data.email

    let data1 = validator.validate(emaiId);
    if(data1==true){
      let authorCreated = await author.create(data)
    res.status(201).send({msg: authorCreated})
      
    }else{
      res.status(404).send({status:false, msg:"Invalid mailId"})
    }
    

   }
   catch(err){
    res.status(500).send(err.message)
   }
}


module.exports.createAuthor=createAuthor