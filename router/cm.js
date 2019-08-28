var express = require("express");
var MongoUtil = require("../libs/MongoUtil");
var ObjectID = require("mongodb").ObjectID;
var util = new MongoUtil("localhost","27017","buy");
module.exports = (function(){
	var router = express.Router();
	
	//查询所有的父类别
	router.use("/list",function(req,res,next){
		//查询数据库，得到所有大类
		util.find({parentId:"0"},{},'categories',function(err,result){
			if(err){
				res.state(404).send("数据库访问错误").end();
			}else{
				req.categories = result;
				next();
			}
		});
	});
	//处理所有的类别列表
	router.use("/list",function(req,res){
		util.find({},{},'categories',function(err,result){
			if(err){
				res.state(404).send("数据库访问错误").end();
			}else{
				res.render("cate_list.ejs",{categories:req.categories,categorys:result,_id:ObjectID(req.query._id)});
			}
		});
	});
	//查询所有的父类别
	router.use("/add",function(req,res,next){
		//查询数据库，得到所有大类
		util.find({parentId:"0"},{},'categories',function(err,result){
			if(err){
				res.state(404).send("数据库访问错误").end();
			}else{
				req.categories = result;
				next();
			}
		});
	});
	//新增：get得到新增表单，同时查询大类
	router.get("/add",function(req,res){
		console.log(req.categories);
		//合并数据到模板文件中，输出html
		res.render("cate_add.ejs",{categories:req.categories,category:{}});
	});
	//新增的post提交数据，处理新类别的数据
	router.post("/add",function(req,res){
		var cate = req.body;
		if(cate.cname.trim().length === 0){
			//合并数据到模板文件中，输出html
			res.render("cate_add.ejs",{categories:req.categories,category:{}});
		}else{
			//新类别cid = max(已有的cid)+1
			util.find({},{sort:{cid:-1},limit:1},'categories',function(err,result){
				console.log(result);
				if(err){
					res.state(500).send("数据库查询错误").end();
				}else{
					if(result.length == 0){
						cate.cid = 1;
					}else{
						cate.cid = result[0].cid+1;
					}
					util.insert(cate,'categories',function(err,result){
						if(err){
							res.state(500).send("数据库新增错误").end();
						}else{
							res.redirect("http://localhost:9900/category/list");
						}
					});
				}
			});
		}
	});
	
	
	//查询所有的父类别
	router.use("/modify",function(req,res,next){
		//查询数据库，得到所有大类
		util.find({parentId:'0'},{},'categories',function(err,result){
			if(err){
				res.state(404).send("数据库访问错误").end();
			}else{
				req.categories = result;
				next();
			}
		});
	});
	//处理修改：
	//修改：get请求，将上面next参数即所有父类别传进来
	router.get("/modify",function(req,res){
		util.find({_id:new ObjectID(req.query._id)},{},'categories',function(err,result){
			res.render("cate_modify.ejs",{category:result[0],categories:req.categories});
		});
	});
	//修改：处理post请求，修改类别
	router.post("/modify",function(req,res){
		var category = req.body;
		util.update({_id:new ObjectID(category._id)},{$set:{cname:category.cname}},'categories',function(err,result){
			if(err) throw err;
			res.redirect("http://localhost:9900/category/list");
		});
	});
	
	
	
	//查询所删除_id的数据
	router.use("/delete",function(req,res,next){
		util.find({_id:new ObjectID(req.query["_id"])},{},'categories',function(err,result){
			if(err){
				res.state(404).send("数据库访问错误").end();
			}else{
				req.category = result[0];
				next();
			}
		});
	});
	//查询其子类
	router.use("/delete",function(req,res,next){
		if(req.category.parentId == 0){
			util.find({parentId:String(req.category.cid)},{},"categories",function(err,result){
				if(err) throw err;
				else{
					req.category2 = result;
					next();
				}
			});
		}else{
			util.find({parentId:req.category.parentId},{},"products",function(err,result){
				if(result.length == 0){
					req.category2 = [];
					next();
				}else{
					console.log("不能删除此小类，因为其中还有商品");
					res.redirect("http://localhost:9900/category/list");
				}
			});
		}
	});
	//处理删除
	router.use("/delete",function(req,res){
		console.log(req.category2.length);
		if(req.category2.length == 0){
			util.del({_id:new ObjectID(req.query["_id"])},'categories',function(err,result){
				if(err) throw err;
				res.redirect("http://localhost:9900/category/list");
			});
		}else{
			console.log("不能删除此大类，因为还有子类");
			res.redirect("http://localhost:9900/category/list");
		}
	});
	return router;
})();