/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/10/31
 * @description
 *
 */

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var FACTORY_DIR = path.join(__dirname, '../factory');

/**
 * 批量生成数据
 * @param nums
 * @param tmp
 * @returns {Array}
 */
function _generate(nums, tmp) {
  if (!tmp){
    tmp = {};
  }
  var randomGenerate = require('./index').randomGenerate;

  // 执行Tmp中属性的方法，把方法值赋值给属性
  var randomResults = randomGenerate(this.model, null, nums);
  for (var i = 0; i < randomResults.length; i++) {
    randomResults[i] = _.defaults(_excuteTmpsMethod(tmp, this.model), randomResults[i]);
    randomResults[i] = _.pick(randomResults[i], _.identity);
  }
  return randomResults;
}

/**
 * 持久化创建的数据，并且记录数据的ids
 * @param datas
 * @returns {*}
 */
function _persist(datas) {
  var modelPersist = require('./index').modelPersist;
  return modelPersist(this.model, datas);
}

/**
 * 销毁数据
 * @returns {*}
 */
function _destroy() {
  var modelDestroy = require('./index').modelDestroy;

  /**
   * 你可以在这里做一些其他的操作，例如销毁关联对象
   */

  return modelDestroy(this.model);
}

/**
 * 批量生成数据，并且持久化
 * @param nums
 * @param tmp
 * @private
 */
function _create(nums, tmp) {
  var datas = this.generate(nums, tmp);
  return this.persist(datas);
}

/**
 * 遍历Factory文件夹的文件名，查询是否有匹配的文件名,有则require这个文件内容
 * @param identity
 * @private
 */
function _getCustomFactory(identity) {
  var customFactory;
  try{
    _.map(fs.readdirSync(FACTORY_DIR), function (filename) {
      filename = filename.toLowerCase().split('.')[0];
      if (filename === identity.toLowerCase()){
        customFactory = require(FACTORY_DIR + '/' + filename);
      }
    });
  }catch(error){
    throw error;
  }
  return customFactory;
}

/**
 * 执行Tmp中属性的方法，把方法值赋值给属性
 * @param tmp
 * @param model
 * @private
 */
function _excuteTmpsMethod(tmp, model) {
  return _.mapValues(tmp, function (values) {
    if (_.isFunction(values)){
      values = values(model);
    }
    return values;
  });
}

/**
 * 工厂构建函数
 * @param model
 * @returns {*}
 * @constructor
 */
function Factory(model) {
  this.model = model;
  this.generate = _generate;
  this.persist  = _persist;
  this.destroy  = _destroy;
  this.create   = _create;

  // 如果有自定义的Factory，则覆盖原有的方法
  var customFactory = _getCustomFactory(model.identity);
  if (customFactory){
    return _.defaults(customFactory, this);
  }
  return this;
}

module.exports = function setupFactory(model) {
  return new Factory(model);
};
