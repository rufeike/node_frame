/*
 * @Descripttion: 注册接口
 * @version: 
 * @Author: rufeike
 * @Date: 2019-12-28 14:43:24
 * @Email: rufeike@163.com
 */
'use strict'

module.exports = async (res,get,post,files)=>{
    /**
     * 注册的逻辑代码
     */
    console.log(get,post,files);
    res.write(JSON.stringify({code:200,msg:'success',data:[]}));
    res.end();    
}