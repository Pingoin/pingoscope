package imu

import (
	"time"

	"github.com/Pingoin/pingoscope/internal/store"
	"github.com/kpeu3i/bno055"
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
		storeData.Data.SensorPosition.Horizontal.Altitude = float64(vector.Z)
		storeData.Data.SensorPosition.Horizontal.Azimuth = float64(vector.X)
		//fmt.Printf("\r*** Euler angles: x=%5.3f, y=%5.3f, z=%5.3f", vector.X, vector.Y, vector.Z)
		time.Sleep(100 * time.Millisecond)
	}
}

func Close() error {
	return sensor.Close()
}
