import Store from './Store';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { StillCamera } from "pi-camera-connect";
const PORT = 8080;

const httpServer = createServer();

export default class Api {
  private io = new Server(httpServer, {
    serveClient: false,
    path:"/api",
    maxHttpBufferSize: 4e6,
      cors: {
        origin: false
      }
  });
  private connectCounter = 0;
  private store: Store;
  private stillCamera = new StillCamera({
    height: 600,
    width: 800,
    iso:1600,
  });
  constructor(store: Store) {
    this.store = store;
    this.io.on("connection", socket => {
      console.log("Blafasel")
      socket.on('connect', ()=>{ this.connectCounter++; 
      console.log(this.connectCounter)});
      socket.on('disconnect', ()=>{ this.connectCounter--; });
      socket.emit("StoreData", this.store.simplify());
      socket.on("getStoreData", () => {
        console.log("getStoreData");
        socket.emit("StoreData", this.store.simplify());
      });
      socket.on("setTargetType", (data) => {
        if (["horizontal", "equatorial"].includes(data as string)) {
          this.store.targetPosition.type = data as "horizontal" | "equatorial";
        }
        this.io.emit("TargetType", this.store.targetPosition.type)
  
      })
    });
    this.picShow()
    httpServer.listen(8080);
  }

  async picShow() {
    while (1) {
      if (true) {
        await this.updatePicture();
        console.log(new Date().toISOString() + " pic taken");
      } else {
        await new Promise((resolve, reject) => { setTimeout(() => resolve, 1000) });
        console.log(new Date().toISOString() + " wait");
      }
    }
  }
  async updatePicture() {
    const image = await this.stillCamera.takeImage();
    this.io.emit("image", image.toString("base64"));
  }
}
