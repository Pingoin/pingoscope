import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    test:"kein Server"
  },
  mutations: {
    setTest(state,test:string){
      state.test=test;
    }
  },
  actions: {
    async fetchData(context) {
      const test=axios.get<string>("/api/test");

      Promise.all([test]).then(results=>{
        context.commit("setTest",results[0].data);
      }).catch(console.log);
    }
  },
  modules: {
  }
})
