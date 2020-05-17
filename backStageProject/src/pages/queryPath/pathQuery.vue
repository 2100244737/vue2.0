<template>
    <div>
        <div id="formBox-top" class="formBox-top">
            <el-form :model="dataList" label-width="90px" inline>
                <el-form-item label="车牌号">
                    <el-input  clearable class="input" v-model="dataList.carNumber" placeholder="请输入车牌号"></el-input>
                </el-form-item>
                <el-form-item label="上传时间">
                    <el-date-picker v-model="dataList.time" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="入口时间">
                    <el-input  clearable class="input" v-model="dataList.entrance" placeholder="请输入口时间"></el-input>
                </el-form-item>
                <el-form-item label="车牌颜色">
                    <el-select  clearable v-model="dataList.color" placeholder="车牌颜色">
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
                    <el-button class="button" type="primary" @click="lookMap">查看地图</el-button>
                    <el-button type="info" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <iframe id="iframe" v-if="show"  src="/static/view.html"
                height="650"
                width="100%" frameborder="0"></iframe>
    </div>
</template>
<!--/static/view.html-->
<script>
    import axios from 'axios'

    export default {
        name: 'pathQuery',
        data() {
            return {
                dataList: {
                    color: '',
                    time: '', // 上传时间
                    entrance: '', // 入口时间
                    carNumber: '',
                },
                show: false,
                dialogTableVisible: false,
                json: ''
            }
        },

        methods: {
            resetHandle() {
                var _t = this;
                _t.show = false;
                sessionStorage.removeItem("JSON")
                _t.dataList.color = "";
                _t.dataList.time = ""; // 上传时间
                _t.dataList.entrance = ""; // 入口时间
                _t.dataList.carNumber = "";
            },
            lookMap() {
                var _t = this
                _t.show = false;
                sessionStorage.removeItem("JSON")
                //查看地图
                console.log(_t.dataList.entrance, 111);
                const time = _t.dataList.entrance.replace(/:/g,"-")
                console.log(time);
                const selectedData = {
                    openId: _t.$cookie.get('openId'),
                    fileId: _t.dataList.time + "/" + time + "_" + _t.dataList.carNumber + '_' + _t.dataList.color
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
                axios.post('https://device.cywetc.com/fcs/api/json', params).then(function (response) {
                    if (response.data.statusCode != 0) {
                        _t.$confirm(response.data.errorMsg, '查询日志失败', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })
                    } else {
                        if (response.data.bizContent) {

                            const data = JSON.parse(response.data.bizContent)
                            sessionStorage.setItem("JSON", JSON.stringify(data))

                            setTimeout(function () {
                                _t.show = true
                            }, 1000)
                        } else {
                            _t.$confirm(response.data.errorMsg, '此文件无法查看地图', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            })
                        }

                    }

                }).catch(function (error) {
                    console.log(error);
                });
            },
            gethengt() {

                var ifm =document.getElementById("iframe");
                var div= document.getElementById("formBox-top");
                ifm.height = document.documentElement.clientHeight -  div.offsetHeight*2;
            }

        },
        created() {
            if (!this.$cookie.get('accessToken') || !this.$cookie.get('openId') ) {
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
    .iframe {
        overflow-x: hidden;
    }
</style>
