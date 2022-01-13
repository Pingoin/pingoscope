import { StellarPositionData } from "./StellarPositionData";

export interface StoreData {
  magneticDeclination: number;
  longitude: number;
  latitude: number;
  sensorPosition: StellarPositionData;
  targetPosition: StellarPositionData;
  stellariumTarget: StellarPositionData;
  actualPosition: StellarPositionData;
  systemInformation: sysInfo;
  gnssData: gnssData;
}
export interface sysInfo {
  cpuTemp: number;

}
export interface wsPost {
  key: "StoreData" | "TargetType" | "Image";
  action: "set" | "get";
  data: unknown;
}
export interface gnssData {
  alt: number;
  satsBeidouVisible:satData[];
  satsGalileoVisible:satData[];
  satsGlonassVisible:satData[];
  satsGpsVisible:satData[];
  fix: string;
  hdop: number;
  pdop: number;
  vdop: number;
}

export interface satData {
  Azimuth: number;
  Elevation: number;
  SNR: number;
  SVPRNNumber: number;

}