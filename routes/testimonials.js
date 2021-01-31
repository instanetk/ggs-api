const { Testimonial, validate } = require('../models/testimonial');
const { Schedule } = require('../models/schedule');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  let testimonials = await Testimonial.find();

  let testimony = testimonials[Math.floor(Math.random() * testimonials.length)];

  res.send(testimony);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let testimonial = new Testimonial(_.pick(req.body, ['name', 'email', 'testimonial', 'language']));

  // let schedule = await Schedule.find({ email: req.body.email });
  // console.log(schedule[0].coordinates, schedule);
  // if (schedule[0].coordinates) testimonial.city = schedule[0].coordinates;

  try {
    await testimonial.save();
  } catch (ex) {
    console.log(ex.message);
  }

  res.send(testimonial);
});

module.exports = router;
