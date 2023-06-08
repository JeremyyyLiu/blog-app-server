const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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

  // Generate salt for bcrypt
  const salt = bcrypt.genSaltSync(10);

  // Create user in DB
  try {
    const userDocument = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDocument);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.listen(process.env.SERVER_PORT);
