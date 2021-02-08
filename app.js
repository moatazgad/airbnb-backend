const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const ClientRoutes = require("./routes/client");
const PlaceRoutes = require("./routes/place");
const WishlistRoutes = require("./routes/wishlist");
const ReservationRoutes = require("./routes/reservation");
const ReviewsRoutes = require("./routes/review");

const app = express();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); //application/json

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).any("images"));
app.use("/images/", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// var cors = require("cors");
// // use it before all route definitions
// app.use(cors({ origin: "*" }));

app.use("/api", ClientRoutes);
app.use("/api", PlaceRoutes);
app.use("/api", ReviewsRoutes);
app.use("/api", WishlistRoutes);
app.use("/api", ReservationRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(
    "mongodb+srv://Moataz:283TyrJkj3MmPSY7@cluster0.igpk5.mongodb.net/client?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
