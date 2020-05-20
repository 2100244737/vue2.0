<template>
    <div>
        <div id="formBox-top" class="formBox-top">
            <el-form :rules="rules" ref=pathForm :model="dataList" label-width="90px" inline>
                <el-form-item label="车牌号" prop="carNumber">
                    <el-input clearable class="input" v-model="dataList.carNumber" placeholder="请输入车牌号"></el-input>
                </el-form-item>
                <el-form-item label="上传时间" prop="time">
                    <el-date-picker v-model="dataList.time" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <!--                <el-form-item label="入口时间" prop="entrance">-->
                <!--                    <el-input clearable class="input" v-model="dataList.entrance" placeholder="请输入口时间"></el-input>-->
                <!--                </el-form-item>-->
                <el-form-item label="车牌颜色" prop="color">
                    <el-select clearable v-model="dataList.color" placeholder="车牌颜色">
                        <el-option label="蓝色" value="0"></el-option>
                        <el-option label="黄色" value="1"></el-option>
                        <el-option label="黑色" value="2"></el-option>
                        <el-option label="白色" value="3"></el-option>
                        <el-option label="渐变绿色" value="4"></el-option>
                        <el-option label="黄绿双拼色" value="5"></el-option>
                        <el-option label="蓝白渐变色" value="6"></el-option>
                        <el-option label="临时牌照" value="7"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button class="button marginLift2" type="primary" @click="getData">查询</el-button>
                    <el-button class="showBtn" v-show="showBtn" type="danger" icon="el-icon-delete" @click="stopMap">
                        关闭地图
                    </el-button>
                    <el-button class="showBtn" v-show="logBtn" type="danger" icon="el-icon-delete" @click="stoplog">
                        关闭日志
                    </el-button>
                    <el-button type="info" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>

                </el-form-item>
            </el-form>
        </div>
        <div v-show="tableShow" class="tableWp marginTop2">
            <el-table :data="tableData" border stripe>
                <el-table-column prop="plateNum" label="车牌号" header-align="center" align="center"/>
                <el-table-column prop="uploadTime" label="上传时间" header-align="center" align="center"/>
                <el-table-column prop="enTime" label="入口时间" header-align="center" align="center"/>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="lookMap(scope.row)">查看地图</el-button>
                        <el-button type="primary" @click="lookLog(scope.row)">查看日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pages

                class="pages"
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>

        <div v-show="logShow" class="tableWp marginTop2">
            <el-table :data="logShowData" border stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="fileName" label="数据名称" header-align="center" align="center"/>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="looklook(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :visible.sync="dialogTableVisible">

            <span slot="footer" class="dialog-footer">

            </span>
        </el-dialog>
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="clear"
            :visible.sync="dialogTableVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">详情查看</span>
            </div>
<!--            <pre>{{json}}</pre>-->
            <json-viewer
                :value="json"
                :expand-depth="5"
                boxed
                sort
            ></json-viewer>
            <div slot="footer">
                <el-button  @click="clear">关 闭</el-button>
                <el-button   v-clipboard:copy="json"
                             v-clipboard:success="onCopy"
                             v-clipboard:error="onError" type="primary" @click="copy">复制JSON</el-button>
            </div>
        </el-dialog>
        <div class="iframe marginTop2">
            <iframe id="iframe" v-if="show" src="/static/view.html"
                    height="600px"
                    width="100%" frameborder="0"></iframe>
        </div>
    </div>
</template>
<!--/static/view.html-->
<script>
    import axios from 'axios'
    import pages from "../../components/pages"; // 分页
    export default {
        name: 'pathQuery',
        data() {
            return {
                pagesShow: true,
                logShow: false, // 查看日志
                logBtn: false, // 关闭日志
                tableData: [],// 表格数据
                logShowData: [], //
                dataList: {
                    color: '',
                    time: '', // 上传时间
                    entrance: '', // 入口时间
                    carNumber: '',
                },
                rules: {
                    carNumber: [
                        {required: true, message: '请输入车牌号', trigger: 'blur'},
                    ],
                    // time: [
                    //     {required: true, message: '请输入上传时间', trigger: 'change'},
                    //     {required: true, message: '请输入上传时间', trigger: 'blur'},
                    // ],
                    // // entrance: [
                    // //     {required: true, message: '请输入入口时间', trigger: 'blur'},
                    // // ],
                    // color: [
                    //     {required: true, message: '请输入车牌颜色', trigger: 'change'},
                    // ],
                },
                show: false,
                tableShow: true,
                showBtn: false,
                dialogTableVisible: false,
                json: '',
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
            }
        },
        components: {
            pages
        },
        methods: {
            copy () {

            },
            onCopy () {
               // copy 成功
                this.$message({
                    message: '复制成功',
                    type: 'success',
                    offset: 200
                });
            },
            onError () {
                // copy 失败
                this.$message({
                    message: '复制失败',
                    type: 'warning',
                    offset: 200
                });
            },
            clear () {
                //  关闭
                this.json = ''
               this.dialogTableVisible = false; //
            },
            looklook (row) {
                // 查看
                var _t = this;
                _t.dialogTableVisible = true; //
                const selectedData = {
                    fileId: row.fileId
                }

                const params = {
                    "bizContent": JSON.stringify(selectedData),
                    "encryptType": "NONE",
                    "filename": "FCS_LOG_FIND_REQ_99999917_20200306170243825.json",
                    "sign": "NONE",
                    "signType": "NONE",
                    "timestamp": "2020-04-06T17:02:44",
                    "tokenType": "USER_AUTH",
                    "accessToken": "chinaetcorg"
                }
                axios.post('/c/fcs/api/json', params).then(function (response) {
                    if (response.data.statusCode != 0) {
                        _t.$confirm(response.data.errorMsg, '查询日志失败', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                    }
                    const data = JSON.parse(response.data.bizContent)
                    _t.json = data.jsonStr

                }).catch(function (error) {
                    console.log(error);
                });

            },
            stoplog () {
                var _t = this;
                _t.logShow = false;
                _t.logBtn = false;
                _t.tableShow = true;
                _t.pagesShow = true
            },
            lookLog (row){
                // 查看日志
                var _t = this;
                _t.logShow = true;
                _t.tableShow = false;
                _t.logBtn = true;
                // 查询 数据
                const selectedData = {
                    enTime: row.enTime,
                    plateNum: row.plateNum,
                    plateColor: row.plateColor, // 转Number
                    insertDate: row.uploadTime
                }
                // 数据处理
                const params = {
                    "bizContent": JSON.stringify(selectedData),
                    "encryptType": "NONE",
                    "filename": "FCS_LOG_LIST_REQ_99999917_20200306170243825.json",
                    "sign": "NONE",
                    "signType": "NONE",
                    "timestamp": "2020-03-06T17:02:44",
                    "tokenType": "USER_AUTH",
                    "accessToken": "chinaetcorg"
                }
                //https://feelog.txffp.com/fcs/api/json
                axios.post('/c/fcs/api/json', params).then(function (response) {
                    if (response.data.statusCode != 0) {
                        _t.$confirm(response.data.errorMsg, '查询日志失败', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                        _t.logBtn = false;
                        _t.logShow = false;
                        _t.tableShow = true;
                    }else {
                        console.log(response);
                        const data = JSON.parse(response.data.bizContent)
                        _t.logShowData = data.uploadModels
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            stopMap() {
                // 关闭地图
                this.showBtn = false;
                this.tableShow = true;
                this.show = false;
                sessionStorage.removeItem("JSON")
            },
            resetHandle() {
                var _t = this;
                _t.show = false;
                _t.showBtn = false;
                _t.tableShow = true;
                sessionStorage.removeItem("JSON")
                _t.dataList.color = "";
                _t.dataList.time = ""; // 上传时间
                _t.dataList.entrance = ""; // 入口时间
                _t.dataList.carNumber = "";
               _t.dialogTableVisible = false; //
               _t.logBtn = false; //
               _t.logShow = false; //
                _t.json = ''
                _t.pagesShow = true
            },
            getData() {
                var _t = this;
                // 查询数据
                _t.$refs.pathForm.validate((valid) => {
                    if (valid) {
                        // 提交
                        _t.show = false;
                        _t.tableShow = true;
                        _t.showBtn = false;
                        sessionStorage.removeItem("JSON")
                        const selectedData = {
                            openId: _t.$cookie.get('openId'),
                            plateNum: _t.dataList.carNumber, // 车牌号
                            plateColor: _t.dataList.color, // 车牌颜色
                            uploadTime: _t.dataList.time, // 上传时间
                        };
                        const params = {
                            "bizContent": JSON.stringify(selectedData),
                            "encryptType": "NONE",
                            "filename": "FCS_MAP_LOG_REQ_99999925_20200108150154581.json",
                            "version": "2.0",
                            "signType": "NONE",
                            "sign": "NONE",
                            "timestamp": "2020-01-08T15:01:54",
                            "tokenType": "USER_AUTH",
                            "accessToken": _t.$cookie.get('accessToken'),
                        }

                        axios.post('/b/api/json', params).then(function (response) {
                            if (response.data.statusCode == 0) {
                                _t.tableData = JSON.parse(response.data.bizContent).data
                                // var pages = JSON.parse(response.data.bizContent).totalCount
                                // _t.options.total = pages ? pages : 0;
                            } else {
                                _t.alertDialogTip(_t, response.errorMsg)
                            }
                        })

                    }
                })
            },
            lookMap(row) {
                //查看地图
                var _t = this
                sessionStorage.removeItem("JSON")
                _t.show = false;
                _t.showBtn = true;
                _t.$store.commit('set_loading', true);

                const time = row.enTime.replace(/:/g, "-");
                const selectedData = {
                    openId: _t.$cookie.get('openId'),
                    fileId: row.uploadTime + "/" + time + "_" + row.plateNum + '_' + row.plateColor
                }
                sessionStorage.setItem("JSON", JSON.stringify(selectedData))
                const params = {
                    "bizContent": JSON.stringify(selectedData),
                    "encryptType": "NONE",
                    "filename": "FCS_MAP_FIND_REQ_99999925_20200108150154581.json",
                    "version": "2.0",
                    "signType": "NONE",
                    "sign": "NONE",
                    "timestamp": "2020-01-08T15:01:54",
                    "tokenType": "USER_AUTH",
                    "accessToken": "chinaetcorg",
                }
                // https://device.cywetc.com/fcs/api/json
                axios.post('/b/api/json', params).then(function (response) {
                    if (response.data.statusCode != 0) {
                        _t.alertDialogTip(_t, '查询日志失败')
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 500);
                        _t.showBtn = false
                    } else {
                        if (response.data.bizContent) {
                            setTimeout(() => {
                                _t.$store.commit('set_loading', false);
                            }, 500);
                            _t.tableShow = false;
                            const data = JSON.parse(response.data.bizContent)
                            sessionStorage.setItem("JSON", JSON.stringify(data))
                            _t.show = true

                        } else {
                            setTimeout(() => {
                                _t.$store.commit('set_loading', false);
                            }, 500);
                            _t.showBtn = false
                            _t.alertDialogTip(_t, '此文件无法查看地图')
                        }

                    }

                }).catch(function (error) {
                    console.log(error);
                });

            },
            handleCurrentChange(val) {
                // 改变当前页码
                var _t = this;
                _t.options.currentPage = val;
                _t.getData()
            },
            handleSizeChangeSub(val) {
                // 改变每页显示条数
                var _t = this;
                _t.options.pageSize = val;
                _t.getData()
            },
            getHenght() {
                var ifm = document.getElementById("iframepage");
                var div = document.getElementById("formBox-top");
                console.log(ifm, '9999');
                ifm.height = document.documentElement.clientHeight - div.offsetHeight * 2;
            }
        },
        created() {
            if (!this.$cookie.get('accessToken') || !this.$cookie.get('openId')) {
                this.$router.replace('/login');
            }
            this.$store.commit('set_loading', true);
            setTimeout(() => {
                this.$store.commit('set_loading', false);
            }, 800);

        }
    }
</script>

<style scoped>

</style>

