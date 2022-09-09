const { updateMany } = require("../models/authorModel");
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const ObjectId = require('mongodb').ObjectId
const moment = require("moment")

//==================================== Blogs post api ===============================//


const createBlog = async function (req, res) {
    try {
        let data = req.let
        let savedData = await blogModel.create(data)
        res.status(201).send({ status: true, data: savedData })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


//===================================== find blogs data by query params =======================//

const findByQuery = async function (req, res) {
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

const updateBlog = async function (req, res) {
    try {
        let data = req.let
        let savedData = req.body;
        let data1 = data[0]._id
        let time = moment().format("YYYY-MM-DD T HH:MM:SS.SSS Z");
        savedData["publishedAt"] = time;
        let newData = await blogModel.findOneAndUpdate({ _id: data1 }, savedData, { new: true })
        res.status(200).send({ status: true, data: newData })
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//============================ DELETE /blogs/:blogId (params)=================================//

const deleteBlogById = async function (req, res) {
    try {
        let data = req.let;
        let time = moment().format("YYYY-MM-DD T HH:MM:SS.SSS Z");
        let newData = await blogModel.findOneAndUpdate({ _id: data[0]._id }, { $set: { isDeleted: true, deletedAt: time } }, { new: true })
        res.status(200).send({ status: true, data: newData })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


//============================ DELETE /blogs/:blogId (Query)=================================//

const deleteByQuery = async function (req, res) {
    try {
        let data = req.query;
        let time = moment().format("YYYY-MM-DD T HH:MM:SS.SSS Z") // set live time using moment module.
        let newData1 = await blogModel.updateMany(data, { $set: { isDeleted: true, deletedAt: time } }, { new: true })
        res.status(200).send({ status: true, data: newData1 })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}



module.exports.createBlog = createBlog
module.exports.findByQuery = findByQuery
module.exports.updateBlog = updateBlog
module.exports.deleteBlogById = deleteBlogById
module.exports.deleteByQuery = deleteByQuery