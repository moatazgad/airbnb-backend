const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    profile_image: {
      type: String,
    },

    is_host: {
      type: Boolean,
      default: false,
    },

    wishlists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Wishlist",
      },
    ],
    places: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place",
      },
    ],
    reservations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reservation",
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
