const express = require('express');
const router = express.Router();
const AuthorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")
const authentication = require("../midil/authentication")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


// ===================================================================================///

router.post("/authors", AuthorController.createAuthor  )//mild.mild1,

router.post("/blogs",authentication.authentication, blogController.createBlog )

router.get("/blogs", blogController.findQuery)

router.put("/blogs/:blogId",authentication.authentication ,blogController.blogUpdate)

router.delete("/blogs/:blogId",authentication.authentication ,blogController.deleteByblogId)

router.delete("/blogs",authentication.authentication ,blogController.deleteByQuery)

//========================================================================================//

router.post("/login" ,AuthorController.authorLogin)




module.exports = router;
