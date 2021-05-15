import express from "express";
import cors from "cors";
 
const PORT=8080;

export default class Api {
    public express: express.Application;
    constructor() {
        this.express = express();
        this.express.set("port", PORT);

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
            res.send("Server Lebt")
        });
    }
}
