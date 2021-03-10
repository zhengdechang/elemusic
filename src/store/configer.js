// import {navMsg} from "../assets/data/header";
const configer ={
    state: {
        // activeName:navMsg[0].name,       //当前选中的菜单名字
        activeName:'',       //当前选中的菜单名字
        showAside:false,                 //是否显示播放中的歌曲列表
        loginIn:false,                   //用户是否已登录
    },
    getters:{
        activeName:state => {
            let activeName =state.activeName;
            if(!activeName){
                activeName = JSON.parse(window.localStorage.getItem('activeName'))
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
        loginIn:state => {
            let loginIn =state.loginIn;
            if(!loginIn){
                loginIn = JSON.parse(window.sessionStorage.getItem('loginIn'))
            }
            return loginIn;
        },

    },
    mutations: {
        setActiveName:(state,activeName) => {
            state.activeName = activeName
            window.localStorage.setItem('activeName',JSON.stringify(activeName))
        },
        setShowAside:(state,showAside) => {
            state.showAside = showAside
            window.sessionStorage.setItem('showAside',JSON.stringify(showAside))
        },
        setLoginIn:(state,loginIn) => {
            state.loginIn = loginIn
            window.sessionStorage.setItem('loginIn',JSON.stringify(loginIn))
        }

    },
    actions: {
    },
    modules: {
    }
}

export default configer
