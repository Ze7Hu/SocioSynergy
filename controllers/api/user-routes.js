const router = require("express").Router();
const path = require("path");
const { User, Post, Comment } = require("../../models");

router.get("/", (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((userData) => res.json(userData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
        // Save the user's session data in the server-side session store
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.profile_picture = userData.profile_picture;
        req.session.logged_in = true;

        res.json({ user: userData, message: "You are now logged in" });
      });

    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((userData) => {
      if (!userData) {
        res
          .status(400)
          .json({ message: "A user with this ID could not be found" });
        return;
      }
      const validPassword = userData.checkPassword(req.body.password);

      if (!validPassword) {
        res
          .status(400)
          .json({ message: "Incorrect password. Please try again" });
        return;
      }
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.profile_picture = userData.profile_picture;
        req.session.logged_in = true;

        res.json({ user: userData, message: "You are now logged in" });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put("/:id", (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData) {
        res
          .status(404)
          .json({ message: "A user with this ID could not be found" });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData) {
        res
          .status(404)
          .json({ message: "A user with this ID could not be found" });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/upload", (req, res) => {
  User.update({ profile_picture: true }, { where: { id: req.session.user_id } })
    .then((userData) => {
      if (!userData) {
        res.status.json({ message: "A user with this ID could not be found" });
        return;
      }

      const { file } = req.files;

      try {
        if (!file) return res.status(400);
        file.mv(
          path.join(__dirname, "../../public/img/profile/") +
            req.session.user_id +
            ".png"
        );
      } catch (error) {
        res.status(400).json(error);
      }

      res.redirect("/profile");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

module.exports = router;
