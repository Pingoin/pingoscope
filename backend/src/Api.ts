import WebSocket from 'ws';
import Store from './Store';
import { wsPost } from "./shared";
const WebSocketServer = WebSocket.Server;

const PORT = 8080;

export default class Api {
  private wss: WebSocket.Server;
  private store: Store;
  constructor(store: Store) {
    this.store = store;
    this.wss = new WebSocketServer({
      port: PORT,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
      }
    });

    this.wss.on("connection", socket => {
      const message: wsPost = {
        key: "StoreData",
        data: this.store.simplify(),
        action: "set"
      };
      socket.send(JSON.stringify(message));
      socket.on("message", message => this.msgInput(message, socket))
    });
  }
  sendAll(data:string){
    this.wss.clients.forEach(client=>{
      client.send(data);
    })
  }

  msgInput(message: WebSocket.Data, socket: WebSocket) {
    const mess = JSON.parse(message as string) as wsPost;
    switch (mess.key) {
      case "StoreData":
        if (mess.action == "get") {
          const message: wsPost = {
            key: "StoreData",
            data: this.store.simplify(),
            action: "set"
          };
          socket.send(JSON.stringify(message));
        }
        break;
      case "TargetType":
        if (mess.action == "set" && ["horizontal", "equatorial"].includes(mess.data as string)) {
          this.store.targetPosition.type = mess.data as "horizontal" | "equatorial";
        }
        const message: wsPost = {
          key: "TargetType",
          data: this.store.targetPosition.type,
          action: "set"
        };
        this.sendAll(JSON.stringify(message))
      default:
        break;
    }
  }
}
