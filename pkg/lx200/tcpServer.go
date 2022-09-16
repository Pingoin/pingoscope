package lx200

import (
	"fmt"
	"log"
	"net"
)

type TCPserver struct {
	host     string
	port     string
	listener net.Listener
	mount    *Lx200
}

func NewTCP(host, port string, mount *Lx200) *TCPserver {

	result := TCPserver{
		host:  host,
		port:  port,
		mount: mount,
	}
	return &result
}

func (t *TCPserver) Start() {
	var err error

	t.listener, err = net.Listen("tcp", t.host+":"+t.port)
	if err != nil {
		log.Fatal(err)
	}
	for {
		conn, err := t.listener.Accept()
		if err != nil {
			log.Fatal(err)
		}
		go t.handleIncomingRequest(conn)
	}

}

func (t *TCPserver) Stop() {
	t.listener.Close()
}

func (t *TCPserver) handleIncomingRequest(conn net.Conn) {
	// store incoming data
	buffer := make([]byte, 1024)
	_, err := conn.Read(buffer)
	if err != nil {
		//log.Fatal(err)
	}
	// respond
	result, err := t.mount.Command(string(buffer))
	if err != nil {
		log.Println(err)
	}
	fmt.Println(result)
	conn.Write([]byte(result))
	// close conn
	conn.Close()
}
