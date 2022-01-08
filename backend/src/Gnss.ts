import serialport from "serialport";
import Store from "./Store";
import child from "child_process";
import util from "util";
import { GPIO, GPIOstate} from "./GPIO";
import GPS, { Satellite } from "gps"
import { gnssData } from "../../shared";

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
    private valid = false;
    private newTimestamp=false;
    private lastPPS:GPIOstate=0;
    private gps=new GPS();
    public sats:Satellite[]=[];

    constructor(store: Store) {
        this.store = store;
        
        this.COMport = new serialport("/dev/serial0", {
            baudRate: 9600
        });
        this.parser = this.COMport.pipe(new serialport.parsers.Delimiter({ delimiter: [0x0D, 0x0A] }));
        this.parser.on("data", this.updateGnss.bind(this));
        setInterval(this.checkPPS.bind(this),100);
        setInterval(this.saveGps.bind(this),1000);
    }
    private async saveGps(){
        this.sats=this.gps.state.satsVisible||[];
        this.store.gnssData=this.gps.state as gnssData;
        this.store.latitude = this.gps.state.lat||0;
        this.store.longitude = this.gps.state.lon||0;
    }

    private updateGnss(chunk:Buffer){
        this.gps.update(chunk.toString());
    }
    private async checkPPS(){         
            if (this.newTimestamp){
                const lastDate = new Date(this.gps.state.time.valueOf() + 1000);
                const timeString = `${lastDate.getFullYear()}-${lastDate.getMonth() + 1}-${lastDate.getDate()}T${lastDate.getHours()}:${lastDate.getMinutes()}:${lastDate.getSeconds()}.000Z`;
                exec(`sudo date --set="${timeString}"`).then(() => {console.log(new Date())});
                this.newTimestamp=false;
                }
        }
        
}