/** @format */

import * as net from "net";
import Store from "./Store";

export default class StellariumConnector {
  private server: net.Server;
  private Store: Store;
  private socket: net.Socket | null = null;

  constructor(port: number, store: Store) {
    this.Store = store;
    this.server = new net.Server();

    this.server.listen(port, function () {
      console.log(
        `Server listening for connection requests on socket localhost:${port}`
      );
    });
    console.log();
    this.server.on("connection", this.connected.bind(this));
    setInterval(this.sendPosition.bind(this),1000);
  }

  private connected(socket: net.Socket) {
    console.log(
      "A new connection has been established. " + socket.localAddress
    );

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    //socket.write('Hello, client.');
    if (this.socket == null) {
      this.socket = socket;
    }

    // The server can also receive data from the client by reading from its socket.
    socket.on("data", this.setSollByStellarium.bind(this));

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on("end", this.closeSocket.bind(this));

    // Don't forget to catch error, for your own sake.
    socket.on("error", this.closeSocket.bind(this));
  }
  private closeSocket(err?: Error) {
    if (this.socket != null)
      this.socket.end(() => {
        this.socket = null;
      });
    this.socket = null;
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log("Closing connection with the client");
    }
  }

  private setSollByStellarium(chunk: Buffer): void {
    const data = {
      rightAscension: (chunk.readUInt32LE(12) / 0x100000000) * 24,
      declination: (chunk.readInt32LE(16) / 0x40000000) * 90
    };
    this.Store.stellariumTarget.equatorial = data;
  }

  private sendPosition(): void {
    if (this.socket != null) {
      const position = this.Store.actualPosition;
      const RAraw = Math.round(
        (position.equatorial.rightAscension / 24) * 0x100000000
      );
      const DECraw = Math.round(
        (position.equatorial.declination / 90) * 0x40000000
      );
      if (this.socket != null) {
        const buffer = Buffer.alloc(24, 0);
        buffer.writeInt16LE(24, 0);
        buffer.writeUInt32LE(RAraw, 12);
        buffer.writeInt32LE(DECraw, 16);
        for (let index = 0; index < 10; index++) {
          this.socket.write(buffer);
        }
      }
    }
  }
}
