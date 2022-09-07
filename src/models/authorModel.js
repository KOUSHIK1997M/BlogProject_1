// { fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }
const validator = require('validator');
const mongoose= require('mongoose');

const authorSchema=new mongoose.Schema({
    
        fname:{
            type:String,
            required: [true, "First name is required."]
        },

        lname:{
            type:String,
            required: [true, "Last name is required."]
        },
        
        title:{
            type: String, 
            required:[true, "Title is required"], 
            enum:["Mr", "Mrs", "Miss"]
        }, 
        email:{
              type:String,
               required:[true, "Email Id is required"],
                unique:true,
                validate(value){if(!validator.isEmail(value)){throw new Error("Email is invalid")}}
        },

        password:{
            type:String, 
            required:[true, "Password is required."]
        } ,   
    

}, {timestamps:true});

module.exports = mongoose.model('Author', authorSchema)
