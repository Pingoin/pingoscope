import { GPIO, PinNumber } from "./rpi-sysfs-io";
import { expose } from "threads/worker";
import { delay } from "./helper";

import child from "child_process";
import util from "util";
const exec = util.promisify(child.exec);

/**
 * @todo Stepper über PIGPIO WAVE Chain Funktion
 *  Schritte im 100 ms Takt per Wellenfunktion weitergeben
 * https://www.raspberrypi.org/forums/viewtopic.php?t=242430
 * http://abyz.me.uk/rpi/pigpio/pigs.html#WVCHA
 */


let positionStep = 0;
let targetPositionStep = 0;
let direction: GPIO;
let step: GPIO;
let enable: GPIO;
let dirModify = false;

const stepper = {
    async setTargetStep(target: number) {
        targetPositionStep = target;
        enable.write(0);
        while (positionStep !== targetPositionStep) {
            if (targetPositionStep > positionStep) {
                positionStep++;
                direction.write(dirModify ? 0 : 1);
            } else if (targetPositionStep < positionStep) {
                positionStep--;
                direction.write(dirModify ? 1 : 0);
            }
            await step.trigger(10,1);
            console.log(positionStep);
            if (positionStep == targetPositionStep) break;
            await delay(1000, null);
        }
        enable.write(1);
    },
    init(stepPin: PinNumber, dirPin: PinNumber, enablePin: PinNumber, changeDir: boolean) {
        direction = new GPIO(dirPin, "w");
        step = new GPIO(stepPin, "w");
        enable = new GPIO(enablePin, "w");
        dirModify = changeDir;
    },
    getPosStep() {
        return positionStep;
    },
    targetReached() {
        return positionStep == targetPositionStep;
    },
    async testTime(count: number,mySec:number){
        const startTime= new Date().valueOf();
        for (let index = 0; index < count; index++) {
            await step.trigger(mySec,1);
        }
        const dauer=new Date().valueOf()-startTime;
        console.log(`dauer: ${ dauer }`)
    }
}

export type Stepper = typeof stepper;

expose(stepper);