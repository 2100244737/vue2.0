<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" inline>
<!--                <el-form-item>-->
<!--                    <el-input clearable v-model="formItem.quserOpenId" placeholder="openId"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item label="内容:">
                    <el-input clearable v-model="formItem.info" placeholder="请输入内容"></el-input>
                </el-form-item>
<!--                <el-form-item label="文件名:">-->
<!--                    <el-input clearable v-model="formItem.fileName" placeholder="请输入文件名"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item label="手机后4位:">
                    <el-input clearable v-model="formItem.mobile" placeholder="请输入文件名"></el-input>
                </el-form-item>
                <el-form-item label="时间:">
                    <el-date-picker
                        value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        v-model="formItem.date"
                        align="right"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
                    <el-button type="info" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" border stripe>
<!--              -->
<!--                <el-table-column prop="fileName" label="文件名称" header-align="center" align="center"/>-->
                <el-table-column prop="mobile" label="脱敏手机号" width="150" header-align="center" align="center"/>
                <el-table-column prop="insertTime" label="时间" width="180" header-align="center" align="center"/>
                <el-table-column prop="info" label="内容" header-align="center" align="center"/>
            </el-table>
            <pages
                class="pages"
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
    </div>
</template>

<script>
    import pages from "../../components/pages"; // 分页
    import {getDataTime} from '@/assets/js/time' // 时间
    import {SYSTEM_LOG} from '@/uitls/filenamme';

    export default {
        name: 'logQuery',
        components: {
            pages
        },
        data() {
            return {
                // 表单数据
                formItem: {
                    quserOpenId: '',
                    info: '',
                    fileName: '',
                    mobile: '',
                    date: '',
                },
                tableData: [], // 表格数据
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
            }
        },
        methods: {
            getData() {
                // 查询
                // 查询功能
                var _t = this
                const params = {
                    mobile: _t.formItem.mobile, // 脱敏手机号
                    queryOpenId: _t.formItem.quserOpenId.trim(),
                    info: _t.formItem.info.trim(),
                    fileName: _t.formItem.fileName.trim(),
                    date: _t.formItem.date,
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = SYSTEM_LOG + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 800);
                        _t.tableData = JSON.parse(res.bizContent).data ? JSON.parse(res.bizContent).data : [];
                        if (_t.tableData.length == 0) {
                            _t.alertDialogTip(_t, '数据为空')
                        }
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;
                        // if (JSON.parse(res.bizContent).data) {
                        //
                        // }else {
                        //      _t.tableData = [];
                        //     // _t.alertDialogTip(_t,'查询数据为空！')
                        // }

                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                    // _t.tableData = JSON.parse(res.bizContent).data

                })
            },
            resetHandle() {
                // 重置
                var _t = this;
                _t.formItem.mobile = ''; // 脱敏手机号
                _t.formItem.quserOpenId = '';
                _t.formItem.info = '';
                _t.formItem.fileName = '';
                _t.formItem.date = '';
                _t.getData()
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
        },
        created() {
            this.$store.commit('set_loading', true);
            this.getData();
        }
    }
</script>

<style scoped>

</style>
