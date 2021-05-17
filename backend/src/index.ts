/** @format */

import Api from "./Api";
import StellariumConnector from "./StellariumConnector";
import Store from "./Store";

const store = new Store();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const api = new Api(store);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stellarium = new StellariumConnector(10001, store);
