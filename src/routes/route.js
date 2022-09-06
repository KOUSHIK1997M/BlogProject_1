const express = require('express');
const router = express.Router();
const AuthorController=require("../controllers/authorController")
const BlogController=require("../controllers/blogController")
// const CowinController= require("../controllers/cowinController")
// const WeatherController=require("../controllers/weather Controller")
// const memesController=require("../controllers/mems controller")



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")

})

router.post("/authors",AuthorController.createAuthor)

router.post("/blogs",BlogController.createBlog)

router.get("/blogs",BlogController.findByQuery)

router.put("/blogs/:blogId",BlogController.updateBlog)

router.delete("/blogs/:blogId",BlogController.deleteBlog )

router.delete("/blogs",BlogController.deleteByQuery)




module.exports = router;