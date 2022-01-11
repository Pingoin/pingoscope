<template>
  <div>
    <h2>Lagesensor</h2>
    <status-string
      caption="Azimut"
      :status="vxm.user.storeData.sensorPosition.horizontal.azimuth.toString()"
    ></status-string>
    <status-string
      caption="Altitude"
      :status="vxm.user.storeData.sensorPosition.horizontal.altitude.toString()"
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

    <status-string caption="Motor Atltiude" :status="vxm.user.storeData.actualPosition.horizontal.altitude.toString()"/>
    <status-string caption="Motor Azimuth" :status="vxm.user.storeData.actualPosition.horizontal.azimuth.toString()"/>
        <status-string caption="Ziel Atltiude" :status="vxm.user.storeData.targetPosition.horizontal.altitude.toString()"/>
    <status-string caption="Ziel Azimuth" :status="vxm.user.storeData.targetPosition.horizontal.azimuth.toString()"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { vxm } from "../store";
import StatusString from "../components/StatusString.vue";
import StatusNumber from "../components/StatusNumber.vue";
import StatusUnit from "../components/StatusUnit.vue";

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
}
</script>
