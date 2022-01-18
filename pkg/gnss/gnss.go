package gnss

import (
	"bufio"
	"fmt"
	"io"
	"log"

	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/adrianmo/go-nmea"
	"github.com/jacobsa/go-serial/serial"
	"github.com/soniakeys/unit"
)

type Gnss struct {
	position *position.GroundPosition
	reader   *bufio.Reader
	serial   io.ReadWriteCloser
	data     *GnssData
}

func NewGnss(position *position.GroundPosition, data *GnssData, options serial.OpenOptions) Gnss {
	// Open the port.
	port, err := serial.Open(options)
	if err != nil {
		fmt.Printf("serial.Open: %v \n", err)
	}
	reader := bufio.NewReader(port)

	result := Gnss{
		position: position,
		reader:   reader,
		serial:   port,
		data:     data,
	}
	return result
}

func (gnss *Gnss) Close() {
	gnss.serial.Close()
}

func (gnss *Gnss) Loop() {
	_, _ = gnss.reader.ReadBytes('\x0a')
	for {
		buffer, _ := gnss.reader.ReadBytes('\x0a')
		s, err := nmea.Parse(string(buffer))
		if err != nil {
			log.Println(err)
		} else {
			if s.DataType() == nmea.TypeRMC {
				m := s.(nmea.RMC)
				if m.Validity == "A" {
					*gnss.position = position.GroundPosition{
						Latitude:  unit.AngleFromDeg(m.Latitude),
						Longitude: unit.AngleFromDeg(m.Longitude),
					}
				}
			} else if s.DataType() == nmea.TypeGSV {
				gsv := s.(nmea.GSV)

				switch gsv.Talker {
				case "GL":
					if gsv.MessageNumber == 1 {
						gnss.data.SatsGlonassVisible = []nmea.GSVInfo{}
					}
					gnss.data.SatsGlonassVisible = append(gnss.data.SatsGlonassVisible, gsv.Info...)
				case "GP":
					if gsv.MessageNumber == 1 {
						gnss.data.SatsGpsVisible = []nmea.GSVInfo{}
					}
					gnss.data.SatsGpsVisible = append(gnss.data.SatsGpsVisible, gsv.Info...)
				case "GA":
					if gsv.MessageNumber == 1 {
						gnss.data.SatsGalileoVisible = []nmea.GSVInfo{}
					}
					gnss.data.SatsGalileoVisible = append(gnss.data.SatsGalileoVisible, gsv.Info...)
				case "GB", "BD":
					if gsv.MessageNumber == 1 {
						gnss.data.SatsBeidouVisible = []nmea.GSVInfo{}
					}
					gnss.data.SatsBeidouVisible = append(gnss.data.SatsBeidouVisible, gsv.Info...)
				}
			} else if s.DataType() == nmea.TypeGSA {
				gsa := s.(nmea.GSA)
				gnss.data.Hdop = gsa.HDOP
				gnss.data.Pdop = gsa.PDOP
				gnss.data.Vdop = gsa.VDOP
				gnss.data.Fix = gsa.FixType
			} else if s.DataType() == nmea.TypeGGA {
				gga := s.(nmea.GGA)
				gnss.data.Alt = gga.Altitude
			}

		}
	}
}
