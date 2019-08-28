//引入中间件
var dbc = require("mongodb").MongoClient;

//封装类,对MongoDB的集合进行增删改查
//定义类的构造函数，定义属性


/**
 * @param {Object} host主机名
 * @param {Object} port端口号
 * @param {Object} dbname数据库名
 */
function MongoUtil(host,port,dbname){
	this.host = host;
	this.port = port;
	this.dbname = dbname;
}
//在构造函数的原型对象上定义方法
//1.链接数据库connectDb;2.insert插入3.update修改4.delete删除5.find查询


/**
 * @param {Object} fn回调函数，用于连接成功后调用的函数
 */
MongoUtil.prototype.connectDb = function(fn){
	var url = "mongodb://"+this.host+":"+this.port+"/"+this.dbname;
	dbc.connect(url,{useNewUrlParser:true},function(err,client){
		if(err) throw err;
		//链接成功，执行回调函数
		fn(client)
	});
}

/**
 * @param {Object} json查找要删除的条件
 * @param {Object} collectionName集合名
 * @param {Object} fn回调函数，指定删除数据后的处理
 */
MongoUtil.prototype.del = function(json,collectionName,fn){
	this.connectDb(function(client){
		var db = client.db(this.dbname);
		var coll = db.collection(collectionName);
		coll.deleteMany(json,function(err,result){
			//删除数据后交给回调函数处理要执行的功能
			fn(err,result);
			client.close();
		});
	});
};

/**
 * @param {Object} json查找要新增的数据，一个对象，一个集合（包含多个对象）
 * @param {Object} collectionName集合名
 * @param {Object} fn回调函数，指定删除数据后的处理
 */
MongoUtil.prototype.insert = function(json,collectionName,fn){
	this.connectDb(function(client){
		var db = client.db(this.dbname);
		var coll = db.collection(collectionName);
		//按json分为两种情况，insertOne，insertMany
		if(json.constructor === Array){
			coll.insertMany(json,function(err,result){
				fn(err,result);
			});
		}else{
			coll.insertOne(json,function(err,result){
				fn(err,result);
			});
		}
		client.close();
	});
};

/**
 * @param {Object} condition查找条件
 * @param {Object} val目标值表达式
 * @param {Object} collectionName集合名
 * @param {Object} fn回调函数
 */
MongoUtil.prototype.update = function(condition,val,collectionName,fn){
	this.connectDb(function(client){
		var db = client.db(this.dbname);
		var coll = db.collection(collectionName);
		coll.updateMany(condition,val,function(err,result){
			fn(err,result);
			client.close();
		});
	});
};

/**
 * @param {Object} condition查找条件
 * @param {Object} args数据
 * @param {Object} collectionName集合名
 * @param {Object} fn回调函数
 */
MongoUtil.prototype.find = function(condition,args,collectionName,fn){
	this.connectDb(function(client){
		var db = client.db(this.dbname);
		var coll = db.collection(collectionName);
		//需要提取的属性列表
		var props = args.props || {};
		//排序的依据
		var sort = args.sort || {};
		//需要跳过的数量
		var skipNum = args.skip || 0;
		//限制的数量
		var limitNum = args.limit || 0;
		
		coll.find(condition,props).sort(sort).skip(skipNum).limit(limitNum).toArray(function(err,result){
			fn(err,result);
			client.close();
		});
	});
}
//导出中间件
module.exports = MongoUtil;