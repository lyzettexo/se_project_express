const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "6a455be61d12e088fcfdc85d",
  };

  next();
});
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
