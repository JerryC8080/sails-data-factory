/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/1
 * @description
 *
 */

var _ = require('lodash');
var persistDatas = {};    // 存储创建的对象
var randomGenerate = require('./random');
var Promise = require('bluebird');

/**
 * 持久化数据
 * @param model
 * @param datas
 */
function modelPersist(model, datas) {
  return model.create(datas).then(function (results) {
    _modelAudit(model, results);
    return results;
  });
}

/**
 * 销毁创建的数据
 * @param model
 * @returns {*}
 */
function modelDestroy(model) {
  return model.destroy(persistDatas[model.identity].ids);
}

/**
 * 记录创建的数据
 * @param model
 * @param datas
 * @private
 */
function _modelAudit(model, datas) {
  var modelIdentity = model.identity;

  // 如果datas不是Array，则构建Array
  if (!Array.isArray(datas)){
    datas = [datas];
  }

  // 如果persisDatas还不存在改Model的数据，则为该Model建立一个初始
  if (!persistDatas[modelIdentity]){
    persistDatas[modelIdentity] = {
      model : model,
      ids   : []
    };
  }

  // 把datas的ID，遍历插进persisDatas对应的Model 数组中。
  _.each(_.pluck(datas, 'id'), function (id) {
    persistDatas[modelIdentity].ids.push(id);
  });
}

module.exports = {
  persist: modelPersist,
  destroy: modelDestroy
};