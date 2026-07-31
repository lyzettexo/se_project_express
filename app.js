require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  validateUserBody,
  validateAuthentication,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorhandler");
const NotFoundError = require("./errors/notfounderror");
const { login, createUser } = require("./controllers/users");
const { errors } = require("celebrate");

const app = express();

const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", validateAuthentication, login);
app.post("/signup", validateUserBody, createUser);

app.use("/", routes);

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
