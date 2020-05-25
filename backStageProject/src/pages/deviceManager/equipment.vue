<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" label-width="90px" inline>
                <el-form-item>
                    <el-input  clearable maxlength="150"  v-model="formItem.equipmentNumber" placeholder="设备编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input  clearable maxlength="150" v-model="formItem.chipNumber" placeholder="芯片编号"></el-input>
                </el-form-item>
                <el-form-item label="厂商：">
                    <el-select
                        clearable
                        v-model="formItem.manufacturer">
                        <el-option label="北京无限感测科技有限公司" value="0"/>
                        <!--                        <el-option-->
                        <!--                            v-for="(item,index) in manufacturerList"-->
                        <!--                            :key="index"-->
                        <!--                            :label="item"-->
                        <!--                            :value="item"/>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="设备状态：">
                    <el-select
                        clearable
                        @change="StatusChange(formItem.deviceStatus)"
                        v-model="formItem.deviceStatus">
                        <el-option label="已部署车道" value="2"/>
                        <el-option label="厂家部署" value="0"/>
                        <el-option label="客户确认" value="1"/>
                        <el-option label="已注销" value="3"/>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="refreshHandle">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="setAddHandle">添加</el-button>
                    <el-button type="primary" icon="el-icon-folder-add" @click="importHandle">批量导入</el-button>
                    <el-button type="info" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" border stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="factory" label="厂商名" header-align="center" align="center"/>
                <el-table-column prop="deviceId" label="设备编号" header-align="center" align="center"/>
                <!--                <el-table-column prop="seNo" label="SE芯片编号" header-align="center" align="center"/>-->
                <!--        <el-table-column prop="hardVersion" label="硬件版本号" header-align="center" align="center"/>-->
                <!--        <el-table-column prop="appVersion" label="软件版本号" header-align="center" align="center"/>-->
                <el-table-column width="180px"  label="备案时间" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-text="settime(scope.row.insertTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column width="120px" prop="status" label="状态" header-align="center" align="center"/>
                <el-table-column width="150px" label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <!--            <el-button type="primary" @click="changeLimit(scope.row)">删除</el-button>-->
                        <el-button type="primary" @click="details(scope.row)">详情</el-button>
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
        <!--    添加-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="addVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备备案--添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addDevice" label-width="150px">
                <el-form-item label="厂商：" prop="factory">
                    <el-select
                        clearable
                        v-model="addEdit.factory">
                        <el-option label="北京无限感测科技有限公司" value="0"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备编号：" prop="deviceId">
                    <el-input  clearable maxlength="50" v-model="addEdit.deviceId" placeholder="设备编号"></el-input>
                </el-form-item>
                <el-form-item label="设备型号：">
                    <el-input maxlength="150" v-model="addEdit.model" placeholder="设备型号"></el-input>
                </el-form-item>
<!--                <el-form-item label="SE芯片编号：" prop="seNo">-->
<!--                    <el-input  clearable maxlength="150" v-model="addEdit.seNo" placeholder="芯片编号"></el-input>-->
<!--                </el-form-item>-->

                <!--        <el-form-item label="硬件版本号：">-->
                <!--          <el-input v-model="addEdit.softwareVersion" placeholder="硬件版本号"></el-input>-->
                <!--        </el-form-item>-->
                <!--        <el-form-item label="软件版本号：">-->
                <!--          <el-input v-model="addEdit.softwareVersion" placeholder="软件版本号"></el-input>-->
                <!--        </el-form-item>-->
            </el-form>
            <div slot="footer">
                <el-button @click="resetCode">取消</el-button>
                <el-button type="primary" @click="amendData">保存</el-button>
            </div>
        </el-dialog>
        <!--    批量加载-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="allAddVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备管理-批量导入</span>
            </div>
            <el-form :model="addEdit" ref="addEdit" label-width="150px">
                <el-form-item label="批量导入字段：" class="textarea">
                    <el-input
                        class="textarea"
                        type="textarea"
                        placeholder="请输入内容:
 例如:设备编号,厂商; 以英文逗号隔开,以分号结尾,最多100条。"
                        v-model="addEdit.textarea">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="resetCode">取消</el-button>
                <el-button type="primary" @click="allamendData">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="detailsVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备备案--详情</span>
            </div>
            <el-form :model="detailsData" ref="addEdit" label-width="150px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="设备编号：">
                            <el-tooltip :content="detailsData.deviceId" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.deviceId" placeholder="设备编号"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="设备厂商：">
                            <el-tooltip :content="detailsData.factory" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.factory" placeholder="设备厂商"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="设备状态：">
                            <el-tooltip :content="detailsData.status" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.status" placeholder="设备状态"></el-input>
                            </el-tooltip>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备型号：">
                            <el-tooltip :content="detailsData.model?detailsData.model: '设备型号'" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.model" placeholder="设备型号"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="设备SE芯片编号：">
                            <el-tooltip :content="detailsData.seNo" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.seNo" placeholder="设备se芯片编号"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="添加时间：">
                            <el-tooltip :content="detailsData.insertTime" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.insertTime" placeholder="添加时间"></el-input>
                            </el-tooltip>
                        </el-form-item>

                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer">
                <el-button @click="resetdetails">关闭</el-button>
                <!--        <el-button v-if="flag == 1" type="primary" @click="amendDatadeploy">保存</el-button>-->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import pages from "../../components/pages"; // 分页
    import {getEquipmentFile, addEquipmentDevice, DEVICE_PAGE, DEVICE_IMPORT} from '@/uitls/filenamme';
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    export default {
        name: 'equipment',
        data() {
            return {
                manufacturerList: [], // 厂商数据
                manufacturersList: [], // 添加厂商数据
                unitList: [], // 添加 设备型号数据
                softwareVersionList: [], // 软件版本
                tableData: [],//  表格数据
                addVisible: false, // 添加设备显示
                allAddVisible: false, // 批量加载显示
                detailsVisible: false, // 详情
                // 表单数据
                formItem: {
                    equipmentNumber: '', // 设备编号
                    chipNumber: '', // 芯片编号
                    manufacturer: '', // 厂商
                    deviceStatus: '', // 设备状态
                },
                rules: {

                    factory: [
                        {required: true, message: '请选择厂商', trigger: 'change'},
                    ],
                    deviceId: [
                        {required: true, message: '请输入设备编号', trigger: 'blur'}
                    ],
                    seNo: [
                        {required: true, message: '请输入芯片编号', trigger: 'blur'}
                    ],
                },
                // 添加表单对象
                addEdit: {
                    factory: '', // 厂商
                    textarea: '', // 批量加载
                    deviceId: '', //	设备编号
                    model: '', //		设备型号
                    seNo: '', //		设备se芯片编号
                },
                detailsList: {},
                detailsData: {
                    deviceId: '', //	设备编号
                    factory: '', //	设备厂商
                    status: '', //	设备状态
                    model: '', //设备型号
                    seNo: '', //	设备se芯片编号
                    stationId: '',//	收费站编号
                    tollPlazaId: '',//	收费广场编号
                    tollLaneId: '',//	收费车道编号
                    openId: '', //	操作人id
                    insertTime: '', //	插入时间
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
            settime (row) {
              // 编辑 table 备案时间
              return   row.replace("T", ' ')
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            StatusChange() {
                // 设备状态
                this.refreshHandle();
            },
            resetCode() {
                // 取消功能
                this.addVisible = false;
                this.allAddVisible = false;
                this.detailsVisible = false;
                this.addEdit.deviceId = ''; //	设备编号
                this.addEdit.factory = ''; //		设备厂商
                this.addEdit.model = ''; //		设备型号
                this.addEdit.seNo = ''; //		设备se芯片编号
                this.addEdit.textarea = '';
                this.resetForm('addDevice')
            },
            resetdetails() {
                this.addVisible = false;
                this.allAddVisible = false;
                this.detailsVisible = false;
                this.addEdit.deviceId = ''; //	设备编号
                this.addEdit.factory = ''; //		设备厂商

                this.addEdit.model = ''; //		设备型号
                this.addEdit.seNo = ''; //		设备se芯片编号
                this.addEdit.textarea = '';
            },
            resetHandle() {
                // 重置
                this.formItem.equipmentNumber = ''
                this.formItem.chipNumber = ''
                this.formItem.manufacturer = ''
                this.formItem.deviceStatus = ''
                this.refreshHandle()
            },
            setAddHandle() {
                // 添加功能
                this.addVisible = true;
            },
            details(row) {
                this.detailsVisible = true;
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    deviceId: row.deviceId
                };
                var filename = getEquipmentFile + getDataTime() + '.json';
                var data = this.changeData(params, filename,_t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    _t.detailsList = JSON.parse(res.bizContent)
                    _t.detailsData.deviceId = _t.detailsList.deviceId; //	设备编号
                    _t.detailsData.factory = _t.detailsList.factory; //	设备厂商
                    _t.detailsData.status = _t.detailsList.status; //	设备状态
                    _t.detailsData.model = _t.detailsList.model; //设备型号
                    _t.detailsData.seNo = _t.detailsList.seNo; //	设备se芯片编号
                    _t.detailsData.sysVersion = _t.detailsList.sysVersion; //	系统版本号
                    _t.detailsData.hardVersion = _t.detailsList.hardVersion;//	硬件版本号
                    _t.detailsData.appVersion = _t.detailsList.appVersion; //	App版本号
                    _t.detailsData.openId = _t.detailsList.openId; //	操作人id
                    _t.detailsData.insertTime = _t.detailsList.insertTime.replace("T", ' '); //	插入时间
                    _t.detailsData.updateTime = _t.detailsList.updateTime; //	更新时间
                })


            },
            amendData() {
                // 添加保存
                var _t = this;

                _t.$refs.addDevice.validate((valid) => {
                    if(valid) {
                        if(_t.addEdit.deviceId.indexOf('@')!=-1) {
                            const seNodata = _t.addEdit.deviceId.split('@')[1]
                            const params = {
                                accessToken: _t.$cookie.get('accessToken'),
                                openId: _t.$cookie.get('openId'),
                                deviceId: _t.addEdit.deviceId.trim(), //	设备编号
                                factory: _t.addEdit.factory, //		设备厂商
                                model: _t.addEdit.model, //		设备型号
                                seNo: seNodata, //		设备se芯片编号
                            };
                            var filename = addEquipmentDevice + getDataTime() + '.json';
                            var data = this.changeData(params, filename,_t.$cookie.get('accessToken'));
                            _t.$api.post('api/json', data, function (res) {
                                if (res.statusCode == 0) {
                                    _t.addVisible = false;
                                    _t.stationIdList = JSON.parse(res.bizContent).data;
                                    _t.alertDialogTip(_t, res.errorMsg);
                                    _t.refreshHandle();
                                    _t.resetCode();
                                } else {
                                    _t.alertDialogTip(_t, res.errorMsg);
                                    // _t.resetCode();
                                }
                            })
                        }else {
                            _t.alertDialogTip(_t, '输入设备编号格式错误!')
                        }
                    }
                })
            },
            refreshHandle() {
                // 查询功能
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    deviceId: _t.formItem.equipmentNumber.trim(),	//设备编号
                    factory: _t.formItem.manufacturer.trim(),	//	设备厂商
                    status: _t.formItem.deviceStatus.trim(),	//	设备状态
                    seNo: _t.formItem.chipNumber.trim(), //芯片编号
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };
                var filename = DEVICE_PAGE + getDataTime() + '.json';
                var data = this.changeData(params, filename,_t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 800);
                        _t.tableData = JSON.parse(res.bizContent).data? JSON.parse(res.bizContent).data:[];
                        var pages = JSON.parse(res.bizContent).totalCount;
                        _t.options.total = pages ? pages : 0;
                    }else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }

                })
            },
            importHandle() {
                // 批量导入
                this.allAddVisible = true;
            },
            allamendData() {
                // 批量导入 保存
                var _t = this;
                const ArrList = []
                var text =''
                if (_t.addEdit.textarea) {
                    _t.addEdit.textarea.split(";").forEach(item => {
                        if (item.trim() !== "") {
                            text = item.split(',')[0]+','+item.split(',')[0].split('@')[1]+ ','+ item.split(',')[1]
                            ArrList.push(text)
                        }
                    })
                    const params = {
                        accessToken: _t.$cookie.get('accessToken'),
                        openId: _t.$cookie.get('openId'),
                        list: ArrList // 数组
                    };
                    var filename = DEVICE_IMPORT + getDataTime() + '.json';
                    var data = this.changeData(params, filename,_t.$cookie.get('accessToken'));
                    _t.$api.post('api/json', data, function (res) {
                        if (res.statusCode == 0) {
                            _t.alertDialogTip(_t, res.errorMsg);
                            _t.refreshHandle();
                            _t.resetCode();
                        } else {
                            _t.alertDialogTip(_t, res.errorMsg);
                            _t.resetCode();
                        }
                    })
                } else {
                    _t.alertDialogTip(_t, '你保存内容为空！');
                }

            },
            handleCurrentChange(val) {
                // 改变当前页码
                var _t = this;
                _t.options.currentPage = val;
                _t.refreshHandle();
            },

            handleSizeChangeSub(val) {
                // 改变每页显示条数
                var _t = this;
                _t.options.pageSize = val;
                _t.refreshHandle();
            },
        },
        created() {
            this.$store.commit('set_loading', true);
            this.refreshHandle()
        }
    }
</script>

<style scoped>
    .el-textarea /deep/ .el-textarea__inner {
        height: 100%;
    }

    .el-textarea {
        height: 250px;
    }

    /deep/ textarea::-webkit-input-placeholder {
        color: red;
    }

    /deep/ textarea:-moz-placeholder {
        color: red;
    }

    /deep/ textarea::-moz-placeholder {
        color: red;
    }

    /deep/ textarea:-ms-input-placeholder {
        color: red;
    }

    .upload-demo {
        display: inline-block;
        position: relative;
    }
</style>
