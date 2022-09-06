
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const ObjectId = require('mongodb').ObjectId;
const moment =require('moment')

const createBlog = async function (req, res) {
    try {
        let data = req.body
        let author_id = data.authorId
        let authorData = await authorModel.findById(author_id)

        if (!authorData) {
            res.status(400).send({ msg: "Invalid Author_Id" })
        }
        else {
            let authorCreated = await blogModel.create(data)
            res.status(201).send({ msg: authorCreated })

        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}



const findByQuery = async function (req, res) {
    try {
        let data = req.query
        const newData = await blogModel.find(data)
        if (!newData) {
            res.status(400).send({ status: false, msg: "Data not find" })
        } else if (newData.length < 1) {
            res.status(404).send({ status: false, msg: "Data not found" })
        } else {
            res.status(200).send({ status: true, data: newData })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

const updateBlog = async function (req, res) {
    try {
        let data = req.params.blogId
        let savedData = req.body

        let blogId = await blogModel.findById(ObjectId(data)).find({ isDeleted: false })
        if (blogId.length<1) {
            res.status(404).send({ msg: "Invalid Data" })
        } else {
            let blogData = blogId[0]._id
            let time = moment().format("YYY-MM-DD T HH:MM:SS.SSS Z")
            savedData["publishedAt"] = time
            savedData["isPublished"] = true

            let newData=await blogModel.findOneAndUpdate({_id:blogData},savedData,{new:true})
            res.status(200).send({status:true, data:newData})
        }

    } catch (err) {
        res.status(500).send(err.message)
    }

}

const deleteBlog = async function(req,res){
    try {
        let data = req.params.blogId

        let blogId = await blogModel.findById(ObjectId(data)).find({ isDeleted: false })
        if (blogId.length<1) {
            res.status(404).send({ msg: "Invalid Data" })
        } else {
            let blogData = blogId[0]._id
            let time = moment().format("YYY-MM-DD T HH:MM:SS.SSS Z")

            let newData=await blogModel.findOneAndUpdate({_id:blogData},{ $set:{isDeleted:true, deletedAt:time}},{new:true})
            res.status(200).send({status:true, data:newData})
        }

    } catch (err) {
        res.status(500).send(err.message)
    }

}

const deleteByQuery = async function(req, res){
    try{
        let data = req.query
        data["isDeleted"] = false; // input key and value in data object.
        data["isPublished"] = true; // input key and value in data object.
        const newData = await blogModel.find(data) // find any data exist in this object.
        if(newData.length <1) res.status(404).send({status: false, msg: "Data not found"}) //If don't have any data in newData then send message.

        else{
            let time = moment().format("YYYY-MM-DD T HH:MM:SS.SSS Z"); // set live time using moment module.
            let newData = await blogModel.updateMany( data, {$set: {isDeleted: true, deletedAt: time}},{ new: true })
            res.status(200).send({status: true, data: newData})
        }
    }catch(error){
        res.status(500).send({status: false, msg: error.message})
    }
}





module.exports.createBlog = createBlog

module.exports.findByQuery = findByQuery

module.exports.updateBlog=updateBlog

module.exports.deleteBlog =deleteBlog 

module.exports.deleteByQuery= deleteByQuery