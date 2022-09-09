const express = require('express');
const router = express.Router();
const AuthorController = require("../controllers/authorController")
const BlogController = require("../controllers/blogController")
const middleWare = require("../middleWare/authentication")
const user = require("../controllers/userController")






router.get("/test-me", function (req, res) {
    res.send("My first ever api!")

})

router.get("/user", user.user)



router.post("/authors", AuthorController.createAuthor)

router.post("/blogs", middleWare.authentication,middleWare.authourizationByBody,BlogController.createBlog)  //middleWare.authentication

router.get("/blogs", BlogController.findByQuery)

router.put("/blogs/:blogId", middleWare.authentication, middleWare.authourizationByParams, BlogController.updateBlog)

router.delete("/blogs/:blogId",  middleWare.authentication, middleWare.authourizationByParams, BlogController.deleteBlogById)

router.delete("/blogs", middleWare.authentication, middleWare.authourizationByQuery, BlogController.deleteByQuery)

router.post("/login", AuthorController.authorLogin)




module.exports = router;