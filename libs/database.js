/*
 * @Descripttion: 数据库操作模块
 * @version: 
 * @Author: rufeike
 * @Date: 2019-12-28 10:03:37
 * @Email: rufeike@163.com
 */
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