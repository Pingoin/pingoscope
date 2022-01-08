// main.go
package main

import (
	"flag"
	"fmt"
	"math"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Pingoin/pingoscope/internal/altazdriver"
	"github.com/Pingoin/pingoscope/internal/api"
	"github.com/Pingoin/pingoscope/internal/imu"
	"github.com/Pingoin/pingoscope/pkg/position"

	"github.com/soniakeys/meeus/v3/coord"
	"github.com/soniakeys/meeus/v3/julian"
	"github.com/soniakeys/meeus/v3/sidereal"
	sexa "github.com/soniakeys/sexagesimal"
	"github.com/soniakeys/unit"
	"github.com/stianeikeland/go-rpio/v4"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 8080, "The port to listen on")
	flag.Parse()

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

	//azStep dir sollte 19 sein, nut test auf 3
	driver := altazdriver.NewAltAzDriver(3, 13, 12, 18, 24, 4)
	go driver.Altitude.Loop()
	go driver.Azimuth.Loop()
	fmt.Printf("azimuth: %v\n", driver.Azimuth.GetData())
	go api.HandleRequests(fmt.Sprintf(":%d", port), &driver, &sensorPosition)
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
