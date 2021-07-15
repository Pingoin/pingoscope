import { Gpio } from "pigpio";
import { expose } from "threads/worker";
import { delay } from "./helper";

let positionStep = 0;
let targetPositionStep = 0;
let direction:Gpio;
let step:Gpio;
let enable:Gpio;
let dirModify=false;

const stepper = {
    async setTargetStep(target: number) {
        targetPositionStep=target;
        enable.digitalWrite(0);
        while (positionStep !== targetPositionStep) {
            if (targetPositionStep > positionStep) {
                positionStep++;
                direction.digitalWrite(dirModify?0:1);
            } else if(targetPositionStep < positionStep){
                positionStep--;
                direction.digitalWrite(dirModify?1:0);
            }
            step.trigger(100,1);
            console.log(positionStep);
            if (positionStep == targetPositionStep) break;
            await delay(1000, null);
        }
        enable.digitalWrite(1);
    },
    init(stepPin:number,dirPin:number,enablePin:number,changeDir:boolean){
        direction=new Gpio(dirPin,{mode: Gpio.OUTPUT});
        step=new Gpio(stepPin,{mode: Gpio.OUTPUT});
        enable=new Gpio(enablePin,{mode: Gpio.OUTPUT});
        dirModify=changeDir;
    },
    getPosStep(){
        return positionStep;
    },
    targetReached(){
        return positionStep == targetPositionStep;
    }
}

export type Stepper = typeof stepper;

expose(stepper);