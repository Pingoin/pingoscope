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
}
export interface sysInfo{
  cpuTemp:number;

}