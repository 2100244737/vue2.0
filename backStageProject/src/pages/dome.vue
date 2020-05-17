<template>
    <div class="view">
        <el-table
            :data="tableData"
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
    </div>
</template>

<script>
    //  侧边栏组件
    import NavMenu from "../components/NavMenu";
    import {getDataTime} from "../assets/js/time";

    export default {
        name: 'index',
        data() {
            return {
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
        components: {
            NavMenu
        },
        computed: {
            options() {
                this.cached = [];
                this.$store.state.options.forEach(item => {
                    this.cached.push(item.name)
                });
                return this.$store.state.options;
            },
            activeIndex: {
                get() {
                    return this.$store.state.activeIndex;
                },
                set(val) {
                    this.$store.commit('set_active_index', val);
                }
            }
        },
        watch: {
            $route(to, from) {
                var _t = this;
                let flag = false;
                for (var option of _t.options) {
                    if (option.name === to.name) {
                        flag = true;
                        _t.$store.commit('set_active_index', to.name);
                        break;
                    }
                }
                if (!flag) {
                    _t.$store.commit('add_tabs', {
                        route: to.path,
                        title: to.meta.title,
                        name: to.name
                    });
                    _t.$store.commit('set_active_index', to.name);
                }
            },
        },
        methods: {
            enter(index) {
                this.isActive = true;
                this.current = index
            },
            leave(index) {
                this.isActive = false;
                this.current = index
            },
            tabClick(tab) {
                // tab切换时，动态的切换路由
                var _t = this;
                if (tab.name !== _t.$route.name) {
                    _t.$router.push({name: _t.activeIndex});
                }
            },
            // 删除页签
            tabRemove(path) {
                var _t = this;
                // 首页不可删除
                if (path === 'index') {
                    return;
                }
                this.cached.forEach((item, index) => {
                    if (item == path) {
                        this.cached.splice(index, 1)
                    }
                });
                // _t.cached.push(path);
                // 删除当前页签
                _t.$store.commit('delete_tabs', path);
                _t.routePath = path;
                // 判断是否删除当前 若是:激活前一项
                if (_t.activeIndex === path) {
                    // 设置当前激活的路由
                    if (_t.options && _t.options.length >= 1) {
                        _t.$store.commit('set_active_index', _t.options[_t.options.length - 1].name);
                        _t.$router.push({name: _t.activeIndex});
                    } else {
                        _t.$router.push({name: 'index'});
                    }
                }
            },
            loginOut() {
                // 退出
                // this.$cookie.delete('openId');
                this.$router.push('/login')
                this.$store.state.options = [];
                this.$store.state.activeIndex = '';

            },
        },
        created() {
            this.$store.state.options = [];
            this.$store.state.activeIndex = '';
        }

    }
</script>

<style scoped>
   .left h3  {
        display: inline-block;
        transition: width 1s;
        font-size:30px;
        -webkit-transition: width 1s; /* Safari */
    }
     h3 {

     }
    .active {

        position: relative;
        top: -5px;
        font-size: 40px;
        color: #1A98FF;
    }

    .el-tabs /deep/ .el-tabs__item:first-child /deep/ .el-icon-close:before {
        content: ''
    }

    .el-tabs--border-card > .el-tabs__header .el-tabs__item + .el-tabs__item, .el-tabs--border-card > /deep/ .el-tabs__header .el-tabs__item:first-child {
        /*// 标签页首页移动*/
        /*margin-left: -10px;*/
    }

    .el-tabs /deep/ .el-tabs__item {

    }

    /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
        /*标签页选中背景颜色*/
        background: #42b983;
        color: #ffffff;
    }

    .headerimg {
        margin-left: 5%;
        margin-right: 20px;
    }

    .headerimg .img {
        width: 50px;
        height: 50px;
    }

    .view {
        height: 100%;
        width: 100%;
    }
    .buttonBHox {
        display: flex;
        height: 100%;
        width: 100%;
    }
   .aside {
       height: 100%;
       background: red;
   }
    .main {
        /*width: 100%;*/
        /*height: 100%;*/
        /*padding: 20px;*/
        /*margin: 0;*/
        /*box-sizing: border-box;*/
        /*position: fixed;*/
        /*top: 70px;*/
        /*left: 181px;*/
        /*right: 30px;*/
        /*bottom: 30px;*/
        /*z-index: 10;*/
        height: 100%;
        width: 100%;
        overflow: auto;
    }

    .content {
        height: 100%;
        width: 100%;
        color: #333;
    }

    .navTitle {
        height: 60px;
        width: 100px;
        line-height: 60px;
        text-align: center;
        color: #888;
        font-size: 15px;
        font-weight: 700;
        background: #ffffff;
        border-right: 0.4px solid #ccc;
    }

    .NavMenu {
        flex: 1;
        width: 200px;
        height: 100%;
    }

    .header {
        display: flex;
        justify-content: space-between;
        border-bottom: 0.4px solid #cccccc;
    }
    .header .left {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
     }
    .header .headerview {
        margin-right: 8%;
        height: 100%;
        display: flex;
        align-items: center;
    }
     .headertitle {

     }
    .header .loginlogo {
        width: 70px;
        height: 70px;
        margin-right: 10px;
        border-radius: 50PX;
    }

    .template-tabs {
        height: 30px;
        margin-left: -1px;
    }


</style>
