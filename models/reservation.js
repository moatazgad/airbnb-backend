const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationShema = new Schema(
  {
    start_date: {
      type: Date,
      required: true, // "2002-12-09"
    },
    end_date: {
      type: Date,
      required: true, // "2002-12-09"
    },
    // price_per_night: {
    //   type: Number,
    //   required: true,
    // },
    total_nights: {
      type: Number,
      required: true,
    },
    // created_at :{
    //     type: Date
    // },
    num_of_guests: {
      type: Number,
      required: true,
    },
    user_id: {
      type: Object,
      // required:true
    },
    place_id: {
      type: Object,
      // required:true
    },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", ReservationShema);

module.exports = Reservation;
