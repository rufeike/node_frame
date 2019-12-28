/*
 * @Descripttion: 路由工具模块
 * @version: 
 * @Author: rufeike
 * @Date: 2019-12-28 10:15:52
 * @Email: rufeike@163.com
 */
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