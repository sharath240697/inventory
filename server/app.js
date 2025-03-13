const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/masterdata", (req, res) => {
  res.sendFile(__dirname + "/masterdata.json");
});

app.post("/generate-bill", (req, res) => {
  body = req.body;
  console.log(body)
});

app.post("/add", (req, res) => {
  body = req.body;
  console.log(body)
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
