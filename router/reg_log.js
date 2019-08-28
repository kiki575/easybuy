//导入模块
var express = require("express");
var MongoUtil = require("../libs/MongoUtil");
var ejs = require("ejs");
var dbc = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

var util = new MongoUtil("localhost","27017","buy");


module.exports = (function(){
	var router = express.Router();
	
	
	//处理注册
	//处理get请求
	router.get("/register",function(req,res){
		res.render("register.ejs",{user:{}});
	});
	//处理post请求
	router.post("/register",function(req,res){
		var user = req.body;
		util.insert({userName:user.userName,passWord:user.passWord},"person",function(err,result){
			if(err){
				console.log("插入数据库出现错误");
			}else{
				res.redirect("http://127.0.0.1:8848/buy/www/reg-result.html");
			}
		});
	});
	
	
	//处理登录
	//处理get请求
	router.get("/login",function(req,res){
		res.render("login.ejs",{user:{},errInfo:''});
	});
	
	//处理post请求
	router.post("/login",function(req,res){
		var user = req.body;
		console.log(user);
		util.find({userName:user.userName,passWord:user.passWord},{},"person",function(err,result){
			if(result.length === 0){
				res.render("login.ejs",{user:{},errInfo:'用户名或密码有误'});
			}else{
				res.redirect("http://127.0.0.1:8848/buy/www/reg-result.html");
			}
		});
	});
	return router;
})();