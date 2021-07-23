/** @format */


import Gnss from "./Gnss";
import StellariumConnector from "./StellariumConnector";
import Store from "./Store";
import { IMU } from "./IMU";
import { AltAzControl } from "./AltAzControl";
class main {
    store: Store;
    bno055:IMU;
    altAzController:AltAzControl;
    stellarium: StellariumConnector;
    positionSet=0;

    gnss: Gnss;
    constructor() {
        this.store = new Store();
        this.stellarium = new StellariumConnector(10001, this.store);
        this.altAzController=new AltAzControl(this.store);
        this.gnss = new Gnss(this.store);
        this.bno055=new IMU();
        setInterval(this.cyclicSecond.bind(this), 1000);
    }
    async cyclicSecond() {
        const position=await this.bno055.readData();
        this.store.sensorPosition.horizontal={azimuth:position.position.azimuth,altitude:position.position.altitude};
        if((this.positionSet<=10)&& this.altAzController.ready){
            this.altAzController.setPosition(position.position.altitude,position.position.azimuth);
            this.positionSet++;
            console.log(position);
        }
    }

}

new main();