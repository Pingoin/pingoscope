package store

import (
	"time"

	"github.com/Pingoin/pingoscope/pkg/position"
)

type Store struct {
	Data StoreData
}

func NewStore() Store {
	return Store{
		Data: StoreData{
			MagneticDeclination: 0,
			Longitude:           1,
			Latitude:            1,
			SensorPosition: position.StellarPositionData{
				Equatorial: position.EqPos{Declination: 0, RightAscension: 0},
				Horizontal: position.AltAzPos{Altitude: 0, Azimuth: 0},
			},
			TargetPosition: position.StellarPositionData{
				Equatorial: position.EqPos{Declination: 0, RightAscension: 0},
				Horizontal: position.AltAzPos{Altitude: 0, Azimuth: 0},
			},
			StellariumTarget: position.StellarPositionData{
				Equatorial: position.EqPos{Declination: 0, RightAscension: 0},
				Horizontal: position.AltAzPos{Altitude: 0, Azimuth: 0},
			},
			ActualPosition: position.StellarPositionData{
				Equatorial: position.EqPos{Declination: 0, RightAscension: 0},
				Horizontal: position.AltAzPos{Altitude: 0, Azimuth: 0},
			},
			SystemInformation: sysInfo{
				CpuTemp: 0,
			},
			GnssData: gnssData{
				Errors:      0,
				Processed:   0,
				Time:        time.Now(),
				Lat:         0,
				Lon:         0,
				Alt:         0,
				Speed:       0,
				Track:       0,
				SatsActive:  []float64{},
				SatsVisible: []satData{},
				Fix:         "",
				Hdop:        0,
				Pdop:        0,
				Vdop:        0,
			},
		},
	}
}
