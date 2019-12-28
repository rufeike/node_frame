/*
 * @Descripttion: 生成环境配置
 * @version: 
 * @Author: rufeike
 * @Date: 2019-12-28 09:47:37
 * @Email: rufeike@163.com
 */
'use strict'
const path = require('paht');
module.exports = {
    //database
    DB_HOST:'localhost',
    DB_PORT:3306,
    DB_USER:'root',
    DB_PWD:'root',
    DB_NAME:'image',

    //http
    HTTP_PORT:8888,//端口号
    HTTP_ROOT:path.resolve(__dirname,'../static/'),//静态文件根目录
    HTTP_UPLOAD:path.resolve(__dirname,'../static/upload/'),//上传文件目录
}