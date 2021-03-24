<template>
    <div class="setting">
        <div class="leftCol">
            <div class="settingsMainHeader">设置</div>
            <ul class="setting-aside">
                <li v-for="(item,index) in settingList" :key="index" :class="{activeColor:activeName == item.name}"
                @click="handleClick(item)">
                    {{item.name}}
                </li>
            </ul>
        </div>
        <div class="contentCol">
            <component :is="componentSrc"></component>
        </div>
    </div>
</template>

<script>
    import Info from "./Info";
    import Upload from "./Upload";
    export default {
        name: "Setting",
        components:{
          Info,
          Upload
        },
        created() {
            this.$store.commit('setActiveName','')
        },
        data(){
            return {
                settingList:[
                    {name:'个人信息',path:'Info'},
                    {name:'修改头像',path:'Upload'}
                ],
                activeName:'个人信息',
                componentSrc:'Info'
            }
        },
        methods:{
            handleClick(item){
                this.activeName = item.name;
                this.componentSrc = item.path;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/css/setting";
</style>