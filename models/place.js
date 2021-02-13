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
