package raspicam

import (
	"bufio"
	"bytes"
	"encoding/base64"
	"fmt"
	"log"
	"time"

	"github.com/dhowden/raspicam"
)

type RaspicamShot struct {
	Debug       bool    // Dump Unix commands on command line interface (for debugging purposes only)
	Doit        bool    // Flag to prevent Unix cammand to be executed (for debugging purposes only)
	ImageType   string  //"jpg,png,gif,bmp"												: type;    	// Desired file type
	Exposure    string  // "auto,night,nightpreview,off,verylong,fireworks"	// Default off
	Analog_gain float64 // Default 1
	Flicker     string  //"off,auto,50hz,60hz"								: "off";		// Default flicker mode off
	Awb         string  //"off,auto,sun,cloud,shade,tungsten,fluorescent,incandescent,flash,horizon,greyworld") : "auto";	// Default auto wide balance
	Hflip       bool    // Default horizontab flip off
	Vflip       bool    // Default vertical flip off
	Roi_x       int     // -1;			// Default disabled
	Roi_y       int     //-1;      		// Default disabled
	Roi_w       int     // -1;			// Default disabled
	Roi_h       int     // -1;			// Default disabled
	Shutter     uint    //1000000;		// Default 1 seconts
	Drc         string  //"off,low,med,high")									: "off";		// Default dynamic range control switched off
	Ag          float64 //(round(_REQUEST['ag'] * 10) / 10)													: 1.0;			// Default analog gain on 1
	Dg          float64 //(round(_REQUEST['dg'] * 10) / 10)													: 1.0;			// Default digital gain on 1
	Binning     uint    //"1,2,3,4")											: 1;			// Default on maximum resolution (4056 xc 3040)
	Annotate    int     //													: 0;			// Default 0 (no text)
	Timeout     uint    //														: 100;			// Default 0.1 sec timeout
	Verbose     bool    // Default debug info default off
	Convert     bool    // Default debug info default off

}

func NewRaspiCamShot() *RaspicamShot {
	return &RaspicamShot{
		Debug:       false,
		Doit:        false,
		ImageType:   "jpg",
		Exposure:    "off",
		Analog_gain: 1,
		Flicker:     "off",
		Awb:         "auto",
		Hflip:       false,
		Vflip:       false,
		Roi_x:       -1,
		Roi_y:       -1,
		Roi_w:       -1,
		Roi_h:       -1,
		Shutter:     1e6,
		Drc:         "off",
		Ag:          1.0,
		Dg:          1.0,
		Binning:     1,
		Annotate:    0,
		Timeout:     100,
		Verbose:     false,
		Convert:     false,
	}
}

func Cam(imageB64 *string) {
	var b bytes.Buffer
	f := bufio.NewWriter(&b)
	s := raspicam.NewStill()
	s.Command = "libcamera-still"
	s.Args = append(s.Args, "--tuning-file", "/usr/share/libcamera/ipa/raspberrypi/imx219_noir.json", "-n")
	s.Width = 800
	s.Height = 600
	//for {
	errCh := make(chan error)
	go func() {
		for x := range errCh {
			log.Printf("Error: %v\n", x)
		}
	}()
	fmt.Println("Capturing image...")

	raspicam.Capture(s, f, errCh)
	*imageB64 = base64.StdEncoding.EncodeToString(b.Bytes())
	time.Sleep(time.Second)

	//}
}
