const mongoose = require('mongoose');
var dummy = mongoose.Schema;


const Schema = new mongoose.Schema({
  _id: {
    $oid: {
      type: dummy.ObjectId,
      required: true
    },
  },

  saleDate: {
    $date: {
      $numberLong: String,
    },
  },

  items: [{
    name: String,
    tags: [String],
    price: {
      $numberDecimal: String
    },
    quantity: Number,
    _id: false
  }],

  storeLocation: String,
  customer: {
    gender: String,
    age: String,
    email: String,
    satisfaction: Number
  },

  couponUsed: Boolean,
  purchaseMethod: String

});

const Sale = mongoose.model('sales', Schema);

module.exports = Sale;
