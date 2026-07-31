const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/badrequesterror");
const ConflictError = require("../errors/conflicterror");
const NotFoundError = require("../errors/notfounderror");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
        return;
      }

      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;

      res.status(201).send(userObject);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("A user with this email already exists."));
        return;
      }

      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data."));
        return;
      }

      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch(next);
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  const updates = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (avatar !== undefined) {
    updates.avatar = avatar;
  }

  User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data."));
        return;
      }

      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
        return;
      }

      next(err);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateCurrentUser,
};
