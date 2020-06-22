<template>
    <div class="login-container">
        <el-form ref="loginForm" :rules="rules" :model="loginForm" class="login-form width" autocomplete="on"
                 label-position="left">
            <div class="title-container">
                <h3 class="title">用户登录</h3>
            </div>
            <el-form-item prop="username">
                <el-input
                    id="username"
                    ref="username"
                    clearable
                    prefix-icon="el-icon-user-solid"
                    v-model="loginForm.username"
                    placeholder="请输入手机号"
                    maxlength="11"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                />
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    @keyup.enter.native="handleLogin"
                    ref="password"
                    type="password"
                    prefix-icon="el-icon-lock"
                    v-model="loginForm.password"
                    placeholder="请输入密码"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;margin-bottom:30px;"
                           @click.native.prevent="handleLogin">登录
                </el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    import {loginfile, getCodefile} from '@/uitls/filenamme';
    import {getDataTime} from '@/assets/js/time'

    export default {
        name: 'loginindex',
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: 'admin',
                    openId: '',
                    accessToken: '',
                },
                btnShow: true, // 获取验证码
                counts: 0,
                timer: null,
                // 表单验证
                rules: {
                    username: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted() {
            // input 聚焦
            const username = document.getElementById('username')
            username.focus()
        },
        methods: {
            clearCache() {
                // 清除数据
            },
            changeinput(val) {
                val = val.replace(/(^\s*)|(\s*$)/g, "")
                if (!val) {
                    this.loginForm.password = "";
                    return
                }
                var reg = /[^\d.]/g

                // 只能是数字和小数点，不能是其他输入
                val = val.replace(reg, "")

                // 保证第一位只能是数字，不能是点
                val = val.replace(/^\./g, "");
                // 小数只能出现1位
                val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                // 小数点后面保留2位
                val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

                this.loginForm.password = val;
            },
            handleLogin() {
                var _t = this;
                _t.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        // 提交
                        _t.$router.push("/index");
                    } else {
                        return false;
                    }
                });
            },
        },
        created() {
            this.$cookie.delete('openId');
            this.$cookie.delete('accessToken');
            this.$cookie.delete('phone');
            this.$cookie.delete('username');
            this.$cookie.delete('roleName');
            localStorage.removeItem("MENU_LIST");
        }
    }
</script>

<style scoped>

    .title-container {
        color: #333;
        font-size: 20px;
        margin-bottom: 10px;
    }

    .login-container {
        display: flex;
        flex-direction:row-reverse;
        box-sizing: border-box;
        padding-top: 10%;
        padding-right: 10%;
        width: 100%;
        height: 100%;
        background: url("../assets/img/login.jpg") no-repeat;
        background-size: 100% 100%;

    }

    .login-form {
        margin-top: 20px;
        width: 350px;
        height: 230px;
        max-width: 350px;
        min-width: 300px;
        padding: 20px;
        border-radius: 8px;
        background:hsla(0 ,0% ,100%,.3);
        /*opacity: .8;*/
        /*box-shadow: 0 0 10px -1px #ccc inset*/
    }

    .width {

    }
</style>
