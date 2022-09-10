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
	"github.com/Pingoin/pingoscope/pkg/gnss"
	"github.com/Pingoin/pingoscope/pkg/lx200"
	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/Pingoin/pingoscope/pkg/stellariumadapter"

	"github.com/soniakeys/unit"
	"github.com/stianeikeland/go-rpio/v4"

	"github.com/jacobsa/go-serial/serial"
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
	storefiles := store.NewStore(
		position.GroundPosition{
			Latitude:  unit.NewAngle(' ', 53, 38, 2.77),
			Longitude: unit.NewAngle(' ', 14, 0, 48.16),
		},
	)
	connect := lx200.NewLx200(&storefiles.GroundPosition)
	ascomTcp := lx200.NewTCP("", "9999", connect)
	go ascomTcp.Start()
	defer ascomTcp.Stop()
	result, _ := connect.Command(":Gt#")
	fmt.Println(result)
	options := serial.OpenOptions{
		PortName:        "/dev/serial0",
		BaudRate:        9600,
		DataBits:        8,
		StopBits:        1,
		MinimumReadSize: 80,
	}

	gnss := gnss.NewGnss(&storefiles.GroundPosition, &storefiles.GnssData, options)

	go gnss.Loop()
	defer gnss.Close()
	go stellariumadapter.Socket(connType, connHost, connPort, &storefiles.StellariumPosition, &storefiles.ActualPosition)

	err := rpio.Open()

	if err != nil {
		panic(err)
	}
	//go raspicam.Cam(&storefiles.Image)
	//azStep dir sollte 19 sein, nut test auf 3
	driver := altazdriver.NewAltAzDriver(3, 13, 12, 18, 24, 4, &storefiles.GroundPosition, &storefiles.ActualPosition)
	go driver.Altitude.Loop()
	go driver.Azimuth.Loop()
	fmt.Printf("azimuth: %v\n", driver.Azimuth.GetData())
	go api.HandleRequests(fmt.Sprintf(":%d", port), &driver, &storefiles)
	go imu.Init(&storefiles)

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
