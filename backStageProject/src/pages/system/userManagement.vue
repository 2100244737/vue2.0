<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" label-width="90px" inline>
                <el-form-item>
                    <el-input  clearable v-model="formItem.phoneNumber" placeholder="手机号"></el-input>
                </el-form-item>
                <!--                <el-form-item>-->
                <!--                    <el-input v-model="formItem.nickname" placeholder="昵称"></el-input>-->
                <!--                </el-form-item>-->
                <!--                <el-form-item label="APP类型：">-->
                <!--                    <el-select-->
                <!--                        @change="ChangeAPP"-->
                <!--                        v-model="formItem.user">-->
                <!--                        <el-option label="阿里APP" value="88000504"/>-->
                <!--                        <el-option label="特情终端管理后台" value="99999925"/>-->
                <!--                    </el-select>-->
                <!--                </el-form-item>-->
                <br>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="refreshHandle">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="synchronization">同步查询</el-button>
                    <el-button type="info" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" border stripe>
                <el-table-column prop="nickName" label="用户名" header-align="center" align="center"/>
                <el-table-column prop="roleId" label="角色" header-align="center" align="center"/>
                <el-table-column prop="mobile" label="手机号" header-align="center" align="center"/>
                <el-table-column  label="APP类型" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-text="desposeTable(scope.row.mapAppType)"></span>
                    </template>
                </el-table-column>
                <!--                <el-table-column label="操作" header-align="center" align="center">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <el-button type="primary" @click="changeLimit(scope.row)">配置</el-button>-->
                <!--                        <el-button type="primary" @click="changeRoleBtn(scope.row)">修改</el-button>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
            </el-table>
            <pages
                class="pages"
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
        <!--    配置-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="configurationVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">用户管理-配置</span>
            </div>
            <el-form :model="addEdit" ref="addEdit" label-width="120px">
                <el-form-item label="手机号：">
                    <el-input  clearable v-model="addEdit.cellPhone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="权限范围：">
                    <el-select  clearable v-model="addEdit.extendompetence" multiple placeholder="请选择(可多选)">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetCode">取消</el-button>
                <el-button type="primary" @click="configurationData">保存</el-button>
            </div>
        </el-dialog>
        <!--    修改-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="amendVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">用户管理-新增</span>
            </div>
            <el-form :model="addEdit" ref="addEdit" label-width="120px">
                <el-form-item label="手机号：">
                    <el-input  clearable  v-model="addEdit.cellPhone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="角色：">
                    <el-select
                        clearable
                        v-model="addEdit.role">
                        <el-option
                            v-for="(item,index) in roleList"
                            :key="index"
                            :label="item"
                            :value="item"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetCode">取消</el-button>
                <el-button type="primary" @click="amendData">保存</el-button>
            </div>
        </el-dialog>
        <!--    同步查询确认-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="synchronizationVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">用户管理-同步查询</span>
            </div>
            <div class="synPhone">
                <div class="box">
                    <el-form :model="addEdit" :rules="rules" ref="addSynBtn" label-width="150px">
                        <el-form-item label="手机号：" prop="cellPhone">
                            <div class="synbox">
                                <el-input  clearable maxlength="11" v-model="addEdit.cellPhone" placeholder="手机号"></el-input>
                                <el-button class="synBtn" type="primary" @click="synBtn">同步</el-button>
                            </div>
                        </el-form-item>
                    </el-form>


                </div>
            </div>

            <el-form v-show="synForm" :rules="rules" :model="addEdit" ref="addEditSyn" label-width="150px">
                <el-form-item label="角色：" prop="user">
                    <el-select
                        clearable
                        v-model="addEdit.user">
                        <el-option label="系统管理员" value="66ac5812d20540d9831fd68f5699fdd0"/>
                        <!--                        <el-option label="超级管理员" value="admin"/>-->
                        <el-option label="设备厂商" value="c922573e79674edf846c3f9668d1a996"/>
                        <el-option label="车道管理员" value="d72499501fa540d8b90a274f2c41d9b7"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input disabled maxlength="11"  clearable v-model="addEdit.Phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input  clearable  clearable disabled v-model="addEdit.synname" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item class="staruser" label="应用编号列表：" prop="checkList">
                    <el-checkbox-group @change="handleCheckedCitiesChange" v-model="checkList">
                        <el-checkbox label="99999925">特情终端管理后台</el-checkbox>
                        <el-checkbox label="88000504">阿里APP</el-checkbox>
                        <el-checkbox label="88000505">无限APP</el-checkbox>
                    </el-checkbox-group>
                    <span v-show="checkShow" class="colorRed">必填项不能为空</span>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetCode">取消</el-button>
                <el-button type="primary" @click="synData">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {SSO_FIND, SSO_ADD, USER_PAGE} from '@/uitls/filenamme';
    import {getDataTime} from '@/assets/js/time'
    import pages from "../../components/pages"; // 分页
    import {Debounce} from '@/uitls/Debounce'
    export default {
        name: 'userManagement',
        data() {
            return {
                userList: [],// 角色数组
                tableData: [],//  表格数据
                roleList: [], // 角色数据
                extendompetenceList: [], // 权限范围
                configurationVisible: false, // 配置
                synchronizationVisible: false, // 同步查询
                amendVisible: false, // 修改角色
                synForm: false, // 同步数据显示
                textShow: false, // 提示字体
                checkList: [], // 复选框组
                rules: {
                    user: [
                        {required: true, message: '请选择角色', trigger: 'change'},
                    ],
                    cellPhone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                },
                // 表单数据
                formItem: {
                    phoneNumber: '', // 手机号
                    nickname: '', // 昵称
                    user: '', // 角色
                    cellPhone: '', // 手机号
                    extendompetence: [], // 权限范围
                },
                checkShow: false,
                // 新增对象
                addEdit: {
                    type: '', // 类型
                    role: '', // 角色
                    name: '', // 姓名
                    cellPhone: '', // 同步手机号
                    Phone: '', // 返回手机号
                    synname: '', //同步姓名
                    user: '', // 角色
                },
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
            desposeTable (row) {
                // 处理 table
               return row.join(', ')
            },
            ChangeAPP() {
                this.refreshHandle()
            },
            handleCheckedCitiesChange(val) {
                if (val.length > 0) {
                    this.checkShow = false
                } else {
                    this.checkShow = true;
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            resetCode() {
                // 取消
                this.dialogAddVisible = false;
                this.configurationVisible = false;
                this.amendVisible = false;
                this.synchronizationVisible = false;
                this.synForm = false;
                this.textShow = false;
                this.addEdit.cellPhone = ''; // 同步手机号
                this.addEdit.Phone = ''; // 返回手机号
                this.addEdit.synname = ''; //同步姓名
                this.checkList = []
                this.addEdit.user = ''
                this.resetForm('addEditSyn') // 清除验证
                this.resetForm('addSynBtn') // 清除验证
            },
            synData:Debounce(function () {
                // 同步保存
                var _t = this;
                let go = false
                _t.checkShow = false;
                if (_t.checkList.length > 0) {
                    _t.checkShow = false;
                    go = true
                } else {
                    _t.checkShow = true;
                    go = false
                }
                if (_t.synForm) {
                    _t.$refs.addEditSyn.validate((valid) => {
                        if (valid && go) {
                            // 提交
                            const params = {
                                accessToken: _t.$cookie.get('accessToken'),
                                openId: _t.$cookie.get('openId'),
                                mobile: _t.addEdit.cellPhone, // 手机号
                                appIds: _t.checkList, // 应用编号列表
                                roleId: _t.addEdit.user,
                                name: _t.addEdit.synname
                            };
                            var filename = SSO_ADD + getDataTime() + '.json';
                            var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                            _t.$api.post('api/json', data, function (res) {
                                if (res.statusCode == 0) {
                                    _t.synchronizationVisible = false;
                                    _t.refreshHandle();
                                    _t.alertDialogTip(_t, res.errorMsg);
                                    _t.resetCode()
                                } else {
                                    _t.resetCode()
                                    _t.alertDialogTip(_t, res.errorMsg)
                                }
                            })
                        }
                    })
                } else {
                    _t.alertDialogTip(_t, '请你先同步手机号！')
                }
            },600),
            synBtn:Debounce(function () {
                var _t = this;
                _t.$refs.addSynBtn.validate((valid) => {
                    if (valid) {
                        _t.textShow = false;
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            mobile: _t.addEdit.cellPhone, // 手机号
                        };
                        var filename = SSO_FIND + getDataTime() + '.json';
                        var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.synForm = true;
                                var getData = JSON.parse(res.bizContent)
                                _t.addEdit.Phone = getData.mobile
                                _t.addEdit.synname = getData.name
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg)
                            }
                        })
                    } else {
                        _t.textShow = true
                    }
                })
            },600),
            synchronization() {
                // 同步查询
                var _t = this;
                _t.synchronizationVisible = true;
            },
            refreshHandle() {
                // 查询功能
                var _t = this
                const params = {
                    mobile: _t.formItem.phoneNumber,
                    mapAppType: _t.formItem.user,
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = USER_PAGE + getDataTime() + '.json';
                var data = _t.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 800);
                        const list = JSON.parse(res.bizContent).data?JSON.parse(res.bizContent).data:[];
                        _t.disposeData(list)
                        var pages = JSON.parse(res.bizContent).totalCount
                        _t.options.total = pages ? pages : 0;
                        // if (JSON.parse(res.bizContent).data) {
                        //
                        // }else {
                        //      _t.tableData = [];
                        //     // _t.alertDialogTip(_t,'查询数据为空！')
                        // }

                    }else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                    // _t.tableData = JSON.parse(res.bizContent).data

                })
            },
            disposeData (row) {
                // 数组 对象 合并某个value 值
                var old = row
                var hash = {};
                var i = 0;
                var res = [];
                old.forEach(function(item) {
                    var name = item.mobile;
                    hash[name] ? res[hash[name] - 1].mapAppType.push(item.mapAppType) : hash[name] = ++i && res.push({
                        mapAppType: [item.mapAppType],
                        roleId: item.roleId,
                        mobile: item.mobile,
                        nickName: item.nickName
                    })

                });
                this.tableData = res
            },
            resetHandle() {
                // 重置功能
                this.formItem.phoneNumber = ''; // 手机号
                this.formItem.nickname = ''; // 昵称
                this.formItem.user = ''; // 角色
                this.refreshHandle();
            },
            changeRoleBtn(row) {
                // 修改
                this.amendVisible = true;
            },
            amendData() {
                // 修改保存
            },
            changeLimit(row) {
                // 配置
                this.configurationVisible = true;
            },
            configurationData() {
                // 配置保存

            },
            handleCurrentChange(val) {
                // 改变当前页码
                var _t = this;
                _t.options.currentPage = val;
                _t.refreshHandle()
            },
            handleSizeChangeSub(val) {
                // 改变每页显示条数
                var _t = this;
                _t.options.pageSize = val;
                _t.refreshHandle()
            },
        },
        created() {
            this.$store.commit('set_loading', true);
            this.refreshHandle()
        }
    }
</script>

<style scoped>
    .synPhone {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .synbox {
        display: flex;

    }

    .text {
        margin-top: 5px;
        margin-left: 119px;
    }

    .synBtn {
        margin: 0 50px;
    }

    .synPhone .syninput {
        margin-left: 119px;
    }

    /*提示功能*/
    .staruser {
        position: relative;
        color: red;
    }

    .staruser:after {
        content: '*';
        color: red;
        margin-right: 5px;
        position: absolute;
        top: 10px;
        left: 29px;
    }
</style>
