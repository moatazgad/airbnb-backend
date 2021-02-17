const express = require("express");
const { body } = require("express-validator/check");

const reservationController = require("../controller/reservation");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post(
  "/reservation/:id",
  isAuth,
  [
    // body("price_per_night").isNumeric(),
    body("total_nights").isNumeric(),
    body("num_of_guests").isNumeric(),
  ],
  reservationController.createReservation
);
router.get("/reservations", isAuth, reservationController.getReservations);
router.get(
  "/placeReservations/:id",
  reservationController.getPlaceReservations
);
router.get("/reservation/:id", isAuth, reservationController.getReservation);
router.get("/reservationNotAuth/:id", reservationController.getReservation_Not_Auth);
router.put(
  "/reservation/:id",
  isAuth,
  [
    // body("price_per_night").isNumeric(),
    body("total_nights").isNumeric(),
    body("num_of_guests").isNumeric(),
  ],
  reservationController.updateReservation
);
router.delete(
  "/reservation/:id",
  isAuth,
  reservationController.deleteReservation
);

module.exports = router;
