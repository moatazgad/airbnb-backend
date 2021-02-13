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
    total_rooms: {
      type: Number,
      required: true,
    },
    total_beds: {
      type: Number,
      required: true,
    },
    total_kitchens: {
      type: Number,
      required: true,
    },
    total_bathrooms: {
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
        type: Number,
      },
    },
    location: {
      lng: {
        type: String,
      },
      lat: {
        type: String,
      },
    },
    has_tv: {
      type: Boolean,
      required: true,
    },
    has_airconditioner: {
      type: Boolean,
      required: true,
    },
    has_wifi: {
      type: Boolean,
      required: true,
    },

    has_heating_system: {
      type: Boolean,
      required: true,
    },
    ratings: {
      type: Array,
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
    user_id: {
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
    reservations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reservation",
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
// "total_rooms": 7,
// "total_beds": 7,
// "total_kitchens": 7,
// "total_bathrooms": 7,
// "price": 50,
// "address": {"country":"New Cairo",
//            "city":"Cairo"   },
// "has_tv": true,
// "has_airconditioner": true,
// "has_heating_system": false,
// "has_wifi": false,
// "max_guests": 10

// }
