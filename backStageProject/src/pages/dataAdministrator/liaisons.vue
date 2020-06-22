<template>
    <div class="contentBox">
        <h3>5.1.接口设计</h3>
        <aside>
            1. 传输协议选择HTTPS协议，采用JSON格式作为传输规范，格式由具体服务接口定义。<br>
            2. 传输加密：在传输过程中应对传输通道进行加密、对传输内容采用AES加密。
        </aside>
        <h3> 5.1.1.协议标准</h3>
        <aside>
            1. 数据传输采用HTTPS 协议标准。<br>
            2. 基于HTTP POST方式进行数据请求,编码格式统一为UTF-8编码。<br>
            3. 协议对 HTTP 协议做适当扩充，但不改变已有 HTTP 标准的任何定义，实现者可以充分利用实现语言的 HTTP 开发包。<br>
            4. 请求和响应格式为JSON。
        </aside>
        <h3>5.1.2.公请求参数</h3>
        <el-table
            class="table"
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
        </el-table>
        <h3>5.1.3.公共返回参数</h3>
        <el-table
            class="table"
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
                prop="date"
                label="日期"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="地址">
            </el-table-column>
        </el-table>
        <h3>5.1.4.文件命名规范</h3>
        <aside>
            1. 文件名使用”_”进行分割，后缀为”.json”，文件名长度不超过100字节。<br>
            2. 文件命名规范：服务标识_接口类型_命令_请求或响应标识(REQ或RES)_appId（APPID）..._时间.json。
        </aside>
        <el-table
            class="table"
            :data="tableData2"
            :span-method="arraySpanMethod"
            border
            style="width: 100%">
            <el-table-column prop="id" label="ID" width="180"/>

            <el-table-column
                prop="name"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="amount1"
                sortable
                label="数值 1">
            </el-table-column>
            <el-table-column
                prop="amount2"
                sortable
                label="数值 2">
            </el-table-column>
            <el-table-column
                prop="amount3"
                sortable
                label="数值 3">
            </el-table-column>
        </el-table>
        <h3>5.1.5.AES加解密规则</h3>
        <aside>
           1. 路网中心与地图厂商之间采用AES对称密钥算法对传输内容加密。AES密钥长为16字符，由路网中心费分配。<br>
           2. AES加密模式为ECB，填充方式：pkcs5padding,无偏移量，数据块大小128，字符集为UTF-8。
        </aside>
        <h3>5.1.6.调用示例</h3>
        <h3>调用接口分为以下几步:</h3>
        <aside>
            （1）按接口协议组装请求json。<br>
            （2）	将步骤1得到的json字符使用AES加密，得到公共请求参数的bizContent。<br>
            （3）	将请求参数加密串（步骤2得到的值bizContent）、文件名（接口协议的文件名）、加密方式（AES）、发送请求时间（当前时间）、版本号(默认1.0)，签名方式（NONE）,签名 （NONE）填入公共请求参数，拼接成json字符串。<br>
            注：这里暂不用签名验证。 如启用签名验证，将签名方式设置为RSA256,同时对除sign属性外的json串用私钥做签名，得到请签名值。<br>
            （4）	将步骤3得到的公共请求参数json字符串，通过http post请求上传路网,获取公共返回参数json。<br>
            （5）	如公共返回参数中statusCode为0，表示请求成功，可使用AES对返回密文解密，得到返回结果。

        </aside>
        <h3>下面以调用接口5.2.1为例：</h3>
        <aside>
            假定图商AppId为88888801，AES 密钥为：chinaetc@1234567
        </aside>
           <h3>步骤一按5.2.1.2接口请参数，组装得到json 串</h3>
        <json-viewer
            :value="json"
            :expand-depth="5"
            :copyable="{copyText: '点击复制', copiedText: '复制成功', timeout: 1000}"
            boxed
            sort
        ></json-viewer>
        <h3 style="margin-top: 10px">步骤二，对上述json串使用AES密钥chinaetc@1234567加密，得到密文：</h3>
        <aside>
            XHH/wJLDeqYkW2Cx6shE3bD9rqlwTD9NHNZrHSa4Qc8lzXXh7xPIdDiSVVrXwbctwrvknlL4m5FPWyrvxL23wWSGq37cG2c60S9u2xZslzLoJ3Gj68RQVMBsztVj23rz1r2c15JSg4D/PB6ipgTfiub+Q0qwNKZOZ4BanbYxj7dnKfHVF63HmqlRHG2AUW5dSVYEGCRArsfQUlYsuOxVTCC8Q6AN3BBAHUFq2GNZWM1YA9BAJQFO7G838xcaceCFFTmt74VB4WXz5QPL9cL9vmfKjkRBXKYRKMuY45mTf2omSJuNhkRLx7EgDEPGOJDJOL6hnL+ISgbxuBQDkPW7xTr+13TueDzTXPfc5Eqx28VoWJy8xbWcYu8e0L0HHlStOIkvsWkBJMCdqp8bHEKAyqoGGNOBAUkidaidjojVBEyScOEuLJ8zt99sX7k4SxvDkxhTcxwrBHt+OcWaWyGgVL0ISC6NiZ4JX/8aZscDrCa4wJ8ih95QQQHrO8yelDiHShHh9DkZ7xVasLYHEC2dQh+6p+24jwzWkR/SGFcYEJdvN0Zw18ARfpFhp3+RgTQZqsCKC8n5M2wjLd6pLQAEzWfSX5NXmPfqzuJFg8YrI/yc=
        </aside>
    </div>
</template>

<script>
    export default {
        name: "liaisons",
        data() {
            return {
                json: {
                    "plateNum":"京A123456",
                    "plateColor":0,
                    "mediaType":0,
                    "vehicleType":1,
                    "vehicleClass":0,
                    "enTollStationId":"G0001210030040",
                    "enTime":"2020-02-15T13:13:52",
                    "exTollStationId":"G0001110010010",
                    "exTime": "2020-02-15T17:10:00",
                    "axleCount":2,
                    "units":
                        [
                            {
                                "unitId": "G000121003001110",
                                "passTime": "2020-02-15T14:10:00"
                            },
                            {
                                "unitId": "G000111001001720",
                                "pastime": "2020-02-15T16:22:00"
                            }
                        ]
                }
                ,
                tableData2:  [{
                    id: '12987122',
                    name: '王小虎',
                    amount1: '234',
                    amount2: '3.2',
                    amount3: 10
                }, {
                    id: '12987123',
                    name: '王小虎',
                    amount1: '165',
                    amount2: '4.43',
                    amount3: 12
                }, {
                    id: '12987124',
                    name: '王小虎',
                    amount1: '324',
                    amount2: '1.9',
                    amount3: 9
                }, {
                    id: '12987125',
                    name: '王小虎',
                    amount1: '621',
                    amount2: '2.2',
                    amount3: 17
                }, {
                    id: '12987126',
                    name: '王小虎',
                    amount1: '539',
                    amount2: '4.1',
                    amount3: 15
                }],
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
         methods: {
             arraySpanMethod({ row, column, rowIndex, columnIndex }) {

                 if (columnIndex === 0) {
                     if (rowIndex % 2 === 0) {
                         return {
                             rowspan: 2,
                             colspan: 1
                         };
                     } else {
                         return {
                             rowspan: 0,
                             colspan: 0
                         };
                     }
                 }
             },
         },
        created() {
            this.$store.commit('set_loading', false);
            setTimeout(() => {
                this.$store.commit('set_loading', false);
            }, 500);
        }
    }
</script>

<style scoped>
    .contentBox {
        padding: 50px;
        box-sizing: border-box;
    }

    p {
        font-size: 15px;
    }
  .table {
      margin-bottom: 10px;
  }
    pre,aside{
        word-wrap: break-word;
        background: #eef1f6;
        padding: 8px 24px;
        margin-bottom: 20px;
        border-radius: 2px;
        display: block;
        line-height: 32px;
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        color: #2c3e50;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
