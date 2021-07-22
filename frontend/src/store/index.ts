import { createModule, mutation, action, extractVuexModule, createProxy } from "vuex-class-component";
import Vue from 'vue';
import Vuex from 'vuex'
import axios from "axios";
import { satData, StoreData, wsPost } from "../shared";


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
    gnssData:{
      errors: 0,
      processed: 0,
      time: new Date(),
      lat: 0,
      lon: 0,
      alt: 0,
      speed: 0,
      track: 0,
      satsActive:new Array<number>(),
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
      horizontalString: { azimuth: "", altitude: "" },
      equatorialString: {
        declination: "",
        rightAscension: ""
      }
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
        altitude: 0,
        azimuth: 0
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
        altitude: 0,
        azimuth: 0
      },
      horizontalString: { azimuth: "", altitude: "" },
      equatorialString: {
        declination: "",
        rightAscension: ""
      }
    },
    systemInformation: {
      cpuTemp: 0
    },
  }
  wsClient= new WebSocket("ws://192.168.178.54:8080/");
  @action async initWS() {
    // Log messages from the server
    this.wsClient.onmessage = vxm.user.handleWS;
  }

  @action async fetchData(){
    const message:wsPost={
      key:"StoreData",
      action:"get",
      data:""
    }
    this.wsClient.send(JSON.stringify(message));
  }

 @action async handleWS(event:MessageEvent<any>){
  const tel=JSON.parse(event.data) as wsPost;
  console.log(tel.action +" "+ tel.key);

  switch (tel.key) {
    case "StoreData":
      console.log(tel.data);
      vxm.user.storeData=tel.data as StoreData;
      break;
  
    default:
      break;
  }
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