import { createModule, mutation, action, extractVuexModule, createProxy } from "vuex-class-component";
import Vue from 'vue';
import Vuex from 'vuex'
import { satData, StoreData } from "../shared";
import { io } from "socket.io-client";


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
      horizontalString: { azimuth: "", altitude: "" },
      equatorialString: {
        declination: "",
        rightAscension: ""
      },
      type: "horizontal"
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
      },
      type: "horizontal"
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
      },
      type: "horizontal"
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
      },
      type: "equatorial"
    },
    systemInformation: {
      cpuTemp: 0
    },
  }
  image: string = "";
  socket = io({
    path:"/api",
    transports: ["websocket", "polling"]
  });
  @action async initWS() { 
    this.socket.onAny((event,...args)=>{
      switch (event) {
        case "StoreData":
          vxm.user.storeData = args[0] as StoreData;
          break;
        case "image":
          vxm.user.image = args[0] as string;
        break;
        case "TargetType":
          if (["horizontal", "equatorial"].includes(args[0] as string)) {
            vxm.user.targetType = args[0] as "horizontal" | "equatorial";
          } 
        break;
        default:
          break;
      }
    })
    this.socket.on("connect",()=>{
      console.log("Connection, ",this.socket.id)
    })
    this.socket.on("disconnect", () => {
      console.log(this.socket.id); // undefined
    });
  } 

  @action async fetchData() {
    this.socket.emit("getStoreData");
  }
  get targetType() {
    return this.storeData.targetPosition.type
  }
  set targetType(type: "horizontal" | "equatorial") {
    this.storeData.targetPosition.type = type;
  }
  @action async setTargetType(type: "horizontal" | "equatorial") {
    this.socket.emit("setTargetType", type);
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