const jwt = require("jsonwebtoken");
const blogModel=require("../models/blogModel");
const ObjectId = require('mongodb').ObjectId



const authentication = async function (req, res, next) {
    try {
        let headers = req.headers["x-api-key"]//["authorization"];//
        if (!headers) {
            res.status(400).send({ status: false, msg: "Token must be present" })
        } else {

            // res.send(headers)
            const token = headers.split(" ")[0];
            // res.send(typeof(token)!=String)
            jwt.verify(String(token), "Author blog secret-key,functionup", (err, author) => {
                if (err) {
                    res.status(400).send({ status: false, msg: "Invalid Token" })
                } else {
                    // console.log(author.authorId)
                    req.Id = author.authorId
                    // res.send(author)

                    next();
                }
            })

           


        }

    } catch (error) {
        res.status(500).send({ status: true, msg: error.message })
    }
}





// /======================================(authorizetion by body)================================================///

const authourizationByBody = async function (req, res, next) {
    try {
        let Id = req.Id;
        let data = req.body;
        if (!(data.title && data.body && data.authorId && data.tags && data.category && data.subcategory)) {
            res.status(400).send({ status: false, msg: "please Enter all data." })
        } else {
            if (data.authorId == Id) {
                req.let = data
                next()
            } else {
                res.status(403).send({ status: false, msg: "unauthorized person is not allowed" })
            }
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}



//========================================(authorizetion by query)==============================================///

const authourizationByQuery = async function (req, res, next) {
    try {
        let Id = req.Id;
        let data = req.query
        try {
            let newData = await blogModel.find(data).find({ isDeleted: false })
            // res.send(newData)
            if (newData[0].authorId == Id) {
                req.let = newData
                next()
                // res.send(newData)
            } else {
                res.status(403).send({ status: false, msg: "unauthorized person is not allowed" })
            }
        } catch (err) {
            res.status(404).send({ status: false, msg: "Data not found." })
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}




//========================================(authorizetion by params)==============================================///

const authourizationByParams = async function (req, res, next) {
    try {
        let Id = req.Id;
        let data = req.params.blogId;
        try {
            let blogId = await blogModel.findById(ObjectId(data)).find({ isDeleted: false })

            // res.send(blogId)
            if (blogId[0].authorId == Id) {
                req.let = blogId
                next()
                // res.send(blogId)
            } else {
                res.status(403).send({ status: false, msg: "unauthorized person is not allowed" })
            }
        } catch (err) {
            res.status(400).send({ status: false, msg:"Invalid Blog Id" })
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}


//======================================================================================///



module.exports.authentication = authentication
module.exports.authourizationByBody = authourizationByBody
module.exports.authourizationByQuery = authourizationByQuery
module.exports.authourizationByParams = authourizationByParams
