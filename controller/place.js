const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

const { estimatedDocumentCount } = require("../models/place");
const Place = require("../models/place");
const Client = require("../models/client");

//contain all business logic
exports.createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  if (!req.files[0]) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }
  let images = [];
  const name = req.body.name;
  const type = req.body.type;
  const description = req.body.description;

  for (index = 0, len = req.files.length; index < len; ++index) {
    images.push(req.files[index].path.replace("\\", "/"));
  }
  // const images = req.files.path;
  const pets = req.body.pets;
  const total_rooms = req.body.total_rooms;
  const total_beds = req.body.total_beds;
  const total_kitchens = req.body.total_kitchens;
  const total_bathrooms = req.body.total_bathrooms;
  const price = req.body.price;
  const address = req.body.address;
  const location = req.body.location;
  const has_tv = req.body.has_tv;
  const has_airconditioner = req.body.has_airconditioner;
  const has_heating_system = req.body.has_heating_system;
  const has_wifi = req.body.has_wifi;
  const max_guests = req.body.max_guests;
  let user;

  const place = new Place({
    name: name,
    type: type,
    description: description,
    images: images,
    pets: pets,
    total_rooms: total_rooms,
    total_beds: total_beds,
    total_kitchens: total_kitchens,
    total_bathrooms: total_bathrooms,
    price: price,
    address: address,
    location: location,
    has_tv: has_tv,
    has_airconditioner: has_airconditioner,
    has_heating_system: has_heating_system,
    has_wifi: has_wifi,
    max_guests: max_guests,
    user_id: req.user_id,
  });
  place
    .save()
    .then((result) => {
      return Client.findById(req.user_id);
    })
    .then((client) => {
      user = client;
      client.places.push(place);
      client.is_host = true;
      return client.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "place created successfully!",
        place: place,
        user_id: user._id,
        user: {
          _id: user._id,
          name: user.name,
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
  // const ClientProps = req.body;
  // Place.create(ClientProps)
  //   .then(place => res.send(place))
  //   .catch(next)
};

exports.getPlaces = (req, res, next) => {
  Client.findById(req.user_id)
    .then((user) => {
      if (!user) {
        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        places: user.places,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // Place.find({})
  // .then(place => res.send(place))
  // .catch("nooooo");
};

exports.getAllPlaces = (req, res, next) => {
  Place.find()
    .then((places) => {
      res
        .status(200)
        .json({ message: "Fetched places successfully!!.", places: places });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPlace = (req, res, next) => {
  const placeId = req.params.id;
  Place.findById(placeId)
    .then((place) => {
      if (!place) {
        const error = new Error("Could not find place.");
        error.statusCode = 404;
        throw error;
      }
      // if (place.user_id.toString() !== req.user_id) {
      //   const error = new Error("Not authorized!");
      //   error.statusCode = 403;
      //   throw error;
      // }
      res.status(200).json({ message: "place fetched.", place: place });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePlace = (req, res, next) => {
  const placeId = req.params.id;
  let images = [];
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  let imgs = req.body.images;
  console.log(typeof req.body.images);
  // if (typeof imgs === "object") {
  //   // req.files && typeof profile_image !== "string"
  //   for (index = 0, len = req.body.images.length; index < len; ++index) {
  //     images.push(req.body.images[index]);
  //     console.log(req.body.images[index]);
  //   }
  // } else {
  //   for (index = 0, len = req.files.length; index < len; ++index) {
  //     images.push(req.files[index].path.replace("\\", "/"));
  //   }
  // }
  if (req.files[0]) {
    // req.files && typeof profile_image !== "string"
    for (index = 0, len = req.files.length; index < len; ++index) {
      images.push(req.files[index].path.replace("\\", "/"));
    }
  } else {
    for (index = 0, len = req.body.images.length; index < len; ++index) {
      images.push(req.body.images[index]);
      console.log(req.body.images[index]);
    }
  }

  // for (index = 0, len = req.files.length; index < len; ++index) {
  //   images.push(req.files[index].path.replace("\\", "/"));
  // }

  const name = req.body.name;
  const type = req.body.type;
  const description = req.body.description;
  const pets = req.body.pets;
  const total_rooms = req.body.total_rooms;
  const total_beds = req.body.total_beds;
  const total_kitchens = req.body.total_kitchens;
  const total_bathrooms = req.body.total_bathrooms;
  const price = req.body.price;
  const address = req.body.address;
  const location = req.body.location;
  const has_tv = req.body.has_tv;
  const has_airconditioner = req.body.has_airconditioner;
  const has_heating_system = req.body.has_heating_system;
  const has_wifi = req.body.has_wifi;
  const max_guests = req.body.max_guests;

  Place.findById(placeId)
    .then((place) => {
      if (!place) {
        const error = new Error("Could not find place.");
        error.statusCode = 404;
        throw error;
      }
      if (place.user_id.toString() !== req.user_id) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      if (req.files[0])
        for (index = 0, len = place.images.length; index < len; ++index) {
          clearImage(place.images[index]);
        }
      place.images = images;
      place.name = name;
      place.type = type;
      place.description = description;
      place.pets = pets;
      place.total_rooms = total_rooms;
      place.total_beds = total_beds;
      place.total_kitchen = total_kitchens;
      place.total_bathrooms = total_bathrooms;
      place.price = price;
      place.address = address;
      place.location = location;
      place.has_TV = has_tv;
      place.has_airconditioner = has_airconditioner;
      place.has_heating_system = has_heating_system;
      place.has_wifi = has_wifi;
      place.max_guests = max_guests;
      return place.save();
    })

    .then((result) => {
      res.status(200).json({
        message: "Place updated.",
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
  // Place.findByIdAndUpdate({_id: driverId}, driverProps)
  // .then(() => Place.findById({_id: driverId}))
  // .then(place => res.send(place))
  // .catch(next);
};

exports.deletePlace = (req, res, next) => {
  const placeId = req.params.id;
  Place.findById(placeId)
    .then((place) => {
      if (!place) {
        const error = new Error("Could not find place.");
        error.statusCode = 404;
        throw error;
      }
      if (place.user_id.toString() !== req.user_id) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      // for (index = 0, len = place.images.length; index < len; ++index) {
      //   clearImage(place.images[index]);
      // }

      // Check logged in user
      return Place.findByIdAndRemove(placeId);
    })

    .then((result) => {
      return Client.findById(req.user_id);
    })
    .then((user) => {
      user.places.pull(placeId);
      if (user.places === undefined || user.places.length == 0) {
        user.is_host = false;
      }
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted place." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  // const driverId = req.params.id;
  // Place.findByIdAndRemove({
  //     _id: driverId
  //   })
  //   .then(place => res.status(204).send(place))
  //   .catch(next);
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
