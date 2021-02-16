const { validationResult } = require("express-validator/check");

const Reservation = require("../models/reservation");
const Client = require("../models/client");
const Place = require("../models/place");
const { estimatedDocumentCount } = require("../models/reservation");

//contain all business logic
exports.createReservation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  // const price_per_night = req.body.price_per_night;
  const total_nights = req.body.total_nights;
  const num_of_guests = req.body.num_of_guests;
  let user;
  const place_id = req.params.id;

  const reservation = new Reservation({
    start_date: start_date,
    end_date: end_date,
    // price_per_night: price_per_night,
    total_nights: total_nights,
    num_of_guests: num_of_guests,
    user_id: req.user_id,
    place_id: place_id,
  });
  reservation
    .save()
    .then((result) => {
      return Client.findById(req.user_id);
    })
    .then((client) => {
      user = client;
      client.reservations.push(reservation);
      return client.save();
    })
    .then((result) => {
      return Place.findById(place_id);
    })
    .then((place) => {
      //place reservations
      place.reservations.push(reservation);
      place.save();
      //place reservations
      res.status(201).json({
        message: "reservation created successfully!",
        reservation: reservation,
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
  // const ReservationProps = req.body;
  // Reservation.create(ReservationProps)
  //   .then(reservation => res.send(reservation))
  //   .catch(next)
};

exports.getReservations = (req, res, next) => {
  Client.findById(req.user_id)
    .then((user) => {
      if (!user) {
        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ reservations: user.reservations });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // Reservation.find({})
  // .then(reservation => res.send(reservation))
  // .catch(next);
};

exports.getPlaceReservations = (req, res, next) => {
  Place.findById(req.params.id)
    .then((place) => {
      if (!place) {
        const error = new Error("Place Not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ reservations: place.reservations });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getReservation = (req, res, next) => {
  console.log("llllllllllllllllllllllllllllllllll");
  const reservationId = req.params.id;
  Reservation.findById(reservationId)
    .then((reservation) => {
      if (!reservation) {
        const error = new Error("Could not find reservation.");
        error.statusCode = 404;
        throw error;
      }
      if (reservation.user_id.toString() !== req.user_id) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      res
        .status(200)
        .json({ message: "reservation fetched.", reservation: reservation });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.getReservation_Not_Auth = (req, res, next) => {
  console.log("hereeeeeeeeeeeeeddddddd:    " , req.params.id);
  const reservationId = req.params.id;
  Reservation.findById(reservationId)
    .then((reservation) => {
      if (!reservation) {
        const error = new Error("Could not find reservation.");
        error.statusCode = 404;
        throw error;
      }
     
      res
        .status(200)
        .json({ message: "reservation fetched.", reservation: reservation });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateReservation = (req, res, next) => {
  const reservationId = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  // const price_per_night = req.body.price_per_night;
  const total_nights = req.body.total_nights;
  const num_of_guests = req.body.num_of_guests;

  Reservation.findById(reservationId)
    .then((reservation) => {
      if (!reservation) {
        const error = new Error("Could not find reservation.");
        error.statusCode = 404;
        throw error;
      }
      if (reservation.user_id.toString() !== req.user_id) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      reservation.start_date = start_date;
      reservation.end_date = end_date;
      // reservation.price_per_night = price_per_night;
      reservation.total_nights = total_nights;
      reservation.num_of_guests = num_of_guests;
      return reservation.save();
    })

    .then((result) => {
      res.status(200).json({
        message: "reservation updated.",
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
  // Reservation.findByIdAndUpdate({_id: driverId}, driverProps)
  // .then(() => Reservation.findById({_id: driverId}))
  // .then(reservation => res.send(reservation))
  // .catch(next);
};

exports.deleteReservation = (req, res, next) => {
  const reservationId = req.params.id;
  Reservation.findById(reservationId)
    .then((reservation) => {
      if (!reservation) {
        const error = new Error("Could not find reservation.");
        error.statusCode = 404;
        throw error;
      }
      if (reservation.user_id.toString() !== req.user_id) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      // Check logged in user
      placeId = reservation.place_id;
      return Reservation.findByIdAndRemove(reservationId);
    })
    .then((result) => {
      return Client.findById(req.user_id);
    })
    .then((user) => {
      user.reservations.pull(reservationId);
      return user.save();
    })
    .then((result) => {
      return Place.findById(placeId);
    })
    .then((place) => {
      place.reservations.pull(reservationId);
      return place.save();
    })

    .then((result) => {
      res.status(200).json({ message: "Deleted Reservation." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // const driverId = req.params.id;
  // Reservation.findByIdAndRemove({_id: driverId})
  //   .then(reservation => res.status(204).send(reservation))
  //   .catch(next);
};
