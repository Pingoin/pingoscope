package stellariumadapter

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"math"
	"net"
	"os"

	"github.com/Pingoin/pingoscope/pkg/position"
	sexa "github.com/soniakeys/sexagesimal"
	"github.com/soniakeys/unit"
)

var target *position.StellarPosition

func Socket(connType, connHost, connPort string, targetNew *position.StellarPosition) {
	target = targetNew
	target.SetEq(true)
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
		target.SetEqPos(position.EqPos{RightAscension: ra, Declination: dec})
		fmt.Printf("A = %v\n", sexa.FmtAngle(target.GetData().Horizontal.Azimuth+math.Pi))
		fmt.Printf("h = %v\n", sexa.FmtAngle(target.GetData().Horizontal.Altitude))
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
