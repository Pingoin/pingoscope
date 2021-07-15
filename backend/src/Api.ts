import WebSocket from 'ws';
import Store from './Store';
import { wsPost } from "./shared";
const WebSocketServer=WebSocket.Server; 
 
const PORT=8080;

export default class Api {
    private wss:WebSocket.Server;
    private store:Store;
    constructor(store:Store) {
        this.store=store;
        this.wss = new WebSocketServer({
            port:PORT,
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
      
          this.wss.on("connection",socket=>{
            const message:wsPost={
              key:"StoreData",
              data:this.store.simplify(),
              action:"set"
            };
            socket.send(JSON.stringify(message));
            socket.on("message",message=>{
                const mess=JSON.parse(message as string) as wsPost;
                if(mess.action=="get"){
                    switch (mess.key) {
                        case "StoreData":
                            const message:wsPost={
                                key:"StoreData",
                                data:this.store.simplify(),
                                action:"set"
                              };
                              socket.send(JSON.stringify(message));
                            break;
                    
                        default:
                            break;
                    }
                }
            })
          });
    }
}
