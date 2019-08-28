//导入模块
var express = require("express");
var MongoUtil = require("../libs/MongoUtil");
var ObjectID = require("mongodb").ObjectID;
var util = new MongoUtil("localhost","27017","buy");


module.exports = (function(){
	var router = express.Router();
	//查找所有商品列表
	router.use("/",function(req,res,next){
		util.find({},{},"products",function(err,result){
			if(err){
				console.log("查找数据库出现错误");
			}else{
				req.products = result;
				next();
			}
		});
	});
	
	//查询所有新闻并结合模板文件
	router.use("/",function(req,res){
		util.find({},{},"newses",function(err,result){
			//console.log(result);
			if(err){
				console.log("查找数据库出现错误");
			}else{
				res.render("index.ejs",{newses:result,products:req.products});
			}
		});
	});
	return router;
})();