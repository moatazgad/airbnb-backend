const express = require("express");
const { body } = require("express-validator/check");

const placeController = require("../controller/place");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post(
  "/place",
  isAuth,
  [
    body("description").trim().not().isEmpty(),
    body("name").trim().not().isEmpty(),
  ],
  placeController.createPlace
);

router.get("/places", isAuth, placeController.getPlaces);
router.get("/allPlaces", placeController.getAllPlaces);
router.get("/place/:id", placeController.getPlace);
router.put(
  "/place/:id",
  isAuth,
  [
    body("description").trim().isLength({
      min: 15,
    }),
    body("name").trim().not().isEmpty(),
  ],
  placeController.updatePlace
);
router.delete("/place/:id", isAuth, placeController.deletePlace);

module.exports = router;
