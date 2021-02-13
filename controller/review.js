const { validationResult } = require("express-validator/check");

const Review = require("../models/review");
const Client = require("../models/client");
const Place = require("../models/place");
const { estimatedDocumentCount } = require("../models/review");

//contain all business logic
exports.postReview = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const rating = req.body.rating;
  const comment = req.body.comment;
  let user;
  const place_id = req.params.id;

  const review = new Review({
    rating: rating,
    comment: comment,
    user_id: req.user_id,
    place_id: place_id,
  });
  review
    .save()
    .then((result) => {
      return Client.findById(req.user_id);
    })
    .then((client) => {
      user = client;
      client.reviews.push(review);
      return client.save();
    })
    .then((result) => {
      return Place.findById(place_id);
    })
    .then((place) => {
      //Trial--------------------------------------------
      //Trial--------------------------------------------
      place.reviews.push(review);
      place.ratings.push(review.rating);
      place.save();
      //Trial--------------------------------------------
      //Trial--------------------------------------------
      res.status(201).json({
        message: "review submitted!",
        review: review,
        user_id: user._id,
        user: {
          _id: user._id,
          name: user.name,
        },
        place: {
          _id: place.id,
          name: place.name,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // next from middelware
  // const ReviewsProps = req.body;
  // Reviews.create(ReviewsProps)
  //   .then(reviews => res.send(reviews))
  //   .catch(next)
};

exports.getReviews = (req, res, next) => {
  Client.findById(req.user_id)
    .then((user) => {
      if (!user) {
        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ reviews: user.reviews });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // Reviews.find({})
  // .then(reviews => res.send(reviews))
  // .catch("nooooo");
};

exports.getReview = (req, res, next) => {
  const reviewId = req.params.id;
  Review.findById(reviewId)
    .then((review) => {
      if (!review) {
        const error = new Error("Could not find review.");
        error.statusCode = 404;
        throw error;
      }
      // if (review.user_id.toString() !== req.user_id) {
      //   const error = new Error("Not authorized!");
      //   error.statusCode = 403;
      //   throw error;
      // }
      res.status(200).json({ message: "review fetched.", review: review });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPlaceReviews = (req, res, next) => {
  Place.findById(req.params.id)
    .then((place) => {
      if (!place) {
        const error = new Error("Place Not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ reviews: place.reviews });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAllReviews = (req, res, next) => {
  Review.find()
    .then((reviews) => {
      res
        .status(200)
        .json({ message: "Fetched reviews successfully!!.", reviews: reviews });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPlaceRatings = (req, res, next) => {
  Place.findById(req.params.id)
    .then((place) => {
      if (!place) {
        const error = new Error("Place Not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ rating: place.ratings });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateReview = (req, res, next) => {
  const reviewId = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const rating = req.body.rating;
  const comment = req.body.comment;

  Review.findById(reviewId)
    .then((review) => {
      if (!review) {
        const error = new Error("Could not find review.");
        error.statusCode = 404;
        throw error;
      }
      if (review.user_id.toString() !== req.user_id) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      review.rating = rating;
      review.comment = comment;

      return review.save();
    })

    .then((result) => {
      res.status(200).json({
        message: "review updated.",
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
  // Reviews.findByIdAndUpdate({_id: driverId}, driverProps)
  // .then(() => Reviews.findById({_id: driverId}))
  // .then(reviews => res.send(reviews))
  // .catch(next);
};

exports.deleteReview = (req, res, next) => {
  const reviewId = req.params.id;
  let placeId;
  Review.findById(reviewId)
    .then((review) => {
      if (!review) {
        const error = new Error("Could not find review.");
        error.statusCode = 404;
        throw error;
      }
      if (review.user_id.toString() !== req.user_id) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      // Check logged in user
      placeId = review.place_id;
      return Review.findByIdAndRemove(reviewId);
    })
    .then((result) => {
      return Client.findById(req.user_id);
    })
    .then((user) => {
      user.reviews.pull(reviewId);
      return user.save();
    })

    .then((result) => {
      return Place.findById(placeId);
    })
    .then((place) => {
      place.reviews.pull(reviewId);
      return place.save();
    })

    .then((result) => {
      res.status(200).json({ message: "Deleted Review." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // const driverId = req.params.id;
  // Reviews.findByIdAndRemove({_id: driverId})
  //   .then(reviews => res.status(204).send(reviews))
  //   .catch(next);
};
