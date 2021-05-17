import express from "express";
import cors from "cors";
import Store from "./Store";
 
const PORT=8080;

export default class Api {
    public express: express.Application;
    private Store:Store;
    constructor(store:Store) {
        this.express = express();
        this.express.set("port", PORT);
        this.Store=store;
        this.middleware();
        this.routes();
        this.express.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
        });
    }
    private middleware(): void {
        this.express.use(cors());
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    }
    private routes(): void {
        this.express.get("/api/test", (req, res) => {
            res.send("Server Lebt");
        });
        this.express.get("/api/data", (req, res) => {
            res.json(this.Store.simplify());
        });
    }
}
