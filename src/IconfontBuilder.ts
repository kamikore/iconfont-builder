import axios from "axios";
import postcss from "postcss";
import cssnano = require('cssnano');


import { openSync, writeSync, closeSync } from "node:fs";

import { resolve } from "node:path";



interface fontUrl {
    url: string,
    format: string,
    base64?: string,
}

interface IconfontBuilderResult {
    /**
     * 字体 CSS
     */
    font: string

    /**
     * icon CSS
     */
    icon: string

    /**
     * 压缩后的 CSS
     */
    compress: string
}


export default class IconfontBuilder {
    /* 
    process.argv 执行参数
        第一个元素process.argv[0]——返回启动Node.js进程的可执行文件所在的绝对路径
        第二个元素process.argv[1]——为当前执行的JavaScript文件路径
        剩余的元素为其他命令行参数
    */
    private static url = process.argv[2];

    /**
     * 构建iconfont css，并输出文件到指定路径
     * @param {string} filePath 可选，文件输出路径（默认为__dirname/iconfont.css）
     * @returns 
     */
    public static async build(filePath: string = resolve(__dirname, 'iconfont.css')): Promise<IconfontBuilderResult> {
        console.log("执行参数", process.argv);

        if (!this.url) {
            console.error("请输入 iconfont 链接 ！！");
            console.error("例如：npm run if //at.alicdn.com/t/c/font_3746531_ihmuv0x54n.css");
            return;
        }

        // 读取样式内容
        const style: string = await axios.get(`https:${this.url}`).then(res => res.data);

        // 匹配样式内字体文件url（仅保留 woff 格式字体 ???）
        const reg: RegExp = /url\('(.*)'\) format\('(.*)'\)/g

        // 由于exec(), test() 匹配成功都会更新regExp.lastIndex，并且在无法匹配时将lastIndex置0，这会导致while死循环。 match 不返回捕获数组不适用
        let result, fontsList: Array<fontUrl> = [];    // 记录本次匹配结果
        while ((result = reg.exec(style)) != null) {
            fontsList.push({
                url: result[1],
                format: result[2],
            })
        }

        console.log("字体Url", fontsList);

        // 获取字体文件内容
        for (let item of fontsList) {
            // responseType 默认为 json，可选值: 'arraybuffer', 'document', 'json', 'text', 'stream
            await axios.get(`https:${item.url}`, { responseType: 'arraybuffer' }).then(res => {
                item['base64'] = res.data.toString('base64')
            })
        }

        // 所有异步执行完，拼装iconfont font-face
        const fontFace: string = `
            @font-face {
                font-family: 'iconfont';
                src: ${fontsList.map((item, index) => `url('data:font/${item.format};charset=utf-8;base64,${item.base64}') format('${item.format}')${fontsList.length - 1 === index ? '' : ','}`).join('\n')};
            }`;


        // 添加修饰符'g'，为了除去匹配返回数组的附加属性
        const newStyle: string = style.replace(/@font-face {(.*?)}/gs, fontFace)
        console.log(newStyle);

        // css 压缩

        const compressStyle = await postcss([cssnano]).process(newStyle, { from: undefined }).then(result => {
            // 原做法，在拼接时预留一个占位符'{fontBase64}'，然后压缩后用正则进行替换
            console.log("postcss处理结果", result);
            return result.css;
        })

        // 写入文件
        const fd: number = openSync(filePath, 'w');         // 返回值为表示文件描述符的整数, 'w' 表示以写入模式打开(如果文件不存在，会创建新的文件,但如果嵌套了不存在文件夹仍会报错)

        console.log("文件描述符", fd)
        writeSync(fd, compressStyle);
        closeSync(fd);

        console.log(`生成成功：${filePath}\n`)

    }

}