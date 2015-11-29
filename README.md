## Quick Start

**Setup a factory**
```javascript
var dataFactory = require("sails-data-factory");
var UserFactory = dataFactory.setup(User);
```

**Generate faker models**
```javascript
var users = UserFactory.generate(10);
// it will be generate 10 faker users for you
```

**Persist faker models**
```javascript
UserFactory.persist(users).then(function(users){
	// users has been persist in your database
});
```

**Destroy faker models**
```javascript
UserFactory.destroy();
// that's it , all users you created has been destroy from your database
```

# API

## setup(sailsModel)
`sailsModel` 是Sails创建的模型，`sails-data-factory`会帮你创建一个基于这个Model的数据工厂`Factory`，
数据工厂能帮你根据给定Model的属性，随机生成一些值。
每个工厂类默认有以下方法：
* generate
* persist
* destroy

## Factory.generate(nums, template)

**Return** : Array
**Params**

| Name | Description   |  Accepted Data Types |   Required？  |
| :--------:| :-------- | :--------:| :------: |
| nums | 需要创建多少个数据    |   int |  Yes  |
| template | 创建模版    |   obj |  Yes  |


如果你需要指定每个创建的数据，都有一样的值，你可以使用`template`参数：
```javascript
var users = UserFactory.generate(5, {gender: '男'});
// so, the faker users created is all the man;
```

**高级玩法：**
`template`参数支持类型为`Function`的Value，如果Value是方法，genrate函数会执行这个方法，并把返回值指定到这个Value：
```javascript
var users = UserFactory.generate(5, {gender: function(){return '男'}});
// so, the faker user will have property gender of '男'
```

`template`属性中的方法，会在创建每一个对象的时候执行一次，例如`nums` = 2， 则会执行两次。所以我们可以把某一个值设置成随机值
```javascript
var user = UserFactory.generate(5, {
  gender: function(){
    switch(_.random(2)){
      case 0 : return '男';
      case 1 : return '女';
      case 2 : return '其他';
      default: return '男';
    }
  }
});
// so, the five fake users will have different gender attribute
```

`template`属性中的方法，会接收一个参数`model`：当前工厂类的`sailsModel`
```javascript
var user = UserFactory.generate(5, {
  gender: function(model){
    // you can do something if you need model
  }
});
```

## Factory.persist(datas)

**Return** : Promise(function(Array))
**Params**

| Name | Description   |  Accepted Data Types |   Required？  |
| :--------:| :-------- | :--------:| :------: |
| datas | 需要持久化的数据，接受数组或者单个对象   |  {}, [{}] |  Yes  |


## Factory.destroy()
**Return**: Promise(function(Array))
删除所有该工厂调用`persist`持久化的数据，

## Factory.create(nums, tmp)
**Return**: Promise(function(Array))
是`generate`、`create`函数的合并。

# Extending

当然你可以根据你的需要，来扩展Factory。
在 `sails-data-factory/factory` 目录下，创建你的自定义工厂文件。

例如，新建文件：`User.js`
```javascript
function generate(nums, tmp) {
  // rewrite generate method as you want
}

function myMethod(){
  // you aslo allow to create your method for UserFactory,
  // so, you can useing the method on this way: UserFactory.myMethod() 
}

module.exports = {
  generate : generate
  myMethod : myMethod
};
```

### Use library
如果你已经决定了要扩展Factory，`sails-data-factory`为你提供了一些工具类，你需要在文件头部引入下面代码：
```javascript
var lib = require("./lib");
```

`lib`提供以下工具：
* randomGengrate(model, except)
* modelPersist(model, datas)
* modelDestroy()

#### randomGengrate(model, except)
对于给定的model，随机生成一个对象，并返回。
**Params : **
* model : 给定的`sailsModel`, 你可以使用`this.model`，获取`setup(model)`传入进来的的`model`。当然，你也可以直接使用sails的全局变量，如：`User`
* except ： 指定model的哪些属性不需要创建，接收的是一个数组，例如: `except = ['id', 'uuid']`。那么就不会自动生成`id`,`uuid`属性。


#### modelPersist(model, datas)
持久化数据
**Params : **
* model：给定的`sailsModel`，具体同`randomGendrate(model, except)`
* datas : 接受单个对象，或者对象数组。是需要持久化的数据。

#### modelDestroy()
销毁调用`modelPersist`方法持久化的数据

