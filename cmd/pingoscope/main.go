// main.go
package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Pingoin/pingoscope/internal/api"
	"github.com/Pingoin/pingoscope/internal/imu"
	"github.com/Pingoin/pingoscope/internal/store"
	"github.com/Pingoin/pingoscope/pkg/altazdriver"
	"github.com/Pingoin/pingoscope/pkg/lx200"
	"github.com/Pingoin/pingoscope/pkg/stellariumadapter"

	gnss "github.com/Pingoin/gpsd-client"

	"github.com/stianeikeland/go-rpio/v4"
)

const (
	connHost = "localhost"
	connPort = "8888"
	connType = "tcp"
)

func main() {

	var port int
	flag.IntVar(&port, "port", 8080, "The port to listen on")
	flag.Parse()
	gps := gnss.NewGPSD("localhost:2947", 0, 0)
	go gps.Start()

	storefiles := store.NewStore(gps)
	connect := lx200.NewLx200(storefiles.GroundPosition)
	ascomTcp := lx200.NewTCP("", "4030", connect)
	go ascomTcp.Start()
	defer ascomTcp.Stop()

	go stellariumadapter.Socket(connType, connHost, connPort, &storefiles.StellariumPosition, &storefiles.ActualPosition)

	err := rpio.Open()

	if err != nil {
		panic(err)
	}
	//go raspicam.Cam(&storefiles.Image)
	//azStep dir sollte 19 sein, nut test auf 3
	driver := altazdriver.NewAltAzDriver(3, 13, 12, 18, 24, 4, storefiles.GroundPosition, &storefiles.ActualPosition)
	go driver.Altitude.Loop()
	go driver.Azimuth.Loop()
	fmt.Printf("azimuth: %v\n", driver.Azimuth.GetData())
	go api.HandleRequests(fmt.Sprintf(":%d", port), &driver, storefiles)
	go imu.Init(storefiles)

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
