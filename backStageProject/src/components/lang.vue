<template>
    <div class="lang">
        <el-dropdown @command="handleCommand">
            <div>
                <img src="../assets/img/lang.png" alt="语言">
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="zh">中文</el-dropdown-item>
                <el-dropdown-item command="en">英文</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    export default {
        name: "lang",
        data() {
            return {}
        },
        components: {},
        mounted() {
        },
        methods: {
            handleCommand (val) {
                localStorage.setItem('locale',val);
                this.$i18n.locale = val;
            },

            getData() {
                // 查询
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped>
    .lang{
        width: 30px;
        cursor: pointer;
       display: flex;
        align-items: center;
        margin-right: 25px;
        margin-top: 5px;
    }
    .lang img {
        width: 100%;
        height: 100%;
    }
</style>
