<template>
  <div>
    <h2>Lagesensor</h2>
    <status-string
      caption="Azimut"
      :status="radToString(vxm.user.storeData.sensorPosition.horizontal.azimuth)"
    ></status-string>
    <status-string
      caption="Altitude"
      :status="radToString(vxm.user.storeData.sensorPosition.horizontal.altitude)"
    ></status-string>
    <h2>GPS</h2>
    <status-number
      caption="Längenengrad"
      :status="vxm.user.storeData.longitude"
    />
    <status-number
      caption="Breitengrad"
      :status="vxm.user.storeData.latitude"
    />

    <v-data-table
      :headers="satHeaders"
      :items="satsVisible"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>

    <h2>Raspberry Pi-Sensoren</h2>
    <status-unit
      caption="CPU-Temperatur"
      :status="vxm.user.storeData.systemInformation.cpuTemp"
      unit="°C"
      >y</status-unit
    >
    <h2>Alt/Az-Steuerung</h2>

    <status-string caption="Motor Atltiude" :status="radToString(vxm.user.storeData.actualPosition.horizontal.altitude)"/>
    <status-string caption="Motor Azimuth" :status="radToString(vxm.user.storeData.actualPosition.horizontal.azimuth)"/>
    <status-string caption="Ziel Atltiude" :status="radToString(vxm.user.storeData.targetPosition.horizontal.altitude)"/>
    <status-string caption="Ziel Azimuth" :status="radToString(vxm.user.storeData.targetPosition.horizontal.azimuth)"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { vxm } from "../store";
import StatusString from "../components/StatusString.vue";
import StatusNumber from "../components/StatusNumber.vue";
import StatusUnit from "../components/StatusUnit.vue";
import {radToString} from "../plugins/angles"

@Component({
  components: {
    StatusString,
    StatusUnit,
    StatusNumber
  }
})
export default class Position extends Vue {
  get vxm() {
    return vxm;
  }
  get satHeaders() {
    return [
      { text: "PRN-ID", value: "prn" },
      { text: "Satelliten-System", value: "system" },
      { text: "Altitude", value: "elevation" },
      { text: "Azimut", value: "azimuth" },
      { text: "Signal-Noise-Ratio", value: "snr" },
      { text: "Status", value: "status" }
    ];
  }
  get satsVisible() {
    return vxm.user.storeData.gnssData.satsVisible?.map(x=>{
      (x as any)["system"]=x.prn>=38?"GLONASS":"GPS";
      return x;
    });
  }
  radToString(rad:number):string{
    return radToString(rad);
  }
}
</script>
