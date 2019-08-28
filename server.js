//导入模块
var express = require("express");
var bodyParser = require("body-parser");
var consolidate = require("consolidate");
var ejs = require("ejs");
var expressStatic = require("express-static");
var multer = require("multer");
var cookieParser = require("cookie-parser");
var session = require("cookie-session");
var MongoUtil = require("./libs/MongoUtil");

//创建expres服务器并连接端口号9900
var server = express();
server.listen(9900);

//处理post请求，保存在req.body中
//通知服务器，任何地址的post请求进行注册
server.use(bodyParser.urlencoded({
	extended: false
}));

//处理上传
var upload = multer({dest:'./www/upload'});
// multer处理multipart/form-data
server.use(upload.any());


//配置模板引擎
server.set("view engine", "html");
server.set("views", "./templates");
server.engine("html", consolidate.ejs);


//从请求中解析cookie和session数据
server.use(cookieParser());
(function(){
	var keys =[];
	for(var i=0;i<10000;i++){
      keys.push("key"+i);
	}

	server.use(session({
		name:'sess_id',
		keys:keys,
		maxAge:20*60*1000
	}));
})();

//路由
server.use("/users",require("./router/users"));
server.use("/category",require("./router/cm"));
server.use("/product",require("./router/product"));
server.use("/order",require("./router/order"));
server.use("/note",require("./router/note"));
server.use("/news",require("./router/news"));
server.use("/person",require("./router/reg_log"));
server.use("/index",require("./router/index"));
server.use("/shopping",require("./router/shopping"));
//进行静态资源的处理
server.use(expressStatic(""));
