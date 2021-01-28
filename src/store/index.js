import Vue from 'vue'
import Vuex from 'vuex'
import configer from "./configer";
import song from "./song";
import user from "./user";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    configer,
    song,
    user
  }
})
