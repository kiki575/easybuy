//导入模块
var express = require("express");
var MongoUtil = require("../libs/MongoUtil");
var ObjectID = require("mongodb").ObjectID;
var util = new MongoUtil("localhost","27017","buy");


module.exports = (function(){
	var router = express.Router();
	
	//处理order_list
	router.use("/list",function(req,res){
		util.find({},{},'orders',function(err,result){
			if(err){
				console.log("查询数据库错误");
			}
			res.render("order_list.ejs",{orders:result});
		});
	});
	
	//处理修改：
	//处理get请求：
	router.get("/modify",function(req,res){
		util.find({_id:new ObjectID(req.query._id)},{},'orders',function(err,result){
			res.render("order_modify.ejs",{order:result[0]});
		});
	});
	//处理post请求：
	router.post("/modify",function(req,res){
		var order = req.body;
		console.log(order);
		util.update({_id:new ObjectID(order._id)},{$set:{orderId:order.orderId,user:order.user,addr:order.addr,state:order.state}},'orders',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/order/list");
		});
	});
	return router;
})();