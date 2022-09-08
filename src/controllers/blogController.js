const { updateMany } = require("../models/authorModel");
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const ObjectId = require('mongodb').ObjectId
const moment = require("moment")

//==================================== Blogs post api ===============================//


const createBlog = async function (req, res) {
    try {
        let Id = req.Id;
        let data = req.body;
        let objectid = data.authorId;
        if (!(data.title && data.body && data.authorId && data.tags && data.category && data.subcategory)) {
            res.status(400).send({ status: false, msg: "please Enter all data." })
        } else {
            if (objectid === Id) {
                let newData = await authorModel.findById(objectid)
                if (!newData) res.status(400).send({ status: false, msg: "Invalid author Id" })
                else {
                    let savedData = await blogModel.create(data)
                    res.status(201).send({ status: true, data: savedData })
                }
            } else res.status(401).send({ status: false, msg: "Unauthorized Person" })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


//===================================== find blogs data by query params =======================//

const findQuery = async function (req, res) {
    try {
        let data = req.query
        data["isDeleted"] = false;
        data["isPublished"] = true;
        const newData = await blogModel.find(data)
        if (newData.length < 1) res.status(404).send({ status: false, msg: "Data not found" })
        else res.status(200).send({ status: true, data: newData })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


//============================== PUT /blogs/:blogId ================================//

const blogUpdate = async function (req, res) {
    try {
        let Id = req.Id;
        let data = req.params.blogId;
        let savedData = req.body;
        let blogId = await blogModel.findById(ObjectId(data)).find({ isDeleted: false })
        let AuthorId = blogId[0].authorId
        if (AuthorId == Id) {
            let data1 = blogId[0]._id
            let time = moment().format(process.env.TIME);
            savedData["publishedAt"] = time;
            let newData = await blogModel.findOneAndUpdate({ _id: data1 }, savedData, { new: true })
            res.status(200).send({ status: true, data: newData })
        } else {
            res.status(404).send({ status: false, msg: "Invalid data." })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//============================ DELETE /blogs/:blogId (params)=================================//

const deleteByblogId = async function (req, res) {
    try {
        let Id = req.Id;
        let data = req.params.blogId;
        let deleted = await blogModel.findById(ObjectId(data)).find({ isDeleted: true });
        if (deleted.length == 1) {
            res.status(200).send({ status: true, msg: "Data already deleted." })
        } else {
            let blogId = await blogModel.findById(ObjectId(data)).find({ isDeleted: false });
            if (blogId.length < 1) res.status(404).send({ status: false, msg: "Data not found" })
            else {
                if (blogId[0].authorId == Id) {
                    let data1 = blogId[0]._id
                    let time = moment().format(process.env.TIME);
                    let newData = await blogModel.findOneAndUpdate({ _id: data1 }, { $set: { isDeleted: true, deletedAt: time } }, { new: true })
                    res.status(200).send({ status: true, data: newData })
                } else res.status(403).send({ status: false, msg: "Invalid data input." })
            }
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


//============================ DELETE /blogs/:blogId (Query)=================================//

const deleteByQuery = async function (req, res) {
    try {
        let Id = req.Id
        let data = req.query
        let deleted = await blogModel.find(data).find({ isDeleted: true });
        // res.send(deleted)
        if (deleted.length == 1) {
            res.status(200).send({ status: true, msg: "Data already deleted." })
        } else {
            data["isDeleted"] = false; // input key and value in data object.
            const newData = await blogModel.find(data) // find any data exist in this object.
            if (newData.length < 1) {
                res.status(404).send({ status: false, msg: "Data not found" })
            } else {
                if (newData[0].authorId == Id) {
                    let time = moment().format(process.env.TIME); // set live time using moment module.
                    let newData1 = await blogModel.updateMany(data, { $set: { isDeleted: true, deletedAt: time } }, { new: true })
                    res.status(200).send({ status: true, data: newData1 })
                } else {
                    res.status(404).send({ status: false, msg: "Data not found" }) //If don't have any data in newData then send message.
                }
            }
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports.createBlog = createBlog
module.exports.findQuery = findQuery
module.exports.blogUpdate = blogUpdate
module.exports.deleteByblogId = deleteByblogId
module.exports.deleteByQuery = deleteByQuery
