/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/10
 * @description
 *
 */
var _ = require('lodash');

module.exports = {
  excuteTmpsMethod: excuteTmpsMethod
};

/**
 * 执行Tmp中属性的方法，把方法值赋值给属性
 * @param tmp
 * @param model
 * @private
 */
function excuteTmpsMethod(tmp, model) {
  return _.mapValues(tmp, function (values) {
    if (_.isFunction(values)){
      values = values(model);
    }
    return values;
  });
}