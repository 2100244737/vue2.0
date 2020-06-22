<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <el-breadcrumb-item  :to="{ path: '/index' }"><span class="home">首页</span></el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in getBreadcrumb" :key="index">{{item.meta.title}}
            </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
    export default {
        name: "Breadcrumb",
        data() {
            return {
                // getBreadcrumb: []
            }
        },
        components: {},
        computed: {
            getBreadcrumb() {
                return this.$route.matched.filter(item => item.meta && item.meta.title && item.meta.title !== '首页');
            }
        },
        watch: {
            $route(to, from) {
                // this.getBreadcrumb =

            }
        },
        mounted() {
        },
        methods: {
            getData() {
                // 查询
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped lang="scss">

    .app-breadcrumb  {
        display: inline-block;
        font-size: 16px;
        margin-left: 8px;
    }
.home {
    font-weight: 600;
}

</style>
