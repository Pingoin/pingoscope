package store

import (
	"time"

	gnss "github.com/Pingoin/gpsd-client"
	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/soniakeys/unit"
)

type Store struct {
	SensorPosition     position.StellarPosition
	ActualPosition     position.StellarPosition
	StellariumPosition position.StellarPosition
	TargetPosition     position.StellarPosition
	Gnss               *gnss.GPSD
	Image              string
	GroundPosition     *position.GroundPosition
}

func NewStore(gpsd *gnss.GPSD) *Store {
	az := position.AltAzPos{Altitude: 0, Azimuth: 0}
	ground := &position.GroundPosition{}
	store := Store{
		GroundPosition:     ground,
		SensorPosition:     position.NewStellarPositionAltAz(az, ground),
		ActualPosition:     position.NewStellarPositionAltAz(az, ground),
		StellariumPosition: position.NewStellarPositionAltAz(az, ground),
		TargetPosition:     position.NewStellarPositionAltAz(az, ground),
		Gnss:               gpsd,
	}
	store.SensorPosition.SetGround(store.GroundPosition)
	store.ActualPosition.SetGround(store.GroundPosition)
	store.StellariumPosition.SetGround(store.GroundPosition)
	go store.refreshGround()
	return &store
}

func (store *Store) GetData() StoreData {
	data := StoreData{}
	data.SensorPosition = store.SensorPosition.GetData()
	data.ActualPosition = store.ActualPosition.GetData()
	data.StellariumTarget = store.StellariumPosition.GetData()
	data.TargetPosition = store.TargetPosition.GetData()
	data.Latitude = store.Gnss.Latitude
	data.Longitude = store.Gnss.Longitude
	data.Gnss = *store.Gnss
	return data
}

func (store *Store) refreshGround() {
	for {
		time.Sleep(time.Second * 5)
		store.GroundPosition.Latitude = unit.AngleFromDeg(store.Gnss.Latitude)
		store.GroundPosition.Longitude = unit.AngleFromDeg(store.Gnss.Longitude)
	}
}
