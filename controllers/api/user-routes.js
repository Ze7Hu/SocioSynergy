const router = require("express").Router();
const path = require("path");
const { User, Post, Comment } = require("../../models");
const fs = require("fs");

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
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.profile_picture = userData.profile_picture;
      req.session.logged_in = true;
      res.json({ user: userData, message: "You are now logged in" });
    });
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
      if (!userData[0]) {
        res.status(400).json({ message: "A user with this ID could not be found" });
        return;
      }

      const { file } = req.files;

      try {
        if (!file) return res.status(400).json({ message: "File not found" });

        const directoryPath = path.join(__dirname, "../../public/img/profile/");
        const filePath = directoryPath + req.session.user_id + ".png";

        // Create the directory if it doesn't exist
        if (!fs.existsSync(directoryPath)) {
          fs.mkdirSync(directoryPath, { recursive: true });
        }

        file.mv(filePath, (error) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to upload file", details: error.message });
          }
          console.log("File uploaded successfully:", filePath);
          req.session.profile_picture = true
          req.session.save()
          res.redirect("/profile");
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to upload file", details: error.message });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Database error", details: error.message });
    });
});

module.exports = router;
