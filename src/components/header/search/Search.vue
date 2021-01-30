<template>
    <div class="search">
        <nav class="searchList-nav" ref="change">
            <span :class="{isActive:toggle == 'SearchSongs' }" @click="handleChangeView('SearchSongs')">歌曲</span>
            <span :class="{isActive:toggle == 'SearchSongList' }" @click="handleChangeView('SearchSongList')">歌单</span>
        </nav>
        <component :is="currentView"></component>
    </div>
</template>

<script>
    import SearchSongList from "./SearchSongList";
    import SearchSongs from "./SearchSongs";
    export default {
        name: "Search",
        components:{
            SearchSongs,
            SearchSongList
        },
        data(){
            return{
                toggle:'SearchSongs',
                currentView:'search-songs'
            }
        },
        methods:{
            handleChangeView(component){
                this.currentView = component;
                this.toggle = component

            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/search";
</style>