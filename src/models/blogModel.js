const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        ref: "Author",
        required: true
    },
    tags: {
        type: [],
        items :{
        type:String,}
    },
    category: {
        type: String,
        required: true,
        // enum: ["technology", "entertainment", "life style", "food", "fashion"]
    },
    subcategory: {
        type: String,
        required: true,
        // enum: [technology-[web development, mobile development, AI, ML etc]]
    },
    
    isPublished: {
        type: Boolean, 
        default: false
    },

    publishedAt:{
        type:String,
        default:''
    },

    isDeleted: {
        type: Boolean, 
        default: false
    },

    deletedAt:{
        type:String,
        default:''
    }




}, { timestamps: true })



module.exports = mongoose.model('Blog', blogSchema)