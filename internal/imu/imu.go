package imu

import (
	"time"

	"github.com/Pingoin/pingoscope/internal/store"
	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/kpeu3i/bno055"
	"github.com/soniakeys/unit"
)

var sensor *bno055.Sensor

func Init(storeData *store.Store) {
	var err error
	sensor, err = bno055.NewSensor(0x29, 3)
	if err != nil {
		panic(err)
	}

	err = sensor.UseExternalCrystal(false)
	if err != nil {
		panic(err)
	}

	err = sensor.Calibrate(bno055.CalibrationOffsets{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 3, 0, 0})
	if err != nil {
		panic(err)
	}

	for {
		vector, err := sensor.Euler()
		if err != nil {
			panic(err)
		}
		altAz := position.AltAzPos{
			Altitude: unit.AngleFromDeg(float64(vector.Z)),
			Azimuth:  unit.AngleFromDeg(float64(vector.X)),
		}
		storeData.SensorPosition = position.NewStellarPositionAltAz(altAz, storeData.GroundPosition)
		time.Sleep(100 * time.Millisecond)
	}
}

func Close() error {
	return sensor.Close()
}
