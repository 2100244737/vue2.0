<template>
    <div class="navMenu">
        <el-menu
            :router="true"
            unique-opened
            :default-active="routerIndex"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff">
            <el-menu-item index="/index">
                <template slot="title">
                    <i class="el-icon-s-home"></i>
                    <span>首页</span>
                </template>
            </el-menu-item>
            <el-submenu v-if="system" index="/system">
                <template slot="title">
                    <i class="el-icon-s-tools"></i>
                    <span>系统管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-if="role" index="/system/roleManagement">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>角色管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item v-if="user" index="/system/userManagement">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>用户管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item v-if="logQuery" index="/system/logQuery">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>查询日志</span>
                        </template>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu v-if="device" index="/deviceManager">
                <template slot="title">
                    <i class="el-icon-s-tools"></i>
                    <span>设备管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-if="records" index="/deviceManager/equipment">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>设备备案</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item v-if="deploy" index="/deviceManager/equipmentDeploy">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>设备部署</span>
                        </template>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu v-if="queryPath"  index="/queryPath">
                <template slot="title">
                    <i class="el-icon-s-tools"></i>
                    <span>查询路径</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-if="query" index="/queryPath/pathQuery">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>路径查询</span>
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
                logQuery: false, // 查询日志
                system: false, // 系统管理
                role: false, // 角色管理
                user: false, // 角色管理
                device: false, // 设备管理
                deploy: false, // 设备部署
                records: false,
                queryPath: false, // 查询路径
                query: false, // 路径查询
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

                this.system = false;// 系统管理
                // 设备管理
                this.device = false;
                // 设备部署
                this.deploy = false;
                var menuList = JSON.parse(localStorage.getItem("MENU_LIST"));
                menuList.forEach((item, index) => {

                    if (item.parent == 'system') {
                        // 系统管理
                        this.system = true;
                    }
                    if (item.parent == 'device') {
                        // 设备管理
                        this.device = true;
                    }
                    if (item.url == 'device/deploy') {
                        // 设备部署
                        this.deploy = true;
                    }
                    if (item.url == 'system/role') {
                        // 角色管理
                        this.role = true;
                    }
                    if (item.url == 'system/user') {
                        // 用户管理
                        this.user = true;
                    }
                    if (item.url == 'system/log/') {
                        // 查询日志
                        this.logQuery = true;
                    }
                    if (item.url == 'device/manage') {
                        // 设备备案
                        this.records = true;
                    }
                    if (item.parent == 'map') {
                        // 查询路径
                        this.queryPath = true;
                    }
                    if (item.url == 'map/query/') {
                        // 路径查询
                        this.query = true;
                    }
                })
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
