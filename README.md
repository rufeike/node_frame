<!--
 * @Descripttion: 
 * @version: 
 * @Author: rufeike
 * @Date: 2019-12-28 11:49:24
 * @Email: rufeike@163.com
 -->
#node原生简易框架1.0

##  目录机构

```html
project  应用部署目录
├─config                配置目录 
│  ├─config.dev.js      开发环境配置 
│  ├─config.prod.js     生成环境配置 
│  └─index.js           配置文件入口模块
├─libs                  框架自定义模块 
│  ├─database.js        数据库连接管理模块
│  ├─http.js            http服务模块 
│  └─router.js          路由管理模块 
├─node_modules          第三方工具类模块目录 
│  └─ ...               省略
├─ routers              路由注册模块 
│  ├─login              登录相关路由目录 
│  │  ├─login.js        登录路由接口模块
│  │  ├─register.js     注册路由接口模块 
│  │  └─ ...            省略
│  └─...                省略 
├─ static               静态文件目录 
│  ├─public             css/js/imgage文件目录
│  │  ├─css             css目录
│  │  ├─js              js目录
│  │  └─ ...            省略
│  ├─upload             上传文件目录 
│  ├─index.html         框加默认首页
│  ├─login.html         登录页 
│  ├─register.html         注册页 
│  └─...                省略 
├─app.js                程序入口文件
├─package.json          npm 定义文件
├─README.md             README 文件
├─...                   省略 

```

## 入口文件 app.js
> 程序启动，负责调用程序服务和路由模块

```js
'use strict'
const http = require('./libs/http');//启动服务
const routers = require('./routers');//注册路由
```

## npm配置文件 package.json
```json
{
  "name": "node_demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "co-mysql": "^1.0.0",
    "multiparty": "^4.2.1",
    "mysql": "^2.17.1"
  }
}

```

## 系统配置目录 config
> 配置程序运行相关配置，如开发或生产环境配置，数据库配置等，该目录包含一个index.js目录默认入口文件，主要用于环境判断读取对应的配置文件

`./config/index.js`代码
```js
'use strict'
const process = require('process');
let mode = (process.env.OS=='Windows_NT'?'dev':'prod');//根据系统来判断开发和生成配置
let config = (mode=='dev'?require('./config.dev'):require('./config.prod'));//获取对应的配置

//对外输出
module.exports = {
    mode,
    ...config
}
```

`./conofig/config.dev.js`代码
```js
'use strict'
const path = require('path');

module.exports = {
    //database
    DB_HOST:'localhost',//地址
    DB_PORT:3306,//端口号
    DB_USER:'root',//用户名
    DB_PWD:'root',//密码
    DB_NAME:'',//数据库名称

    //http
    HTTP_PORT:8888,//端口号
    HTTP_ROOT:path.resolve(__dirname,'../static/'),//静态文件根目录
    HTTP_UPLOAD:path.resolve(__dirname,'../static/upload/'),//上传文件目录
}
```

## libs 自定义模块目录
> 框架自定义模块目录，放置自定义的模块
### `database.js`数据库连接模块
> 数库连接模块，使用`mysql`连接和`co-mysql`封装，实现同步连接效果，模块返回封装后的方法
代码：
```js
'use strict'
const mysql = require('mysql');
const co = require('co-mysql');//数据库包装工具，可以实现同步操作
const {DB_HOST,DB_NAME,DB_PORT,DB_PWD,DB_USER} = require('../config');//通过配置工具获取数据库配置

let conn = mysql.createPool({
    host:DB_HOST,
    port:DB_PORT,
    user:DB_USER,
    password:DB_PWD,
    database:DB_NAME
});

//导出已包装的数库类
module.exports = co(conn)
```

### `http.js`http服务模块
>提供http服务，引用`multiparty`处理表单数据

代码：
```js
'use strict'

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const zlib = require('zlib');//压缩模块
const fs = require('fs');//文件处理模块
const {Form} = require('multiparty');//第三方处理表单模块
const {HTTP_PORT,HTTP_ROOT,HTTP_UPLOAD} = require('../config');//自定义配置模块
const router = require('./router');//自定义路由模块

http.createServer((req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers',"x-requested-with, content-type");
    //1.解析数据-GET/POST/FILE
    let {pathname,query} = url.parse(req.url,true);
    if(req.method=='POST'){
        if(req.headers['content-type'].startsWith('application/x-www-form-urlencoded')){//普通POST
            //普通删除，可以采用数组接收，最后合成一个字符串
            let arr = [];
            req.on('data',buffer=>{
                arr.push(buffer);
            })
            req.on('end',()=>{
                let post = querystring.parse(Buffer.concat(arr).toString());

                //找路由
                handle(req.method,pathname,query,post,{});
            })
        }else{//文件post
            //使用第三方模块处理表单提交数据
            let form = new Form({
                uploadDir:HTTP_UPLOAD,//文件上传路径
            });
            form.parse(req);
             
            let post = {};
            let files = {};
            //普通input提交
            form.on('field',(name,value)=>{
                //存入post数据中
                post[name]=value;
            })

            //文件上传
            form.on('file',(name,file)=>{
                files[name] = file;
            })

            //错误处理
            form.on('error',err=>{
                console.log(err);
            })

            //表单处理结束后
            form.on('close',()=>{
                //找路由
                handle(req.method,pathname,query,post,files);
            })
        }
    }else{
        //默认'/'访问HTTP_ROOT/static/index.html
        pathname = pathname=='/'?'/index.html':pathname;
        
        //找路由
        handle(req.method,pathname,query,{},{});

    }

    /**
     * 路由入口方法 
     * @param {String} method 方法类型 GET/POST
     * @param {String} url 地址
     * @param {Json} get get参数
     * @param {Json} post post参数
     * @param {Json} files 文件参数
     */
    async function handle(method,url,get,post,files){
        let fn = router.findRouter(method,url);
        if(!fn){//文件请求
            let filepath = HTTP_ROOT+pathname;//指定查找文件的目录
            // console.log(filepath);
            fs.stat(filepath,(err,stat)=>{
                if(err){
                    res.writeHeader(404);
                    res.write('Not Found');
                    res.end();
                }else{
                    let rs = fs.createReadStream(filepath);
                    let gz = zlib.createGzip();//文件压缩再传输
                    //文件读取有错误时处理
                    rs.on('error',err=>{
                        console.log(err);
                    });

                    //声明位压缩格式的流
                    res.setHeader('Content-Encoding','gzip');
                    //推送文件流到浏览器
                    rs.pipe(gz).pipe(res);
                }
            })
        }else{//接口路由请求
            try{
                await fn(res,get,post,files);
            }catch(e){//错误处理
                res.writeHeader(500);
                res.write('Internal Server Error');
                res.end();
            }
        }
    }

}).listen(HTTP_PORT,()=>{
    console.log(`Sever ${HTTP_PORT} is running...`);
});
```

### `router.js`路由注册服务模块
>路由注册功能模块，提供路由注册和路由查找两个函数

代码：
```js
'use strict'

let router = {};//路由存储器


/**
 * 添加路由方法
 * @param {String} method POST/GET
 * @param {String} url 路由地址
 * @param {callback} fn 具体方法
 */
function addRouter(method,url,fn){
    method = method.toLowerCase();
    url = url.toLowerCase();
    router[method] = router[method]||{};
    router[method][url] = fn;
}

/**
 * 查找路由方法
 * @param {String} method POST/GET
 * @param {String} url 路由地址
 */
function findRouter(method,url){
    method = method.toLowerCase();
    url = url.toLowerCase();
    if(!router[method]||!router[method][url]){
        return null;//返回空
    }else{
        return router[method][url];//返回对应的方法
    }
}
//导出模块
module.exports = {
    addRouter,
    findRouter
}
```

## routers 路由注册目录
>接口路由注册目录，放置自定义接口文件，可以按不同功能分目录注册，需要再默认读取的`index.js`模块中添加对应的地址目录地址即可

`./routers/index.js`代码
```js
'use strict'
const { addRouter, findRouter } = require('../libs/router');


//登录接口路由注册
addRouter('post','/login',require('./login/login'));
//注册接口路由注册
addRouter('post','/register',require('./login/register'));

```

`./routers/模块目录名称/接口名称.js`代码
```js
'use strict'
module.exports = async (res,get,post,files)=>{
    /**
     *写登录对应的逻辑
     */
    res.write('login');
    res.end();
};
```


## 静态文件目录 static
>主要放置前端页面代码和上传目录
