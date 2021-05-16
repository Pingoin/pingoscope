/** @format */

export default interface StellarPositionData {
  equatorial: {
    declination: number;
    rightAscension: number;
  };
  horizontal: {
    altitude: number;
    azimuth: number;
  };
  horizontalString: { azimuth: string; altitude: string };
  equatorialString: {
    declination: string;
    rightAscension: string;
  };
}
