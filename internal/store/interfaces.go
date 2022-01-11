package store

import (
	"time"

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
	GnssData            gnssData                     `json:"gnssData"`
}

type sysInfo struct {
	CpuTemp float64 `json:"cpuTemp"`
}
type gnssData struct {
	Errors      float64   `json:"errors"`
	Processed   float64   `json:"processed"`
	Time        time.Time `json:"time"`
	Lat         float64   `json:"lat"`
	Lon         float64   `json:"lon"`
	Alt         float64   `json:"alt"`
	Speed       float64   `json:"speed"`
	Track       float64   `json:"track"`
	SatsActive  []float64 `json:"satsActive"`
	SatsVisible []satData `json:"satsVisible"`
	Fix         string    `json:"fix"`
	Hdop        float64   `json:"hdop"`
	Pdop        float64   `json:"pdop"`
	Vdop        float64   `json:"vdop"`
}

type satData struct {
	Pprn      float64 `json:"prn"`
	Elevation float64 `json:"elevation"`
	Azimuth   float64 `json:"azimuth"`
	Snr       float64 `json:"snr"`
	Status    string  `json:"status"`
}
