const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  user_id: {
    type: Object,
    required:true
    
  },
  place_id: {
    type: String,
    required:true
  },

  creator: {
  type:  Object,
  // ref: 'Client'
  }
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
