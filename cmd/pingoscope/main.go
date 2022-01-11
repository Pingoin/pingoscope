// main.go
package main

import (
	"bufio"
	"encoding/binary"
	"flag"
	"fmt"
	"math"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Pingoin/pingoscope/internal/altazdriver"
	"github.com/Pingoin/pingoscope/internal/api"
	"github.com/Pingoin/pingoscope/internal/imu"
	"github.com/Pingoin/pingoscope/internal/store"

	"github.com/soniakeys/meeus/v3/coord"
	"github.com/soniakeys/meeus/v3/julian"
	"github.com/soniakeys/meeus/v3/sidereal"
	sexa "github.com/soniakeys/sexagesimal"
	"github.com/soniakeys/unit"
	"github.com/stianeikeland/go-rpio/v4"
)

const (
	connHost = "localhost"
	connPort = "8888"
	connType = "tcp"
)

func main() {

	go socket()
	var port int
	flag.IntVar(&port, "port", 8080, "The port to listen on")
	flag.Parse()
	storefiles := store.NewStore()

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
	driver := altazdriver.NewAltAzDriver(3, 13, 12, 18, 24, 4, &storefiles)
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
func socket() {
	fmt.Println("Starting " + connType + " server on " + connHost + ":" + connPort)
	l, err := net.Listen(connType, ":"+connPort)
	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}
	defer l.Close()

	for {
		c, err := l.Accept()
		if err != nil {
			fmt.Println("Error connecting:", err.Error())
			return
		}
		fmt.Println("Client connected.")

		fmt.Println("Client " + c.RemoteAddr().String() + " connected.")

		go handleConnection(c)
	}
}

func handleConnection(conn net.Conn) {
	buffer := make([]byte, 50)
	len, err := bufio.NewReader(conn).Read(buffer)
	if err != nil {
		fmt.Println(err)
		conn.Close()
		return
	}
	if len >= 20 {
		ra := unit.RAFromHour((float64(binary.LittleEndian.Uint32(buffer[12:16])) / 0x100000000) * 24)
		dec := unit.AngleFromDeg((float64(int32(binary.LittleEndian.Uint32(buffer[16:24]))) / 0x40000000) * 90)
		fmt.Printf("Client message: %v/%v\n", sexa.FmtRA(ra), sexa.FmtAngle(dec))
		jd := julian.TimeToJD(time.Date(
			2022, 1, 9, 16, 30, 0, 0, time.UTC))
		A, h := coord.EqToHz(
			ra,
			dec,
			unit.NewAngle(' ', 53, 38, 2.77),
			unit.NewAngle('-', 14, 0, 48.60),
			sidereal.Apparent0UT(jd))
		fmt.Printf("A = %v\n", sexa.FmtAngle(A+math.Pi))
		fmt.Printf("h = %v\n", sexa.FmtAngle(h))
	} else {
		fmt.Println(len)
	}
	handleConnection(conn)
}

func Float64frombytes(bytes []byte) float64 {
	bits := binary.LittleEndian.Uint64(bytes)
	float := math.Float64frombits(bits)
	return float
}

func Float64bytes(float float64) []byte {
	bits := math.Float64bits(float)
	bytes := make([]byte, 8)
	binary.LittleEndian.PutUint64(bytes, bits)
	return bytes
}
