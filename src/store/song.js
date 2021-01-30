
const song ={
    state: {
        listOfSongs:[]  //网络请求的歌曲
    },
    getters:{
        listOfSongs:state => {
            let listOfSongs =state.listOfSongs;
            if(!listOfSongs.length){
                listOfSongs = JSON.parse(window.localStorage.getItem('listOfSongs'))
            }
            return listOfSongs;
        }

    },
    mutations: {
        setListOfSongs:(state,listOfSongs) => {
            state.listOfSongs = listOfSongs
            window.localStorage.setItem('listOfSongs',JSON.stringify(listOfSongs))
        }

    },
    actions: {
    },
    modules: {
    }
}

export default song