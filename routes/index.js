const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const auth = require("../middlewares/auth");

router.use("/items", clothingItemRouter);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
