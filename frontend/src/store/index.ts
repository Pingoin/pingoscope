import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import StoreData from "../../../shared/StoreData";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    test:"kein Server",
    storeData:{
      magneticDeclination: 0,
      longitude: 0,
      latitude: 0,
      sensorPosition: {
        equatorial: {
          declination: 0,
          rightAscension: 0
        },
        horizontal: {
          altitude:0,
          azimuth:0
        },
        horizontalString: { azimuth: "", altitude: "" },
        equatorialString: {
          declination: "",
          rightAscension: ""
        }
      },
      targetPosition:{
        equatorial: {
          declination: 0,
          rightAscension: 0
        },
        horizontal: {
          altitude:0,
          azimuth:0
        },
        horizontalString: { azimuth: "", altitude: "" },
        equatorialString: {
          declination: "",
          rightAscension: ""
        }
      },
      actualPosition: {
        equatorial: {
          declination: 0,
          rightAscension: 0
        },
        horizontal: {
          altitude:0,
          azimuth:0
        },
        horizontalString: { azimuth: "", altitude: "" },
        equatorialString: {
          declination: "",
          rightAscension: ""
        }
      },
    }
  },
  mutations: {
    setTest(state,test:string){
      state.test=test;
    },
    setStoreData(state,storeData:StoreData){
      state.storeData=storeData;
    }
  },
  actions: {
    async fetchData(context) {
      const test=axios.get<string>("/api/test");
      const store=axios.get<StoreData>("/api/data");

      Promise.all([test,store]).then(results=>{
        context.commit("setTest",results[0].data);
        context.commit("setStoreData",results[1].data);
      }).catch(console.log);
    }
  },
  modules: {
  }
})
