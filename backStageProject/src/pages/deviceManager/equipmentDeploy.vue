<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" label-width="90px" inline>
                <el-form-item>
                    <el-input  clearable maxlength="150" v-model="formItem.equipmentNumber" placeholder="设备编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input  clearable maxlength="150" v-model="formItem.state" placeholder="芯片编号"></el-input>
                </el-form-item>
                <el-form-item label="设备厂商：">
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
                        <el-option label="已部署" value="2"/>
                        <el-option label="未部署" value="1"/>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="refreshHandle">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="setAddHandle">添加</el-button>
                    <el-button type="info" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" border stripe>
                <el-table-column type="index" width="50px" label="序号" header-align="center" align="center"/>
                <el-table-column prop="factory" label="厂商名称" header-align="center" align="center"/>
                <el-table-column prop="deviceId" label="设备编号" header-align="center" align="center"/>
                <!--                <el-table-column prop="seNo" label="SE芯片编号" header-align="center" align="center"/>-->
                <el-table-column width="180px" prop="insertTime" label="添加时间" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-text="settime(scope.row.insertTime)"></span>
                    </template>
                </el-table-column>
                <el-table-column width="100px" label="状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == '1' " style="color: red">未部署</span>
                        <span v-else style="color: #67C23A">已部署</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == '1' " type="success" @click="deploy(scope.row)">部署
                        </el-button>
                        <el-button v-else type="danger" @click="redeploy(scope.row)">停用</el-button>
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
                <span class="title">设备部署--添加</span>
            </div>
            <el-form :model="addEdit" :rules="rules" ref="addList" label-width="150px">
                <el-form-item label="设备编号：" prop="deviceId">
                    <el-input  clearable v-model="addEdit.deviceId" placeholder="设备编号"></el-input>
                </el-form-item>
<!--                <el-form-item label="设备SE芯片编号：" prop="seNo">-->
<!--                    <el-input  clearable  v-model="addEdit.seNo" placeholder="芯片编号"></el-input>-->
<!--                </el-form-item>-->
            </el-form>
            <div slot="footer">
                <el-button @click="resetCode">取消</el-button>
                <el-button type="primary" @click="amendData">保存</el-button>
            </div>
        </el-dialog>
        <!--    部署-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetFlag"
            :visible.sync="deployVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备部署--{{deployTitleName}}</span>
            </div>
            <el-form :model="deployAg" :rules="ruleLIst" ref="deployFlag" label-width="150px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="省份：" prop="province">
                            <el-select
                                clearable
                                filterable
                                @change="changeProvince(deployAg.province)"
                                v-model="deployAg.province">
                                <el-option label="北京" value="11"></el-option>
                                <el-option label="天津市" value="12"></el-option>
                                <el-option label="河北省" value="13"></el-option>
                                <el-option label="山西省" value="14"></el-option>
                                <el-option label="内蒙古自治区" value="15"></el-option>
                                <el-option label="辽宁省" value="21"></el-option>
                                <el-option label="吉林省" value="22"></el-option>
                                <el-option label="黑龙江省" value="23"></el-option>
                                <el-option label="上海市" value="31"></el-option>
                                <el-option label="江苏省" value="32"></el-option>
                                <el-option label="浙江省" value="33"></el-option>
                                <el-option label="安徽省" value="34"></el-option>
                                <el-option label="福建省" value="35"></el-option>
                                <el-option label="江西省" value="36"></el-option>
                                <el-option label="山东省" value="37"></el-option>
                                <el-option label="河南省" value="41"></el-option>
                                <el-option label="湖北省" value="42"></el-option>
                                <el-option label="湖南省" value="43"></el-option>
                                <el-option label="广东省" value="44"></el-option>
                                <el-option label="广西壮族自治区" value="45"></el-option>
                                <el-option label="重庆市" value="50"></el-option>
                                <el-option label="四川省" value="51"></el-option>
                                <el-option label="贵州省" value="52"></el-option>
                                <el-option label="云南省" value="53"></el-option>
                                <el-option label="陕西省" value="61"></el-option>
                                <el-option label="甘肃省" value="62"></el-option>
                                <el-option label="青海省" value="63"></el-option>
                                <el-option label="宁夏回族自治区" value="64"></el-option>
                                <el-option label="新疆维吾尔自治区" value="65"></el-option>
                                <el-option label="海南省" value="46"></el-option>
                                <el-option label="西藏自治区" value="54"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收费站：" prop="stationId">
                            <el-select
                                clearable
                                filterable
                                @change="changeStationId(deployAg.stationId)"
                                v-model="deployAg.stationId">
                                <el-option
                                    v-for="(item,index) in stationIdList"
                                    :key="index"
                                    :label="item.stationName"
                                    :value="item.stationId"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收费广场：" prop="tollPlazaId">
                            <el-select
                                clearable
                                filterable
                                @change="changeTollPlazaId(deployAg.tollPlazaId)"
                                v-model="deployAg.tollPlazaId">
                                <el-option
                                    v-for="(item,index) in tollPlazaIdList"
                                    :key="index"
                                    :label="item.plazaName"
                                    :value="item.plazaId"/>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收费车道：" prop="tollLaneId">
                            <el-select
                                clearable
                                placeholder="请选择Hex码"
                                filterable
                                v-model="deployAg.tollLaneId">
                                <el-option
                                    v-for="(item,index) in tollLaneIdList"
                                    :key="index"
                                    :label="item.laneHex"
                                    :value="item.laneId"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <div v-if="show" class="class">
                            <span class="titletext">你所选择的收费站具有代收功能，以下为其代收门架的Hex码。</span>
                            <p class="titletext">注意：若代收关系有误，请取消部署操作。</p>
                            <p> {{showtext}}</p>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer">
                <el-button @click="resetFlag">取消</el-button>
                <el-button v-if="flag == 1" type="primary" @click="amendDatadeploy">保存</el-button>
            </div>
        </el-dialog>
        <!--    详情-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="detailsVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">设备部署--详情</span>
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
                        <el-form-item label="设备型号：">
                            <el-tooltip :content="detailsData.model?detailsData.model:'设备型号'" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.model" placeholder="设备型号"></el-input>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="设备SE芯片编号：">
                            <el-tooltip :content="detailsData.seNo" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.seNo" placeholder="设备se芯片编号"></el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <!--                        <el-form-item label="操作员id：">-->
                        <!--                            <el-input :disabled="true" v-model="detailsData.openId" placeholder="操作员id"></el-input>-->
                        <!--                        </el-form-item>-->
                        <el-form-item label="收费站名称：">
                            <el-tooltip :content="detailsData.stationId?detailsData.stationId: '收费站名称'" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.stationId" placeholder="收费站名称"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="收费广场名称：">
                            <el-tooltip :content="detailsData.tollPlazaId?detailsData.tollPlazaId: '收费广场名称'" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.tollPlazaId"
                                          placeholder="收费广场名称"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="收费车道编号：">
                            <el-tooltip :content="detailsData.tollLaneId?detailsData.tollLaneId: '收费车道编号'" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.tollLaneId" placeholder="收费车道编号"></el-input>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="添加时间：">
                            <el-tooltip :content="detailsData.insertTime" placement="top-start" effect="light">
                                <el-input :disabled="true" v-model="detailsData.insertTime" placeholder="添加时间"></el-input>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div v-if="detailShow" class="class">
                    <p class="titletext">注意! 代收关系: </p>
                    <p> {{showtextdetail}}</p>
                </div>
            </el-form>
            <div slot="footer">
                <el-button @click="resetData">关闭</el-button>
                <!--        <el-button v-if="flag == 1" type="primary" @click="amendDatadeploy">保存</el-button>-->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import pages from "../../components/pages";
    import {Decrypt, Encrypt} from '../../uitls/crypto';
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    import {
        PAGE_STATION,
        PAGE_PLAZA,
        PAGE_LANE,
        BIND_FIND,
        BIND_ADD,
        BIND_DELETE,
        BIND_CONFIRM,
        BIND_PAGE
    } from '@/uitls/filenamme';

    export default {
        name: 'equipmentDeploy',
        data() {
            return {
                manufacturerList: [], // 厂商数据
                manufacturersList: [], // 添加厂商数据
                unitList: [], // 添加 设备型号数据
                softwareVersionList: [], // 软件版本
                stationIdList: [], // 收费站数组
                tollPlazaIdList: [], // 收费广场数组
                tollLaneIdList: [], // 收费车道数组
                tableData: [],//  表格数据
                deployVisible: false, // 部署
                addVisible: false, // 添加设备显示
                detailsVisible: false, //详情显示
                flag: 1,
                deployTitleName: '',
                // 表单数据
                formItem: {
                    equipmentNumber: '', // 设备编号
                    deviceStatus: '', // 设备状态
                    manufacturer: '', // 厂商
                },
                rules: {
                    deviceId: [
                        {required: true, message: '请输入设备编号', trigger: 'change'},
                    ],
                    seNo: [
                        {required: true, message: '必填项不能为空', trigger: 'change'},
                    ],


                },
                ruleLIst: {
                    tollLaneId: [
                        {required: true, message: '必填项不能为空', trigger: 'change'},
                    ],
                    province: [
                        {required: true, message: '必填项不能为空', trigger: 'change'},
                    ],
                    tollPlazaId: [
                        {required: true, message: '必填项不能为空', trigger: 'change'},
                    ],
                    stationId: [
                        {required: true, message: '必填项不能为空', trigger: 'change'},
                    ],
                },
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
                detailShow: false,
                showtextdetail: '',
                // 添加表单对象
                addEdit: {
                    deviceId: "", //	设备编号
                    seNo: '', //		设备se芯片编号
                },
                // 部署弹框
                deployAg: {
                    province: '',  // 省份
                    tollPlazaId: '', // 收费广场
                    stationId: '', // 收费车站
                    tollLaneId: '' // 收费车道
                },
                detailsList: {},
                showtextData: '', // 代收关系
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                show: false,
                showtext: '',
                deviceId: '', // 部署deviceId
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
            StatusChange(row) {
                // 部署状态
                this.refreshHandle()
            },
            changeProvince(val) {
                // 联动 省份
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    provinceId: val
                };
                _t.stationIdList = []; // 收费站数组
                _t.tollPlazaIdList = []; // 收费广场数组
                _t.tollLaneIdList = []; // 收费车道数组
                this.deployAg.stationId = '';// 收费车站
                this.deployAg.tollPlazaId = '';// 收费广场
                this.deployAg.tollLaneId = '';// 收费车道
                var filename = PAGE_STATION + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    _t.stationIdList = JSON.parse(res.bizContent).data
                    // console.log(_t.stationIdList, '123');
                })
            },
            changeTollPlazaId(val) {
                // 收费广场
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    plazaId: val
                }
                _t.tollLaneIdList = []; // 收费车道数组
                this.deployAg.tollLaneId = '';// 收费车道
                var filename = PAGE_LANE + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    _t.tollLaneIdList = JSON.parse(res.bizContent).data
                })
            },
            changeStationIdLIst(val) {
                var _t = this;
                var data = {}
                _t.stationIdList.forEach(item => {
                    if (item.stationId == val) {
                        data = item
                    }
                })
                if (data.hasAgency) {
                    _t.show = true;
                    _t.showtextData = data.gantrys
                    _t.showtext = data.gantrys.replace("|", ";  ");
                } else {
                    _t.show = false;
                    _t.showtext = '';
                    return
                }
            },
            changeStationId(val) {
                // 收费车站
                var _t = this;

                _t.changeStationIdLIst(val);
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    stationId: val
                };
                _t.tollPlazaIdList = []; // 收费广场数组
                _t.tollLaneIdList = []; // 收费车道数组
                this.deployAg.tollPlazaId = '';// 收费广场
                this.deployAg.tollLaneId = '';// 收费车道
                var filename = PAGE_PLAZA + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    _t.tollPlazaIdList = JSON.parse(res.bizContent).data
                })
            },
            details(row) {
                // 详情
                this.detailsVisible = true;
                var _t = this;
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    seNo: row.seNo, //	省份编号
                    deviceId: row.deviceId
                };
                var filename = BIND_FIND + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    _t.detailsList = JSON.parse(res.bizContent)

                    if (JSON.parse(res.bizContent).agencyGantrys) {
                        _t.detailShow = true;
                        _t.showtextdetail = JSON.parse(res.bizContent).agencyGantrys.replace("|", ";  ")
                    } else {
                        _t.detailShow = false;
                        _t.showtextdetail = '';
                    }

                    _t.detailsData.deviceId = _t.detailsList.deviceId; //	设备编号
                    _t.detailsData.factory = _t.detailsList.factory; //	设备厂商
                    _t.detailsData.status = _t.detailsList.status; //	设备状态
                    _t.detailsData.model = _t.detailsList.model; //设备型号
                    _t.detailsData.seNo = _t.detailsList.seNo; //	设备se芯片编号
                    _t.detailsData.stationId = _t.detailsList.stationName;//	收费站编号
                    _t.detailsData.tollPlazaId = _t.detailsList.tollPlazaName;//	收费广场编号
                    _t.detailsData.tollLaneId = _t.detailsList.tollLaneId;//	收费车道编号
                    _t.detailsData.sysVersion = _t.detailsList.sysVersion; //	系统版本号
                    _t.detailsData.hardVersion = _t.detailsList.hardVersion;//	硬件版本号
                    _t.detailsData.appVersion = _t.detailsList.appVersion; //	App版本号
                    _t.detailsData.openId = _t.detailsList.openId; //	操作人id
                    _t.detailsData.insertTime = _t.detailsList.insertTime.replace("T", " "); //	插入时间
                    _t.detailsData.updateTime = _t.detailsList.updateTime; //	更新时间
                })


            },
            amendDatadeploy() {
                // 部署功能保存
                var _t = this;
                _t.$refs.deployFlag.validate((valid) => {
                    if (valid) {
                        var _t = this
                        const params = {
                            deviceId: this.deviceId,
                            stationId: _t.deployAg.stationId, // 收费车站
                            province: _t.deployAg.province, // 省份
                            tollPlazaId: _t.deployAg.tollPlazaId,// 收费广场
                            tollLaneId: _t.deployAg.tollLaneId, // 收费车道
                            agencyGantrys: _t.showtextData, // 代收关系
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                        };
                        var filename = BIND_ADD + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.alertDialogTip(_t, res.errorMsg)
                                _t.refreshHandle();
                                _t.resetFlag();
                                _t.deployVisible = false;
                                _t.show = false;
                                _t.showtext = ''
                            }
                        })
                    }
                })

            },
            clearCache() {
                // 清除数据
                this.flag = 1;
                this.show = false;
                this.deployAg.stationId = '';// 收费车站
                this.deployAg.province = ''; // 省份
                this.deployAg.tollPlazaId = '';// 收费广场
                this.deployAg.tollLaneId = '';// 收费车道
                this.addEdit.deviceId = ''; //	设备编号
                this.addEdit.seNo = ''; //		设备se芯片编号
            },
            deploy(row) {
                // 部署功能
                this.flag = 1;
                this.deployVisible = true;
                this.deployTitleName = "部署";
                this.deviceId = row.deviceId
                this.deployAg.stationId = '';// 收费车站
                this.deployAg.province = ''; // 省份
                this.deployAg.tollPlazaId = '';// 收费广场
                this.deployAg.tollLaneId = '';// 收费车道
            },
            redeploy(row) {
                // 停用
                var _t = this;

                this.$confirm('此操作将取消部署, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        provinceId: row.provinceId, //	省份编号
                        deviceId: row.deviceId, //	设备编号
                        stationId: row.stationId, //	收费站编号
                        tollPlazaId: row.tollPlazaId, //	收费广场编号
                        tollLaneId: row.tollLaneId, //	收费车道编号
                        accessToken: _t.$cookie.get('accessToken'),
                        openId: _t.$cookie.get('openId'),
                    };
                    var filename = BIND_DELETE + getDataTime() + '.json';
                    var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                    _t.$api.post('api/json', data, function (res) {
                        if (res.statusCode == 0) {
                            _t.refreshHandle();
                            _t.deployVisible = false;
                            _t.$message({
                                offset: 200,
                                type: 'success',
                                message: '取消部署成功!'
                            });
                        } else {
                            _t.alertDialogTip(_t, res.errorMsg)
                        }
                    });
                }).catch(() => {
                    _t.$message({
                        type: 'info',
                        offset: 200,
                        message: '取消成功'
                    });
                });

            },
            resetData () {
                this.addVisible = false;
                this.deployVisible = false;
                this.detailsVisible = false;
                this.flag = 1;
                this.show = false;
                this.deployAg.stationId = '';// 收费车站
                this.deployAg.province = ''; // 省份
                this.deployAg.tollPlazaId = '';// 收费广场
                this.deployAg.tollLaneId = '';// 收费车道
            },
            resetCode() {
                // 取消功能
                this.addVisible = false;
                this.deployVisible = false;
                this.detailsVisible = false;
                this.flag = 1;
                this.show = false;
                this.deployAg.stationId = '';// 收费车站
                this.deployAg.province = ''; // 省份
                this.deployAg.tollPlazaId = '';// 收费广场
                this.deployAg.tollLaneId = '';// 收费车道

                this.resetForm('addList'); // 清除验证
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            resetFlag() {
                // 部署取消
                this.addVisible = false;
                this.deployVisible = false;
                this.detailsVisible = false;
                this.deployAg.stationId = '';// 收费车站
                this.deployAg.province = ''; // 省份
                this.deployAg.tollPlazaId = '';// 收费广场
                this.deployAg.tollLaneId = '';// 收费车道
                this.flag = 1;
                this.show = false;
                this.resetForm('deployFlag'); // 清除验证
            },
            resetHandle() {
                // 重置
                this.formItem.equipmentNumber = '';
                this.formItem.state = '';
                this.formItem.deviceStatus = '';
                this.formItem.manufacturer = '';
                this.refreshHandle()
            },
            setAddHandle() {
                // 添加功能
                this.addVisible = true;
            },
            amendData() {
                // 添加保存
                var _t = this;
                _t.$refs.addList.validate((valid) => {
                    if (valid) {
                        const seNoData = _t.addEdit.deviceId.split('@')[1]
                        const params = {
                            accessToken: _t.$cookie.get('accessToken'),
                            openId: _t.$cookie.get('openId'),
                            deviceId: _t.addEdit.deviceId, //	设备编号
                            seNo: seNoData, //		设备se芯片编号
                        };
                        var filename = BIND_CONFIRM + getDataTime() + '.json';
                        var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                        _t.$api.post('api/json', data, function (res) {
                            if (res.statusCode == 0) {
                                _t.addVisible = false;
                                _t.stationIdList = JSON.parse(res.bizContent).data;
                                _t.alertDialogTip(_t, res.errorMsg)
                                _t.refreshHandle();
                                _t.clearCache();
                            } else {
                                _t.alertDialogTip(_t, res.errorMsg)
                                _t.clearCache();
                            }
                        })
                    }
                })

            },
            refreshHandle() {
                // 查询功能
                var _t = this
                const params = {
                    deviceId: _t.formItem.equipmentNumber,
                    seNo: _t.formItem.state,
                    status: _t.formItem.deviceStatus,
                    factory: _t.formItem.manufacturer,
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                    pageNo: _t.options.currentPage, // 当前页
                    pageSize: _t.options.pageSize, // 显示条数
                };

                var filename = BIND_PAGE + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        setTimeout(() => {
                            _t.$store.commit('set_loading', false);
                        }, 800);
                        _t.tableData = JSON.parse(res.bizContent).data
                        var pages = JSON.parse(res.bizContent).totalCount
                        // console.log(JSON.parse(res.bizContent), '123');
                        _t.options.total = pages ? pages : 0;
                    }else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }

                })
            },
            importHandle() {
                // 批量导入
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
    .titletext:before {
        content: '*';
        color: red;
        margin-right: 5px;
    }

    .titletext {
        color: red;
        font-size: 12px;
    }
</style>
