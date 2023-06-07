const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDocument = await username.create({ username, password });
    res.json(userDocument);
  } catch (e) {}
  res.status(400).json(e);
});

app.listen(process.env.SERVER_PORT);
