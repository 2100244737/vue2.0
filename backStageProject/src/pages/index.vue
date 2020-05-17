<template>
    <div class="view">
        <div class="content">
            <nav class="nav">
                <div class="headerimg">
                    <img class="img" src="../assets/img/icon.png" alt="">
                </div>
                <NavMenu class="NavMenu"/>
            </nav>
            <div class="right">
                <header class="header">

                    <h3 class="headertitle">

                        <!--              互联网收费业务处理终端-->
                        <span v-bind:class="{active:isActive&&index==current}" v-for="(item, index) in text "
                              :key="index" @mouseenter="enter(index)" @mouseleave="leave(index)">{{item}}</span>
                    </h3>
                    <div class="headerview">
                        <el-button class="loginOut" type="primary" @click="loginOut">退出</el-button>
                        <el-dropdown>
                            <img class="loginlogo" src="../assets/img/icon.png" alt="">
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>用户名：{{username}}</el-dropdown-item>
                                <el-dropdown-item>手机号：{{phone}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>

                </header>
                <div>
                    <el-tabs
                        class="template-tabs"
                        v-model="activeIndex"
                        type="border-card"
                        closable
                        @tab-click="tabClick"
                        @tab-remove="tabRemove">
                        <el-tab-pane
                            :key="item.name"
                            v-for="(item, index) in options"
                            :label="item.title"
                            :name="item.name">
                        </el-tab-pane>
                    </el-tabs>
                </div>
                 <div   v-loading="loading"
                        element-loading-text="拼命加载中..."
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="#fff" class="main">
                     <div
                         class="main">
                         <router-view/>
                     </div>
                 </div>


                <!--        <footer class="footer">底部</footer>-->
            </div>

        </div>
    </div>
</template>

<script>
    //  侧边栏组件
    import NavMenu from "../components/NavMenu";
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    import {USER_LOGOUT} from '@/uitls/filenamme';

    export default {
        name: 'index',
        data() {
            return {
                username: this.$cookie.get('username'), // 用户名称
                phone: this.$cookie.get('phone'), // 手机号
                cached: [], // 缓存的组件
                routePath: '',
                isActive: false,
                current: 0,
                text: '联网收费业务处理终端运营管理系统'
            }
        },
        components: {
            NavMenu
        },
        computed: {
            loading () {
                return this.$store.state.loading
            },
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
                var _t = this;
                // 提交
                const params = {
                    accessToken: _t.$cookie.get('accessToken'),
                    openId: _t.$cookie.get('openId'),
                };
                var filename = USER_LOGOUT + getDataTime() + '.json';
                var data = this.changeData(params, filename, _t.$cookie.get('accessToken'));
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        _t.$router.push('/login')
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                })


                // 退出
                // this.$cookie.delete('openId');

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
    /deep/ .el-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    h3 span {
        display: inline-block;
        transition: width 1s;

        -webkit-transition: width 1s; /* Safari */
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
        border-radius: 5px;
    }

    .headerimg {
        /*color: #333;*/
        /*font-size: 18px;*/
        height: 80px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        /*line-height: 80px;*/
        /*font-weight: 700;*/
        text-align: center;
        /*border-bottom: 1px solid #999;*/
        /*border-right: 1px solid #ddd;*/
        /*background-color: #f0f0f0;*/
        /*box-shadow: 0 0 10px 5px #ccc inset*/
    }

    .headerimg .img {
        width: 50px;
        height: 50px;
    }

    .view {
        height: 100%;
        width: 100%;
        /*overflow: auto;*/
        /*background: #F0F2F5;*/
    }

    .main {
        /*width: 100%;*/
        /*height: 100%;*/
        /*padding: 20px;*/
        /*margin: 0;*/
        /*box-sizing: border-box;*/
        position: fixed;
        top: 138px;
        left: 215px;
        right: 30px;
        bottom: 30px;
        z-index: 10;
        overflow: auto;
    }

    .content {
        display: flex;
        height: 100%;
        width: 100%;
        color: #333;
    }

    .nav {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .nav .navTitle {
        height: 60px;
        width: 100px;
        line-height: 60px;
        text-align: center;
        color: #888;
        font-size: 15px;
        font-weight: 700;
        background: #ffffff;
        /*border-right: 0.4px solid #ccc;*/
    }

    .nav .NavMenu {
        flex: 1;
        width: 200px;
        /*max-width: 200px;*/
    }

    .right {
        width: 99%;
        height: 100%;
        overflow: hidden;
    }

    .header {
        margin-right: 5%;
        padding: 8.5px;
        /*border-bottom: 0.4px solid #cccccc;*/
    }

    .template-tabs {
        height: 30px;
        margin-left: -1px;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .headertitle {

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 30px;
        margin-left: 5px;
        margin-bottom: 0;
    }

    .header .headerview {
        display: flex;
        align-items: center;
        padding-right: 20px;
        padding-top: 10px;
        flex-direction: row-reverse;
    }

    .header .headerview .loginlogo {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        margin-right: 15px;
    }

    .footer {
        height: 30px;
        width: 100%;
        background: blue;
    }
</style>
