/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/10/30
 * @description
 *
 */

var faker = require('faker');
var _ = require('lodash');
var randomGenerate = require('../lib').randomGenerate;
var excuteTmpsMethod = require('../lib').excuteTmpsMethod;

module.exports = {
  generate  : generate
};

/**
 * 批量生成数据
 * @param nums
 * @param tmp
 * @returns {Array}
 */
function generate(nums, tmp) {
  faker.locale = 'en';
  var except = ['id', 'uuid'];

  if (!tmp){
    tmp = {}
  }

  tmp = _.defaults(tmp, {
    username: function () {
      return faker.name.findName();
    },
    avatar: function () {
      return faker.image.avatar();
    },
    birthdate: function () {
      return faker.date.past();
    },
    tel: function () {
      return faker.phone.phoneNumber('###########');
    },
    email: function () {
      return faker.internet.email();
    }
  });

  // 执行Tmp中属性的方法，把方法值赋值给属性
  var randomResults = randomGenerate(this.model, except, nums);
  for (var i = 0; i < randomResults.length; i++) {
    randomResults[i] = _.defaults(excuteTmpsMethod(tmp, this.model), randomResults[i]);
    randomResults[i] = _.pick(randomResults[i], _.identity);
  }
  return randomResults;
}