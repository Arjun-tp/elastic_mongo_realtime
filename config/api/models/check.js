'use strict';

var mongoose = require('mongoose')
// Schema
var schema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    age: {type: Number},
  });


// Model
var model = mongoose.model('users', schema);

// Public API
module.exports = model;