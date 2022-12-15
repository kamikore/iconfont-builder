import axios from "axios";
import postcss from "postcss";

export default class IconfontBuilder {
    /* 
    process.argv 执行参数
        第一个元素process.argv[0]——返回启动Node.js进程的可执行文件所在的绝对路径
        第二个元素process.argv[1]——为当前执行的JavaScript文件路径
        剩余的元素为其他命令行参数
    */
    private static src = process.argv[2];

    public static async build() {
        if (!this.src) {
            console.log("请输入 iconfont 链接 ！！");
            console.log("例如：npm run if //at.alicdn.com/t/font_922838_rcjsxjh53np.css");


        }
    }



}