const router = require("express").Router();
const userRoutes = require("./user-routes.js");
const postRoutes = require("./post-routes.js");
const commentRoutes = require("./comment-route.js");
const msgRoutes = require("./msg-routes.js");

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/msg", msgRoutes);

module.exports = router;
