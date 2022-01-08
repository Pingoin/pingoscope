package altazdriver

import (
	"github.com/Pingoin/pingoscope/pkg/stepper"
	"github.com/stianeikeland/go-rpio/v4"
)

type AltAzDriver struct {
	Altitude stepper.Stepper
	Azimuth  stepper.Stepper
}
type AltAzDriverData struct {
	Altitude stepper.StepperData
	Azimuth  stepper.StepperData
}

func NewAltAzDriver(azStepNr, azDirNr, azEnaNr, altStepNr, altDirNr, altEnaNr uint8) AltAzDriver {
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
	azimuth := stepper.New(azStep, azDir, azEna, 1, 200, 10)
	azimuth.SetTarget(5)

	altStep := rpio.Pin(altStepNr)
	altStep.Output()
	altDir := rpio.Pin(altDirNr)
	altDir.Output()
	altEna := rpio.Pin(altEnaNr)
	altEna.Output()
	altitude := stepper.New(azStep, azDir, azEna, 1, 200, 10)
	altitude.SetTarget(5)
	return AltAzDriver{
		Altitude: altitude,
		Azimuth:  azimuth,
	}
}

func (driver *AltAzDriver) GetData() AltAzDriverData {
	return AltAzDriverData{
		Altitude: driver.Altitude.GetData(),
		Azimuth:  driver.Azimuth.GetData(),
	}
}
