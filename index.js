import express from "express";
import bootstrap from "./src/app.controller.js";
import { runSocket } from "./src/socketio/index.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
bootstrap(app, express);

const port = process.env.PORT || 4000;
const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

runSocket(server);
