import {
    EquatorialCoordinates,
    HorizontalCoordinates
  } from "astronomical-algorithms/dist/coordinates";
  import aa from "./astronomical-algorithms";
  import { degreesToString, hoursToString } from "./helper";

export default class StellarPosition {
    private _vertical: number;
    private _horizontal: number;
    private type: "horizontal" | "equatorial";
    longitude = 14 + 2 / 60 + 40.92 / 3600;
    latitude = 53 + 44 / 60 + 16.44 / 3600;
  
    constructor(
      type: "horizontal" | "equatorial"
    ) {
      this._horizontal=0;
      this._vertical = 0;
      this.type = type;
    }
  
    get equatorial(): EquatorialCoordinates {
      if (this.type == "equatorial") {
        return {
          declination: this._vertical,
          rightAscension: this._horizontal
        };
      } else {
        const jd = aa.julianday.getJulianDay(new Date()) || 0;
        return aa.coordinates.transformHorizontalToEquatorial(
          jd,
          this._vertical,
          this._horizontal,
          this.longitude,
          this.latitude
        );
      }
    }
  

  
    set equatorial(val: EquatorialCoordinates) {
      if (this.type == "equatorial") {
        this._vertical = val.declination;
        this._horizontal = val.rightAscension;
      } else {
        const jd = aa.julianday.getJulianDay(new Date()) || 0;
        const hori = aa.coordinates.transformEquatorialToHorizontal(
          jd,
          this.longitude,
          this.latitude,
          val.rightAscension,
          val.declination
        );
  
        this._vertical = hori.altitude;
        this._horizontal = hori.azimuth;
      }
    }
  
    get horizontal(): HorizontalCoordinates {
      if (this.type == "horizontal") {
        return {
          altitude: this._vertical,
          azimuth: this._horizontal
        };
      } else {
        const jd = aa.julianday.getJulianDay(new Date()) || 0;
        return aa.coordinates.transformEquatorialToHorizontal(
          jd,
          this.longitude,
          this.latitude,
          this._horizontal,
          this._vertical
        );
      }
    }
 
    set horizontal(val: HorizontalCoordinates) {
      if (this.type == "horizontal") {
        this._vertical = val.altitude;
        this._horizontal = val.azimuth;
      } else {
        const jd = aa.julianday.getJulianDay(new Date()) || 0;
        const eq = aa.coordinates.transformHorizontalToEquatorial(
          jd,
          this._vertical,
          this._horizontal,
          this.longitude,
          this.latitude
        );
        this._vertical = eq.declination;
        this._horizontal = eq.rightAscension;
      }
    }

    get horizontalString(): { azimuth: string; altitude: string } {
        const hori = this.horizontal;
        return {
          altitude: degreesToString(hori.altitude),
          azimuth: degreesToString(hori.azimuth)
        };
      }

      get equatorialString(): {
        declination: string;
        rightAscension: string;
      } {
        const eq = this.equatorial;
        return {
          declination: degreesToString(eq.declination),
          rightAscension: hoursToString(eq.rightAscension)
        };
      }
  }