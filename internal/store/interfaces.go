package store

import (
	gnss "github.com/Pingoin/gpsd-client"
	"github.com/Pingoin/pingoscope/pkg/position"
)

type StoreData struct {
	MagneticDeclination float64                      `json:"magneticDeclination"`
	Longitude           float64                      `json:"longitude"`
	Latitude            float64                      `json:"latitude"`
	SensorPosition      position.StellarPositionData `json:"sensorPosition"`
	TargetPosition      position.StellarPositionData `json:"targetPosition"`
	StellariumTarget    position.StellarPositionData `json:"stellariumTarget"`
	ActualPosition      position.StellarPositionData `json:"actualPosition"`
	SystemInformation   sysInfo                      `json:"systemInformation"`
	Gnss                gnss.GPSD                    `json:"gnssData"`
}

type sysInfo struct {
	CpuTemp float64 `json:"cpuTemp"`
}
