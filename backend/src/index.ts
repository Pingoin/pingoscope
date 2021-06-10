/** @format */

import Api from "./Api";
import Gnss from "./Gnss";
import StellariumConnector from "./StellariumConnector";
import Store from "./Store";

class main{
    store:Store;
    api:Api;
    stellarium:StellariumConnector;
    gnss:Gnss;
    constructor(){
        this.store = new Store();
        this.api = new Api(this.store);
        this.stellarium = new StellariumConnector(10001, this.store);
        this.gnss = new Gnss(this.store);
    }

}

new main();