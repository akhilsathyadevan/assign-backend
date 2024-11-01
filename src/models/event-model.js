const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"], // Standard recurrence options
      required: true,
    },
    nextOccurrence: {
      type: Date,
      required: true,
    },
    exclusions: {
      type: [Date], 
      default: [],
    },
    customRule: {
      type: String, 
      default: null,
    },
  }, { timestamps: true }); 

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
