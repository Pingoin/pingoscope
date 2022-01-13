package gnss

import (
	"github.com/adrianmo/go-nmea"
)

type GnssData struct {
	Alt                float64        `json:"alt"`
	SatsGpsVisible     []nmea.GSVInfo `json:"satsGpsVisible"`
	SatsGlonassVisible []nmea.GSVInfo `json:"satsGlonassVisible"`
	SatsGalileoVisible []nmea.GSVInfo `json:"satsGalileoVisible"`
	SatsBeidouVisible  []nmea.GSVInfo `json:"satsBeidouVisible"`
	Fix                string         `json:"fix"`
	Hdop               float64        `json:"hdop"`
	Pdop               float64        `json:"pdop"`
	Vdop               float64        `json:"vdop"`
}
