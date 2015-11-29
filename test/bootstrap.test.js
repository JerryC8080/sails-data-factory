/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/10/30
 * @description
 *
 */

var Sails = require('sails');
var testConfig = require("../../../config/env/test.js");
var dataFactory = require('../index.js');
var Promise = require('bluebird');
var app;

before(function (done) {
  Sails.lift(testConfig, function (err, sails) {
    if (err) return done(err);
    app = sails;
    sails.dataFactory = dataFactory;
    done(err, sails);
  });
});