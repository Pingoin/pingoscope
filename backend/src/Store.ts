/** @format */

import StellarPosition from "./StellarPosition";
import {satData, StoreData} from "./shared";
import sysinfo from "systeminformation";
import * as geomag from "geomag";
import Api from "./Api";
import { gnssData } from "../../shared";

/**
 * central data store
 */
export class Store implements StoreData {
  public systemInformation = {
    cpuTemp: 0
  };
  private api:Api;
  public gnssData:gnssData={
    errors: 0,
    processed: 0,
    time: new Date(),
    lat: 13.9807452,
    lon: 53.5956198,
    alt: 0,
    speed: 0,
    track: 0,
    satsActive:new Array<number>(),
    satsVisible: new Array<satData>(),
    fix: "3D",
    hdop: 0,
    pdop: 0,
    vdop: 0
  }
  public magneticDeclination = 0;
  private _longitude: number;
  public get longitude(): number {
    return this._longitude;
  }
  public set longitude(value: number) {
    this.actualPosition.longitude = value;
    this.sensorPosition.longitude = value;
    this.targetPosition.longitude = value;
    this._longitude = value;
    const field = geomag.field(this.latitude, this.longitude);
    this.magneticDeclination = field.declination;
  }
  private _latitude: number;
  public get latitude(): number {
    return this._latitude;
  }
  public set latitude(value: number) {
    this.actualPosition.latitude = value;
    this.sensorPosition.latitude = value;
    this.targetPosition.latitude = value;
    this._latitude = value;
    const field = geomag.field(this.latitude, this.longitude);
    this.magneticDeclination = field.declination;
  }
  public sensorPosition: StellarPosition = new StellarPosition("horizontal");
  public targetPosition: StellarPosition = new StellarPosition("equatorial");
  public stellariumTarget: StellarPosition = new StellarPosition("equatorial");
  public actualPosition: StellarPosition = new StellarPosition("horizontal");
  constructor() {
    this.api = new Api(this);
    this.latitude = 53.5953413;
    this.longitude = 13.9806109;

    sysinfo.cpuTemperature().then(data => {
      this.systemInformation.cpuTemp = data.max;
    })
  }
  /**
   * exports the Object to an JSON-String
   */
  public simplify(): StoreData {
    return {
      magneticDeclination: this.magneticDeclination,
      longitude: this.longitude,
      latitude: this.latitude,
      gnssData:this.gnssData,
      sensorPosition: {
        horizontal: this.sensorPosition.horizontal,
        equatorial: this.sensorPosition.equatorial,
        horizontalString: this.sensorPosition.horizontalString,
        equatorialString: this.sensorPosition.equatorialString,
        type:this.sensorPosition.type
      },
      targetPosition: {
        horizontal: this.targetPosition.horizontal,
        equatorial: this.targetPosition.equatorial,
        horizontalString: this.targetPosition.horizontalString,
        equatorialString: this.targetPosition.equatorialString,
        type:this.targetPosition.type
      },
      actualPosition: {
        horizontal: this.actualPosition.horizontal,
        equatorial: this.actualPosition.equatorial,
        horizontalString: this.actualPosition.horizontalString,
        equatorialString: this.actualPosition.equatorialString,
        type:this.actualPosition.type
      },
      stellariumTarget: {
        horizontal: this.stellariumTarget.horizontal,
        equatorial: this.stellariumTarget.equatorial,
        horizontalString: this.stellariumTarget.horizontalString,
        equatorialString: this.stellariumTarget.equatorialString,
        type:this.stellariumTarget.type
      },
      systemInformation: this.systemInformation
    };
  }
}

export default Store;
