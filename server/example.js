const https = require("https");
const SocketServer = require("socket.io").Server;
// import https from "https";

const postData = JSON.stringify({"type": "x-event"});
const index = new Map();

const io: socketServer = new SocketServer(httpServer, {
  /*path: "/api/socket", */
  cors: {
    methods: ["GET", "POST"],
    origin: "https://localhost:4200"
  },
});

const req = https.request(
  {
    method: "POST",
    path: "/data-layer/dbstream",
    host: "api.dev.finsec-project.eu",
    protocol: "https:",
    headers: {
      "Accepts": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5ZlB6YmIwaC1FMXI0MTFVajFUdXhyYzFqdXRxNE43VnMxZHQ3c0NLT3ZZIn0.eyJqdGkiOiI2NDYzODk3ZS0zZTIxLTRmZTMtOWU2Mi1lODU3ZjlhMzQ4OGQiLCJleHAiOjE2MTQyNjUwMzYsIm5iZiI6MCwiaWF0IjoxNjE0MjYyMDM2LCJpc3MiOiJodHRwczovL2tleWNsb2FrLmZpbnNlYy1wcm9qZWN0LmV1L2F1dGgvcmVhbG1zL2ZpbnNlYy1wcm9qZWN0LmV1IiwiYXVkIjpbImNsaWVudC1maW5zZWMiLCJhY2NvdW50Il0sInN1YiI6ImUyMWFjNDIyLWVjYjEtNGM3MC04NWE3LWJlOTIzZTRkZmU3ZSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImNsaWVudC1maW5zZWMiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiIwZWU4MTU3My04ZjIyLTRiMjUtOWZjZC1lZjcyZDJiZjhmZjMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsic29jb3BlcmF0b3IiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwieF9vcmdhbml6YXRpb24iOiJ4LW9yZ2FuaXphdGlvbi0tODMxMTJhZDctMDMyYS00NzkxLWE3YjktNDhlZmVmMDI5ZjVkIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInhfcm9sZSI6InNvY29wZXJhdG9yIiwiZ3JvdXBzIjpbInNvY29wZXJhdG9yIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImFscGhhYmFuay1hZG1pbiIsImVtYWlsIjoiYWxwaGFiYW5rQGZpbnNlYy5jb20iLCJ1c2VyUm9sZU5hbWUiOlsic29jb3BlcmF0b3IiXX0.SoIDYYbqcRQzojyxTIffX1dkhtbE-xA4Rk04YmIM4EtSvsjauY_d789NyaieVRqNKujP6eV3FOgSWCQLgKYT3ZAMIR3Xhcl01Jj7ZmFAXwlAmNp6WUrNknzA4ACSzj_edmTwQ-uZjG_7bcQbDCadmztgHw_FgUcuk8QDw03sWvZkWjAdARF_SdsoD6mm99OhdbHSE4qziHcKnIBHYoMeIu3sx80uk35EnTMZuYmmOyK5TaiyoEW4nvTj3Q6FDOs2E23qk4I7ZdyAd88v6yYbNrwepUN3ayTcZiqpJ7NzCeyeyfqjmBSgqNI1Rc7IkUf0WbU2bI6Jpt-DRX-b9WfNsg",
      "Content-Length": postData.length
    },
    timeout: 0,
    httpsAgent: new https.Agent({ keepAlive: true, timeout: 0 }),
  },
  (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  }
);

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end();
