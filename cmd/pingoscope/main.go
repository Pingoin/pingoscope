// main.go
package main

import (
	"fmt"

	"math"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Pingoin/pingoscope/internal/api"
	"github.com/Pingoin/pingoscope/internal/imu"
	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/Pingoin/pingoscope/pkg/stepper"

	"github.com/soniakeys/meeus/v3/coord"
	"github.com/soniakeys/meeus/v3/julian"
	"github.com/soniakeys/meeus/v3/sidereal"
	sexa "github.com/soniakeys/sexagesimal"
	"github.com/soniakeys/unit"
	"github.com/stianeikeland/go-rpio/v4"
)

// Article - Our struct for all articles

var azimuth stepper.Stepper

func main() {
	sensorPosition := position.Position{Azimuth: 0, Altitude: 0}

	// Example 13.b, p. 95.
	jd := julian.TimeToJD(time.Now())
	A, h := coord.EqToHz(
		unit.NewRA(5, 15, 35.05),
		unit.NewAngle('-', 8, 10, 36.7),
		unit.NewAngle(' ', 53, 38, 2.77),
		unit.NewAngle('-', 14, 0, 48.16),
		sidereal.Apparent(jd))
	fmt.Printf("A = %+.3j\n", sexa.FmtAngle(A+math.Pi))
	fmt.Printf("h = %+.3j\n", sexa.FmtAngle(h))

	err := rpio.Open()
	if err != nil {
		panic(err)
	}
	azStep := rpio.Pin(3)
	azStep.Output()
	azDir := rpio.Pin(4)
	azDir.Output()
	azEna := rpio.Pin(5)
	azEna.Output()
	azimuth = stepper.New(azStep, azDir, azEna, 1, 200, 10)
	azimuth.SetTarget(5)

	go azimuth.Loop()
	fmt.Printf("azimuth: %v\n", azimuth.GetData())
	go api.HandleRequests(&azimuth, &sensorPosition)
	go imu.Init(&sensorPosition)

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)
	for {
		select {
		case <-signals:
			rpio.Close()
			err := imu.Close()
			panic(err)
		default:
			time.Sleep(time.Millisecond)
		}
	}
}
