const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeShema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pets: {
      type: Boolean,
      required: true,
    },
    total_bedroom: {
      type: Number,
      required: true,
    },
    total_kitchen: {
      type: Number,
      required: true,
    },
    total_bathroom: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipcode: {
        type: String,
      },
    },
    location: {
      lng: {
        type: Number,
      },
      lat: {
        type: Number,
      },
    },
    has_TV: {
      type: Boolean,
      required: true,
    },
    has_aircondition: {
      type: Boolean,
      required: true,
    },
    has_wifi: {
      type: Boolean,
      required: true,
    },

    has_heating: {
      type: Boolean,
      required: true,
    },
    images: [
      {
        type: String,
        // required: true,
        // "default": []
      },
    ],
    //   images: Object,
    max_guests: {
      type: Number,
      required: true,
    },
    creator: {
      type: Object,
      //   ref: 'User',
      //   required:true
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeShema);

module.exports = Place;

// for database template
// {
// "name": "New Cairo",
// "type": "Cottage",
// "description": "Wild Mountains",
// "pets": false,
// "total_bedroom": 7,
// "total_kitchen": 7,
// "total_bathroom": 7,
// "price": 50,
// "address": {"country":"New Cairo",
//            "city":"Cairo"   },
// "has_TV": true,
// "has_aircondition": true,
// "has_heating": false,
// "has_wifi": false,
// "max_guests": 10

// }
