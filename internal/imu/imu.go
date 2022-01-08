package imu

import (
	"time"

	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/kpeu3i/bno055"
)

var sensor *bno055.Sensor

func Init(sensorPosition *position.Position) {
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
		sensorPosition.Altitude = vector.Z
		sensorPosition.Azimuth = vector.X
		//fmt.Printf("\r*** Euler angles: x=%5.3f, y=%5.3f, z=%5.3f", vector.X, vector.Y, vector.Z)
		time.Sleep(100 * time.Millisecond)
	}
}

func Close() error {
	return sensor.Close()
}
