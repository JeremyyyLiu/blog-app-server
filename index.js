const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./src/models/User");
const Post = require("./src/models/Post");
require("dotenv").config();

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json());

// MongoDB connection
mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`);

// Register controller
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Encrypt the password using bcrypt
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Create user in DB
  try {
    const userDocument = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(200).json("Registration successful");
  } catch (e) {
    res.status(400).json(e);
  }
});

// Login controller
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists in DB
    const userDocument = await User.findOne({ username });

    // Check if password is correct
    const passwordMatch = bcrypt.compareSync(password, userDocument.password);

    // If password matches, sign the JWT token and send to client
    passwordMatch
      ? jwt.sign(
          { username, id: userDocument._id },
          process.env.JWT_SECRET_KEY,
          {},
          (error, token) => {
            if (error) throw error;
            res.cookie("token", token).json({
              id: userDocument._id,
              username,
            });
          }
        )
      : res.status(400).json("Invalid username or password. Please try again.");
  } catch (e) {
    res.status(200).json("Invalid username or password. Please try again.");
  }
});

// Profile controller
app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  // Verify JWT token
  jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

// Logout controller
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// Create post controller
app.post("/post", async (req, res) => {
  const { title, body } = req.body;

  const postDocument = await Post.create({
    title,
    body,
  });

  res.json(postDocument);
});

// Server port
app.listen(process.env.SERVER_PORT);
