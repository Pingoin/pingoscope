<template>
  <div>
    <h2>GPS</h2>
    <status-string
      caption="Längenengrad"
      :status="radToString(vxm.user.storeData.longitude/180*Math.PI)"
    />
    <status-string
      caption="Breitengrad"
      :status="radToString(vxm.user.storeData.latitude/180*Math.PI)"
    />
    <v-data-table
      :headers="satHeaders"
      :items="satsVisible"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>
  <h2>Positionen</h2>
    <v-data-table
      :headers="posHeaders"
      :items="posData"
      class="elevation-1"
      hide-default-footer
    />

    <h2>Raspberry Pi-Sensoren</h2>
    <status-unit
      caption="CPU-Temperatur"
      :status="vxm.user.storeData.systemInformation.cpuTemp"
      unit="°C"
      />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { vxm } from "../store";
import StatusString from "../components/StatusString.vue";
import StatusNumber from "../components/StatusNumber.vue";
import StatusUnit from "../components/StatusUnit.vue";
import { radToString,radToHourString } from "../plugins/angles";
import { StellarPositionData } from "../../../shared";

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
      { text: "PRN-ID", value: "SVPRNNumber" },
      { text: "Satelliten-System", value: "system" },
      { text: "Altitude", value: "Elevation" },
      { text: "Azimut", value: "Azimuth" },
      { text: "Signal-Noise-Ratio", value: "SNR" }
    ];
  }
  get satsVisible() {
    let sats = vxm.user.storeData.gnssData.satsGlonassVisible.map(x => {
      (x as any)["system"] = "GLONASS";
      return x;
    });

    vxm.user.storeData.gnssData.satsGpsVisible.map(x => {
      (x as any)["system"] = "GPS";
      return x;
    }).forEach(sat=>sats.push(sat))

        vxm.user.storeData.gnssData.satsGalileoVisible.map(x => {
      (x as any)["system"] = "Galileo";
      return x;
    }).forEach(sat=>sats.push(sat))

        vxm.user.storeData.gnssData.satsBeidouVisible.map(x => {
      (x as any)["system"] = "Beidou";
      return x;
    }).forEach(sat=>sats.push(sat))

    return sats;
  }
  radToString(rad: number): string {
    return radToString(rad);
  }
    radToHourString(rad: number): string {
    return radToHourString(rad);
  }

get posHeaders(){
  return[
    {text: "Name", value: "name"},
    {text: "Azimuth", value: "azimuth"},
    {text: "Altitude", value: "altitude"},
    {text: "Right Ascension", value: "rightAscension"},
    {text: "Declination", value: "declination"},
  ]
}
get posData(){
  let tmp:{data:StellarPositionData,name:string}[]=[]
  tmp.push({data:vxm.user.storeData.actualPosition,name:"Actual"})
  tmp.push({data:vxm.user.storeData.sensorPosition,name:"Sensor"})
  tmp.push({data:vxm.user.storeData.targetPosition,name:"Target"})
  tmp.push({data:vxm.user.storeData.stellariumTarget,name:"Stellarium"})

  return(tmp.map(x=>{return {
    name:x.name,
    altitude: radToString(x.data.horizontal.altitude),
    azimuth: radToString(x.data.horizontal.azimuth),
    rightAscension:radToHourString(x.data.equatorial.rightAscension),
    declination: radToString(x.data.equatorial.declination),
    }}))

}

}
</script>
