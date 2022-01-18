package position

import (
	"math"
	"time"

	"github.com/soniakeys/meeus/v3/coord"
	"github.com/soniakeys/meeus/v3/julian"
	"github.com/soniakeys/meeus/v3/sidereal"
	"github.com/soniakeys/unit"
)

type Position struct {
	Altitude float32 `json:"alt"`
	Azimuth  float32 `json:"az"`
}

type StellarPositionData struct {
	Equatorial EqPos    `json:"equatorial"`
	Horizontal AltAzPos `json:"horizontal"`
}

type EqPos struct {
	Declination    unit.Angle `json:"declination"`
	RightAscension unit.RA    `json:"rightAscension"`
}

type AltAzPos struct {
	Altitude unit.Angle `json:"altitude"`
	Azimuth  unit.Angle `json:"azimuth"`
}

type GroundPosition struct {
	Latitude  unit.Angle
	Longitude unit.Angle
}

type StellarPosition struct {
	isEq   bool
	eq     EqPos
	altAz  AltAzPos
	ground *GroundPosition
}

func NewStellarPositionEq(eqPos EqPos, ground *GroundPosition) StellarPosition {
	altAz := AltAzPos{Altitude: 0, Azimuth: 0}
	return StellarPosition{isEq: true, eq: eqPos, ground: ground, altAz: altAz}
}
func NewStellarPositionAltAz(altAz AltAzPos, ground *GroundPosition) StellarPosition {
	eqPos := EqPos{0, 0}
	return StellarPosition{isEq: false, eq: eqPos, ground: ground, altAz: altAz}
}

func (pos *StellarPosition) GetData() StellarPositionData {
	eq := pos.eq
	alt := pos.altAz
	jd := julian.TimeToJD(time.Now())
	s0 := sidereal.Apparent0UT(jd)

	if pos.isEq {
		pos.altAz.Azimuth, pos.altAz.Altitude = coord.EqToHz(
			eq.RightAscension,
			eq.Declination,
			pos.ground.Latitude,
			-pos.ground.Longitude,
			s0,
		)
		pos.altAz.Azimuth += math.Pi
	} else {
		pos.eq.RightAscension, pos.eq.Declination = coord.HzToEq(
			alt.Azimuth+math.Pi,
			alt.Altitude,
			pos.ground.Latitude,
			-pos.ground.Longitude,
			s0,
		)
	}
	return StellarPositionData{Equatorial: pos.eq, Horizontal: pos.altAz}
}

func (pos *StellarPosition) SetGround(ground *GroundPosition) {
	pos.ground = ground
}
func (pos *StellarPosition) SetEq(isEq bool) {
	jd := julian.TimeToJD(time.Now())
	if isEq {
		alt := pos.GetData().Horizontal
		ra, dec := coord.HzToEq(
			alt.Azimuth+math.Pi,
			alt.Altitude,
			pos.ground.Latitude,
			pos.ground.Longitude,
			sidereal.Apparent(jd))
		pos.eq.RightAscension = ra
		pos.eq.Declination = dec
		pos.isEq = true
	} else {
		eq := pos.eq
		A, h := coord.EqToHz(
			eq.RightAscension,
			eq.Declination,
			pos.ground.Latitude,
			pos.ground.Longitude,
			sidereal.Apparent(jd))
		pos.altAz.Azimuth = A + math.Pi
		pos.altAz.Altitude = h
		pos.isEq = false
	}
}

func (pos *StellarPosition) SetEqPos(eq EqPos) {
	pos.eq = eq

	if !pos.isEq {
		jd := julian.TimeToJD(time.Now())
		pos.altAz.Azimuth, pos.altAz.Altitude = coord.EqToHz(
			eq.RightAscension,
			eq.Declination,
			pos.ground.Latitude,
			pos.ground.Longitude,
			sidereal.Apparent(jd))
		pos.altAz.Azimuth += math.Pi
	}
}
