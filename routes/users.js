const router = require("express").Router();

const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

const { validateUserUpdateBody } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdateBody, updateCurrentUser);

module.exports = router;
