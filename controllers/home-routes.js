const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const router = require("express").Router();
const withAuth = require("../utils/auth");


router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "profile_picture"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    const posts = postData.map((post) => post.get({ plain: true }));
    const newPosts = posts.map((post) => {
      return {
        ...post,
        logged_in: req.session.logged_in,
        username: req.session.username,
      }
  });
    res.render("homepage", { 
      newPosts,
      logged_in: req.session.logged_in,
      username: req.session.username,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/profile", withAuth, (req, res) => {
  User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.session.user_id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "content", "created_at"],
      },
      {
        model: Comment,
        attributes: ["id", "text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
      {
        model: Post,
        attributes: ["title"],
      },
    ],
  })
    .then((userData) => {
      if (!userData) {
        res
          .status(404)
          .json({ message: "A user with this id could not be found" });
        return;
      }
      const user = userData.get({ plain: true });
      console.log(user);
      res.render("profile", {
        user,
        logged_in: req.session.logged_in,
        username: req.session.username,
        user_id: req.session.user_id,
        profile_picture: req.session.profile_picture,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");
});


router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});


router.get("/post/:id", withAuth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "content", "title", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "A post with this ID could not be found" });
        return;
      }
      const post = data.get({ plain: true });
      res.render("single-post", { post, logged_in: req.session.logged_in });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/posts-comments", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "content", "title", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .json({ message: "A post with this ID could not be found" });
        return;
      }
      const post = data.get({ plain: true });

      res.render("posts-comments", { post, logged_in: req.session.logged_in });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/user/:id", withAuth, (req, res) => {
  if (req.session.user_id == req.params.id) {
    res.status(200).redirect("../profile");
  } else {
    User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Post,
          order: [["created_at", "DESC"]],
          attributes: ["id", "title", "content", "created_at"],
        },
        {
          model: Comment,
          attributes: ["id", "text", "created_at"],
          include: {
            model: Post,
            attributes: ["title"],
          },
        },
        {
          model: Post,
          attributes: ["title"],
        },
      ],
    })
      .then((userData) => {
        if (!userData) {
          res
            .status(404)
            .json({ message: "A user with that id could not be found" });
          return;
        }

        const user = userData.get({ plain: true });
        res.render("user-preview", {
          user,
          logged_in: req.session.logged_in,
          username: req.session.username,
          user_id: req.session.user_id,
        });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
});

module.exports = router;
