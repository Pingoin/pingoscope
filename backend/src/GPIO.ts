import FS,{promises as FSP} from "fs";
import child from "child_process";
import util from "util";
import { delay } from "./helper";
const exec = util.promisify(child.exec);

//const pigpio = require('pigpio-client').pigpio({host: 'raspberryHostIP'});  

export type direction = "r" | "w";
export type GPIOstate=0|1;
export type PinNumber=0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31;

export class GPIO {
    private pin: PinNumber;
    private mode: direction;
    private inited = false;
    //private test:any;

    constructor(pin: PinNumber, mode: direction) {
        this.pin=pin;
        this.mode=mode;
        //this.test=pigpio.gpio(pin);
        //this.test.modeSet(mode=="w"?"out":"in");
        
        FSP.writeFile("/dev/pigpio",` modes ${this.pin} ${this.mode}`)
        .then(()=>{
            this.inited=true;
        })
    }

    async read(){
        if (this.inited){
            const result=(await exec(`pigs r ${this.pin}`)).stdout;
            return result.includes("1")?1:0;
        }
        else
            return 0;
    }

    async write(state:GPIOstate){
        if (this.inited)
        return (await FSP.writeFile("/dev/pigpio",` w ${this.pin} ${state}`));
    else
        return false;
    }
 
    async trigger( length:number, level:GPIOstate){
        if (this.inited)
        return (await FSP.writeFile("/dev/pigpio",` trig ${this.pin} ${length} ${level}`));
    else
        return false;

    }
    async waitForReady(){
        while (!this.inited) {
           await delay(100,null);
        }
    }
}