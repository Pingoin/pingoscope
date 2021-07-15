/** @format */

import Api from "./Api";
import Gnss from "./Gnss";
import StellariumConnector from "./StellariumConnector";
import Store from "./Store";
import { ModuleThread, spawn, Thread, Worker } from "threads";
import {Stepper} from "./Stepper";
class main{
    store:Store;
    api:Api;
    stepper:ModuleThread<Stepper>;
    stellarium:StellariumConnector;
    gnss:Gnss;
    constructor(){
        this.store = new Store();
        this.api = new Api(this.store);
        this.stellarium = new StellariumConnector(10001, this.store);
        this.gnss = new Gnss(this.store);
        spawn<Stepper>(new Worker("./Stepper")).then(step=>this.stepper=step).then(async ()=>{
            console.log(await this.stepper.getPosStep());
            this.stepper.setTargetStep(50);
            setInterval(this.checkStepper.bind(this),1000);
        });
    }
    async checkStepper(){

        const pos=await this.stepper.getPosStep()
        console.log(`ausgelesen: ${pos}`);
        if(await this.stepper.targetReached()){
            this.stepper.setTargetStep(pos*-1);
        }
    }

}

new main();