import StellarPositionData from "./StellarPositionData";

export default interface StoreData {
  magneticDeclination: number;
  longitude: number;
  latitude: number;
  sensorPosition: StellarPositionData;
  targetPosition: StellarPositionData;
  stellariumTarget: StellarPositionData;
  actualPosition: StellarPositionData;
}
