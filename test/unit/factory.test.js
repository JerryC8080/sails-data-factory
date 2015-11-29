/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/11/1
 * @description
 *
 */

var should = require('should');
var rewire = require('rewire');
var _ = require('lodash');

describe('factory', function () {
  var _generate;
  var _persist;
  var _destroy;
  var _excuteTmpsMethod;

  before(function () {
    var factoryMethod = rewire('../../lib/factory');
    _generate         = factoryMethod.__get__('_generate');
    _persist          = factoryMethod.__get__('_persist');
    _destroy          = factoryMethod.__get__('_destroy');
    _excuteTmpsMethod = factoryMethod.__get__('_excuteTmpsMethod');
  });

  describe('#_generate', function () {
    it('should generate a faker user for me', function () {
      var factory = function () { this.model = Product; };
      factory.prototype.generate = _generate;
      var product = (new factory).generate(1);
      product[0].should.not.have.properties('id');
    });
  });

  describe('#_persist', function () {
    it('should persist a faker user', function (done) {
      var Factory = function () { this.model = User; };
      Factory.prototype.generate = _generate;
      Factory.prototype.persist = _persist;
      var factory = new Factory();
      var user = factory.generate(1, {gender: '男'});
      delete user[0].id;
      factory.persist(user).then(function (users) {
        users[0].should.have.properties(['id', 'uuid', 'gender']);
        done();
      }).catch(done);
    });
  });

  describe('#_destroy', function () {
    it('should destroy the persist user', function (done) {
      var Factory = function () { this.model = User; };
      Factory.prototype.generate = _generate;
      Factory.prototype.persist = _persist;
      Factory.prototype.destroy = _destroy;
      var factory = new Factory();
      var user = factory.generate(1, {gender: '男'});
      delete user[0].id;
      factory.persist(user).then(function (users) {
        users[0].should.have.properties(['id', 'uuid', 'gender']);
        return factory.destroy();
      }).then(function (destroyRecord) {
        destroyRecord.length.should.be.above(1);
        done();
      }).catch(done);
    });
  });

  describe('#_excuteTmpsMethod', function () {
    it('should excute the obj method', function () {
      var tmp = {
        username: 'jerryc',
        age     : function () {
          return 56;
        }
      };
      tmp = _excuteTmpsMethod(tmp);
      tmp.should.have.properties({
        username: 'jerryc',
        age: 56
      });
    });

    it('should excute "_excuteTmpsMethod" 50 times', function () {
      var factory = function () { this.model = User; };
      var tmp = {
        gender  : function () {
          switch(_.random(2)){
            case 0 : return '男';
            case 1 : return '女';
            case 2 : return '其他';
            default: return '男';
          }
        }
      };
      factory.prototype.generate = _generate;
      var user = (new factory).generate(50, tmp);
      var genders = _.pluck(user, 'gender');
      genders.indexOf('男').should.be.above(-1);
      genders.indexOf('女').should.be.above(-1);
      genders.indexOf('其他').should.be.above(-1);
    });
  });
});