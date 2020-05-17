<template>
    <div class="comtent">
        <div class="btn" @click="getApp"></div>
        <!--         <div class="left">-->
        <!--            <div class="topImg">-->
        <!--                <h1>第一步： 设备厂商进行设备备案</h1>-->
        <!--                <img class="leftImg" src="../assets/img/equimentDep.png" alt="">-->
        <!--            </div>-->
        <!--             <div class="buttonImg">-->
        <!--                 <h1>第二步： 车道用户进行设备部署</h1>-->
        <!--                 <img class="leftImg" src="../assets/img/equipment.png" alt="">-->
        <!--             </div>-->
        <!--         </div>-->
        <!--         <div class="right">-->
        <!--             <div class="rightContent">-->
        <!--                 <img class="rightImg" src="../assets/img/Gp.jpg" alt="">-->
        <!--                 <el-button class="btn" type="primary" @click="getApp">APP下载</el-button>-->
        <!--             </div>-->
        <!--         </div>-->
    </div>
</template>
<script>
    export default {
        name: 'home',
        methods:{
            getApp () {
                this.$confirm('你要下载此APP?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    window.location.href= 'https://tqappupdate.oss-cn-beijing.aliyuncs.com/1/V1.1.1.apk'

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        created() {
            if (!this.$cookie.get('accessToken') || !this.$cookie.get('openId') ) {
                this.$router.replace('/login');
            }
            this.$store.commit('set_loading', false);
            // setTimeout(() => {
            //     this.$store.commit('set_loading', false);
            // }, 800);
        }
    }
</script>
<style scoped>
    .comtent {
        position: relative;
        height: 100%;
        width: 100%;
        background: url("../assets/img/index2.jpg") no-repeat;
        background-size: 100% 100%;
    }
    .btn {
        position: absolute;
        right: 15%;
        top: 53%;
        width: 10%;
        height: 10%;
    }
</style>
<!--<style scoped>-->

<!--    .comtent {-->
<!--        display: flex;-->
<!--        justify-content: space-between;-->
<!--        padding: 20px 100px;-->
<!--        height: 100%;-->
<!--        width: 100%;-->
<!--        box-sizing: border-box;-->
<!--    }-->
<!--    .left {-->
<!--        width: 35%;-->
<!--        height: 100%;-->
<!--    }-->
<!--    /*.left .leftImg {*/-->
<!--    /*    display: block;*/-->
<!--    /*    width: 100%;*/-->
<!--    /*    height: 50%;*/-->
<!--    /*    border-radius: 8px;*/-->
<!--    /*}*/-->
<!--    .right {-->
<!--        display: flex;-->
<!--        align-items: center;-->
<!--        flex-direction: row-reverse;-->
<!--        width: 30%;-->
<!--        height: 60%;-->
<!--        padding-top: 50px;-->
<!--    }-->
<!--    .rightContent {-->
<!--        display: flex;-->
<!--        flex-direction: column;-->
<!--        align-items: center;-->
<!--        justify-content: center;-->
<!--        /*border: 1px solid #ccc;*/-->
<!--        background: #fff;-->
<!--        border-radius: 8px;-->
<!--        text-align: center;-->
<!--        width: 100%;-->
<!--        height: 100%;-->
<!--        padding-top:5%;-->
<!--        /*box-shadow: 0 0 10px -1px #ccc inset*/-->
<!--    }-->
<!--    /*.rightImg {*/-->
<!--    /*    width: 100%;*/-->
<!--    /*    height: 150px;*/-->
<!--    /*    border-radius: 8px;*/-->
<!--    /*}*/-->
<!--    .buttonImg {-->
<!--        margin-top: 50px;-->
<!--        border-radius: 8px;-->
<!--    }-->
<!--    h1 {-->
<!--        font-size: 20px;-->
<!--    }-->
<!--    .btn {-->
<!--        margin-top: 50px;-->
<!--        width: 150px;-->
<!--        margin-bottom: 50px;-->
<!--    }-->
<!--    @media screen and (max-device-width: 1920px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->

<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 250px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1680px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->

<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 250px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1600px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->

<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 190px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1400px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--        .rightContent {-->
<!--            padding-top: 50px;-->
<!--        }-->
<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 250px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1366px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--        .rightContent {-->
<!--            padding-top: 50px;-->
<!--        }-->
<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 400px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1280px) and (max-height: 1024px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--        .rightContent {-->
<!--            padding-top: 50px;-->
<!--        }-->
<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 320px;-->
<!--            height: 270px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->
<!--    @media screen and (max-width: 1280px ) and (max-height: 960px) {-->
<!--        .rightImg {-->
<!--            width: 200px;-->
<!--            height: 150px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--        .rightContent {-->
<!--            padding-top: 50px;-->
<!--        }-->
<!--        .left .leftImg {-->
<!--            display: block;-->
<!--            width: 320px;-->
<!--            height: 200px;-->
<!--            border-radius: 8px;-->
<!--        }-->
<!--    }-->

<!--</style>-->
