<template>
  <div class="role">
    <div class="formBox-top">
      <el-form :model="formItem" label-width="70px" inline>
        <el-form-item class="marBottom7">
          <el-button type="primary"  icon="el-icon-plus" @click="setAddHandle">新增</el-button>
          <el-button type="primary"  icon="el-icon-refresh-left" @click="refreshHandle">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tableWp marginTop2">
      <el-table :data="tableData" border stripe >
        <el-table-column  type="index" width="80px" label="序号" header-align="center" align="center"/>
        <el-table-column prop="" label="单位" header-align="center" align="center"/>
        <el-table-column prop="" label="角色名称" header-align="center" align="center"/>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
<!--            <el-button  type="primary" @click="changeRoleBtn(scope.row)">修改</el-button>-->
<!--            <el-button  type="danger"  @click="deleteRole(scope.row)">删除</el-button>-->
            <el-button  type="primary"  @click="changeLimit(scope.row)">配置角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    添加弹框-->
    <el-dialog
      append-to-body
      :close-on-click-modal="true"
      :close-on-press-escape="false"
      :before-close="resetCode"
      :visible.sync="dialogVisible">
      <div slot="title" class="dialogTitle clearFix">
        <span class="title">{{dialogTitle}}</span>
      </div>
      <el-form :model="addEdit" ref="addEdit"  label-width="150px">
          <el-row :gutter="20">
              <el-col :span="12">
            <el-form-item label="类型：" >
              <el-select
                  clearable
                v-model="addEdit.type">
                <el-option
                  v-for="(item,index) in typeList"
                  :key="index"
                  :label="item"
                  :value="item"/>
              </el-select>
            </el-form-item>
            <el-form-item label="角色名称：" >
              <el-input  clearable v-model="addEdit.name" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位：" >
              <el-select
                  clearable
                v-model="addEdit.unit">
                <el-option
                  v-for="(item,index) in typeList"
                  :key="index"
                  :label="item"
                  :value="item"/>
              </el-select>
            </el-form-item>
            <el-form-item label="显示顺序：">
              <el-input  clearable type="number" v-model="addEdit.number" placeholder="显示顺序"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述：" class="textarea">
          <el-input
            class="textarea"
            type="textarea"
            placeholder="请输入内容"
            v-model="addEdit.textarea">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetCode">取消</el-button>
        <el-button v-if="isAdd === true" type="primary"  @click="addCodeData">保存</el-button>
        <el-button v-if="isAdd === false" type="primary"  @click="editCodeData">保存</el-button>
      </div>
    </el-dialog>
<!--    配置-->
    <el-dialog
      append-to-body
      :close-on-click-modal="true"
      :close-on-press-escape="false"
      :before-close="resetCode"
      :visible.sync="configurationVisible">
      <div slot="title" class="dialogTitle clearFix">
        <span class="title">配置角色</span>
      </div>
      <div class="tree">
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer">
        <el-button @click="resetCode">取消</el-button>
        <el-button type="primary"  @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {Debounce} from '@/uitls/Debounce'
export default {
  name: 'roleManagement',
  data(){
    return {
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
      formItem:{}, // 表单数据
      tableData:  [],//  表格数据
      typeList: [], // 添加类型数组
      dialogVisible: false, // 添加弹窗显示
      configurationVisible: false, // 配置弹窗显示
      isAdd: true,
      dialogTitle: '',
      // 添加修改弹窗
      addEdit: {
        type: '', // 类型
        name: '', // 名称
        unit: '', // 单位
        number: '',// 显示顺序
        textarea: '', // 描述
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

    created () {
        this.$store.commit('set_loading', true);
        setTimeout(() => {
            this.$store.commit('set_loading', false);
        }, 800);
      this.dome();
    },
  methods: {

      dome () {
          var old = this.tableData
          var hash = {};
          var i = 0;
          var res = [];
          old.forEach(function(item) {
              var name = item.date;
              hash[name] ? res[hash[name] - 1].address.push(item.address) : hash[name] = ++i && res.push({
                  address: [item.address],
                  name: [item.name],
                  data: item.date
              })

          });
      },
    resetCode() {
      // 添加取消按钮
      this.dialogVisible = false;
      this.configurationVisible = false;
    },
    setAddHandle() {
      // 添加功能
      this.dialogVisible = true;
      this.dialogTitle = "角色管理-添加"
    },
    editCodeData() {
      // 修改 保存功能
    } ,
    addCodeData() {
      // 添加 保存功能
    },
    refreshHandle: Debounce(function () {
        console.log(111);
    },800),
    changeLimit(row) {
      // 配置
      this.configurationVisible = true;
    },
    confirm() {
      // 配置角色保存
    },
    changeRoleBtn(row) {
      // 修改
    },
    deleteRole(row) {
      // 删除
      this.$confirm('你确定要删除此角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {
       return false
      });
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
  }

}
</script>

<style scoped>


</style>
