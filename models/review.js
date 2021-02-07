const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  // user_id: {
  //   type: String,
  //   required:true
    
  // },
  rating: {
    type: Number,
    required:true
  },
  comment: {
    type: String
  },
  creator: {
    type: Object,
    // required:true
  },
  place_id :{
      type: Object,
      // required:true
  }
},{timestamps: true});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
