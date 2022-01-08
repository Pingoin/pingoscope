// main.go
package main

import (
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Pingoin/pingoscope/pkg/stepper"
	"github.com/gorilla/mux"
	"github.com/kpeu3i/bno055"
	"github.com/soniakeys/meeus/v3/coord"
	"github.com/soniakeys/meeus/v3/julian"
	"github.com/soniakeys/meeus/v3/sidereal"
	sexa "github.com/soniakeys/sexagesimal"
	"github.com/soniakeys/unit"
	"github.com/stianeikeland/go-rpio/v4"
)

// Article - Our struct for all articles
type Article struct {
	Id      string `json:"Id"`
	Title   string `json:"Title"`
	Desc    string `json:"desc"`
	Content string `json:"content"`
}

type Postion struct {
	Altitude float32 `json:"alt"`
	Azimuth  float32 `json:"az"`
}

var Articles []Article
var azimuth stepper.Stepper

func handleRequests() {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", homePage)
	myRouter.HandleFunc("/target", setTarget).Methods("POST")
	myRouter.HandleFunc("/articles", returnAllArticles)
	myRouter.HandleFunc("/article", createNewArticle).Methods("POST")
	myRouter.HandleFunc("/article/{id}", deleteArticle).Methods("DELETE")
	myRouter.HandleFunc("/article/{id}", returnSingleArticle)
	log.Fatal(http.ListenAndServe(":10000", myRouter))
}

func main() {
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

	Articles = []Article{
		{Id: "1", Title: "Hello", Desc: "Article Description", Content: "Article Content"},
		{Id: "2", Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
	}
	err := rpio.Open()
	if err != nil {
		panic(err)
	}
	azimuth = stepper.New(3, 4, 5, 1, 200, 10)
	azimuth.SetTarget(5)
	go azimuth.Loop()
	fmt.Printf("azimuth: %v\n", azimuth.GetData())
	go handleRequests()
	sensor, err := bno055.NewSensor(0x29, 3)
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
	status, err := sensor.Status()
	if err != nil {
		panic(err)
	}

	fmt.Printf("*** Status: system=%v, system_error=%v, self_test=%v\n", status.System, status.SystemError, status.SelfTest)

	revision, err := sensor.Revision()
	if err != nil {
		panic(err)
	}

	fmt.Printf(
		"*** Revision: software=%v, bootloader=%v, accelerometer=%v, gyroscope=%v, magnetometer=%v\n",
		revision.Software,
		revision.Bootloader,
		revision.Accelerometer,
		revision.Gyroscope,
		revision.Magnetometer,
	)

	axisConfig, err := sensor.AxisConfig()
	if err != nil {
		panic(err)
	}

	fmt.Printf(
		"*** Axis: x=%v, y=%v, z=%v, sign_x=%v, sign_y=%v, sign_z=%v\n",
		axisConfig.X,
		axisConfig.Y,
		axisConfig.Z,
		axisConfig.SignX,
		axisConfig.SignY,
		axisConfig.SignZ,
	)

	temperature, err := sensor.Temperature()
	if err != nil {
		panic(err)
	}

	fmt.Printf("*** Temperature: t=%v\n", temperature)

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)

	var (
		isCalibrated       bool
		calibrationOffsets bno055.CalibrationOffsets
		calibrationStatus  *bno055.CalibrationStatus
	)
	for !isCalibrated {
		select {
		case <-signals:
			err := sensor.Close()
			if err != nil {
				panic(err)
			}
		default:
			calibrationOffsets, calibrationStatus, err = sensor.Calibration()
			if err != nil {
				panic(err)
			}

			isCalibrated = calibrationStatus.IsCalibrated()

			fmt.Printf(
				"\r*** Calibration status (0..3): system=%v, accelerometer=%v, gyroscope=%v, magnetometer=%v",
				calibrationStatus.System,
				calibrationStatus.Accelerometer,
				calibrationStatus.Gyroscope,
				calibrationStatus.Magnetometer,
			)
		}

		time.Sleep(100 * time.Millisecond)
	}
	fmt.Printf("\n*** Done! Calibration offsets: %v\n", calibrationOffsets)
	for {
		select {
		case <-signals:
			err := sensor.Close()
			if err != nil {
				panic(err)
			}
		default:
			vector, err := sensor.Euler()
			if err != nil {
				panic(err)
			}

			fmt.Printf("\r*** Euler angles: x=%5.3f, y=%5.3f, z=%5.3f", vector.X, vector.Y, vector.Z)
		}

		time.Sleep(100 * time.Millisecond)
	}
}
