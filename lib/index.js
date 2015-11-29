/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/10/30
 * @description
 *
 */

var _ = require('lodash');
var randomGenerate  = require('./random');
var model           = require('./model');
var utils           = require('./utils');

module.exports = _.merge(utils, {
  randomGenerate          : randomGenerate,
  modelPersist            : model.persist,
  modelDestroy            : model.destroy
});