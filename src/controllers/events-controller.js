const Event = require('../models/event-model');
const responseHandler = require('../helpers/responseHandler')
const { v4: uuidv4 } = require("uuid");
const moment = require('moment');
const fs = require("fs-extra");
const path = require("path");
const DATA_FILE = path.join(__dirname, "../data/events.json");
const CreateEventSchema = require('../validators/eventValidator')

async function loadEvents() {
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async function saveEvents(events) {
    await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
  }

  function calculateNextOccurrence(startDate, frequency, exclusions = []) {
    let nextDate = moment(startDate);
  
    switch (frequency.toLowerCase()) {
      case "daily":
        nextDate.add(1, "days");
        break;
      case "weekly":
        nextDate.add(1, "weeks");
        break;
      case "monthly":
        nextDate.add(1, "months");
        break;
      default:
        throw new Error("Invalid frequency");
    }
  
    while (exclusions.includes(nextDate.format("YYYY-MM-DD"))) {
      nextDate.add(1, frequency.toLowerCase() === "daily" ? "days" : frequency.toLowerCase() === "weekly" ? "weeks" : "months");
    }
  
    return nextDate;
  }
  
  
  exports.addEvent = async (req, res, next) => {
    try{
    const { eventName, startDate, frequency, exclusionDates, customRule } = req.body;
    const { error } = CreateEventSchema.validate(req.body);

    if (error) {
     return res.status(400).json({ error: error.details[0].message });
    }

    
    if (!eventName || !startDate || !frequency) {
      return res.status(400).json({ error: "Event name, start date, and frequency are required" });
    }
  
    const event = {
      id: uuidv4(),
      eventName,
      startDate,
      frequency,
      nextOccurrence: calculateNextOccurrence(startDate, frequency, exclusionDates).toISOString(),
      exclusions: exclusionDates || [],
      customRule: customRule || null
    };
  
    const events = await loadEvents();
    events.push(event);
    await saveEvents(events);
  
    res.status(201).json(event);
  } catch(err){
    next(err)
  }
  };
  exports.getEvents = async (req, res, next) => {
    try{
    const { page = 1, limit = 20 } = req.query;
    const events = await loadEvents();
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    res.json({
      events: events.slice(startIndex, endIndex),
      totalEvents: events.length,
      page: parseInt(page),
      totalPages: Math.ceil(events.length / limit),
    });
  }catch(err){
    next(err)
  }
  };

  function calculateFutureOccurrences(event, count) {
    let occurrences = [];
    let nextDate = moment(event.startDate);
    
    for (let i = 0; i < count; i++) {
      nextDate = calculateNextOccurrence(nextDate, event.frequency, event.exclusions);
      occurrences.push(nextDate.toISOString());
    }
    
    return occurrences;
  }

  exports.getNextOccurrences = async (req, res, next) => {
    try{
    const events = await loadEvents();
    const event = events.find((e) => e.id === req.params.id);
  
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
  
    const occurrences = calculateFutureOccurrences(event, 5);
    res.json({ nextOccurrences: occurrences });
   }catch(err){
      next(err);
    }
  };