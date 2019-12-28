/*
 * @Descripttion: 配置目录入口文件
 * @version: 
 * @Author: rufeike
 * @Date: 2019-12-28 09:51:59
 * @Email: rufeike@163.com
 */
'use strict'
const process = require('process');
let mode = (process.env.OS=='Windows_NT'?'dev':'prod');//根据系统来判断开发和生成配置
let config = (mode=='dev'?require('./config.dev'):require('./config.prod'));//获取对应的配置

//对外输出
module.exports = {
    mode,
    ...config
}