const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  res.json({ requestData: { username, password } });
});

app.listen(8080);

// mongodb+srv://jeremyzeyuliu:FotoPie666@cluster0.h92dy9e.mongodb.net/
