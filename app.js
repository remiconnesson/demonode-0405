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

app.get('/api/names', (req, res) => {
  res.json(mapToObj(db.memoryDb));
})

app.get('/api/name/:id', (req, res) => {
  let id = parseInt(req.params.id)
  res.json(db.memoryDb.get(id));
})

module.exports = app;
