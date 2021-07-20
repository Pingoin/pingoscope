/** @format */


import Gnss from "./Gnss";
import StellariumConnector from "./StellariumConnector";
import Store from "./Store";
import { ModuleThread, spawn, Thread, Worker } from "threads";
import { Stepper } from "./Stepper";
import { IMU } from "./IMU";
import StellarPosition from "./StellarPosition";
class main {
    store: Store;
    bno055:IMU;
    stepper: ModuleThread<Stepper>;
    stepper2: ModuleThread<Stepper>;
    stellarium: StellariumConnector;

    gnss: Gnss;
    constructor() {
        this.store = new Store();
        this.stellarium = new StellariumConnector(10001, this.store);
        this.gnss = new Gnss(this.store);
        this.bno055=new IMU();
        spawn<Stepper>(new Worker("./Stepper")).then(step => this.stepper = step).then(async () => {
            this.stepper.init(5, 6, 13, false)
            console.log(await this.stepper.getPosStep());
        });
        spawn<Stepper>(new Worker("./Stepper")).then(step => this.stepper2 = step).then(async () => {
            this.stepper2.init(8, 9, 10, false)
        });
        setInterval(this.cyclicSecond.bind(this), 1000);
    }
    async cyclicSecond() {
        const position=await this.bno055.readData();
        //const pos = await this.stepper.getPosStep();
        this.store.sensorPosition.horizontal={azimuth:position.position.azimuth,altitude:position.position.altitude};
        //console.log(`ausgelesen: ${pos}`);
        console.log(position);

        //if (await this.stepper.targetReached()) {
            //this.stepper.setTargetStep(pos*-1);
        //}
    }

}

new main();