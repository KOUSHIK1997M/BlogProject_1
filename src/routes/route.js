const express = require('express');
const router = express.Router();
const AuthorController= require("../controllers/authorController")
const blogController= require("../controllers/blogController")
const mild = require("../midil/emailCheck")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.post("/authors",mild.mild1, AuthorController.createAuthor  )//mild.mild1,

router.post("/blogs", blogController.createBlog )

router.get("/blogs", blogController.findQuery)

router.put("/blogs/:blogId", blogController.blogUpdate)

router.delete("/blogs/:blogId", blogController.deleteByblogId)

router.delete("/blogs", blogController.deleteByQuery)

module.exports = router;
