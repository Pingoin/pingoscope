import { createModule, mutation, action, extractVuexModule, createProxy } from "vuex-class-component";
import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import { satData, StoreData } from "../shared";


const VuexModule = createModule({
  namespaced: "user",
  strict: false,
})
Vue.use(Vuex);
export class UserStore extends VuexModule {
  storeData: StoreData = {
    magneticDeclination: 0,
    longitude: 0,
    latitude: 0,
    gnssData: {
      errors: 0,
      processed: 0,
      time: new Date(),
      lat: 0,
      lon: 0,
      alt: 0,
      speed: 0,
      track: 0,
      satsActive: new Array<number>(),
      satsVisible: new Array<satData>(),
      fix: "3D",
      hdop: 0,
      pdop: 0,
      vdop: 0
    },
    sensorPosition: {
      equatorial: {
        declination: 0,
        rightAscension: 0
      },
      horizontal: {
        altitude: 0,
        azimuth: 0
      },
    },
    targetPosition: {
      equatorial: {
        declination: 0,
        rightAscension: 0
      },
      horizontal: {
        altitude: 0,
        azimuth: 0
      },
    },
    actualPosition: {
      equatorial: {
        declination: 0,
        rightAscension: 0
      },
      horizontal: {
        altitude: 0,
        azimuth: 0
      },
    },
    stellariumTarget: {
      equatorial: {
        declination: 0,
        rightAscension: 0
      },
      horizontal: {
        altitude: 0,
        azimuth: 0
      },
    },
    systemInformation: {
      cpuTemp: 0
    },
  }
  image: string = "";

  @action async initWS() {
    this.storeData=(await axios.get<StoreData>("/api/store")).data;
  } 

  @action async fetchData() {
    this.storeData=(await axios.get<StoreData>("/api/store")).data;
  }
  @action async setTargetType(type: "horizontal" | "equatorial") {
    
  }
}

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(UserStore)
  }
})

// Creating proxies.
export const vxm = {
  user: createProxy(store, UserStore),
}