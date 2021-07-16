import { GPIO } from "./rpi-sysfs-io";
import { expose } from "threads/worker";
import { delay } from "./helper";

let positionStep = 0;
let targetPositionStep = 0;
let direction: GPIO;
let step: GPIO;
let enable: GPIO;
let dirModify = false;

async function oneStepp() {
    return step.write(1)
        .then(()=> delay(100,null))
        .then(()=>step.write(0));
}

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
            await oneStepp();
            console.log(positionStep);
            if (positionStep == targetPositionStep) break;
            await delay(1000, null);
        }
        enable.write(1);
    },
    init(stepPin: number, dirPin: number, enablePin: number, changeDir: boolean) {
        direction = new GPIO(dirPin, "out");
        step = new GPIO(stepPin, "out");
        enable = new GPIO(enablePin, "out");
        dirModify = changeDir;
    },
    getPosStep() {
        return positionStep;
    },
    targetReached() {
        return positionStep == targetPositionStep;
    }
}

export type Stepper = typeof stepper;

expose(stepper);