const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const auth = require("../middlewares/auth");

router.use("/items", clothingItemRouter);

router.use("/users", auth, userRouter);

module.exports = router;
