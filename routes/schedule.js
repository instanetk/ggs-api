const { Schedule, validate } = require('../models/schedule');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const schedule = await Schedule.find({});
  res.send(schedule);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let schedule = await Schedule.findOne({ phone: req.body.phone });
  if (schedule) return res.status(400).send('Appointment already set.');

  schedule = new Schedule(_.pick(req.body, ['name', 'phone', 'address', 'date']));

  await schedule.save();

  res.send(schedule);
});

module.exports = router;
