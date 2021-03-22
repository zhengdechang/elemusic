const user ={
    state: {
        userId:'',       //用户id
        username:'',     //用户名
        avator:'',       //用户头像
        isActive:false,     //单曲用户是否收藏  play-bar
        isActiveSong:false,   //单曲用户是否收藏  detail
        isActiveAlbum:false,  //歌单是否收藏
        isActiveArtist:false,     //歌手用户是否收藏
        isActiveCollection:false,  //专辑是否收藏

    },
    getters:{
        userId:state => {
            let userId =state.userId;
            if(!userId){
                userId = JSON.parse(window.sessionStorage.getItem('userId'))
            }
            return userId;
        },
        username:state => {
            let username =state.username;
            if(!username){
                username = JSON.parse(window.sessionStorage.getItem('username'))
            }
            return username;
        },
        avator:state => {
            let avator =state.avator;
            if(!avator){
                avator = JSON.parse(window.sessionStorage.getItem('avator'))
            }
            return avator;
        },
        isActive:state => {
            let isActive =state.isActive;
            if(!isActive){
                isActive = JSON.parse(window.sessionStorage.getItem('isActive'))
            }
            return isActive;
        },
        isActiveSong:state => {
            let isActiveSong =state.isActiveSong;
            if(!isActiveSong){
                isActiveSong = JSON.parse(window.sessionStorage.getItem('isActiveSong'))
            }
            return isActiveSong;
        },
        isActiveAlbum:state => {
            let isActiveAlbum =state.isActiveAlbum;
            if(!isActiveAlbum){
                isActiveAlbum = JSON.parse(window.sessionStorage.getItem('isActiveAlbum'))
            }
            return isActiveAlbum;
        },
        isActiveArtist:state => {
            let isActiveArtist =state.isActiveArtist;
            if(!isActiveArtist){
                isActiveArtist = JSON.parse(window.sessionStorage.getItem('isActiveArtist'))
            }
            return isActiveArtist;
        },
        isActiveCollection:state => {
            let isActiveCollection =state.isActiveCollection;
            if(!isActiveCollection){
                isActiveCollection = JSON.parse(window.sessionStorage.getItem('isActiveCollection'))
            }
            return isActiveCollection;
        },

    },
    mutations: {
        setUserId:(state,userId) => {
            state.userId = userId
            window.sessionStorage.setItem('userId',JSON.stringify(userId))
        },
        setUsername:(state,username) => {
            state.username = username
            window.sessionStorage.setItem('username',JSON.stringify(username))
        },
        setAvator:(state,avator) => {
            state.avator = avator
            window.sessionStorage.setItem('avator',JSON.stringify(avator))
        },
        setIsActive:(state,isActive) => {
            state.isActive = isActive
            window.sessionStorage.setItem('isActive',JSON.stringify(isActive))
        },
        setIsActiveSong:(state,isActiveSong) => {
            state.isActiveSong = isActiveSong
            window.sessionStorage.setItem('isActiveSong',JSON.stringify(isActiveSong))
        },
        setIsActiveAlbum:(state,isActiveAlbum) => {
            state.isActiveAlbum = isActiveAlbum
            window.sessionStorage.setItem('isActiveAlbum',JSON.stringify(isActiveAlbum))
        },
        setIsActiveArtist:(state,isActiveArtist) => {
            state.isActiveArtist = isActiveArtist
            window.sessionStorage.setItem('isActiveArtist',JSON.stringify(isActiveArtist))
        },
        setIsActiveCollection:(state,isActiveCollection) => {
            state.isActiveCollection = isActiveCollection
            window.sessionStorage.setItem('isActiveCollection',JSON.stringify(isActiveCollection))
        }

    },
    actions: {
    },
    modules: {
    }
}

export default user
