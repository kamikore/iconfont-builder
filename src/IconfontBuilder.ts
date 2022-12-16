import axios from "axios";
import { log } from "console";
import postcss from "postcss";

interface fontUrl {
    url: string,
    format: string
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
     * @param filePath 输出路径
     * @returns 
     */
    public static async build(filePath: string): Promise<IconfontBuilderResult> {
        console.log("执行参数", process.argv);

        if (!this.url) {
            console.log("请输入 iconfont 链接 ！！");
            console.log("例如：npm run if //at.alicdn.com/t/c/font_3746531_ihmuv0x54n.css");
            return;
        }

        // 读取样式内容
        const style = await axios.get(`https:${this.url}`).then(res => res.data);

        // 匹配样式内字体文件url（仅保留 woff 格式字体 ???）
        const reg = /url\('(.*)'\) format\('(.*)'\)/g

        // 由于exec(), test() 匹配成功都会更新regExp.lastIndex，并且在无法匹配时将lastIndex置0，这会导致while死循环
        let result, fontUrls: Array<fontUrl> = [];    // 记录本次匹配结果
        while ((result = reg.exec(style)) != null) {
            fontUrls.push({
                url: result[1],
                format: result[2]
            })
            console.log(`Found ${result[0]}. Next starts at ${reg.lastIndex}.`);
        }

        console.log("字体Url", fontUrls);

        // 获取字体文件内容
        // responseType 默认为 json，可选值: 'arraybuffer', 'document', 'json', 'text', 'stream'
        const fontBuff = await axios.get(`https:${fontUrls[0].url}`, { responseType: 'arraybuffer' }).then(res => res.data);
        // arrayBuffer 转base64
        const fontData = fontBuff.toString('base64')
        console.log("fontData", fontData);



        // 拼装iconfont font-face
        const fontFace = `
            @font-face {
                font-family: 'iconfont';
                src: url(${fontData}) format(${fontUrls[0].format});
            }`;

        // const removeFontFace = style.replace(new RegExp(/\@font-face \{(.*)\}/, 'i'), '')
        // console.log(removeFontFace);
        console.log(new RegExp(/@font-face {\n(.*)}/, 'g').exec(style));


    }



}