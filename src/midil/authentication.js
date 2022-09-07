
const jwt = require("jsonwebtoken");
const {  author } = require("../controllers/authorController");



const authentication = async function (req, res, next){
    try{
        let headers = req.headers["authorization"];
        // res.send(headers)
        const token = headers.split(" ")[1];
        if(!token){
            res.status(404).send({status: false, msg: "No token found."})
        }
        jwt.verify(String(token), "functionup-plutonium-very-very-secret-key",(err, author)=>{
            if(err){
                res.status(400).send({status: false, msg: "Invalid Token"})
            }else{
                // console.log(author.authorId)
                req.Id = author.authorId; 
                next();
            }
        })
    }catch(error){
        res.status(500).send({status: true, msg: error.message})
    }
}

module.exports.authentication = authentication