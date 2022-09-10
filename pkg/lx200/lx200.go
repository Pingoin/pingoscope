package lx200

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/Pingoin/pingoscope/pkg/position"
	"github.com/soniakeys/meeus/v3/julian"
	"github.com/soniakeys/meeus/v3/sidereal"
)

type Lx200 struct {
	groundPosition *position.GroundPosition
}

func (l *Lx200) Command(cmd string) (string, error) {

	command := cmd[1:3]

	switch command {
	//case "SC": //	:SCMM/DD/YY#	Reply: 0 or 1	Set date
	//	return "1", nil
	case "GC": //	:GC#	Reply: MM/DD/YY#	Get date
		now := time.Now()
		return now.Format("01/02/06#"), nil
	//	:SLHH:MM:SS#	Reply: 0 or 1	Set time (Local)
	case "Ga": //	:Ga#	Reply: HH:MM:SS#	Get time (Local, 12hr format)
		now := time.Now()
		return now.Format("03:04:05#"), nil
	case "GL": //	:GL#	Reply: HH:MM:SS#	Get time (Local, 24hr format)
		now := time.Now()
		return now.Format("15:04:05#"), nil
	//	:SSHH:MM:SS#	Reply: 0 or 1	Set time (Sidereal)
	case "GS": //	:GS#	Reply: HH:MM:SS#	Get time (Sidereal)
		jd := julian.TimeToJD(time.Now())
		s0 := sidereal.Apparent(jd)
		return fmt.Sprintf("%02d:%02d:%02d#", uint(s0.Hour()), uint((s0.Hour()*60))%60, uint(s0.Hour()*3600)%60), nil
	//	:SGsHH#	Reply: 0 or 1	Set UTC Offset(for current site)
	case "GG": //	:GG#	Reply: sHH#	Get UTC Offset(for current site)

		return "+01#", nil
	//	:StsDD*MM#	Reply: 0 or 1	Set Latitude (for current site)
	case "Gt": //	:Gt#	Reply: sDD*MM#	Get Latitude (foaultfasdsr current site)
		lat := l.groundPosition.Latitude
		return fmt.Sprintf("%+02d*%02d#", int(lat.Deg()), uint(lat.Deg()*60)%60), nil
	//	:SgDDD*MM#	Reply: 0 or 1	Set Longitude (for current site)
	case "Gg": //	:Gg#	Reply: DDD*MM#	Get Longitude (for current site)
		long := l.groundPosition.Longitude
		return fmt.Sprintf("%+02d*%02d#", int(long.Deg()), uint(long.Deg()*60)%60), nil
	//	:SMsss...#	Reply: 0 or 1	Set site 0 name
	//	:SNsss...#	Reply: 0 or 1	Set site 1 name
	//	:SOsss...#	Reply: 0 or 1	Set site 2 name
	//	:SPsss...#	Reply: 0 or 1	Set site 3 name
	//	:GM#	Reply: sss...#	Get site 0 name
	//	:GN#	Reply: sss...#	Get site 1 name
	//	:GO#	Reply: sss...#	Get site 2 name
	//	:GP#	Reply: sss...#	Get site 3 name
	//	:Wn#	Reply: [none]	Select site n (0-3)

	case "%BR", "%B", "$B":
		return "1#", nil
	case "%BD", "$BD":
		return "1#", nil

	case "SG":
		return "1#", nil
	case "Gh":
		return "+0*#", nil
	case "Go":
		return "+89*#", nil
	case "GV":
		switch cmd {
		case ":GVP#":
			return "Pingoscope#", nil
		case ":GVD#":
			return "12:00:00#", nil
		case ":GVT#":
			return "30.07.22#", nil
		case ":GVN#":
			return "1.0o#", nil
		default:
			return "", errors.New("unknown Command: " + cmd)
		}
	default:
		log.Println("unknown Command: " + cmd)
		return "", errors.New("unknown Command: " + cmd)

	}
}

func NewLx200(groundPosition *position.GroundPosition) *Lx200 {
	result := Lx200{groundPosition: groundPosition}
	return &result
}
