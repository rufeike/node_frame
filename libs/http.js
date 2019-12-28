/*
 * @Descripttion: http服务器工具模块
 * @version: 
 * @Author: rufeike
 * @Date: 2019-12-28 10:26:23
 * @Email: rufeike@163.com
 */
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
            console.log(filepath);
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