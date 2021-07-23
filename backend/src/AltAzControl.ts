import { Stepper } from "./Stepper";
import Store from "./Store";

export class AltAzControl {
    altitude: Stepper;
    azimuth: Stepper;
    ready = false;
    store: Store;
    constructor(store: Store) {
        this.store = store;
        this.init();
        setInterval(this.cyclic1000ms.bind(this), 1000)
    }

    async init() {
        this.altitude = new Stepper(5, 6, 13, false, 1.8 / 50);
        this.azimuth = new Stepper(8, 9, 10, false, 1.8 / 50);

        await this.altitude.waitForReady();
        await this.azimuth.waitForReady();
        console.log("Alt-AZ-Controler initialisiert")
        this.ready = true;
    }
    async cyclic1000ms() {
        if (this.ready) {
            this.altitude.targetUnit = this.store.targetPosition.horizontal.altitude;
            this.azimuth.targetUnit = this.store.targetPosition.horizontal.azimuth;

            this.store.actualPosition.horizontal = { altitude: this.altitude.posUnit, azimuth: this.azimuth.posUnit };
        }
    }
    async setPosition(altitude: number, azimuth: number) {
        if (this.ready) {
            this.altitude.posUnit = altitude;
            this.azimuth.posUnit = azimuth;
            console.log(altitude+" " +azimuth)
        }
    }
}