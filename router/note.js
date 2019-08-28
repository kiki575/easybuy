//导入模块
var express = require("express");
var MongoUtil = require("../libs/MongoUtil");
var ObjectID = require("mongodb").ObjectID;
var util = new MongoUtil("localhost","27017","buy");

module.exports = (function(){
	var router = express.Router();
	
	
	//处理note_list
	router.use("/list",function(req,res){
		util.find({},{},'notes',function(err,result){
			if(err){
				console.log("查询数据库错误");
			}
			res.render("note_list.ejs",{notes:result});
		});
	});
	
	//处理修改：
	//处理get请求：
	router.get("/modify",function(req,res){
		util.find({_id:new ObjectID(req.query._id)},{},'notes',function(err,result){
			res.render("note_modify.ejs",{note:result[0]});
		});
	});
	//处理post请求：
	router.post("/modify",function(req,res){
		var note = req.body;
		console.log(note);
		util.update({_id:new ObjectID(note._id)},{$set:{reply:note.reply}},'notes',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/note/list");
		});
	});
	
	
	//处理新增：
	//处理get请求
	var myDate = new Date();
	router.get("/add",function(req,res){
		util.find({},{},"notes",function(err,result){
			res.render("note_add.ejs",{notes:result,note:{},time:myDate.toLocaleString()});
		});
	});
	
	//处理post请求
	router.post("/add",function(req,res){
		var note = req.body;
		util.insert(note,"notes",function(err,result){
			if(err){
				console.log("添加数据失败");
			}else{
				res.redirect("http://localhost:9900/note/list");
			}
		});
	});
	return router;
})();