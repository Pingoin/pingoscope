import { Console } from "console";
import { Stepper } from "./Stepper";
import Store from "./Store";

const stepsPerRevolveAz=200;
const stepsPerRevolveAlt=200;

const teethMotor=20;

const diameterAzNeutralPhase=601;
const diameterAltNeutralPhase=301;
const toothWidth=2;

const teethAz=Math.round(Math.PI*diameterAzNeutralPhase/toothWidth);
const teethAlt=Math.round(Math.PI*diameterAltNeutralPhase/toothWidth);

const unitPerStepAz=360/stepsPerRevolveAz*teethMotor/teethAz;
const unitPerStepAlt=360/stepsPerRevolveAlt*teethMotor/teethAlt;
export class AltAzControl {
    //altitude: Stepper;
    //azimuth: Stepper;
    ready = false;
    store: Store;
    constructor(store: Store) {
        this.store = store;
        this.init();
        setInterval(this.cyclic1000ms.bind(this), 1000)
    }

    async init() {
        //this.altitude = new Stepper(5, 6, 13, false,unitPerStepAlt);
        //this.azimuth = new Stepper(8, 9, 10, false, unitPerStepAz);

        //await this.altitude.waitForReady();
        //await this.azimuth.waitForReady();
        console.log("Alt-AZ-Controler initialisiert")
        this.ready = true;
    }
    async cyclic1000ms() {
        if (this.ready) {
            //this.altitude.targetUnit = this.store.targetPosition.horizontal.altitude;
            //this.azimuth.targetUnit = this.store.targetPosition.horizontal.azimuth;

            //this.store.actualPosition.horizontal = { altitude: this.altitude.posUnit, azimuth: this.azimuth.posUnit };
        }
    }
    async setPosition(altitude: number, azimuth: number) {
        if (this.ready) {
            //this.altitude.posUnit = altitude;
            //this.azimuth.posUnit = azimuth;
            console.log(altitude+" " +azimuth)
        }
    }
}