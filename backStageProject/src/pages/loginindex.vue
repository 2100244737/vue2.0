<template>
    <div  class="login-container">
        <div class="box">
            <div ref="add" class="IMgheader">
                <img class="img" src="../assets/img/logo.png" alt="">
            </div>
            <el-form  ref="loginForm" :rules="rules" :model="loginForm" class="login-form width" autocomplete="on"
                     label-position="left">
                <div class="title-container">
                    <h3 class="title">用户登录</h3>
                </div>
                <el-form-item prop="username">
                    <el-input
                        id="username"
                        ref="username"
                        autofocus
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
                    <div class="inputBtn">
                        <el-input
                            @keyup.enter.native="handleLogin"
                            ref="password"
                            prefix-icon="el-icon-lock"
                            maxlength="6"
                            @input="changeinput(loginForm.password)"
                            v-model="loginForm.password" type="text"
                            placeholder="请输入验证码"
                            name="password"
                            tabindex="2"
                            autocomplete="on"
                        />
                        <el-button class="btn" v-if="btnShow" type="primary" @click.native.prevent="handleCode">获取验证码
                        </el-button>
                        <el-button class="btn" v-else type="primary">{{counts}} s后重试</el-button>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录
                    </el-button>
                </el-form-item>

            </el-form>
        </div>

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
                    username: '',
                    password: '',
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
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
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
            toHome() {
                var _t = this;
                const params = {
                    mobile: _t.loginForm.username, // 用户名
                    code: _t.loginForm.password
                };
                // const sha256 = require("js-sha256").sha256; //引入sha256库
                // var src = JSON.stringify(params)
                const token = 'chinaetcorg'
                var filename = loginfile + getDataTime() + '.json';
                var data = _t.changeData(params, filename,token);
                _t.$api.post('api/json', data, function (res) {
                    if (res.statusCode == 0) {
                        var menuList = JSON.parse(res.bizContent).menus
                        localStorage.setItem("MENU_LIST", JSON.stringify(menuList));
                        _t.$message({
                            message: '登录成功！',
                            offset: 200,
                            type: 'success'
                        });
                        _t.loginForm.openId = JSON.parse(res.bizContent).openId;
                        _t.loginForm.accessToken = JSON.parse(res.bizContent).accessToken;
                       const mobile = JSON.parse(res.bizContent).mobile;
                       const name = JSON.parse(res.bizContent).name;
                       const roleName = JSON.parse(res.bizContent).roleName?JSON.parse(res.bizContent).roleName: '';

                         _t.$router.push("/index");
                        _t.$cookie.set('openId', _t.loginForm.openId);
                        _t.$cookie.set('accessToken', _t.loginForm.accessToken);
                        _t.$cookie.set('username', name); // 用户名
                        _t.$cookie.set('phone', mobile); // 手机号
                        _t.$cookie.set('roleName', roleName); // 角色
                    } else {
                        _t.alertDialogTip(_t, res.errorMsg)
                    }
                })

            },
            handleCode() {
                var _t = this;
                _t.loginForm.password = '';
                if (_t.loginForm.username && _t.loginForm.username !== "") {
                    const params = {
                        mobile: _t.loginForm.username // 用户名
                    };
                    const token = 'chinaetcorg'
                    var filename = getCodefile + getDataTime() + '.json';
                    var data = this.changeData(params, filename,token);
                    _t.$api.post('api/json', data, function (res) {
                        if (res.statusCode == 0) {
                            _t.getCode();
                        } else {
                            _t.alertDialogTip(_t, res.errorMsg)
                        }
                    })
                } else {
                    // _t.$message({
                    //     offset: 100,
                    //     message: '手机号不能为空',
                    //     type: 'warning'
                    // });
                }

            },
            getCode() {
                var _t = this;
                const TIME_COUNT = 60;
                if (!_t.timer) {
                    _t.counts = TIME_COUNT;
                    _t.btnShow = false;
                    _t.timer = setInterval(() => {
                        if (_t.counts > 0 && _t.counts <= TIME_COUNT) {
                            this.counts--;
                        } else {
                            _t.btnShow = true;
                            clearInterval(_t.timer);
                            _t.timer = null;
                        }
                    }, 1000)
                }
            },
            handleLogin() {
                var _t = this;
                _t.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        // 提交
                        _t.toHome();
                    } else {
                        return false;
                    }
                });
            },
            toTree(list) {
                let cloneData = JSON.parse(JSON.stringify(list))
                let endArr = cloneData.filter(fatherItem => {
                    let children = cloneData.filter(childItem => childItem.menuId === fatherItem.id);
                    if (children.length > 0) {
                        return fatherItem.children = children
                    }
                    return fatherItem.children
                })
                return endArr
            },
            aa (x) {

            },
            dome() {

                // 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
                // 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
                // 示例:
                //  给定 nums = [2, 7, 11, 15], target = 9
                // 因为 nums[0] + nums[1] = 2 + 7 = 9
                // 所以返回 [0, 1]

                // var dataList =this.menuList.pages.concat(this.menuList.menus);
                // console.log(dataList);
                // console.log(this.toTree(dataList), '123');
            }
        },
        created() {
            this.dome()
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

    .inputBtn {
        display: flex;

    }

    .btn {
        width: 160px;
        margin-left: 15px;
        text-align: center;
    }

    .login-container {
        /*display: flex;*/
        /*justify-content: center; !*x轴对齐方式*!*/
        /*box-sizing: border-box;*/
        width: 100%;
        height: 100%;
        background: url(".././assets/img/login.jpg") no-repeat;
        background-position: right bottom;
        background-size: 45% 100%;
        padding: 100px;
        box-sizing: border-box;

    }
    .login-container .box {
        position: fixed;
        top: 20%;
        left: 9%;
    }
    .IMgheader {
        width: 400px;
        max-width: 400px;
    }

    .IMgheader .img {
        width: 100%;
        height: auto;
    }

    .login-form {
        margin-top: 20px;
        width: 350px;
        height: 230px;
        max-width: 350px;
        min-width: 300px;
        border: 1px solid #cccccc;
        padding: 20px;
        border-radius: 8px;
        /*box-shadow: 0 0 10px -1px #ccc inset*/
    }

    .width {

    }
</style>
