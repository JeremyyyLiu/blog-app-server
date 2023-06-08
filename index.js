const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./src/models/User");
require("dotenv").config();

const app = express();

app.use(cors());
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
            res.json(token);
          }
        )
      : res.status(400).json("Invalid username or password. Please try again.");
  } catch (e) {
    res.status(200).json("User does not exist. Please register first.");
  }
});

// Server port
app.listen(process.env.SERVER_PORT);
