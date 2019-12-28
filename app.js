/*
 * @Descripttion: 程序入口文件
 * @version: 1.0
 * @Author: rufeike
 * @Date: 2019-12-28 09:36:52
 * @Email: rufeike@163.com
 */
'use strict'

const http = require('./libs/http');//启动服务
const {addRouter} = require('./libs/router');//注册路由

addRouter('get','/',async(res,get,post,files)=>{
    res.write('welcome');
    res.end();
})

addRouter('get','/add',async(res,get,post,files)=>{
    res.write('3232323232');
    res.end();
})
