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
├─ static               静态文件目录 
│  ├─public             css/js/imgage文件目录
│  │  ├─css             css目录
│  │  ├─js              js目录
│  │  └─ ...            省略
│  ├─upload             上传文件目录 
│  └─index.html         html文件
├─app.js                程序入口文件
├─package.json          npm 定义文件
├─README.md             README 文件
├─...                   省略 

```