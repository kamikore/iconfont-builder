# iconfont-builder

一个iconfont 样式生成器

**前言：**

  该工具主要为了尝试npm包的开发、发布、安装，工具参照了作者[@imba97](https://github.com/imba97)的[simple-iconfont-builder](https://github.com/imba97/simple-iconfont-builder)项目

**简述：**

  使用 `iconfont` 项目会生成CDN服务链接，点击链接完全可以直接复制内容粘贴到.css生效。但字体资源是通过外链获取的，为了避免意外的情况，最好是备份本地获取。而把字体文件进一步转`base64`，能够避免ttf,woff等字体文件在android,ios,小程序中可能出现无法使用的问题。而上述一系列的操作，在每次更新`iconfont`时都需重做一遍。借由该该工具可以快捷生成经过压缩后的样式文件。


# 导入⚙️
```javascript
import IconfontBuilder from '@kamikore/iconfont-builder'
```

# 如何使用 ❔
1. 新建一个iconfont.js文件，例如 `src/dev/iconfont.js`，添加如下内容：
```javascript
import path from 'path'
import IconfontBuilder from 'iconfont-builder'

/* 
  配置输出路径（如果build没有传入路径参数，默认输出当前执行node命令时候的文件夹地址 ——工作目录）
*/
IconfontBuilder.build(path.resolve(__dirname, 'iconfont.css'))  
```

2. 直接执行或是设置`script`命令
直接执行：
```shell
 node src/index.js //at.alicdn.com/t/c/font_3746531_ihmuv0x54n.css
 ```
 设置`script`命令：
在 `package.json` 的 `scripts` 添加一条：
```json
{
  "scripts": {
    "if": "node dev/iconfont.js"
  }
}
```
使用时执行 `npm run if //at.alicdn.com/t/c/font_3746531_ihmuv0x54n.css`
