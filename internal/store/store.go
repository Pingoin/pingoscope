package store

import (
	"github.com/Pingoin/pingoscope/pkg/gnss"
	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/adrianmo/go-nmea"
)

type Store struct {
	data               StoreData
	SensorPosition     position.StellarPosition
	ActualPosition     position.StellarPosition
	StellariumPosition position.StellarPosition
	GroundPosition     position.GroundPosition
	GnssData           gnss.GnssData
}

func NewStore(ground position.GroundPosition) Store {
	az := position.AltAzPos{Altitude: 0, Azimuth: 0}

	gnssTemp := gnss.GnssData{
		Alt:                0,
		SatsGpsVisible:     []nmea.GSVInfo{},
		SatsGlonassVisible: []nmea.GSVInfo{},
		SatsGalileoVisible: []nmea.GSVInfo{},
		SatsBeidouVisible:  []nmea.GSVInfo{},
		Fix:                "",
		Hdop:               0,
		Pdop:               0,
		Vdop:               0,
	}
	store := Store{
		data: StoreData{
			MagneticDeclination: 4.83,
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
			GnssData: gnssTemp,
		},
		SensorPosition:     position.NewStellarPositionAltAz(az, &ground),
		ActualPosition:     position.NewStellarPositionAltAz(az, &ground),
		StellariumPosition: position.NewStellarPositionAltAz(az, &ground),
		GroundPosition:     ground,
		GnssData:           gnssTemp,
	}

	store.SensorPosition.SetGround(&store.GroundPosition)
	store.ActualPosition.SetGround(&store.GroundPosition)
	store.StellariumPosition.SetGround(&store.GroundPosition)
	return store
}

func (store *Store) GetData() StoreData {
	store.data.SensorPosition = store.SensorPosition.GetData()
	store.data.ActualPosition = store.ActualPosition.GetData()
	store.data.StellariumTarget = store.StellariumPosition.GetData()
	store.data.Latitude = store.GroundPosition.Latitude.Deg()
	store.data.Longitude = store.GroundPosition.Longitude.Deg()
	store.data.GnssData = store.GnssData
	return store.data
}
