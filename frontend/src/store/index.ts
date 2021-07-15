import { createModule, mutation, action, extractVuexModule, createProxy } from "vuex-class-component";
import Vue from 'vue';
import Vuex from 'vuex'
import axios from "axios";
import {StoreData} from "../shared";

const VuexModule = createModule({
  namespaced: "user",
  strict: false,
})
Vue.use(Vuex);
export class UserStore extends VuexModule {
    test="kein Server";
    storeData:StoreData={
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
      stellariumTarget: {
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
      systemInformation:{
        cpuTemp:0
      },
    }
    @action async fetchData() {
      const test=axios.get<string>("/api/test");
      const store=axios.get<StoreData>("/api/data");

      Promise.all([test,store]).then(results=>{
        this.test=results[0].data;
        this.storeData=results[1].data;
      }).catch(console.log);
    }
  }
  export const store = new Vuex.Store({
    modules: {
      ...extractVuexModule( UserStore )
    }
  })
  
  // Creating proxies.
  export const vxm = {
    user: createProxy( store, UserStore ),
  }