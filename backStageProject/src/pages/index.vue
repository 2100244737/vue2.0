<template>
    <div class="view">
        <div class="content">
            <nav class="nav">
                <NavMenu class="NavMenu"/>
            </nav>
            <div class="right">
                <header class="header">
                    <div class="headertitle">
                        <Breadcrumb v-if="showBreadcrumbl"></Breadcrumb>
                    </div>
                    <div class="headerview loginlogo">
                        <el-dropdown @command="handleCommand">
                            <div>
                                <img class="loginlogo" src="../assets/img/Avatar.png" alt="">
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="out">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                          <div class="picker">
                              <el-tooltip :content="allText? '全屏模式':'普通模式'">
                                  <img  v-if="showfull" :src="fullImg?fullAll1:fullAll2" class="fullAll" @click="buttoncli"
                                       alt="全屏">
                              </el-tooltip>
                              <lang></lang>
                          </div>

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
                        <keep-alive v-if="isRouterAlive" :include="cached">
                            <router-view></router-view>
                        </keep-alive>
                    </div>
                </div>
                <!--        <footer class="footer">底部</footer>-->
            </div>
        </div>
         <div class="set">
             <div @click="setData" class="setImg">
                 <i v-if="drawer" class="el-icon-close  setIcon"></i>
                 <i v-else class=" el-icon-setting setIcon"></i>
             </div>
             <el-drawer
                 title="我是标题"
                 size="307px"
                 :visible.sync="drawer"
                 :with-header="false">
                 <div class="drawerContent">
                      <h2>系统布局配置</h2>
                       <div class="setPicker">
                           <span>主题色</span>
                           <ThemePicker></ThemePicker>
                       </div>
                       <div class="setfull">
                           <span>是否显示全屏功能</span>
                           <el-switch
                               v-model="showfull"
                               active-color="#13ce66"
                               inactive-color="#ddd">
                           </el-switch>
                       </div>
                     <div class="setfull">
                           <span>是否显示Breadcrumb功能</span>
                           <el-switch
                               v-model="showBreadcrumbl"
                               active-color="#13ce66"
                               inactive-color="#ddd">
                           </el-switch>
                       </div>
                     <div class="copyright">
                         <div class="logo">
                             Copyright
                             <span>©北京数软科技有限公司 版权所有</span>
                         </div>
                         <p>经营理念：诚信·务实·高效·至上·高端</p>
                         <p class="text">我们只是喜欢互联网的一群人,为互联网创建内容</p>
                         <p>地址：<span>北京市海淀区黑泉路12号康健宝盛广场B座8层</span></p>
                         <p>邮箱：<span>datasw@datasw.cn</span></p>
                         <p>版本 <span>1.0.0.1</span></p>
                     </div>
                 </div>
             </el-drawer>
         </div>
    </div>
</template>

<script>
    //  侧边栏组件
    import NavMenu from "../components/NavMenu";
    import ThemePicker from "../components/ThemePicker";
    import screenfull from "screenfull";
    import Breadcrumb from '../components/Breadcrumb'
    import lang from "../components/lang";
    import {getDataTime} from '@/assets/js/time' // 获取当前时间
    import {USER_LOGOUT} from '@/uitls/filenamme';

    export default {
        name: 'index',
        data() {
            return {
                isRouterAlive: true,
                showBreadcrumbl: true, // 面包屑导航
                showfull: false, // 显示全屏
                allText: true,
                fullImg: true,// 全屏 背景图
                fullAll1: require('.././assets/img/all1.png'),
                fullAll2: require('.././assets/img/all.png'),
                drawer: false, // 设置
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
            NavMenu,
            ThemePicker,
            Breadcrumb,
            lang
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
            setData () {
                // 设置
                this.drawer =  !this.drawer;
            },
            buttoncli() {
                // 需要注意的是 如果判断!screenfull.enabled 显示的是不支持全屏的话 是因为谷歌的版本问题  判断改为 !screenfull.isEnabled  就可以了
                if (!screenfull.isEnabled) {
                    this.$message({
                        message: '该浏览器版本不支持全屏！',
                        type: 'warning'
                    })
                    return false
                } else {
                    this.fullImg = !this.fullImg
                    this.allText = !this.allText
                    screenfull.toggle()
                }
            },
            handleCommand (command) {
                if (command == 'out') {
                    this.loginOut()
                }

            },
            handleClose () {
                this.drawer = false;
            },
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
                 _t.cached.push(path);
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
                //退出
                _t.$router.push('/login')
                _t.$cookie.delete('openId');
                _t.$store.state.options = [];
                _t.$store.state.activeIndex = '';

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
    .picker {
        width: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 20px;
    }
    /deep/ :focus{

        outline:0;

    }
    .fullAll{
        width: 30px;
        cursor: pointer;
        height: 30px;
        margin-right: 25px;
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

    /deep/ .el-tabs  .el-tabs__item:first-child .el-icon-close:before {
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
        height: 77px;
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
        overflow-y: auto;
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
   .setIcon {
       display: inline-block;
       font-size: 30px;
       color: #eef1f6;
   }
    .header .headerview {
        display: flex;
        align-items: center;
        padding-right: 20px;
        padding-top: 10px;
        flex-direction: row-reverse;
    }
     .setImg {
        position: fixed;
         right: 0;
         top: 45%;
         width: 50px;
         height: 50px;
         display: flex;
         justify-content: center;
         align-items: center;
         background: var(--bck);
         z-index: 33008;
         border-bottom-left-radius: 20px;
         border-top-left-radius: 20px;
         cursor:pointer
     }
    .header .headerview .loginlogo {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-right: -10px;
    }
    .drawerContent {
        padding-top: 30px;
        padding-left:30px;
        margin-right: 30px;
    }
   .copyright {
       position: absolute;
       bottom: 0;
       left: 0;
       right: 0;
       color: #fff;
       width: 310px;
       background: #324157;
       padding-left: 12px;
       padding-top: 10px;
   }
   .setPicker, .setfull {
       display: flex;
       justify-content: space-between;
       align-items: center;
       margin-top: 20px;
       font-size: 16px;
   }
    .copyright .text {
        color: #409EFF;
    }
    /deep/.el-drawer {
        z-index: 300000;
    }
</style>
