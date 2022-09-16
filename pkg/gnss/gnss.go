package gnss

import (
	"fmt"

	"github.com/stratoberry/go-gpsd"

	"github.com/Pingoin/pingoscope/pkg/position"

	"github.com/soniakeys/unit"
)

var groundPosition *position.GroundPosition
var data *GnssData
var fix []string = []string{"unkown", "no fix", "2D", "3D"}

func StartGNSS(position *position.GroundPosition, inputData *GnssData) {
	data = inputData
	groundPosition = position

	var gps *gpsd.Session
	var err error

	if gps, err = gpsd.Dial(gpsd.DefaultAddress); err != nil {
		panic(fmt.Sprintf("Failed to connect to GPSD: %s", err))
	}

	gps.AddFilter("TPV", tpvFilter)
	gps.AddFilter("SKY", skyfilter)
	done := gps.Watch()
	<-done
}

func tpvFilter(r interface{}) {
	tpv := r.(*gpsd.TPVReport)

	mode := tpv.Mode
	data.Fix = fix[mode]
	data.Alt = tpv.Alt
	groundPosition.Latitude = unit.AngleFromDeg(tpv.Lat)
	groundPosition.Longitude = unit.AngleFromDeg(tpv.Lon)
}

func skyfilter(r interface{}) {
	sky := r.(*gpsd.SKYReport)
	data.Hdop = sky.Hdop
	data.Pdop = sky.Pdop
	data.Vdop = sky.Vdop
	sats := sky.Satellites
	gpsSats := make([]GSVInfo, 0)
	glonassSats := make([]GSVInfo, 0)
	baidouSats := make([]GSVInfo, 0)
	galileoSats := make([]GSVInfo, 0)

	for _, sat := range sats {
		newSat := GSVInfo{
			SVPRNNumber: sat.PRN,
			Elevation:   sat.El,
			Azimuth:     sat.Az,
			SNR:         sat.Ss,
			Used:        sat.Used,
		}

		if (newSat.SVPRNNumber >= 1) && (newSat.SVPRNNumber <= 63) {
			gpsSats = append(gpsSats, newSat)
		} else if (newSat.SVPRNNumber >= 64) && (newSat.SVPRNNumber <= 96) {
			glonassSats = append(glonassSats, newSat)
		} else {
			galileoSats = append(galileoSats, newSat)
		}
	}
	data.SatsGpsVisible = gpsSats
	data.SatsGlonassVisible = glonassSats
	data.SatsGalileoVisible = galileoSats
	data.SatsBeidouVisible = baidouSats
}
