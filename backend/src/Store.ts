/** @format */

import StellarPosition from "./StellarPosition";
import StoreData from "../../shared/StoreData";
import * as geomag from "geomag";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Store extends StoreData {}
/**
 * central data store
 */
export class Store {
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
    this.latitude = 53 + 44 / 60 + 16.44 / 3600;
    this.longitude = 14 + 2 / 60 + 40.92 / 3600;
  }
  /**
   * exports the Object to an JSON-String
   */
  public simplify(): StoreData {
    return {
      magneticDeclination: this.magneticDeclination,
      longitude: this.longitude,
      latitude: this.latitude,
      sensorPosition: {
        horizontal: this.sensorPosition.horizontal,
        equatorial: this.sensorPosition.equatorial,
        horizontalString: this.sensorPosition.horizontalString,
        equatorialString: this.sensorPosition.equatorialString
      },
      targetPosition: {
        horizontal: this.targetPosition.horizontal,
        equatorial: this.targetPosition.equatorial,
        horizontalString: this.targetPosition.horizontalString,
        equatorialString: this.targetPosition.equatorialString
      },
      actualPosition: {
        horizontal: this.actualPosition.horizontal,
        equatorial: this.actualPosition.equatorial,
        horizontalString: this.actualPosition.horizontalString,
        equatorialString: this.actualPosition.equatorialString
      },
      stellariumTarget: {
        horizontal: this.stellariumTarget.horizontal,
        equatorial: this.stellariumTarget.equatorial,
        horizontalString: this.stellariumTarget.horizontalString,
        equatorialString: this.stellariumTarget.equatorialString
      }
    };
  }
}

export default Store;
