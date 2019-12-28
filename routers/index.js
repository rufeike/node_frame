/*
 * @Descripttion: 路由注册模块
 * @version: 
 * @Author: rufeike
 * @Date: 2019-12-28 14:25:18
 * @Email: rufeike@163.com
 */
'use strict'
const { addRouter, findRouter } = require('../libs/router');


//登录接口路由注册
addRouter('post','/login',require('./login/login'));
//注册接口路由注册
addRouter('post','/register',require('./login/register'));

