<template>
    <div class="search-songs">
        <album-content :songList="listOfSongs"></album-content>
    </div>
</template>

<script>
    import AlbumContent from "../../common/AlbumContent";
    import {mixin} from "../../../mixins";
    import {mapGetters} from 'vuex'
    export default {
        name: "SearchSongs",
        components: {
            AlbumContent
        },
        mixins:[mixin],
        computed:{
            ...mapGetters([
                'listOfSongs'
            ])
        },
        mounted() {
            this.getSong()

        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/css/search-songs";
</style>