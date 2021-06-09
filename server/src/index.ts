// import * as Sentry from "@sentry/node";
// import dotenv from "dotenv";
// import express, {Router} from "express";
// import http, { Server as HttpServer} from "http";
// import mongoose from "mongoose";
// import { hostname } from "os";
// import path from "path";
// import {Server as SocketServer} from "socket.io";
// import {io as clientIO, Socket as ClientSocket} from "socket.io-client";
//
// import ArtemisEvent from "./models/event";
// import { H3cip } from "./models/H3CIP";
//
// dotenv.config();
// console.log(`Starting up server ${process.env.SERVER_NAME}`);
// Sentry.init({ dsn: process.env.SENTRY_DSN, serverName: process.env.SERVER_NAME });
//
// const app: express.Application = express();
//
// // The request handler must be the first middleware on the app
// app.use(Sentry.Handlers.requestHandler());
//
// const httpServer: HttpServer = http.createServer(app);
// const io: SocketServer = new SocketServer(httpServer, {
//   /*path: "/api/socket", */
//   cors: {
//     methods: ["GET", "POST"],
//     origin: "https://localhost:4200"
//   },
// });
//
// let clientWS: ClientSocket = null;
// if (process.env.IS_WS_CLIENT === "true") {
//   console.log("Connecting with WS Server at " + process.env.WS_SERVER_URL);
//   clientWS = clientIO(process.env.WS_SERVER_URL);
//   clientWS.on("connect", () => {
//     // @ts-ignore
//     console.log("Web Socket Connected with ID: " + clientWS.id);
//   });
//   clientWS.on("kemea", (data: any) => {
//     console.log("Got new message from kemea!", data);
//   });
// }
//
// mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
//   { useNewUrlParser: true, useUnifiedTopology: true }
//   );
// const db = mongoose.connection;
// // @ts-ignore
// db.on(`error`, console.error.bind(console, `connection error:`));
// db.once(`open`, () => {
//     // we're connected!
//     console.log("database connected");
// });
//
// // @ts-ignore
// const port: number = process.env.PORT && process.env.PORT.length ? parseInt(process.env.PORT, 10) : 3000;
//
// const router = Router();
// app.get(`/api/test`, (req: any, res: any) => {
//     res.send(`<script src="/socket.io/socket.io.js"></script>
// <script>
//   var socket = io("ws://localhost:4200/api/socket");
// </script><h1>Hello world</h1>`);
// });
//
// app.get(`/api/events`, (req: express.Request, res: express.Response) => {
//     ArtemisEvent.find({}).sort([[`createdAt`, -1]]).exec().then((data: any[]) => {
//         res.send(data);
//     });
// });
//
// app.post(`/api/event`, (req: express.Request, res: express.Response) => {
//     console.log(`new event`, req.body);
//     const event = new ArtemisEvent(req.body);
//     event.save();
//     io.emit(`event`, event);
//
//     res.send({ success: true });
// });
//
// app.post(`/api/event/:id`, async (req: express.Request, res: express.Response) => {
//
//   // const event = ArtemisEvent.findById(req.params.id);
//   const status = await ArtemisEvent.updateOne({ _id: req.params.id }, {
//     $set: {
//       forwardedAt: new Date(),
//       operator_input: {...req.body, _id: null}
//     }
//   });
//
//   const event = await ArtemisEvent.findOne({ _id: req.params.id } );
//   console.log(`lookup event id: ${req.params.id}`, event);
//
//   if (clientWS && clientWS.connected && event) {
//
//     clientWS.emit("kemea", {
//       ...event.toJSON(),
//       _id: null,
//       from: hostname(),
//       rawId: event._id
//     });
//
//     res.send({ success: true, msg: "Forwarded to Kemea", status });
//   } else {
//     res.send({ success: false, msg: "Cannot forward to Kemea", status });
//   }
// });
//
// app.get(`/api/debug-sentry`, (req, res) => {
//   throw new Error(`My first Sentry error!`);
// });
//
// // app.use(`/api`, router);
//
// // Handle any other front-end generated route
// [
//   "/pages/*",
//   "/auth/*"
// ].forEach( (route) => app.get(route, (req, res) => {
//   res.sendFile("./client/index.html", { root: __dirname });
// }));
//
// // The error handler must be before any other error middleware and after all controllers
// app.use(Sentry.Handlers.errorHandler());
//
// app.use(express.json());
//
// // ---- SERVE STATIC FILES FROM ./client DIR ---- //
// app.use(express.static(path.join(__dirname, `client`)));
//
// const handleKemeaMsg = (msg: any) => {
//   const event = new ArtemisEvent(msg);
//   event.save();
//   io.emit(`event`, event);
//   console.log(`Got new event`, msg);
//
//   // TODO sent message to H3CIP
//   if (process.env.H3CIP_URL && process.env.H3CIP_URL.length) {
//      const fwd: H3cip = {
//        features : [], // TODO parse the message!
//        type: event.get("type")
//      };
//
//      http.request({
//        hostname: process.env.H3CIP_URL,
//        method: "POST",
//        path: process.env.H3CIP_URL_PATH
//      }); // TODO handle the request status.
//   }
// };
//
// io.on(`connection`, (socket: any) => {
//     console.log(`WS connected`);
//     socket.on(`msg`, (msg: string) => console.log(`Message from WS ${msg}`));
//     if (process.env.IS_WS_CLIENT !== "true") {
//       socket.on(`kemea`, handleKemeaMsg);
//     }
// });
//
// httpServer.listen(port, () => {
//     console.log(`listening on *:${port}`);
// });
