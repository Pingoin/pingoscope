import serialport from "serialport";
import Store from "./Store";
import OnOff from "onoff";

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
    private pps: OnOff.Gpio;

    constructor(store: Store) {
        this.store = store;
        this.COMport = new serialport("/dev/serial0", {
            baudRate: 9600
        });
        this.parser = this.COMport.pipe(new serialport.parsers.Delimiter({ delimiter: [0x0D, 0x0A] }));
        this.parser.on("data", this.parse.bind(this));
        this.pps = new OnOff.Gpio(18, "in", "rising");
        this.pps.watch((err, value) => {
            console.log(new Date() + " Interrupt " + value)

        })
    }
    private parse(buffer: Buffer) {
        const msg = buffer.toString();
        const type = msg.slice(1, 3);
        const mid = msg.slice(3, 6);
        switch (mid) {
            case "GSV":
                const tel = msg.split(",");
                break

            default:
                console.log(type + "/" + mid + "/" + msg.slice(7));
                break;
        }

    }
}