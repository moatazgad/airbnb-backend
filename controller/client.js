// const fs = require("fs");
// const path = require("path");

const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { estimatedDocumentCount } = require("../models/client");

const Client = require("../models/client");

//contain all business logic
exports.signup = (req, res, next) => {
  // next from middelware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  // NO PROFILE IMAGE
  // if (!req.files) {
  //   const error = new Error("No image provided.");
  //   error.statusCode = 422;
  //   throw error;
  // }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const phone = req.body.phone;
  const is_host = req.body.is_host;
  const profile_image = req.body.profile_image;
  // const profile_image = req.files[0].path.replace("\\", "/");
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const client = new Client({
        email: email,
        password: hashedPw,
        name: name,
        phone: phone,
        profile_image: profile_image,
        is_host: is_host,
      });
      return client.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created!",
        user_id: result._id,
        client: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  // const ClientProps = req.body;
  // Client.create(ClientProps)
  //   .then(client => res.send(client))
  //   .catch(next)
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  await Client.findOne({
    email: email,
  })
    .then((client) => {
      console.log("client", req.body);
      if (!client) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = client;
      return bcrypt.compare(password, client.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          user_id: loadedUser._id.toString(),
        },
        "somesupersecretsecret",
        {
          expiresIn: "1h",
        }
      );
      console.log("token", token); ////////////
      res.status(200).json({
        token: token,
        user_id: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  Client.find()
    .then((users) => {
      res.status(200).json({
        message: "Fetched clients successfully.",
        users: users,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // Client.find({})
  // .then(client => res.send(client))
  // .catch("nooooo");
};

exports.getUser = (req, res, next) => {
  Client.findById(req.user_id)
    .then((user) => {
      if (!user) {
        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        user: user,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;
  const phone = req.body.phone;
  const password = req.body.password;
  const profile_image = req.body.profile_image;

  // NO PROFILE IMAGE
  // let profile_image = req.body.profile_image;
  // if (req.files) {
  //   profile_image = req.files[0].path.replace("\\", "/");
  // }
  // if (!profile_image) {
  //   const error = new Error("No file picked.");
  //   error.statusCode = 422;
  //   throw error;
  // }
  Client.findById(req.user_id)
    .then((user) => {
      if (!user) {
        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;
      }
      // if (profile_image !== user.profile_image) {
      //   clearImage(user.profile_image);
      // }
      bcrypt.hash(password, 12).then((hashedPw) => {
        user.name = name;
        user.phone = phone;
        user.profile_image = profile_image;
        user.password = hashedPw;
        return user.save();
      });
    })

    .then((result) => {
      res.status(200).json({
        message: "User updated.",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // const driverId = req.params.id;
  // const driverProps = req.body;
  // console.log(req.body);
  // console.log(driverId);
  // Client.findByIdAndUpdate({_id: driverId}, driverProps)
  // .then(() => Client.findById({_id: driverId}))
  // .then(client => res.send(client))
  // .catch(next);
};

exports.deleteUser = (req, res, next) => {
  const driverId = req.params.id;
  Client.findByIdAndRemove({
    _id: driverId,
  })
    .then((client) => res.status(204).send(client))
    .catch(next);
};

// const clearImage = (filePath) => {
//   filePath = path.join(__dirname, "..", filePath);
//   fs.unlink(filePath, (err) => console.log(err));
// };
