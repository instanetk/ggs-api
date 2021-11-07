const mongoose = require('mongoose');
const Joi = require('joi');

const pinboardSchema = new mongoose.Schema({
  published: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    required: true,
  },
  caption: {
    type: String,
    required: false,
    minLength: 0,
    maxLength: 1000,
  },
  tags: {
    type: [String],
    required: false,
    minLength: 3,
    maxLength: 255,
  },
  likes: {
    type: Number,
    minLength: 1,
    maxLength: 9999,
    default: 1,
  },
});

const Pinboard = mongoose.model('Pinboard', pinboardSchema);

function validatePinboard(pin) {
  const schema = Joi.object({
    published: Joi.boolean().required(),
    data: Joi.object().required(),
    caption: Joi.string().min(0).max(1000),
    tags: Joi.array().items(Joi.string().min(3).max(255)),
    likes: Joi.number().min(1).max(9999),
  });
  return schema.validate(pin);
}

exports.Pinboard = Pinboard;
exports.validate = validatePinboard;
