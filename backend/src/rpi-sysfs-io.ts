import FS from "fs";

const Defaults = {
    sysfsGPIOPath: "/sys/class/gpio/",
    sysfsPWMPath: "/sys/class/pwm/pwmchip0/",
    exportWaitTimeout: 5000,
    exportWaitInterval: 50
};
interface setup {
    sysfsGPIOPath: string,
    sysfsPWMPath: string,
    exportWaitTimeout: number,
    exportWaitInterval: number
}

export class RPiSysfsIO {
    settings: setup;

    constructor(settings?: setup) {
        this.settings = Object.assign({}, Defaults, settings);
    }

    async exportGPIO(gpio: number, waitExport: boolean): Promise<void> {
        await this.write(this.settings.sysfsGPIOPath + "export", gpio.toString());
        if (!waitExport) {
            return;
        }
        return await this.waitExported(this.settings.sysfsGPIOPath + "gpio" + gpio);
    }

    async unexportGPIO(gpio: number): Promise<void> {
        return await this.write(this.settings.sysfsGPIOPath + "unexport", gpio.toString());
    }

    async isExportedGPIO(gpio: number): Promise<boolean> {
        return await this.isExported(this.settings.sysfsGPIOPath + "gpio" + gpio);
    }

    async directionGPIO(gpio: number, direction: direction): Promise<void> {
        return await this.write(this.settings.sysfsGPIOPath + "gpio" + gpio + "/direction", direction);
    }

    async writeGPIO(gpio: number, data: GPIOstate): Promise<void> {
        return await this.write(this.settings.sysfsGPIOPath + "gpio" + gpio + "/value", data.toString());
    }

    async readGPIO(gpio: number): Promise<GPIOstate> {
        const data = await this.read(this.settings.sysfsGPIOPath + "gpio" + gpio + "/value");
        //console.log(data.toString());
        return data.toString().includes("1")?1:0;
    }


    async exportPWM(pwm: number, waitExport: boolean): Promise<void> {
        await this.write(this.settings.sysfsPWMPath + "export", pwm.toString());
        if (!waitExport) {
            return;
        }
        return await this.waitExported(this.settings.sysfsPWMPath + "pwm" + pwm);
    }

    async unexportPWM(pwm: number): Promise<void> {
        return await this.write(this.settings.sysfsPWMPath + "unexport", pwm.toString());
    }

    async isExportedPWM(pwm: number): Promise<boolean> {
        return await this.isExported(this.settings.sysfsPWMPath + "pwm" + pwm);
    }

    async periodPWM(pwm: number, period: number): Promise<void> {
        return await this.write(this.settings.sysfsPWMPath + "pwm" + pwm + "/period", period.toString());
    }

    async dutyCyclePWM(pwm: number, dutyCycle: number): Promise<void> {
        return await this.write(this.settings.sysfsPWMPath + "pwm" + pwm + "/duty_cycle", dutyCycle.toString());
    }

    async enablePWM(pwm: number, enable: boolean): Promise<void> {
        return await this.write(this.settings.sysfsPWMPath + "pwm" + pwm + "/enable", enable ? "1" : "0");
    }


    async write(path: string, data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            FS.writeFile(path, "" + data, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

    async read(path: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            FS.readFile(path, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(data);
            });
        });
    }

    async waitExported(path: string): Promise<void> {
        let waitTime = 0;
        while (!(await this.isExported(path))) {
            waitTime += this.settings.exportWaitInterval;
            if (waitTime > this.settings.exportWaitTimeout) {
                throw new Error("Timeout waiting for export.");
            }
            await this.wait(this.settings.exportWaitInterval);
        }
        await this.wait(this.settings.exportWaitInterval);
    }

    isExported(path: string): Promise<boolean> {
        return new Promise((resolve) => {
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

    wait(ms: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(function () { resolve(); }, ms);
        });
    }
}

export type direction = "in" | "out";
export type GPIOstate=0|1;

export class GPIO {
    private pin: number;
    private mode: direction;
    private inited = false;
    private gpio = new RPiSysfsIO();

    constructor(pin: number, mode: direction) {

    }

    async initGPIO() {
        if (!(await this.gpio.isExportedGPIO(this.pin))) {
            // export the GPIO and wait until the export is complete
            await this.gpio.exportGPIO(this.pin, true);
        }
        await this.gpio.directionGPIO(this.pin, this.mode);
        this.inited=true;
    }

    async read(){
        if (this.inited)
            return this.gpio.readGPIO(this.pin)
        else
            return 0;
    }

    async write(state:GPIOstate){
    if (this.inited)
        return this.gpio.writeGPIO(this.pin,state)
    else
        return false;
    }


}