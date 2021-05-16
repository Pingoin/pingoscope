/* eslint-disable @typescript-eslint/no-unused-vars */
/** @format */

import {
  DEG2H,
  DEG2RAD,
  H2RAD,
  RAD2DEG,
  RAD2H,
  JulianDay,
  Degree,
  Hour,
  Pixel
} from "./constants";
import { fmod } from "./utils";
import * as julianday from "./julianday";

const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;
const asin = Math.asin;
const atan = Math.atan2;

export interface EquatorialCoordinates {
  rightAscension: Hour;
  declination: Degree;
}

export interface EclipticCoordinates {
  longitude: Degree;
  latitude: Degree;
}

export interface HorizontalCoordinates {
  azimuth: Degree;
  altitude: Degree;
}

export interface Point {
  x: Pixel;
  y: Pixel;
}

export function horizontalAltitude(
  jd: JulianDay,
  lng: Degree,
  lat: Degree,
  ra: Hour,
  dec: Degree
): Degree {
  const lmst = julianday.localSiderealTime(jd, lng);
  const hourAngle = ((lmst - ra) * 360) / 24;
  return (
    asin(
      sin(lat * DEG2RAD) * sin(dec * DEG2RAD) +
        cos(lat * DEG2RAD) * cos(dec * DEG2RAD) * cos(hourAngle * DEG2RAD)
    ) * RAD2DEG
  );
}

export function horizontalAzimuth(
  jd: JulianDay,
  lng: Degree,
  lat: Degree,
  ra: Hour,
  dec: Degree
): Degree {
  const lmst = julianday.localSiderealTime(jd, lng);
  const hourAngle = ((lmst - ra) * 360) / 24;
  const azimuth =
    atan(
      sin(hourAngle * DEG2RAD),
      cos(hourAngle * DEG2RAD) * sin(lat * DEG2RAD) -
        tan(dec * DEG2RAD) * cos(lat * DEG2RAD)
    ) *
      RAD2DEG +
    180;

  return azimuth;
}

/**
 *
 * @param jd
 * @param lng
 * @param lat
 * @param ra
 * @param dec
 */
export function transformEquatorialToHorizontal(
  jd: JulianDay,
  lng: Degree,
  lat: Degree,
  ra: Hour,
  dec: Degree
): HorizontalCoordinates {
  return {
    azimuth: horizontalAzimuth(jd, lng, lat, ra, dec),
    altitude: horizontalAltitude(jd, lng, lat, ra, dec)
  };
}

export function rightAscensionFromHorizontal(
  jd: JulianDay,
  alt: Degree,
  az: Degree,
  lng: Degree,
  lat: Degree
): Hour {
  const lmst = julianday.localSiderealTime(jd, lng);
  az -= 180;
  const hourAngle = fmod(
    atan(
      sin(az * DEG2RAD),
      cos(az * DEG2RAD) * sin(lat * DEG2RAD) +
        tan(alt * DEG2RAD) * cos(lat * DEG2RAD)
    ) *
      RAD2H +
      24.0,
    24.0
  );
  return lmst - hourAngle;
}

export function declinationFromHorizontal(
  jd: JulianDay,
  alt: Degree,
  az: Degree,
  lat: Degree
): Degree {
  az -= 180;
  return (
    asin(
      sin(lat * DEG2RAD) * sin(alt * DEG2RAD) -
        cos(lat * DEG2RAD) * cos(alt * DEG2RAD) * cos(az * DEG2RAD)
    ) * RAD2DEG
  );
}

export function transformHorizontalToEquatorial(
  jd: JulianDay,
  alt: Degree,
  az: Degree,
  lng: Degree,
  lat: Degree
): EquatorialCoordinates {
  return {
    rightAscension: fmod(
      rightAscensionFromHorizontal(jd, alt, az, lng, lat) + 24.0,
      24.0
    ),
    declination: declinationFromHorizontal(jd, alt, az, lat)
  };
}
