const Wishlist = require("../models/wishlist");
const Client = require("../models/client");
const { estimatedDocumentCount } = require("../models/wishlist");

//contain all business logic
exports.addToWishlist = (req, res, next) => {
  // const user_id = req.body.user_id;
  const place_id = req.body.place_id;
  let user;

  const wishlist = new Wishlist({
    // user_id: user_id,
    place_id: place_id,
    user_id: req.user_id,
  });
  wishlist
    .save()
    .then((result) => {
      return Client.findById(req.user_id);
    })
    .then((client) => {
      user = client;
      client.wishlists.push(wishlist);
      return client.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "added to wishlist successfully!",
        wishlist: wishlist,
        user_id: user._id,
        user: { _id: user._id, name: user.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // next from middelware
  //   const WishlistProps = req.body;
  //   Wishlist.create(WishlistProps)
  //     .then(wishlist => res.send(wishlist))
  //     .catch(next)
  // }
};
exports.getWishlists = (req, res, next) => {
  Client.findById(req.user_id)
    .then((user) => {
      if (!user) {
        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ wishlists: user.wishlists });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  // Wishlist.find({})
  // .then(wishlist => res.send(wishlist))
  // .catch("nooooo");
};
exports.updateWishlist = (req, res, next) => {
  const driverId = req.params.id;
  const driverProps = req.body;
  console.log(req.body);
  console.log(driverId);
  Wishlist.findByIdAndUpdate({ _id: driverId }, driverProps)
    .then(() => Wishlist.findById({ _id: driverId }))
    .then((wishlist) => res.send(wishlist))
    .catch(next);
};

exports.deleteWishlist = (req, res, next) => {
  const wishlistId = req.params.id;
  Wishlist.findById(wishlistId)
    .then((wishlist) => {
      if (!wishlist) {
        const error = new Error("Could not find wishlist.");
        error.statusCode = 404;
        throw error;
      }
      if (wishlist.user_id.toString() !== req.user_id) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      // Check logged in user
      return Wishlist.findByIdAndRemove(wishlistId);
    })
    .then((result) => {
      return Client.findById(req.user_id);
    })
    .then((user) => {
      user.wishlists.pull(wishlistId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Removed Wishlist." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // const driverId = req.params.id;
  // Wishlist.findByIdAndRemove({_id: driverId})
  //   .then(wishlist => res.status(204).send(wishlist))
  //   .catch(next);
};
