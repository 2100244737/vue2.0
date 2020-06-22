<template>
    <div>
        <div class="formBox-top">
            <el-form :model="formItem" label-width="90px" inline>
                <el-form-item>
                    <el-input clearable v-model="formItem.phoneNumber" placeholder="手机号"></el-input>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getData">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="addData">新增</el-button>
                    <el-button type="info" icon="el-icon-refresh-left" @click="resetHandle">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableWp marginTop2">
            <el-table :data="tableData" border stripe>
                <el-table-column prop="name" label="App名称" header-align="center" align="center"/>
                <el-table-column prop="enableIpCheck" label="是否启用原IP鉴权" header-align="center" align="center"/>
                <el-table-column prop="enableApiCheck" label="是否启用原API鉴权" header-align="center" align="center"/>
                <el-table-column prop="encryptType" label="是否启用加密" header-align="center" align="center"/>
                <el-table-column prop="signType" label="签名方式" header-align="center" align="center"/>
                <el-table-column prop="status" label="状态" header-align="center" align="center"/>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="detailsHandle(scope.row)">详情</el-button>
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
        <!--        详情-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="detailsVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">详情</span>
            </div>
            <el-form :model="addEdit" label-width="150px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="App名称：">
                            <el-input clearable v-model="addEdit.name" placeholder="App名称"></el-input>
                        </el-form-item>
                        <el-form-item label="是否启用原IP鉴权：">
                            <el-input clearable v-model="addEdit.enableIpCheck" placeholder="是否启用原IP鉴权"></el-input>
                        </el-form-item>
                        <el-form-item label="是否启用原API鉴权：">
                            <el-input clearable v-model="addEdit.enableApiCheck" placeholder="是否启用原API鉴权"></el-input>
                        </el-form-item>
                        <el-form-item label="是否启用加密：">
                            <el-input clearable v-model="addEdit.encryptType" placeholder="是否启用加密"></el-input>
                        </el-form-item>
                        <el-form-item label="签名方式：">
                            <el-input clearable v-model="addEdit.signType" placeholder="签名方式"></el-input>
                        </el-form-item>
                        <el-form-item label="平台私钥：">
                            <el-input clearable v-model="addEdit.platformPriKey" placeholder="平台私钥"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否启用加密：">
                            <el-input clearable v-model="addEdit.encryptType" placeholder="是否启用加密"></el-input>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <el-input clearable v-model="addEdit.status" placeholder="状态"></el-input>
                        </el-form-item>
                        <el-form-item label="App密钥：">
                            <el-input clearable v-model="addEdit.secret" placeholder="App密钥"></el-input>
                        </el-form-item>
                        <el-form-item label="Key密钥：">
                            <el-input clearable v-model="addEdit.aesKey" placeholder="Key密钥"></el-input>
                        </el-form-item>
                        <el-form-item label="app公钥：">
                            <el-input clearable v-model="addEdit.publicKey" placeholder="app公钥"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer">
                <el-button @click="resetCode">关闭</el-button>
            </div>
        </el-dialog>
<!--        新增-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="addVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">新增</span>
            </div>
            <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps">
            </el-tree>
            <div slot="footer">
                <el-button @click="resetCode">取消</el-button>
                <el-button type="primary" @click="addSave">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import pages from "../../components/pages"; // 分页
    export default {
        name: "apply1",
        data() {
            return {
                tableData: [],//  表格数据
                detailsVisible: false,
                addVisible: false, // 新增弹框
                data: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                // 表单数据
                addEdit: {
                    secret: '',   //App密钥
                    name:  '',     //App名称
                    aesKey:  '',   //Key密钥
                    publicKey:  '',//app公钥
                    platformPriKey:  '',//平台私钥
                    platformPubKey:  '',//平台公钥
                    status:  '',//状态
                    enableIpCheck:  '',//是否启用原IP鉴权
                    enableApiCheck:  '',//是否启用原API鉴权
                    encryptType:  '',//是否启用加密
                    signType:  '',//签名方式
                },
                formItem: {
                    phoneNumber: '', // 手机号
                    nickname: '', // 昵称
                    user: '', // 角色
                    cellPhone: '', // 手机号
                    extendompetence: [], // 权限范围
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
            addData () {
                // 新增
                this.addVisible = true;
            },
            addSave () {
               // 新增保存
                this.addVisible = false;
            },
            resetCode() {
                // 取消对话框
                this.detailsVisible = false;
                // 新增
                this.addVisible = false;
            },
            getData() {
                // 查询
                this.detailsVisible = true;
            },
            detailsHandle() {
                // 详情
            },
            resetHandle() {
                //重置

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
            this.$store.commit('set_loading', false);
            setTimeout(() => {
                this.$store.commit('set_loading', false);
            }, 800);
        }
    }
</script>

<style scoped>

</style>
