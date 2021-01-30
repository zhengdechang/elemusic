import {navMsg} from "../assets/data/header";
const configer ={
    state: {
        HOST: 'http://localhost:3000',
        activeName:navMsg[0].name,
    },
    getters:{
        activeName:state => {
            let activeName =state.activeName;
            if(!activeName){
                activeName = JSON.parse(window.sessionStorage.getItem('activeName'))
            }
            return activeName;
        }

    },
    mutations: {
        setActiveName:(state,activeName) => {
            state.activeName = activeName
            window.sessionStorage.setItem('activeName',JSON.stringify(activeName))
        }

    },
    actions: {
    },
    modules: {
    }
}

export default configer