// ************************************************************************************
// Original Copyright Notice
// ************************************************************************************
// by Ned Wright
// 25 Jul 1999
// Copyright Edward L. Wright, all rights reserved.
//
// Adapted/modernized by Stuart Lowe @ dotAstronomy 2012, Heidelberg
//
// Corrected and covered by unit tests by Cédric Foellmi @onekiloparsec
// (https://github.com/onekiloparsec) February 2020
//
// ************************************************************************************
// See also Ned Wright's cosmology tutorial:
// http://www.astro.ucla.edu/~wright/cosmo_01.htm
// ************************************************************************************

import { SPEED_OF_LIGHT } from "./constants";

const Tyr = 977.8; // coefficent for converting 1/H into Gyr
const INTEGRAL_POINTS_NUMBER = 2000;

export function omegaR(H0: number): number {
  const h = H0 / 100;
  return 4.165e-5 / (h * h); // includes 3 massless neutrino species, T0 = 2.72528
}

export function omegaK(H0: number, WM: number, WV: number): number {
  const WR = omegaR(H0);
  return 1 - WM - WR - WV;
}

export function universeAge(H0: number, WM: number, WV: number): number {
  const az = 1.0;
  const WR = omegaR(H0);
  const WK = omegaK(H0, WM, WV);

  let age = 0;
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = (az * (i + 0.5)) / INTEGRAL_POINTS_NUMBER;
    const adot = Math.sqrt(WK + WM / a + WR / (a * a) + WV * a * a);
    age = age + 1 / adot;
  }
  age = age / INTEGRAL_POINTS_NUMBER;

  return age * (Tyr / H0);
}

export function universeAgeAtRedshift(
  H0: number,
  WM: number,
  WV: number,
  z: number
): number {
  const az = 1.0 / (1 + z);
  const WR = omegaR(H0);
  const WK = omegaK(H0, WM, WV);

  let age = 0;
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = (az * (i + 0.5)) / INTEGRAL_POINTS_NUMBER;
    const adot = Math.sqrt(WK + WM / a + WR / (a * a) + WV * a * a);
    age = age + 1 / adot;
  }

  const zage = (az * age) / INTEGRAL_POINTS_NUMBER;

  // correction for annihilations of particles not present now like e+/e-
  // added 13-Aug-03 based on T_vs_t.f
  const lpz = Math.log(1 + z) / Math.log(10.0);
  let dzage = 0;
  if (lpz > 7.5) dzage = 0.002 * (lpz - 7.5);
  if (lpz > 8.0) dzage = 0.014 * (lpz - 8.0) + 0.001;
  if (lpz > 8.5) dzage = 0.04 * (lpz - 8.5) + 0.008;
  if (lpz > 9.0) dzage = 0.02 * (lpz - 9.0) + 0.028;
  if (lpz > 9.5) dzage = 0.019 * (lpz - 9.5) + 0.039;
  if (lpz > 10.0) dzage = 0.048;
  if (lpz > 10.775) dzage = 0.035 * (lpz - 10.775) + 0.048;
  if (lpz > 11.851) dzage = 0.069 * (lpz - 11.851) + 0.086;
  if (lpz > 12.258) dzage = 0.461 * (lpz - 12.258) + 0.114;
  if (lpz > 12.382) dzage = 0.024 * (lpz - 12.382) + 0.171;
  if (lpz > 13.055) dzage = 0.013 * (lpz - 13.055) + 0.188;
  if (lpz > 14.081) dzage = 0.013 * (lpz - 14.081) + 0.201;
  if (lpz > 15.107) dzage = 0.214;

  // Gyr
  return (Tyr / H0) * zage * Math.pow(10.0, dzage);
}

export function lightTravelTime(
  H0: number,
  WM: number,
  WV: number,
  z: number
): number {
  let DTT = 0.0;
  const az = 1.0 / (1 + z);
  const WR = omegaR(H0);
  const WK = omegaK(H0, WM, WV);

  // do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az + ((1 - az) * (i + 0.5)) / INTEGRAL_POINTS_NUMBER;
    const adot = Math.sqrt(WK + WM / a + WR / (a * a) + WV * a * a);
    DTT = DTT + 1 / adot;
  }

  DTT = ((1 - az) * DTT) / INTEGRAL_POINTS_NUMBER;

  // Gyr
  return (Tyr / H0) * DTT;
}

export function comovingRadialDistance(
  H0: number,
  WM: number,
  WV: number,
  z: number
): number {
  let DCMR = 0.0;
  const az = 1.0 / (1 + z);
  const WR = omegaR(H0);
  const WK = omegaK(H0, WM, WV);

  // do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az + ((1 - az) * (i + 0.5)) / INTEGRAL_POINTS_NUMBER;
    const adot = Math.sqrt(WK + WM / a + WR / (a * a) + WV * a * a);
    DCMR = DCMR + 1 / (a * adot);
  }

  DCMR = ((1 - az) * DCMR) / INTEGRAL_POINTS_NUMBER;

  // Mpc
  return (SPEED_OF_LIGHT / H0) * DCMR;
}

export function comovingVolume(WK: number, DCMR: number): number {
  const x = Math.sqrt(Math.abs(WK)) * DCMR;
  if (x > 0.1) {
    const ratio =
      WK > 0
        ? (0.125 * (Math.exp(2 * x) - Math.exp(-2 * x)) - x / 2) /
          ((x * x * x) / 3)
        : (x / 2 - Math.sin(2 * x) / 4) / ((x * x * x) / 3);
    return (ratio * DCMR * DCMR * DCMR) / 3;
  }

  let y = x * x;
  // statement below fixed 13-Aug-03 to correct sign error in expansion
  if (WK < 0) {
    y = -y;
  }
  const ratio = 1 + y / 5 + (2 / 105) * y * y;
  return (ratio * DCMR * DCMR * DCMR) / 3;
}

export function comovingVolumeWithinRedshift(
  H0: number,
  WM: number,
  WV: number,
  z: number
): number {
  const az = 1.0 / (1 + z);
  const WR = omegaR(H0);
  const WK = omegaK(H0, WM, WV);
  let DCMR = 0.0;
  // do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az + ((1 - az) * (i + 0.5)) / INTEGRAL_POINTS_NUMBER;
    const adot = Math.sqrt(WK + WM / a + WR / (a * a) + WV * a * a);
    DCMR = DCMR + 1 / (a * adot);
  }
  DCMR = ((1 - az) * DCMR) / INTEGRAL_POINTS_NUMBER;
  const VCM = comovingVolume(WK, DCMR);

  // Gpc^3
  return 4 * Math.PI * Math.pow((0.001 * SPEED_OF_LIGHT) / H0, 3) * VCM;
}

export function tangentialComovingDistance(
  H0: number,
  WM: number,
  WV: number,
  z: number
): number {
  const az = 1.0 / (1 + z);
  const WR = omegaR(H0);
  const WK = omegaK(H0, WM, WV);

  let DCMR = 0.0;
  // do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az + ((1 - az) * (i + 0.5)) / INTEGRAL_POINTS_NUMBER;
    const adot = Math.sqrt(WK + WM / a + WR / (a * a) + WV * a * a);
    DCMR = DCMR + 1 / (a * adot);
  }
  DCMR = ((1 - az) * DCMR) / INTEGRAL_POINTS_NUMBER;

  let ratio = 1.0;
  const x = Math.sqrt(Math.abs(WK)) * DCMR;
  if (x > 0.1) {
    ratio = WK > 0 ? (0.5 * (Math.exp(x) - Math.exp(-x))) / x : Math.sin(x) / x;
    return ratio * DCMR;
  }

  let y = x * x;
  // statement below fixed 13-Aug-03 to correct sign error in expansion
  if (WK < 0) y = -y;
  ratio = 1 + y / 6 + (y * y) / 120;
  return ratio * DCMR;
}

export function angularSizeDistance(
  H0: number,
  WM: number,
  WV: number,
  z: number
): number {
  const az = 1.0 / (1 + z);
  const DA = az * tangentialComovingDistance(H0, WM, WV, z);
  // Mpc
  return (SPEED_OF_LIGHT / H0) * DA;
}

export function angularSizeScale(
  H0: number,
  WM: number,
  WV: number,
  z: number
): number {
  const DA = angularSizeDistance(H0, WM, WV, z);
  const DAMpc = (SPEED_OF_LIGHT / H0) * DA;
  return DAMpc / 206.264806;
}

export function luminosityDistance(
  H0: number,
  WM: number,
  WV: number,
  z: number
) {
  const az = 1.0 / (1 + z);
  const DA = angularSizeDistance(H0, WM, WV, z);
  return DA / (az * az);
}
