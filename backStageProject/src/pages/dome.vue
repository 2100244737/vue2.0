
<template>
    <div>
        <div>{{$t('name')}}</div>
        <el-select v-model="langType" class="changeLangType" size="mini" @change="changeLangType">
            <el-option value="en" label="English"></el-option>
            <el-option value="sc" label="中文简体"></el-option>
        </el-select>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                langType:'',
            }; },
        methods:{
            changeLangType(type){
                // localStorage.setItem('locale',type);
                this.$i18n.locale = type;
            }
        },
        created() {
            this.$store.commit('set_loading', false);
        }
    };
</script>
