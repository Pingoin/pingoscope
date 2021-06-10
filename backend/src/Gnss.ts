import serialport from "serialport";
import Store from "./Store";
import PiGpio,{Gpio} from "pigpio";
import child from "child_process";
import util from "util";
const exec = util.promisify(child.exec);
const SAT_SOURCE = {
    "GP": "GPS",
    "GL": "GLONASS",
    "GA": "GALILEO",
    "GB": "BAIDOU"
}

export default class Gnss {
    private store: Store;
    private COMport: serialport;
    private parser: serialport.parsers.Delimiter;
    private pps: Gpio;
    private valid = false;
    private lastDate = new Date("2021-06-03T13:00:00.000Z");
    private newTimestamp=false;

    constructor(store: Store) {
        this.store = store;
        this.COMport = new serialport("/dev/serial0", {
            baudRate: 9600
        });
        this.parser = this.COMport.pipe(new serialport.parsers.Delimiter({ delimiter: [0x0D, 0x0A] }));
        this.parser.on("data", this.parse.bind(this));
        this.pps = new PiGpio.Gpio(18,{
            mode: Gpio.INPUT,
            pullUpDown: Gpio.PUD_DOWN,
            edge: Gpio.RISING_EDGE
          });
        this.pps.on("interrupt",(value) => {
            if (this.newTimestamp){
            this.lastDate = new Date(this.lastDate.valueOf() + 1000);
            const timeString = `${this.lastDate.getFullYear()}-${this.lastDate.getMonth() + 1}-${this.lastDate.getDate()}T${this.lastDate.getHours()}:${this.lastDate.getMinutes()}:${this.lastDate.getSeconds()}.000Z`;
            exec(`sudo date --set="${timeString}"`).then(() => console.log(new Date()));
            this.newTimestamp=false;
            }
        })
    }

    private parse(buffer: Buffer) {
        const msg = buffer.toString().slice(0, -3);
        const tel = msg.split(",");
        const mid = msg.slice(3, 6);
        console.log(mid)
;        switch (mid) {
            case "GSV":
                const type = msg.slice(1, 3);
                break;
            case "RMC":
                const dateString = `20${tel[9].slice(-2)}-${tel[9].slice(2, 4)}-${tel[9].slice(0, 2)} ${tel[1].slice(0, 2)}:${tel[1].slice(2, 4)}:${tel[1].slice(-5)}`
                this.lastDate = new Date(dateString);
                this.newTimestamp=true;
                this.store.latitude = this.gpsDegreeToDeg(tel[3], tel[4]);
                this.store.longitude = this.gpsDegreeToDeg(tel[5], tel[6]);
                break;
            case "VTG":
                break;
            case "GGA":
                break;
            case "GSA":
                break;
            case "GLL":
                break;
            default:
                console.log(buffer.toString());
                break;
        }
    }
    private gpsDegreeToDeg(value: string, direction: string): number {
        const val = parseFloat(value);
        let result = Math.floor(val / 100) + (val % 60) / 60;
        if (["W", "S"].includes(direction)) {
            result *= -1
        }
        return result;
    }
}