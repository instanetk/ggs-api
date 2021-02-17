const { Testimonial, validate } = require('../models/testimonial');
const { Schedule } = require('../models/schedule');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  let testimonials = await Testimonial.find();

  res.send(testimonials);
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

router.put('/', async (req, res) => {
  const { id } = req.query;
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) return;

  testimonial.published = !testimonial.published;

  testimonial.save();
});

router.delete('/', async (req, res) => {
  const { id } = req.query;

  await Testimonial.deleteOne({ _id: id });

  res.send('deleted');
});

module.exports = router;
