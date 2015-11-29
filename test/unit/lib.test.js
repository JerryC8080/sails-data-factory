/**
 * Copyright (c) 2015 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author JerryC
 * @date  15/10/30
 * @description
 *
 */

var lib = require('../../lib/index');
var _ = require('lodash');
var should  = require('should');

describe('lib', function () {

  describe('#randomGenerate', function () {
    it('should return faker user', function () {
      var except = ['id', 'uuid'];
      var user = lib.randomGenerate(User, except);
      user = user[0];
      user.should.have.not.properties(except);
    });

    it('should return unique bbsMeizuTid of Post', function () {
      var posts = lib.randomGenerate(Post, null, 1000);
      var bbsMeizuTids = _.pluck(posts, 'bbsMeizuTid');
      should(bbsMeizuTids.length).be.equal(_.uniq(bbsMeizuTids).length);
    });
  });

  describe('#modelPersist', function () {
    var user;
    after(function () {
      User.destroy(user.id);
    });
    it('should persist a module for me', function (done) {
      lib.modelPersist(User, {username: 'jerryc'}).then(function (_user) {
        user = _user;
        _user.should.have.property('username', 'jerryc');
        done();
      }).catch(done);
    });
  });

  describe('#modelDestroy', function () {
    var user;

    // 首先持久化一个User
    before(function (done) {
      lib.modelPersist(User, {username: 'jerryb'}).then(function (_user) {
        user = _user;
        done();
      }).catch(done);
    });

    it('should destroy a module which persist before', function (done) {
      lib.modelDestroy(User).then(function (destroyUser) {
        var _user = _.find(destroyUser, {id: user.id});
        _user.should.have.property('username', user.username);
        done();
      }).catch(done);
    });
  });
});