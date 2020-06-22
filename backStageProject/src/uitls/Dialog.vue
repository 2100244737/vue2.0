<!--使用element-ui提供的Dialog，那么每一个弹框都要手动加按钮，不但代码量增多，而且后面如果按钮UI，需求发生变化，改动量也比较大-->
<!--如果可以将Dialog进行二次封装，将按钮封装到组件内部，就可以不用重复去写了。-->
<template>
    <div>
        <el-dialog :visible.sync="visibleDialog" v-bind="$attrs" v-on="$listeners"
                   append-to-body
                   :close-on-click-modal="true"
                   :close-on-press-escape="false"
                   :before-close="$_handleCancel"
        >
            <!--内容区域的默认插槽-->
            <slot></slot>
            <!--使用弹框的footer插槽添加按钮-->
            <template #footer>
                <!--对外继续暴露footer插槽，有个别弹框按钮需要自定义-->
                <slot name="footer">
                    <!--将取消与确定按钮集成到内部-->
                    <span>
          <el-button @click="$_handleCancel">取 消</el-button>
          <el-button type="primary" @click="$_handleConfirm">
            确 定
          </el-button>
        </span>
                </slot>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Dialog",
        props: {
            // 对外暴露visible属性，用于显示隐藏弹框
            visible: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            // 通过计算属性，对.sync进行转换，外部也可以直接使用visible.sync
            visibleDialog: {
                get() {
                    return this.visible;
                },
                set() {
                    this.$emit("update:visible");
                }
            }
        },
        methods: {
            // 对外抛出cancel事件
            $_handleCancel() {
                this.$emit("cancel");
            },
            // 对外抛出 confirm事件
            $_handleConfirm() {
                this.$emit("confirm");
            }
        }
    }
</script>

<style scoped>

</style>
