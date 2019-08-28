//导入模块
var express = require("express");
var MongoUtil = require("../libs/MongoUtil");
var ejs = require("ejs");
var dbc = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

//创建数据库
var util = new MongoUtil("localhost","27017","buy");
//构建匿名函数立即调用并导出模块
module.exports = (function(){
	//创建路由
	var router = express.Router();
	
	//处理user.html
	router.use("/list",function(req,res){
		util.find({},{},'users',function(err,result){
			if(err) throw err;
			res.render("user_list.ejs",{users:result});
		});
	});
	//处理新增用户
	router.get("/add",function(req,res){
		var user = {userName:'',name:'',passWord:'',gender:'',phone:'',email:''};
		res.render("user_add.ejs",{user:user});
	});
	router.post("/add",function(req,res){
		var user = req.body;
		if(user.gender === '1'){
			user.gender = '男';
		}else{
			user.gender = '女';
		}
		util.insert(user,'users',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/users/list");
		});
	});
	
	//处理修改用户
	router.get("/modify",function(req,res){
		console.log(req.query._id);
		util.find({_id:new ObjectID(req.query._id)},{},'users',function(err,result){
			res.render("user_modify.ejs",{user:result[0]});
		});
	});
	router.post("/modify",function(req,res){
		var user = req.body;
		if(user.gender === '1'){
			user.gender = '男';
		}else{
			user.gender = '女';
		}
		util.update({_id:new ObjectID(user._id)},{$set:{name:user.name,passWord:user.passWord,gender:user.gender,birthday:user.birthday,
		birthmonth:user.birthmonth,birthyear:user.birthyear,phone:user.phone,email:user.email}},'users',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/users/list");
		});
	});
	
	//处理删除用户
	router.use("/delete",function(req,res){
		util.del({_id:new ObjectID(req.query["_id"])},'users',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/users/list");
		});
	});
	return router;
})();