
const song ={
    state: {
        listOfSongs:[],  //网络请求的歌曲
        isPlay: false,          //是否播放中
        url: '',                //歌曲地址
        id: '' ,                 //歌曲id
        playButtonUrl: 'icon-play' ,      //播放状态的图标
        duration:0,              //音乐时长
        curTime:0,              //当前音乐播放位置
        changeTime:0,           //指定播放时刻
        title:'',              //歌名
        artist:'',             //歌手名
        picUrl:'',             //歌曲图片
        autoNext:true,         //自动播放下一首
        lyric:[],              //未处理歌词数据
        tempList:{},           //当个歌单信息或者歌手
        listIndex:null,        //当前歌曲在歌单中的位置
        volume:50,              //音量
        AsidePlayList:[],       //播放列表
        mode:0,                 //播放模式
    },
    getters:{
        mode:state => {
            let mode =state.mode;
            if(!mode.length){
                mode = JSON.parse(window.sessionStorage.getItem('mode'))
            }
            return mode;
        },
        listOfSongs:state => {
            let listOfSongs =state.listOfSongs;
            if(!listOfSongs.length){
                listOfSongs = JSON.parse(window.sessionStorage.getItem('listOfSongs'))
            }
            return listOfSongs;
        },
        isPlay:state => {
            let isPlay =state.isPlay;
            if(!isPlay){
                isPlay = JSON.parse(window.sessionStorage.getItem('isPlay'))
            }
            return isPlay;
        },
        id:state => {
            let id =state.id;
            if(!id){
                id = JSON.parse(window.sessionStorage.getItem('id'))
            }
            return id;
        },
        url:state => {
            let url =state.url;
            if(!url){
                url = JSON.parse(window.sessionStorage.getItem('url'))
            }
            return url;
        },
        playButtonUrl:state => {
            let playButtonUrl =state.playButtonUrl;
            if(!playButtonUrl){
                playButtonUrl = JSON.parse(window.sessionStorage.getItem('playButtonUrl')||null);
            }
            return playButtonUrl;
        },
         duration:state => {
            let  duration =state. duration;
            if(! duration){
                 duration = JSON.parse(window.sessionStorage.getItem(' duration')||null);
            }
            return  duration;
        },
         curTime:state => {
            let  curTime =state. curTime;
            if(! curTime){
                 curTime = JSON.parse(window.sessionStorage.getItem(' curTime')||null);
            }
            return  curTime;
        },
        changeTime:state => {
            let changeTime =state.changeTime;
            if(!changeTime){
                changeTime = JSON.parse(window.sessionStorage.getItem('changeTime')||null);
            }
            return changeTime;
        },
        title:state => {
            let title =state.title;
            if(!title){
                title = JSON.parse(window.sessionStorage.getItem('title')||null);
            }
            return title;
        },
        artist:state => {
            let artist =state.artist;
            if(!artist){
                artist = JSON.parse(window.sessionStorage.getItem('artist')||null);
            }
            return artist;
        },
        picUrl:state => {
            let picUrl =state.picUrl;
            if(!picUrl){
                picUrl = JSON.parse(window.sessionStorage.getItem('picUrl')||null);
            }
            return picUrl;
        },
        autoNext:state => {
            let autoNext =state.autoNext;
            if(!autoNext){
                autoNext = JSON.parse(window.sessionStorage.getItem('autoNext')||null);
            }
            return autoNext;
        },
        lyric:state => {
            let lyric =state.lyric;
            if(!lyric){
                lyric = JSON.parse(window.sessionStorage.getItem('lyric')||null);
            }
            return lyric;
        },
        tempList:state => {
            let tempList =state.tempList;
            if(!tempList){
                tempList = JSON.parse(window.sessionStorage.getItem('tempList')||null);
            }
            return tempList;
        },
        listIndex:state => {
            let listIndex =state.listIndex;
            if(!listIndex){
                listIndex = JSON.parse(window.sessionStorage.getItem('listIndex')||null);
            }
            return listIndex;
        },
        volume:state => {
            let volume =state.volume;
            if(!volume){
                volume = JSON.parse(window.sessionStorage.getItem('volume'));
            }
            return volume;
        },
        AsidePlayList:state => {
            let AsidePlayList =state.AsidePlayList;
            if(!AsidePlayList){
                AsidePlayList = JSON.parse(window.localStorage.getItem('AsidePlayList'));
            }
            return AsidePlayList;
        },
    },
    mutations: {
        setListOfSongs:(state,listOfSongs) => {
            state.listOfSongs = listOfSongs
            window.sessionStorage.setItem('listOfSongs',JSON.stringify(listOfSongs))
        },
        setIsPlay:(state,isPlay) => {
            state.isPlay = isPlay
            window.sessionStorage.setItem('isPlay',JSON.stringify(isPlay))
        },
        setUrl:(state,url) => {
            state.url = url
            window.sessionStorage.setItem('url',JSON.stringify(url))
        },
        setId:(state,id) => {
            state.id = id
            window.sessionStorage.setItem('id',JSON.stringify(id))
        },
        setPlayButtonUrl:(state,playButtonUrl) => {
            state.playButtonUrl = playButtonUrl
            window.sessionStorage.setItem('playButtonUrl',JSON.stringify(playButtonUrl))
        },
        setDuration:(state,duration) => {
            state.duration = duration
            window.sessionStorage.setItem('duration',JSON.stringify(duration))
        },
        setCurTime:(state,curTime) => {
            state.curTime = curTime
            window.sessionStorage.setItem('curTime',JSON.stringify(curTime))
        },
        setChangeTime:(state,changeTime) => {
            state.changeTime = changeTime
            window.sessionStorage.setItem('changeTime',JSON.stringify(changeTime))
        },
        setTitle:(state,title) => {
            state.title = title
            window.sessionStorage.setItem('title',JSON.stringify(title))
        },
        setArtist:(state,artist) => {
            state.artist = artist
            window.sessionStorage.setItem('artist',JSON.stringify(artist))
        },
        setPicUrl:(state,picUrl) => {
            state.picUrl = picUrl
            window.sessionStorage.setItem('picUrl',JSON.stringify(picUrl))
        },
        setAutoNext:(state,autoNext) => {
            state.autoNext = autoNext
            window.sessionStorage.setItem('autoNext',JSON.stringify(autoNext))
        },
        setLyric:(state,lyric) => {
            state.lyric = lyric
            window.sessionStorage.setItem('lyric',JSON.stringify(lyric))
        },
        setTempList:(state,tempList) => {
            state.tempList = tempList
            window.sessionStorage.setItem('tempList:',JSON.stringify(tempList))
        },
        setListIndex:(state,listIndex) => {
            state.listIndex = listIndex
            window.sessionStorage.setItem('listIndex',JSON.stringify(listIndex))
        },
        setVolume:(state,volume) => {
            state.volume = volume
            window.sessionStorage.setItem('volume',JSON.stringify(volume))
        },
        setAsidePlayList:(state,AsidePlayList) => {
            state.AsidePlayList = AsidePlayList
            window.localStorage.setItem('AsidePlayList',JSON.stringify(AsidePlayList))
        },
        setMode:(state,mode) => {
            state.mode = mode
            window.localStorage.setItem('Mode',JSON.stringify(mode))
        },

    },
    actions: {
    },
    modules: {
    }
}

export default song
