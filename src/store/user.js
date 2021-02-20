const user ={
    state: {
        userid:'',       //用户id
        username:'',     //用户名
        avator:'',       //用户头像
    },
    getters:{
        userid:state => {
            let userid =state.userid;
            if(!userid){
                userid = JSON.parse(window.sessionStorage.getItem('userid'))
            }
            return userid;
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

    },
    mutations: {
        setUserid:(state,userid) => {
            state.userid = userid
            window.sessionStorage.setItem('userid',JSON.stringify(userid))
        },
        setUsername:(state,username) => {
            state.username = username
            window.sessionStorage.setItem('username',JSON.stringify(username))
        },
        setAvator:(state,avator) => {
            state.avator = avator
            window.sessionStorage.setItem('avator',JSON.stringify(avator))
        }

    },
    actions: {
    },
    modules: {
    }
}

export default user