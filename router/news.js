//导入模块
var express = require("express");
var MongoUtil = require("../libs/MongoUtil");
var ObjectID = require("mongodb").ObjectID;
var util = new MongoUtil("localhost","27017","buy");


module.exports = (function(){
	var router = express.Router();
	
	
	//处理news_add列表
	router.use("/list",function(req,res){
		util.find({},{},"newses",function(err,result){
			if(err){
				console.log("数据库查询错误");
			}else{
				res.render("news_list.ejs",{newses:result});
			}
		});
	});
	
	
	//处理新增：
	//得到get请求：
	router.get("/add",function(req,res){
		res.render("news_add.ejs",{news:{}});
	});
	
	//得到post请求：
	router.post("/add",function(req,res){
		var news = req.body;
		if(news.title.trim().length === 0){
			//合并数据到模板文件中，输出html
			res.render("news_add.ejs",{news:{}});
		}else{
			util.insert(news,"newses",function(err,result){
				if(err){
					console.log("新增数据库错误");
				}else{
					res.redirect("http://localhost:9900/news/list");
				}
			});
		}
	});
	
	
	//处理修改：
	//处理get请求
	router.get("/modify",function(req,res){
		//console.log(req.query._id);
		util.find({_id:new ObjectID(req.query._id)},{},'newses',function(err,result){
			res.render("news_modify.ejs",{news:result[0]});
		});
	});
	
	//处理post请求
	router.post("/modify",function(req,res){
		var news = req.body;
		util.update({_id:new ObjectID(news._id)},{$set:{title:news.title,content:news.content}},'newses',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/news/list");
		});
	});
	
	//处理删除：
	router.use("/delete",function(req,res){
		util.del({_id:new ObjectID(req.query["_id"])},'newses',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/news/list");
		});
	});
	
	
	//处理单个新闻页面
	//先查询所有的新闻
	router.use("/single_news",function(req,res,next){
		util.find({},{},"newses",function(err,result){
			if(err){
				console.log("查询数据库出现错误");
			}else{
				req.newses = result;
				next();
			}
		});
	});
	router.use("/single_news",function(req,res){
		util.find({_id:new ObjectID(req.query._id)},{},"newses",function(err,result){
			if(err){
				console.log("查询数据库错误");
			}else{
				res.render("single_news.ejs",{newses:req.newses,news:result[0]});
			}
		});
	});
	return router;
})();