import {navMsg} from "../assets/data/header";
const configer ={
    state: {
        activeName:navMsg[0].name,       //当前选中的菜单名字
        showAside:false,                 //是否显示播放中的歌曲列表
    },
    getters:{
        activeName:state => {
            let activeName =state.activeName;
            if(!activeName){
                activeName = JSON.parse(window.sessionStorage.getItem('activeName'))
            }
            return activeName;
        },
        showAside:state => {
            let showAside =state.showAside;
            if(!showAside){
                showAside = JSON.parse(window.sessionStorage.getItem('showAside'))
            }
            return showAside;
        },

    },
    mutations: {
        setActiveName:(state,activeName) => {
            state.activeName = activeName
            window.sessionStorage.setItem('activeName',JSON.stringify(activeName))
        },
        setShowAside:(state,showAside) => {
            state.showAside = showAside
            window.sessionStorage.setItem('showAside',JSON.stringify(showAside))
        }

    },
    actions: {
    },
    modules: {
    }
}

export default configer