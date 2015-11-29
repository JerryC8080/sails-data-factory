/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/1
 * @description
 *
 */

var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();

var randomMatchType = {
  string : function (definition, nums) {
    return _validationsSupport(definition, chance.string, nums, {length: _calculateLength(definition)});
  },
  integer: function (definition, nums) {
    return _validationsSupport(definition, chance.integer, nums,  {min: 0, max: definition.length || definition.size || 100000});
  },
  boolean: function (definition, nums) {
    return chance.n(chance.bool, nums);
  },
  'text': function (definition, nums) {
    // TODO
    return chance.n(chance.string, nums, {length: _calculateLength(definition)});
  },
  'float': function () {
    // TODO
    return null;
  },
  'date': function () {
    // TODO
    return null;
  },
  'time': function () {
    // TODO
    return null;
  },
  'datetime': function () {
    // TODO
    return null;
  },
  'binary': function () {
    // TODO
    return null;
  },
  'array': function () {
    // TODO
    return null;
  },
  'json': function () {
    // TODO
    return null;
  }
};

/**
 * 根据Model 的 attribute type属性，来随机生成一些值
 * @param model
 * @param except
 * @param nums
 */
function randomGenerate(model, except, nums) {
  var attributes = model._attributes;
  var results = [];

  if (!nums){
    nums = 1;
  }

  // 过滤不需要的字段
  if (except){
    _removeExceptAttributes(attributes, except);
  }

  // 遍历model的 attribute
  var randomObj = _.mapValues(attributes, function (value) {
    if (!value.type){
      return null;
    }
    return _randomAccordingType(value, nums);
  });

  // 过滤无效的属性
  randomObj = _.pick(randomObj, _.identity);

  for (var i = 0; i < nums; i++) {
    results.push(_.mapValues(randomObj, function (value) {
      return value[i];
    }));
  }

  return results;
}

/**
 * 根据Type生成随机值
 * @param definition
 * @param nums
 * @private
 */
function _randomAccordingType(definition, nums) {
  var chance = randomMatchType[definition.type];
  if (!chance){
    return null;
  }
  return chance(definition, nums);
}

/**
 * 删除多余的值
 * @param obj
 * @param extras
 * @returns {*}
 */
function _removeExceptAttributes(obj, extras) {
  if (!extras){
    return obj;
  }
  if (!Array.isArray(extras)){
    extras = [extras];
  }
  _.each(extras, function (key) {
    delete obj[key];
  });
  return obj;
}

/**
 * 根据长度，计算随机Length
 * @param definition
 * @returns {*}
 * @private
 */
function _calculateLength(definition) {
  var min = definition.minLength || 1;
  var max = definition.maxLength || definition.length || definition.size || 255;
  if (min){
    return _.random(min,max);
  }else {
    return _.random(max);
  }
}

/**
 * 支持Waterline validation
 * @param definition
 * @param generator
 * @param nums
 * @param opts
 * @returns {*}
 * @private
 */
function _validationsSupport(definition, generator, nums, opts) {
  if (definition['autoIncrement']){
    return null;
  }
  if (definition['enum']){
    return _getEnumValue(definition.enum, nums);
  }
  if (definition['numeric']){
    opts = {pool:'1234567890'};
  }
  if (definition['email']){
    // TODO
  }
  if (definition['url']){
    // TODO
  }
  if (definition['ip']){
    // TODO
  }
  if (definition['ipv4']){
    // TODO
  }
  if (definition['ipv6']){
    // TODO
  }
  if (definition['creditcard']){
    // TODO
  }
  if (definition['uuid']){
    // TODO
  }
  if (definition['uuidv3']){
    // TODO
  }
  if (definition['uuidv4']){
    // TODO
  }
  if (definition['unique']){
    return chance.unique(generator, nums, opts);
  }
  return chance.n(generator, nums, opts);
}

/**
 * 随机获取枚举数组的值
 * @param enums
 * @param nums
 * @returns {*}
 * @private
 */
function _getEnumValue(enums, nums) {
  var results = [];
  for (var i = 0; i < nums; i++) {
    results.push(enums[_.random(enums.length)]);
  }
  return results;
}

module.exports = randomGenerate;
