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
  if (!req.files) {
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
  const total_bedroom = req.body.total_bedroom;
  const total_kitchen = req.body.total_kitchen;
  const total_bathroom = req.body.total_bathroom;
  const price = req.body.price;
  const address = req.body.address;
  const location = req.body.location;
  const has_TV = req.body.has_TV;
  const has_aircondition = req.body.has_aircondition;
  const has_heating = req.body.has_heating;
  const has_wifi = req.body.has_wifi;
  const max_guests = req.body.max_guests;
  let creator;

  const place = new Place({
    name: name,
    type: type,
    description: description,
    images: images,
    pets: pets,
    total_bedroom: total_bedroom,
    total_kitchen: total_kitchen,
    total_bathroom: total_bathroom,
    price: price,
    address: address,
    location: location,
    has_TV: has_TV,
    has_aircondition: has_aircondition,
    has_heating: has_heating,
    has_wifi: has_wifi,
    max_guests: max_guests,
    creator: req.userId,
  });
  place
    .save()
    .then((result) => {
      return Client.findById(req.userId);
    })
    .then((client) => {
      creator = client;
      client.places.push(place);
      client.is_host = true;
      return client.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "place created successfully!",
        place: place,
        creator: {
          _id: creator._id,
          name: creator.name,
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
  Client.findById(req.userId)
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
        .json({ message: "Fetched places successfully.", places: places });
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

  for (index = 0, len = req.files.length; index < len; ++index) {
    images.push(req.files[index].path.replace("\\", "/"));
  }
  const name = req.body.name;
  const type = req.body.type;
  const description = req.body.description;
  const pets = req.body.pets;
  const total_bedroom = req.body.total_bedroom;
  const total_kitchen = req.body.total_kitchen;
  const total_bathroom = req.body.total_bathroom;
  const price = req.body.price;
  const address = req.body.address;
  const location = req.body.location;
  const has_TV = req.body.has_TV;
  const has_aircondition = req.body.has_aircondition;
  const has_heating = req.body.has_heating;
  const has_wifi = req.body.has_wifi;
  const max_guests = req.body.max_guests;

  Place.findById(placeId)
    .then((place) => {
      if (!place) {
        const error = new Error("Could not find place.");
        error.statusCode = 404;
        throw error;
      }
      if (place.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      place.images = images;
      place.name = name;
      place.type = type;
      place.description = description;
      place.pets = pets;
      place.total_bedroom = total_bedroom;
      place.total_kitchen = total_kitchen;
      place.total_bathroom = total_bathroom;
      place.price = price;
      place.address = address;
      place.location = location;
      place.has_TV = has_TV;
      place.has_aircondition = has_aircondition;
      place.has_heating = has_heating;
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
      if (place.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      // Check logged in user
      return Place.findByIdAndRemove(placeId);
    })
    .then((result) => {
      return Client.findById(req.userId);
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
