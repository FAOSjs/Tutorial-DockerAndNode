const express = require("express")

const postControllers = require("../controllers/post.controllers")
const authHandle = require("../middlewares/auth.middleware")

const router = express.Router()

router.route("/")
   .get(postControllers.getAllPosts)
   .post(authHandle, postControllers.createPost)
   
router.route("/:id")
   .get(authHandle, postControllers.getOnePost)
   .patch(authHandle, postControllers.updatePost)
   .delete(authHandle, postControllers.deletePost)


module.exports = router
