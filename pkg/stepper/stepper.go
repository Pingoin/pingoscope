package stepper

import (
	"math"
	"time"

	"github.com/stianeikeland/go-rpio/v4"
)

type StepperData struct {
	// units per step
	Resolution float64 `json:"resolution"`
	// in Units
	Position float64 `json:"position"`
	// in Units
	Target float64 `json:"target"`
	// max Units per second
	MaxSpeed float64 `json:"maxSpeed"`
	//Max units per seconds²
	MaxAccel float64 `json:"maxAccelaration"`
	// Units per Second
	CurrentSpeed float64 `json:"currentSpeed"`
}

type Stepper struct {
	step rpio.Pin
	dir  rpio.Pin
	ena  rpio.Pin
	// units per step
	resolution float64
	position   float64
	target     float64
	maxSpeed   float64
	// max steps per seconds²
	maxAccel float64
	//Microseconds between start of Pulses
	cycleWidth uint
	// Microsecond
	pulseWidth uint
}

/*

 */
func New(stepNr uint8, dirNr uint8, enaNr uint8, resolution float64, maxSpeed float64, maxAccel float64) Stepper {
	err := rpio.Open()
	if err != nil {
		panic(err)
	}
	stepper := Stepper{rpio.Pin(stepNr), rpio.Pin(dirNr), rpio.Pin(enaNr), resolution, 0, 0, maxSpeed, maxAccel, 1e6, 20}
	stepper.dir.Output()
	stepper.step.Output()
	stepper.ena.Output()
	stepper.dir.Low()
	stepper.step.Low()
	stepper.ena.Low()
	return stepper
}

func (stepper *Stepper) SetTarget(target float64) {
	stepper.target = target
}

func (stepper *Stepper) Loop() {
	for {
		stepper.loop()
	}
}

func (stepper *Stepper) setSpeed() {
	distance := math.Abs(float64(stepper.target - stepper.position))
	currentSpeed := stepper.getCurrentSpeed()
	breakWay := currentSpeed * currentSpeed / 2 / stepper.maxAccel
	if breakWay >= distance {
		currentSpeed -= stepper.maxAccel / currentSpeed
	} else {
		currentSpeed += stepper.maxAccel / currentSpeed
	}

	currentSpeed = math.Max(1, math.Min(currentSpeed, stepper.maxSpeed))
	stepper.cycleWidth = uint(1e6 / currentSpeed)

}

func (stepper *Stepper) loop() {
	stepper.setSpeed()
	distance := stepper.target - stepper.position
	if math.Abs(float64(distance)) >= float64(stepper.resolution) {
		stepper.step.High()
		sleepMicros(stepper.pulseWidth)
		stepper.step.Low()
		sleepMicros(stepper.cycleWidth - stepper.pulseWidth)
		if distance > 0 {
			stepper.position += stepper.resolution
		} else {
			stepper.position -= stepper.resolution
		}
	} else {
		sleepMicros(stepper.pulseWidth)
	}
}

func sleepMicros(micros uint) {
	time.Sleep(time.Microsecond * time.Duration(micros))
}

func (stepper *Stepper) SetMaxSpeed(maxSpeed float64) {
	stepper.maxSpeed = maxSpeed
}

func (stepper *Stepper) GetData() StepperData {
	return StepperData{
		stepper.resolution,
		stepper.position,
		stepper.target,
		stepper.maxSpeed,
		stepper.maxAccel,
		stepper.resolution * stepper.getCurrentSpeed(),
	}
}

func (stepper *Stepper) getCurrentSpeed() float64 {
	return 1e6 / float64(stepper.cycleWidth)
}
