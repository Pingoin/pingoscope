import { GPIO, PinNumber } from "./GPIO";

const MAX_SPEED = 1500;



export class Stepper {
    private positionStep = 0;
    private targetPositionStep = 0;
    private direction: GPIO;
    private step: GPIO;
    private enable: GPIO;
    private dirModify = false;
    private uPS = 1.8;
    /** Steps pro Sekunde */
    private speed = 1000;
    constructor(stepPin: PinNumber, dirPin: PinNumber, enablePin: PinNumber, changeDir: boolean, unitPerStep: number = 1.8) {
        this.direction = new GPIO(dirPin, "out");
        this.uPS = unitPerStep;
        this.step = new GPIO(stepPin, "out");
        this.enable = new GPIO(enablePin, "out");
        this.dirModify = changeDir;
        this.waitForReady().then(()=>{this.cyclic100ms()})
    }

    set targetStep(target: number) {
        this.targetPositionStep = target;
    }
    get targetStep() {
        return this.targetPositionStep;
    }
    get posStep() {
        return this.positionStep;
    }
    set posStep(position: number) {
        this.positionStep = position;
    }


    get targetUnit() {
        return this.targetPositionStep * this.uPS;
    }
    set targetUnit(position: number) {
        this.targetPositionStep = Math.round(position / this.uPS);
    }
    get posUnit() {
        return this.positionStep * this.uPS;
    }
    set posUnit(position: number) {
        this.positionStep = Math.round(position / this.uPS);
    }



    get targetReached() {
        return this.positionStep == this.targetPositionStep;
    }

    /**
     * @private
     */
    async cyclic100ms() {
        
        const time = new Date().valueOf();
        if (this.positionStep !== this.targetPositionStep) {
            this.enable.write(0);
            const steps = Math.min(Math.abs(this.positionStep - this.targetPositionStep), Math.round(this.speed / 10))
            if (this.targetPositionStep > this.positionStep) {
                this.positionStep+=steps;
                this.direction.write(this.dirModify ? 0 : 1);
                
            } else {
                this.positionStep-=steps
                this.direction.write(this.dirModify ? 1 : 0);
            }
            await this.steps(steps);    
        } else {
            this.enable.write(1);
        }
        const duration = new Date().valueOf() - time;
        if (duration >= 100) {
            this.cyclic100ms();
        } else {
            setTimeout(this.cyclic100ms.bind(this), 100 - duration);
        }
    }
    /**
     * führt eine Anzahl an schritte aus 
     * @param count anzahl der Schritte
     * @param duration Dauer des high werts in mikrosekunden
     * @private
     */
    async steps(count: number, duration: number = 10) {
        for (let index = 0; index < count; index++) {
            //await this.step.trigger(duration, 1);
        }
    }
    async waitForReady(){
        await this.step.waitForReady();
        await this.enable.waitForReady();
        await this.direction.waitForReady();
    }
}