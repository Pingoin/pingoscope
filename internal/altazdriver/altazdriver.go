package altazdriver

import (
	"math"

	"github.com/Pingoin/pingoscope/internal/store"
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

var teethAz = math.Round(math.Pi * diameterAzNeutralPhase / toothWidth)
var teethAlt = math.Round(math.Pi * diameterAltNeutralPhase / toothWidth)

var unitPerStepAz = 360 / stepsPerRevolveAz * teethMotor / teethAz
var unitPerStepAlt = 360 / stepsPerRevolveAlt * teethMotor / teethAlt

type AltAzDriver struct {
	Altitude  stepper.Stepper
	Azimuth   stepper.Stepper
	storeData *store.Store
}
type AltAzDriverData struct {
	Altitude stepper.StepperData
	Azimuth  stepper.StepperData
}

func NewAltAzDriver(azStepNr, azDirNr, azEnaNr, altStepNr, altDirNr, altEnaNr uint8, storeNew *store.Store) AltAzDriver {
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
	azimuth := stepper.New(azStep, azDir, azEna, unitPerStepAz, 200, 10)
	azimuth.SetTarget(5)

	altStep := rpio.Pin(altStepNr)
	altStep.Output()
	altDir := rpio.Pin(altDirNr)
	altDir.Output()
	altEna := rpio.Pin(altEnaNr)
	altEna.Output()
	altitude := stepper.New(azStep, azDir, azEna, unitPerStepAlt, 200, 10)
	altitude.SetTarget(5)
	return AltAzDriver{
		Altitude:  altitude,
		Azimuth:   azimuth,
		storeData: storeNew,
	}
}

func (driver *AltAzDriver) GetData() AltAzDriverData {

	altAz := position.AltAzPos{
		Altitude: unit.AngleFromDeg(driver.Altitude.GetData().Position),
		Azimuth:  unit.AngleFromDeg(driver.Azimuth.GetData().Position),
	}
	driver.storeData.ActualPosition = position.NewStellarPositionAltAz(altAz, &driver.storeData.GroundPosition)

	return AltAzDriverData{
		Altitude: driver.Altitude.GetData(),
		Azimuth:  driver.Azimuth.GetData(),
	}
}
