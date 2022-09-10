package altazdriver

import (
	"math"

	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/Pingoin/pingoscope/pkg/stepper"
	"github.com/soniakeys/unit"
	"github.com/stianeikeland/go-rpio/v4"
)

const stepsPerRevolveAz = float64(200)
const stepsPerRevolveAlt = float64(200)

const teethMotor = float64(20)

const diameterAzNeutralPhase = float64(601)
const diameterAltNeutralPhase = float64(301)
const toothWidth = float64(2)

const microsteppingAz = 16
const microsteppingAlt = 16

var teethAz = math.Round(math.Pi * diameterAzNeutralPhase / toothWidth)
var teethAlt = math.Round(math.Pi * diameterAltNeutralPhase / toothWidth)

var unitPerStepAz = 360 / stepsPerRevolveAz * teethMotor / teethAz / microsteppingAz
var unitPerStepAlt = 360 / stepsPerRevolveAlt * teethMotor / teethAlt / microsteppingAlt

type AltAzDriver struct {
	Altitude        stepper.Stepper
	Azimuth         stepper.Stepper
	stellarPosition *position.StellarPosition
	groundPosition  *position.GroundPosition
}
type AltAzDriverData struct {
	Altitude stepper.StepperData
	Azimuth  stepper.StepperData
}

func NewAltAzDriver(azStepNr, azDirNr, azEnaNr, altStepNr, altDirNr, altEnaNr uint8, groundPosition *position.GroundPosition, stellarPosition *position.StellarPosition) AltAzDriver {
	err := rpio.Open()
	if err != nil {
		panic(err)
	}
	azStep := rpio.Pin(azStepNr)
	azStep.Output()
	azDir := rpio.Pin(altDirNr)
	azDir.Output()
	azEna := rpio.Pin(azEnaNr)
	azEna.Output()
	azimuth := stepper.New(azStep, azDir, azEna, unitPerStepAz, 2000, 10)
	azimuth.SetTarget(5)

	altStep := rpio.Pin(altStepNr)
	altStep.Output()
	altDir := rpio.Pin(altDirNr)
	altDir.Output()
	altEna := rpio.Pin(altEnaNr)
	altEna.Output()
	altitude := stepper.New(azStep, azDir, azEna, unitPerStepAlt, 2000, 10)
	altitude.SetTarget(5)
	return AltAzDriver{
		Altitude:        altitude,
		Azimuth:         azimuth,
		groundPosition:  groundPosition,
		stellarPosition: stellarPosition,
	}
}

func (driver *AltAzDriver) GetData() AltAzDriverData {

	altAz := position.AltAzPos{
		Altitude: unit.AngleFromDeg(driver.Altitude.GetData().Position),
		Azimuth:  unit.AngleFromDeg(driver.Azimuth.GetData().Position),
	}

	*driver.stellarPosition = position.NewStellarPositionAltAz(altAz, driver.groundPosition)

	return AltAzDriverData{
		Altitude: driver.Altitude.GetData(),
		Azimuth:  driver.Azimuth.GetData(),
	}
}
