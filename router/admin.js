const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const JSONdb = require("simple-json-db");

const config = require("../config");
const { db } = require("../lib/database");
const { isAuthenticated } = require("../lib/api");
const Function = require("../lib/function");
const Func = new Function();

let tokens = "RonzzYT118";

router.get("/", isAuthenticated, async (req, res) => {
  const user = req.user;

  if (user.isAdmin) {
    res.render("admin", {
      title: `${config.web.title} || Admin Page`,
      page: config.web.title,
      user: req.user,
      message: req.flash(),
      layout: "layouts/main"
    });
  } else {
    res.redirect("/dash");
  }
});

// API Standard
router.post("/standard/add", async (req, res) => {
  const { username, days, token } = req.body;

  try {
    if (token !== tokens) {
      req.flash("error", "Invalid Token Input");
      res.redirect("/admin");
    } else {
      const user = await db.findOne({ username: username.replace(/[^A-Za-z0-9]/g, '').toLowerCase() });

      if (!user) {
        req.flash("error", "User Not Found");
        res.redirect("/admin");
      }

      user.limit = config.options.standardLimit;
      user.standard = true;
      user.standardTime = new Date() * 1 + days * 86400000;

      await user.save();

      req.flash("success", username + " Standard added successfully");
      res.redirect("/admin");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Error add standard user");
  }
});

router.post("/standard/delete", async (req, res) => {
  const { username, token } = req.body;

  try {
    if (token !== tokens) {
      req.flash("error", "Invalid Token Input");
      res.redirect("/admin");
    } else {
      const user = await db.findOne({ username: username.replace(/[^A-Za-z0-9]/g, '').toLowerCase() });

      if (!user) {
        req.flash("error", "User Not Found");
        res.redirect("/admin");
      }

      user.limit = config.options.limit;
      user.standard = false;
      user.standardTime = 0;

      await user.save();

      req.flash("success", username + " Standard delete successfully");
      res.redirect("/admin");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Error delete standard user");
  }
});

router.get("/standard/list", async (req, res) => {
  try {
    const users = await db.find();
    let z = 1;
    const resultArray = [];

    users
      .filter((user) => user.standard)
      .forEach((user) => {
        const timer = user.standardTime ? user.standardTime - new Date() : 0;

        resultArray.push({
          no: z++,
          name: user.username,
          standard: user.standard,
          expired: timer,
          profile: user.profile,
        });
      });

    res.json(resultArray);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API PREMIUM
router.post("/premium/add", async (req, res) => {
  const { username, days, token } = req.body;

  try {
    if (token !== tokens) {
      req.flash("error", "Invalid Token Input");
      res.redirect("/admin");
    } else {
      const user = await db.findOne({ username: username.replace(/[^A-Za-z0-9]/g, '').toLowerCase() });

      if (!user) {
        req.flash("error", "User Not Found");
        res.redirect("/admin");
      }

      user.limit = config.options.premiumLimit;
      user.standard = false;
      user.standardTime = 0;
      user.premium = true;
      user.premiumTime = new Date() * 1 + days * 86400000;

      await user.save();

      req.flash("success", username + " Premium added successfully");
      res.redirect("/admin");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Error add premium user");
  }
});

router.post("/premium/delete", async (req, res) => {
  const { username, token } = req.body;

  try {
    if (token !== tokens) {
      req.flash("error", "Invalid Token Input");
      res.redirect("/admin");
    } else {
      const user = await db.findOne({ username: username.replace(/[^A-Za-z0-9]/g, '').toLowerCase() });

      if (!user) {
        req.flash("error", "User Not Found");
        res.redirect("/admin");
      }

      user.limit = config.options.limit;
      user.premium = false;
      user.premiumTime = 0;

      await user.save();

      req.flash("success", username + " Premium delete successfully");
      res.redirect("/admin");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Error delete premium user");
  }
});

router.get("/premium/list", async (req, res) => {
  try {
    const users = await db.find();
    let z = 1;
    const resultArray = [];

    users
      .filter((user) => user.premium)
      .forEach((user) => {
        const timer = user.premiumTime ? user.premiumTime - new Date() : 0;

        resultArray.push({
          no: z++,
          name: user.username,
          premium: user.premium,
          limit: user.limit,
          expired: timer,
          profile: user.profile,
        });
      });

    res.json(resultArray);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/user/delete", async (req, res) => {
  const { username, token } = req.body;

  try {
    if (token !== tokens) {
      req.flash("error", "Invalid Token Input");
      res.redirect("/admin");
    } else {
      const user = await db.findOne({ username: username.replace(/[^A-Za-z0-9]/g, '').toLowerCase() });

      if (!user) {
        req.flash("error", "User Not Found");
        res.redirect("/admin");
      }

      await user.deleteOne()

      req.flash("success", username + " User delete successfully");
      res.redirect("/admin");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Error delete user");
  }
});

router.get("/user/list", async (req, res) => {
  try {
    const users = await db.find();
    let z = 1;
    const resultArray = [];

    for (let user of users) {
      const timer = user.vipTime ? user.vipTime - new Date() : user.premiumTime ? user.premiumTime - new Date() : false;

      resultArray.push({
        no: z++,
        name: user.username,
        vip: user.vip,
        premium: user.premium,
        limit: user.limit,
        expired: timer,
        profile: user.profile,
      });
    };

    res.json(resultArray);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/user/update", async (req, res) => {
  try {
    const users = await db.find();

    for (let user of users) {
      user.name = user.username
      user.username = user.username.replace(/[^A-Za-z0-9]/g, '').toLowerCase()

      await user.save();
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    req.flash("error", "Error add premium user");
  }
});

router.get("/changelog", (req, res) => {
  try {
    const { changelog } = database.JSON();

    res.status(200).json(changelog || []);
  } catch (error) {
    console.error("Error reading changelog file:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
