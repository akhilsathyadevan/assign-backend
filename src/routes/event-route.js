const express = require("express");
const eventRoute = express.Router();
const eventController = require('../controllers/events-controller');
const eventRateLimit = require('../helpers/evenetRateLimit')


eventRoute.post("/api/event", eventRateLimit,eventController.addEvent);
eventRoute.get("/api/events", eventController.getEvents);
eventRoute.get("/api/event/next-occurrences/:id", eventController.getNextOccurrences);

module.exports = eventRoute