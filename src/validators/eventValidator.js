const Joi = require("joi");

const CreateEventSchema = Joi.object({
  eventName: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.base": `"eventName" should be a type of 'text'`,
      "string.empty": `"eventName" cannot be an empty field`,
      "string.min": `"eventName" should have a minimum length of {#limit}`,
      "any.required": `"eventName" is a required field`
    }),

  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": `"startDate" should be a type of 'date'`,
      "date.iso": `"startDate" must be a valid ISO date`,
      "any.required": `"startDate" is a required field`
    }),

  frequency: Joi.string()
    .valid("Daily", "Weekly", "Monthly", "Custom")
    .required()
    .messages({
      "string.base": `"frequency" should be a type of 'text'`,
      "any.only": `"frequency" must be one of the following values: Daily, Weekly, Monthly, Custom`,
      "any.required": `"frequency" is a required field`
    }),

  customFrequency: Joi.string()
    .allow(null)
    .max(200) // Optional, assuming you might want to limit the length
    .messages({
      "string.base": `"customFrequency" should be a type of 'text'`,
      "string.max": `"customFrequency" should have a maximum length of {#limit}`
    }),

  exclusionDates: Joi.array()
    .items(Joi.date().iso())
    .messages({
      "array.base": `"exclusionDates" should be an array`,
      "date.iso": `"exclusionDates" must contain valid ISO date(s)`
    })
});

module.exports = CreateEventSchema;
