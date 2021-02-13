const express = require("express");
const { body } = require("express-validator/check");
const reviewController = require("../controller/review");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post(
  "/review/:id",
  isAuth,
  [body("rating").isInt({ min: 0, max: 5 })],
  reviewController.postReview
);
router.get("/allReviews", reviewController.getAllReviews);
router.get("/reviews", isAuth, reviewController.getReviews);
router.get("/placeReviews/:id", reviewController.getPlaceReviews);
router.get("/placeRating/:id", reviewController.getPlaceRatings);
router.get("/review/:id", reviewController.getReview);
router.get("/allReviews", reviewController.getAllReviews);
router.put(
  "/review/:id",
  isAuth,
  [body("rating").isInt({ min: 0, max: 5 })],
  reviewController.updateReview
);
router.delete("/review/:id", isAuth, reviewController.deleteReview);

module.exports = router;
