const express = require("express");
const router = express.Router();

const wishlistController = require("../controller/wishlist");
const isAuth = require("../middleware/is-auth");

router.post("/wishlist", isAuth, wishlistController.addToWishlist);
router.get("/wishlists", isAuth, wishlistController.getWishlists);
router.get("/wishlist/:id", isAuth, wishlistController.getWishlist);
router.put("/wishlist/:id", isAuth, wishlistController.updateWishlist);
router.delete("/wishlist/:id", isAuth, wishlistController.deleteWishlist);

module.exports = router;
