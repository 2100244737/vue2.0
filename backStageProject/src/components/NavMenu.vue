<template>
    <div class="navMenu">
        <el-menu
            :router="true"
            unique-opened
            :default-active="routerIndex"
            class="el-menu-vertical-demo"
            background-color="#324157"
            text-color="#fff">
            <el-menu-item index="/index">
                <template slot="title">
                    <i class="el-icon-s-home"></i>
                    <span>{{$t('route.home')}}</span>
                </template>
            </el-menu-item>
            <el-submenu  index="/system">
                <template slot="title">
                    <i class="el-icon-s-tools"></i>
                    <span>系统管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item  index="/system/roleManagement">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>角色管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/system/userManagement">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>用户管理</span>
                        </template>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu  index="/apply">
                <template slot="title">
                    <i class="el-icon-s-tools"></i>
                    <span>应用管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item  index="/apply/apply1">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>服务管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/apply/apply2">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>APP应用管理</span>
                        </template>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu  index="/dataAdministrator">
                <template slot="title">
                    <i class="el-icon-s-tools"></i>
                    <span>数据管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item  index="/dataAdministrator/liaisons">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>接口</span>
                        </template>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: 'NavMenu',
        data() {
            return {
                nvaBarList: [],
            }
        },
        computed: {
            routerIndex() {
                return this.$route.path
            }
        },
        mounted() {
            // 刷新时以当前路由做为tab加入tabs
            var _t = this;
            if (_t.$route.name !== 'index') {
                // 非首页且非详情页
                _t.$store.commit('add_tabs', {route: '/index', title: '首页', name: 'index'});
                _t.$store.commit('add_tabs', {
                    route: _t.$route.path,
                    title: _t.$route.meta.title,
                    name: _t.$route.name
                });
                _t.$store.commit('set_active_index', _t.$route.name);
            } else {
                // 首页
                _t.$store.commit('add_tabs', {route: '/index', title: '首页', name: 'index'});
                _t.$store.commit('set_active_index', 'index');
            }
        },
        methods: {
            getNavbar() {
                var list = this.$router.options.routes.filter((item) => {
                    return !item.hidden
                });
                this.nvaBarList = list;
            },
            menuList() {


            }
        },
        created() {
            this.$store.state.options = [];
            this.$store.state.activeIndex = '';
            this.menuList();
            this.getNavbar();

        }
    }
</script>

<style scoped="scoped">
    .navMenu {
        height: 100%;
        font-size: 15px;
        width: 100%;
        overflow: hidden;
    }

    .el-menu {
        border-right-width: 0;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        height: 100%;
    }
</style>
