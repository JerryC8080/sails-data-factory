/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/1
 * @description
 *
 */

var _ = require('lodash');
var should = require('should');
var setupFactory = require('../../lib/factory');

describe('API', function () {
  describe('#setup', function () {
    it('should return factory of given', function () {
      var UserFactory = setupFactory(User);
      var user = UserFactory.generate(2);
      user.length.should.equal(2);
      user[0].should.have.not.properties(['id', 'uuid']);
    });

    it('should return factory of given product', function () {
      var ProductFactory = setupFactory(Product);
      var product = ProductFactory.generate(2);
      product.length.should.equal(2);
    });
  });
});