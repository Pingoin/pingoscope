import FS, { promises as FSP } from "fs";
import { delay } from "./helper";


export type direction = "out" | "in";
export type GPIOstate = 0 | 1;
export type PinNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;

export class GPIO {
    private pin: PinNumber;
    private mode: direction;
    private inited = false;
    private sysfsGPIOPath = '/sys/class/gpio/';
    private sysfsPWMPath = '/sys/class/pwm/pwmchip0/';

    constructor(pin: PinNumber, mode: direction) {
        this.pin = pin;
        this.mode = mode;


        FSP.writeFile(this.sysfsGPIOPath + 'export', this.pin.toString())
            .then(async () => {
                await this.isReady();
                await this.setDirection();
            })
    }

    async closePin(){
        this.inited=false;
        return FSP.writeFile(this.sysfsGPIOPath + 'unexport', this.pin.toString())
    }

    private async setDirection() {
        if (this.inited) {
            await FSP.writeFile(`/sys/class/gpio/gpio${this.pin}/direction`, this.mode);
        }
    }

    private async isReady() {
        const timeout = 5000;
        const cycle = 10;
        let time = 0;
        const path = this.sysfsGPIOPath + 'gpio' + this.pin;
        do {
            if (await this.isExported(path) && await this.haveAccess(path)) {
                this.inited = true;
                return;
            }
            time += cycle;
        } while (time < timeout);
        throw new Error('Timeout waiting for export.');
    }

    private isExported(path: string) {
        return new Promise((resolve, reject) => {
            FS.access(path, FS.constants.F_OK, (error) => {
                if (error) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    private haveAccess(path: string) {
        return new Promise((resolve, reject) => {
            FS.access(path, FS.constants.W_OK, (error) => {
                if (error) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }

    async read(): Promise<GPIOstate> {
        if (this.inited) {
            const result = (await FSP.readFile(this.sysfsGPIOPath + 'gpio' + this.pin + '/value')).toString();
            return result.includes("1") ? 1 : 0;
        }
        else
            return 0;
    }

    async write(state: GPIOstate) {
        if (this.inited)
            return (await FSP.writeFile(this.sysfsGPIOPath + 'gpio' + this.pin + '/value',state.toString()));
        else
            return false;
    }

    async pulses(usOn: number,usOff:number,pulses:number=1) {
        if (this.inited){


        let pin = FS.createWriteStream(this.sysfsGPIOPath + 'gpio' + this.pin + '/value', {
            flags: 'w' // Open file for appending. The file is created if it does not exist.
          })
          

          for (let index = 0; index < pulses; index++) {
              await new Promise ((resolve,reject)=>{pin.write("1",resolve)});
              await new Promise ((resolve,reject)=>{pin.write("0",resolve)});
          }
          pin.close();
        }else
            return false;

    }

    async waitForReady() {
        while (!this.inited) {
            await delay(100, null);
        }
    }
}