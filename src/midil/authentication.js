
const jwt = require("jsonwebtoken");
const { author } = require("../controllers/authorController");
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel")
const ObjectId = require('mongodb').ObjectId





//=======================================(authentication)===============================================///

const authentication = async function (req, res, next) {
    try {
        let headers = req.headers["x-api-key"];
        if (!headers) {
            res.status(400).send({ status: false, msg: "Please enter token number." })
        } else {
            const token = headers.split(" ")[0];
            jwt.verify(String(token), process.env.TOKEN, (err, author) => {
                if (err) {
                    res.status(400).send({ status: false, msg: "Invalid Token" })
                } else {
                    // console.log(author.authorId)
                    req.Id = author.authorId;
                    next();
                }
            })

        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

//======================================(authorizetion by body)================================================///

const authorizetion1 = async function (req, res, next) {
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

const authorizetion2 = async function (req, res, next) {
    try {
        let Id = req.Id;
        let data = req.query
        try {
            let newData = await blogModel.find(data).find({ isDeleted: false })
            if (newData[0].authorId == Id) {
                req.let = newData
                next()
                // res.send(newData)
            } else {
                res.status(403).send({ status: false, msg: "unauthorized person is not allowed" })
            }
        } catch (err) {
            res.status(400).send({ status: false, msg: "Invalid query data." })
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}




//========================================(authorizetion by params)==============================================///

const authorizetion3 = async function (req, res, next) {
    try {
        let Id = req.Id;
        let data = req.params.blogId;
        try {
            let blogId = await blogModel.findById(ObjectId(data)).find({ isDeleted: false })
            if (blogId[0].authorId == Id) {
                req.let = blogId
                next()
                // res.send(blogId)
            } else {
                res.status(403).send({ status: false, msg: "unauthorized person is not allowed" })
            }
        } catch (err) {
            res.status(400).send({ status: false, msg: "Invalid blog Id." })
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}


//======================================================================================///



module.exports.authentication = authentication
module.exports.authorizetion1 = authorizetion1
module.exports.authorizetion2 = authorizetion2
module.exports.authorizetion3 = authorizetion3