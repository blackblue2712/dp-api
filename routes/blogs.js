const router = require("express").Router();

const {
    requireSignin
} = require("../controllers/auth");

const {
    getBlogs,
    getAllBlogs,
    postWriteBlog,
    getSingleBlog,
    getSingleBlogToEdit,
    requestRelatedBlogId,
    putEditBlog,
    getYourBlogs,
    deleteBlog
} = require("../controllers/blogs");

router.get("/", getBlogs);
router.get("/all", getAllBlogs);
router.post("/write", requireSignin, postWriteBlog)
router.get("/your-blogs", getYourBlogs);
router.get("/:blogId", getSingleBlog);
router.get("/edit/:blogId", getSingleBlogToEdit);
router.put("/edit/:blogId", requireSignin, putEditBlog);

router.delete("/delete/:bid", requireSignin, deleteBlog);

router.param("blogId", requestRelatedBlogId);

module.exports = router;