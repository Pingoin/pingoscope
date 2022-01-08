import {StellarPositionData} from "./StellarPositionData";

export interface StoreData {
  magneticDeclination: number;
  longitude: number;
  latitude: number;
  sensorPosition: StellarPositionData;
  targetPosition: StellarPositionData;
  stellariumTarget: StellarPositionData;
  actualPosition: StellarPositionData;
  systemInformation:sysInfo;
  gnssData:gnssData;
}
export interface sysInfo{
  cpuTemp:number;

}
export interface wsPost{
  key:"StoreData"|"TargetType"|"Image";
  action:"set"|"get";
  data:unknown;
}
export interface gnssData{
  errors: number;
  processed: number;
  time?: Date;
  lat?: number;
  lon?: number;
  alt?: number;
  speed?: number;
  track?: number;
  satsActive?: number[];
  satsVisible?: satData[];
  fix?: string;
  hdop?: number;
  pdop?: number;
  vdop?: number;
}

export interface satData{
  prn: number;
  elevation: number;
  azimuth: number;
  snr: number;
  status: string;
}