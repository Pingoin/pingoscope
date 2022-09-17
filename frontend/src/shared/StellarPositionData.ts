/** @format */

export interface StellarPositionData {
  equatorial: {
    declination: number;
    rightAscension: number;
  };
  horizontal: {
    altitude: number;
    azimuth: number;
  };
}

export interface Direction{
  dir:"up"|"down"|"left"|"right";
}