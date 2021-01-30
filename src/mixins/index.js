import {likeSongofName} from "../networks";

export const mixin = {
    methods:{
        // notify(title,type){
        //     this.notify({
        //         title:title,
        //         type:type
        //     })
        // },
        attachImageUrl(srcUrl){
            return srcUrl ? srcUrl : '../assets/img/user.jpg';
        },
        //模糊搜索
        getSong(){
            if(!this.$route.query.keywords){
                this.$store.commit('setListOfSongs',[])
                // this.notify('您输入的内容为空','warning');
                console.log('您输入的内容为空')
            }
            else {
                likeSongofName(this.$route.query.keywords).then(res =>{
                    if(res.length){
                        this.$store.commit('setListOfSongs',[])
                        // this.notify('系统暂无符合条件的歌曲','warning')
                        console.log('您输入的内容为空')
                    }else{
                        this.$store.commit('setListOfSongs',res.result.songs)
                        console.log(res.result.songs);
                    }
                }).catch(err =>{
                    console.log(err);
                })
            }

        },


        //获取名字前半部分
        // replaceName(str){
        //     let arr = str.split('-');
        //     return arr[0]
        // },
        // replaceFName(str){
        //     let arr = str.split('-');
        //     return arr[1]
        // },
    }
}