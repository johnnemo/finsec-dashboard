import dotenv from "dotenv";
import express from "express";
import http, {IncomingMessage, Server as HttpServer} from "http";
import https from "https";
import path from "path";
import {Server as SocketServer} from "socket.io";

import proxy from "express-http-proxy";

dotenv.config();
console.log(`Starting up server ${process.env.SERVER_NAME}`);

const app: express.Application = express();

const httpServer: HttpServer = http.createServer(app);
const io: SocketServer = new SocketServer(httpServer, {
  /*path: "/api/socket", */
  cors: {
    methods: ["GET", "POST"],
    origin: "https://localhost:4200"
  },
});
const httpsAgent = new https.Agent({keepAlive: true, timeout: 0});

const openDbStream = (query: any = {"type": "x-event"},
                      token: string,
                      socket: any) => {
  const postData = JSON.stringify(query);

  console.log(`Openning WS dbstream with query: `, query);
  const req = https.request(process.env.FINSEC_URL + "/data-layer/dbstream",
                            {
                              method: "POST",
                              headers: {
                                "Accepts": "application/json",
                                "Authorization": `Bearer ${token}`,
                                "Content-Type": "application/json",
                                "Content-Length": postData.length
                              },
                              timeout: 0,
                              agent: httpsAgent,
                            },
                            (res: IncomingMessage) => {
                              // console.log('statusCode:', res.statusCode);
                              // console.log('headers:', res.headers);

                              res.on('data', (d) => {
                                // process.stdout.write(d);
                                socket.emit('data', d);
                              });
                            }
  );

  socket.on("disconnect", (reason: any) => {
    console.log('WS Disconnected, closing request');
    req.destroy();
  });

  req.on('error', (e) => {
    console.error(e);
  });

  req.write(postData);
  req.end();

  return req;
}

// @ts-ignore
const port: number = process.env.PORT && process.env.PORT.length ? parseInt(process.env.PORT, 10) : 3000;

app.get(`/api/test`, (req: any, res: any) => {
  res.send(`<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io({
    query: {type: 'x-event'},
    extraHeaders: {
        authorization: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5ZlB6YmIwaC1FMXI0MTFVajFUdXhyYzFqdXRxNE43VnMxZHQ3c0NLT3ZZIn0.eyJqdGkiOiIwMmU3OGQ2ZC05NGFhLTQ4NTItYmM1YS0xNWQ4MTkzNzhmZjYiLCJleHAiOjE2MTQzMzYxNDIsIm5iZiI6MCwiaWF0IjoxNjE0MzMzMTQyLCJpc3MiOiJodHRwczovL2tleWNsb2FrLmZpbnNlYy1wcm9qZWN0LmV1L2F1dGgvcmVhbG1zL2ZpbnNlYy1wcm9qZWN0LmV1IiwiYXVkIjpbImNsaWVudC1maW5zZWMiLCJhY2NvdW50Il0sInN1YiI6ImUyMWFjNDIyLWVjYjEtNGM3MC04NWE3LWJlOTIzZTRkZmU3ZSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImNsaWVudC1maW5zZWMiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJjNGM1Y2M2Zi05NjAyLTQ2Y2EtYjBmZi04OTQyODlkYTk2ZDYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsic29jb3BlcmF0b3IiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwieF9vcmdhbml6YXRpb24iOiJ4LW9yZ2FuaXphdGlvbi0tODMxMTJhZDctMDMyYS00NzkxLWE3YjktNDhlZmVmMDI5ZjVkIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInhfcm9sZSI6InNvY29wZXJhdG9yIiwiZ3JvdXBzIjpbInNvY29wZXJhdG9yIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImFscGhhYmFuay1hZG1pbiIsImVtYWlsIjoiYWxwaGFiYW5rQGZpbnNlYy5jb20iLCJ1c2VyUm9sZU5hbWUiOlsic29jb3BlcmF0b3IiXX0.NtNINt31p04CiDTxZteqd3HDbcV0LUcv6faVNR7eLrChhLnBPQRRQ0pDUn3U37JHloS_-v2RdB86iSKl0UAt1LWK_EUQLG_gXmWxN6TzKp0iP3QfQjRwWRmKzVgnH-M2aeViAUWN7MzMQCiUfM5oq-xCSl5extBcj-aJuMp48LLaGNvWAA2nXeA2aU4YL9nLt3fyXsRmHXVsMcjkmdChD2jGsG_0ziRjIcisLlw2cNatRYPUtDz6H_y1_r-X5x9NYK3l-OIVRkKSD4tM4mNCKzYNecF1aIVKVCjDpQKO9CZHvPR_cqqfiII0o0jMPGL4uX6KOWnfZ4JNkxNbxL-x9w"
    }
  });
  var enc = new TextDecoder("utf-8");
  socket.onAny((event, msg) => console.log('event', event, enc.decode(msg)));
</script><h1>Hello world</h1>`);
});

app.get(`/api/token`, (req: any, res: any) => {
  res.send({
             secret: process.env.CLIENT_SECRET
           });
});

app.use('/keycloak', proxy(process.env.KEYCLOAK_URL, {
  https: process.env.KEYCLOAK_URL.includes('https://')
}));

app.use('/finsec', proxy(process.env.FINSEC_URL, {
  https: process.env.FINSEC_URL.includes('https://')
}));

app.use('/backend', proxy(process.env.DASHBOARD_BACKEND_URL, {
  https: process.env.DASHBOARD_BACKEND_URL.includes('https://'),
  proxyReqOptDecorator(proxyReqOpts, originalReq) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    proxyReqOpts.rejectUnauthorized = false
    return proxyReqOpts;
  }
}));

// Handle any other front-end generated route
[
  "/pages/*",
  "/auth/*"
].forEach((route) => app.get(route, (req, res) => {
  res.sendFile("./client/index.html", {root: __dirname});
}));

app.use(express.json());

// ---- SERVE STATIC FILES FROM ./client DIR ---- //
app.use(express.static(path.join(__dirname, `client`)));

io.on(`connection`, (socket: any) => {
  console.log(`WS connected`);
  openDbStream(JSON.parse(socket.handshake.query.filters), socket.handshake.headers.authorization, socket);

  socket.on(`query`, (msg: string) => {
    console.log(`Message from WS ${msg}`);

  });
});

httpServer.listen(port, () => {
  console.log(`listening on *:${port}`);
});
