//导入模块
var express = require("express");
var MongoUtil = require("../libs/MongoUtil");
var ObjectID = require("mongodb").ObjectID;
var fs = require("fs");
var multer = require("multer");
var upload = multer({dest:'../www/upload'});
var path = require("path");
var util = new MongoUtil("localhost","27017","buy");


//构建匿名函数立即调用并导出模块
module.exports = (function(){
	//创建路由
	var router = express.Router();
	
	//处理pro_list
	router.use("/list",function(req,res){
		util.find({},{},'products',function(err,result){
			if(err){
				console.log("查询数据库错误");
			}
			res.render("pro_list.ejs",{products:result});
		});
	});
	
	//处理新增：
	router.use("/add",function(req,res,next){
		//查询数据库，得到所有大类
		util.find({},{},'categories',function(err,result){
			if(err){
				res.state(404).send("数据库访问错误").end();
			}else{
				req.categories = result;
				next();
			}
		});
	});
	
	//处理get请求：
	router.get("/add",function(req,res){
		res.render("pro_add.ejs",{product:{},categories:req.categories});
	});
	//处理post请求
	router.post("/add",function(req,res){
		//处理上传的图片
		var extName = path.extname(req.files[0].originalname);
		var newname = req.files[0].filename+extName;
		var oldname = req.files[0].filename;
		
		fs.rename('./www/upload/'+oldname,'./www/upload/'+newname,function(err){
			if(err) throw err;
		});
		
		//处理其他上传的数据
		var pro = req.body;
		pro.photo = newname;
		if(pro.pname.trim().length === 0){
			//合并数据到模板文件中，输出html
			res.render("pro_add.ejs",{product:{},categories:req.categories});
		}else{
			util.find({},{},"products",function(err,result){
				if(err){
					res.state(500).send("数据库查询错误").end();
				}else{
					//pro.pid = result[0].pid + 1;
					util.insert(pro,"products",function(err,result){
						if(err){
							res.state(500).send("数据库新增错误").end();
						}else{
							res.redirect("http://localhost:9900/product/list");
						}
					});
				}
			});
		}
	});
	
	
	//处理修改：
	//查询所有的父类别
	router.use("/modify",function(req,res,next){
		//查询数据库，得到所有大类
		util.find({parentId:0},{},'categories',function(err,result){
			if(err){
				res.state(404).send("数据库访问错误").end();
			}else{
				req.categories = result;
				next();
			}
		});
	});
	//处理get请求
	router.get("/modify",function(req,res){
		util.find({_id:new ObjectID(req.query._id)},{},'products',function(err,result){
			res.render("pro_modify.ejs",{product:result[0],categories:req.categories});
		});
	});
	
	//处理post请求
	router.post("/modify",function(req,res){
		var product = req.body;
		console.log(product._id);
		util.update({_id:new ObjectID(product._id)},{$set:{pname:product.pname,parentId:product.parenId,photo:product.photo,pprice:product.pprice,brand:product.brand,productTotal:product.productTotal,quantity:product.quantity,}},'products',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/product/list");
		});
	});
	
	
	//处理删除：
	router.use("/delete",function(req,res){
		util.del({_id:new ObjectID(req.query["_id"])},'products',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/product/list");
		});
	});
	
	
	
	//处理单个商品页面
	router.get("/single_list",function(req,res){
		util.find({_id:new ObjectID(req.query._id)},{},"products",function(err,result){
			//console.log(result);
			if(err) {
				console.log("查询数据库出现错误");
			}else{
				res.render("single_list.ejs",{product:result[0]});
			}
		});
	});
	
	
	
	
	
	return router;
})();