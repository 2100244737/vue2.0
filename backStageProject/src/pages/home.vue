<template>
    <div class="comtent">
<!--        <el-button @click="handleOpened">打开</el-button>-->
<!--        <custom-dialog :visible.sync="visibleDialog" title="测试弹框" @confirm="handleConfirm" @cancel="handleCancel">这是一段内容</custom-dialog>-->
        <div id="echarts" class="echarts"></div>
    </div>
</template>
<script>
    // import customDialog from '../uitls/Dialog'
     import echarts from "echarts";
    export default {
        name: 'home',
        data () {
            return {
                visibleDialog:false
            }
        },
        components: {

        },
        mounted() {
            // 基于准备好的dom，初始化echarts实例


                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('echarts'));
                var option = {
                    legend: {},
                    tooltip: {},
                    dataset: {
                        source: [
                            ['product', '2015', '2016', '2017'],
                            ['Matcha Latte', 43.3, 85.8, 93.7],
                            ['Milk Tea', 83.1, 73.4, 55.1],
                            ['Cheese Cocoa', 86.4, 65.2, 82.5],
                            ['Walnut Brownie', 72.4, 53.9, 39.1],
                        ]
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [
                        {type: 'bar'},
                        {type: 'bar'},
                        {type: 'bar'}
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);


        },
        methods:{
            handleOpened () {
                this.visibleDialog =true;
            },
            handleConfirm() {
                console.log(1111);
            },
            handleCancel () {
                this.visibleDialog =false;
                console.log(222);
            }

        },
        created() {
            setTimeout(() => {
                this.$store.commit('set_loading', false);
            }, 800);
        }
    }
</script>
<style scoped>
.echarts {
    width: 100%;
    height: 100%;
}
.comtent {
    height: 100%;
    width: 100%;
}
</style>

