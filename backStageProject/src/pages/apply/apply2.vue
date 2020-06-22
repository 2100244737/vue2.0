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
                <el-table-column prop="serviceId" label="系统ID" header-align="center" align="center"/>
                <el-table-column prop="serviceName" label="系统名称" header-align="center" align="center"/>
                <el-table-column prop="apiTypeName" label="服务类型枚举中文名称" header-align="center" align="center"/>
                <el-table-column prop="apiStatus" label="状态" header-align="center" align="center"/>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="detailsHandle(scope.row)">详情</el-button>
                        <el-button type="primary" @click="configureRoles(scope.row)">配置角色</el-button>
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
            <el-form :model="addEdit" label-width="170px">
                <el-form-item label="系统ID：">
                    <el-input clearable v-model="addEdit.serviceId" placeholder="系统ID"></el-input>
                </el-form-item>
                <el-form-item label="系统名称：">
                    <el-input clearable v-model="addEdit.serviceName" placeholder="系统名称"></el-input>
                </el-form-item>
                <el-form-item label="服务类型：">
                    <el-input clearable v-model="addEdit.apiType" placeholder="服务类型"></el-input>
                </el-form-item>
                <el-form-item label="服务类型枚举中文名称：">
                    <el-input clearable v-model="addEdit.apiTypeName" placeholder="服务类型枚举中文名称"></el-input>
                </el-form-item>
                <el-form-item label="命令枚举：">
                    <el-input clearable v-model="addEdit.cmd" placeholder="命令枚举"></el-input>
                </el-form-item>
                <el-form-item label="命令枚举中文名称：">
                    <el-input clearable v-model="addEdit.cmdName" placeholder="命令枚举中文名称"></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-input clearable v-model="addEdit.apiStatus" placeholder="状态"></el-input>
                </el-form-item>
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
                    :data="treeData"
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
<!--        配置角色-->
        <el-dialog
            append-to-body
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :before-close="resetCode"
            :visible.sync="configureRolesVisible">
            <div slot="title" class="dialogTitle clearFix">
                <span class="title">配置角色</span>
            </div>
            <div class="treeTag">
                <div class="tree">
                    <el-tree
                        ref="tree"
                        :data="treeData"
                        show-checkbox
                        node-key="label"
                        @check-change="changehandle"
                        :props="defaultProps">
                    </el-tree>
                </div>
                <el-card class="tag">
                    <div class="box">
                        <el-tag
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)"
                            v-for="(tag, index) in tagList"
                            :key="tag">
                            {{tag}}
                        </el-tag>
                    </div>

                </el-card>
            </div>

            <div slot="footer">
                <el-button @click="resetCode">取消</el-button>
                <el-button type="primary" @click="RolesSave">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import pages from "../../components/pages"; // 分页
    export default {
        name: "apply2",
        data() {
            return {
                tableData: [{}],//  表格数据
                detailsVisible: false,
                addVisible: false, // 新增弹框
                configureRolesVisible: false, // 配置角色
                tagList: ['二级 2-1'],
                treeData: [{
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
                    // 详情对话框
                    serviceId: '',//系统ID
                    serviceName: '',//系统名称
                    apiType: '',//服务类型
                    apiTypeName: '',//服务类型枚举中文名称
                    cmd: '',//命令枚举
                    cmdName: '',//命令枚举中文名称
                    apiStatus: '',//状态
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
        watch: {

        },
        methods: {
            configureRoles (row) {
                // 配置角色
                this.configureRolesVisible = true;
                // 获取 tree 节点
                this.getNodeTree()
            },
            getNodeTree () {
                // this.$nextTick(function () {
                //     this.tagList =this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
                //     console.log(this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()),'123');
                // })
                this.$nextTick(function () {
                    this.tagList.forEach(item => {
                        // this.$refs.tree.setCurrentKey(item)
                        this.$refs.tree.setChecked(item,true,false)
                    })
                })
            },
            changehandle () {
                this.tagList = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
            },

            handleClose(tag) {
                this.tagList.splice(this.tagList.indexOf(tag), 1);
                this.$refs.tree.setCheckedKeys([])
                this.tagList.forEach( item => {
                    this.$refs.tree.setChecked(item,true,false)
                })
                this.$nextTick(function () {


                })
            },
            RolesSave () {
               // 配置角色保存
            },
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
                // 配置角色
                this.configureRolesVisible = false;
                this.$refs.tree.setCheckedKeys([])
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
            this.$store.commit('set_loading', false);
            setTimeout(() => {
                this.$store.commit('set_loading', false);
            }, 800);
        }
    }
</script>

<style scoped>
  .treeTag {
      display: flex;

  }
  .el-tag {
      margin-right: 20px;
      margin-bottom: 10px;
  }
    .tree {
        width: 40%;
    }
    .box {
        display: flex;
        flex-wrap:wrap;
    }
    .tag {

        width: 60%;
    }
</style>
