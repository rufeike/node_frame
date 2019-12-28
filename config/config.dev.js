/*
 * @Descripttion: 开发环境配置
 * @version: 
 * @Author: rufeike
 * @Date: 2019-12-28 09:47:37
 * @Email: rufeike@163.com
 */
'use strict'
const path = require('path');

module.exports = {
    //database
    DB_HOST:'localhost',//地址
    DB_PORT:3306,//端口号
    DB_USER:'root',//用户名
    DB_PWD:'root',//密码
    DB_NAME:'image',//数据库名称

    //http
    HTTP_PORT:8888,//端口号
    HTTP_ROOT:path.resolve(__dirname,'../static/'),//静态文件根目录
    HTTP_UPLOAD:path.resolve(__dirname,'../static/upload/'),//上传文件目录
}