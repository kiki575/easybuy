//导入模块
var express = require("express");
var MongoUtil = require("../libs/MongoUtil");
var ObjectID = require("mongodb").ObjectID;
var fs = require("fs");
var multer = require("multer");
var upload = multer({dest:'../www/upload'});
var path = require("path");
var util = new MongoUtil("localhost","27017","buy");


module.exports = (function(){
	var router = express.Router();
	
	
	//处理购物车，需要新建一个购物车集合，把对应的_id传进去，在购物车页面显示所有商品
	//首先在商品集合中查询到_id所对应的商品
	router.use("/add",function(req,res,next){
		util.find({_id:new ObjectID(req.query._id)},{},"products",function(err,result){
			if(err){
				console.log("查询数据库出现错误");
			}else{
				req.shopping = result[0];
				next();
			}
		});
	});
	//然后将查询到的商品添加至购物车集合
	router.use("/add",function(req,res,next){
		var shop = req.shopping;
		util.insert({pname:shop.pname,photo:shop.photo,pprice:shop.pprice},"shopping",function(err){
			if(err) throw err;
			res.redirect("http://localhost:9900/shopping/");
			next();
		});
	});
	
	//最后处理模板文件
	router.get("/",function(req,res){
		util.find({},{},"shopping",function(err,result){
			if(err){
				console.log("查询数据库出现错误");
			}else{
				res.render("shopping.ejs",{products:result});
			}
		});
	});
	
	//处理购物车删除
	router.use("/delete",function(req,res){
		util.del({_id:new ObjectID(req.query._id)},"shopping",function(err,result){
			if(err){
				console.log("数据删除错误");
			}else{
				res.redirect("http://localhost:9900/shopping/");
			}
		});
	});
	return router;
})();