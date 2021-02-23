const path = require("path");
const fs = require("fs");
const https = require("https");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const ClientRoutes = require("./routes/client");
const PlaceRoutes = require("./routes/place");
const WishlistRoutes = require("./routes/wishlist");
const ReservationRoutes = require("./routes/reservation");
const ReviewsRoutes = require("./routes/review");

// mongodb+srv://Moataz:283TyrJkj3MmPSY7@cluster0.igpk5.mongodb.net/client?retryWrites=true&w=majority
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.igpk5.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const app = express();

// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

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

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

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
// console.log(
//   process.env.MONGO_USER,
//   process.env.MONGO_PASSWORD,
//   process.env.MONGO_DEFAULT_DATABASE,
//   process.env.NODE_ENV
// );

mongoose
  .connect(MONGODB_URI)

  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // auth: {authSource: "admin"},

  .then((result) => {
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 8080);
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => console.log(err));
