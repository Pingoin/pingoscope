package stellariumadapter

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"math"
	"net"
	"os"
	"time"

	"github.com/Pingoin/pingoscope/pkg/position"
	sexa "github.com/soniakeys/sexagesimal"
	"github.com/soniakeys/unit"
)

var target *position.StellarPosition

var clients map[string]*net.Conn

func Socket(connType, connHost, connPort string, targetNew, currentPos *position.StellarPosition) {
	target = targetNew
	clients = make(map[string]*net.Conn)
	target.SetEq(true)
	fmt.Println("Starting " + connType + " server on " + connHost + ":" + connPort)
	l, err := net.Listen(connType, ":"+connPort)
	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}
	defer l.Close()
	go handleClients(currentPos)
	for {
		c, err := l.Accept()
		clients[c.RemoteAddr().String()] = &c
		if err != nil {
			fmt.Println("Error connecting:", err.Error())
			return
		}
		fmt.Println("Client connected.")

		fmt.Println("Client " + c.RemoteAddr().String() + " connected.")

		go handleConnection(c)
	}
}

func handleClients(currentPos *position.StellarPosition) {
	for {
		if len(clients) > 0 {

			rawRA := uint32(currentPos.GetData().Equatorial.RightAscension.Rad() / (2 * math.Pi) * 0x100000000)

			rawDec := int32(currentPos.GetData().Equatorial.Declination.Rad() / (math.Pi / 2) * 0x40000000)

			bytesRA := make([]byte, 4)
			bytesLength := make([]byte, 2)
			bytesDEC := make([]byte, 4)
			bytesMSG := make([]byte, 24)
			binary.LittleEndian.PutUint16(bytesLength, 24)
			binary.LittleEndian.PutUint32(bytesRA, rawRA)
			binary.LittleEndian.PutUint32(bytesDEC, uint32(rawDec))

			bytesMSG[0] = bytesLength[0]
			bytesMSG[1] = bytesLength[1]

			bytesMSG[12] = bytesRA[0]
			bytesMSG[13] = bytesRA[1]
			bytesMSG[14] = bytesRA[2]
			bytesMSG[15] = bytesRA[3]
			bytesMSG[16] = bytesDEC[0]
			bytesMSG[17] = bytesDEC[1]
			bytesMSG[18] = bytesDEC[2]
			bytesMSG[19] = bytesDEC[3]

			for _, client := range clients {
				for i := 0; i < 10; i++ {
					(*client).Write(bytesMSG)
				}
				//
				fmt.Println((*client).RemoteAddr().String())
			}
		}
		time.Sleep(time.Second)
	}
}

func handleConnection(conn net.Conn) {
	buffer := make([]byte, 50)
	len, err := bufio.NewReader(conn).Read(buffer)
	if err != nil {
		fmt.Println(err)
		delete(clients, conn.RemoteAddr().String())
		fmt.Printf("%v disconnected\n", conn.RemoteAddr().String())
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
