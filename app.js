const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db");

const mapToObj = (m) => {
  return Array.from(m).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});
};

const app = express();

const server = http.createServer((req, res) => {
  try {
    if (req.url === "/api/names") {
      if (req.method === "GET") {
        res.writeHead(200, { "content-type": "application/json" });
        res.write(JSON.stringify(mapToObj(db["memoryDb"])));
        res.end();
      } else if (req.method === "POST") {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          try {
            if (typeof data === undefined) {
              throw "bad request";
            } else {
              data = JSON.parse(data);
              if (!("name" in data)) {
                throw "bad request - test";
              }
              let currentId = db["id"];
              db["memoryDb"].set(db["id"]++, data);
              res.writeHead(201, { "content-type": "application/json" });
              res.write(JSON.stringify(db["memoryDb"].get(currentId)));
              res.end();
            }
          } catch (err) {
            console.log(err);
            res.writeHead(400, { "content-type": "application/json" });
            res.write(
              JSON.stringify({error:"nop"})
            );
            res.end();
          }
        });
      } else {
        res.writeHead(405, { "content-type": "application/json" });
        res.write(
          JSON.stringify({error:"nop"})
        );
        res.end();
      }
    } else if (req.url.match(/\/api\/name\/*/)) {
      const split = req.url.split("/");
      const targetId = parseInt(split[split.length - 1]);
      if (!db["memoryDb"].has(targetId)) {
        res.writeHead(404, { "content-type": "application/json" });
        res.write(
          JSON.stringify({error:"nop"})
        );
        res.end();
      } else if (req.method === "GET") {
        res.writeHead(200, { "content-type": "application/json" });
        res.write(JSON.stringify(db["memoryDb"].get(targetId)));
        res.end();
      } else if (req.method === "DELETE") {
        db["memoryDb"].delete(targetId);
        res.writeHead(204);
        res.end();
      } else if (req.method === "PUT") {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          try {
            if (typeof data === undefined) {
              throw "bad request";
            } else {
              data = JSON.parse(data);
              if (!("name" in data)) {
                throw "bad request - test";
              }
              db["memoryDb"].set(targetId, data);
              res.writeHead(204);
              res.end();
            }
          } catch (err) {
            console.log(err);
            res.writeHead(400, { "content-type": "application/json" });
            res.write(
              JSON.stringify({error:"nop"})
            );
            res.end();
          }
        });
      } else {
        res.writeHead(405, { "content-type": "application/json" });
        res.write(
          JSON.stringify({error:"nop"})
        );
        res.end();
      }
    }
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.write(
      JSON.stringify({error:"nop"})
    );
    res.end();
  }
});

module.exports = app;
