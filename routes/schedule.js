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
  // if (schedule) return res.status(400).send('Appointment already set.');

  schedule = new Schedule(_.pick(req.body, ['name', 'phone', 'address', 'service', 'date']));

  const date = {
    appointment: new Date(schedule.date).toDateString(),
    submitted: new Date(schedule.submitted).toDateString() + ' at ' + new Date(schedule.submitted).toTimeString(),
  };
  const message = {
    text: `A new estimate request from ${schedule.name} has been received for a ${schedule.service} at ${schedule.address} on ${date.appointment}. 
  
    You may reach this customer at ${schedule.phone} to confirm or reschedule. 
    
    This request was received on ${date.submitted}`,
    html: `A new estimate request from <b>${schedule.name}</b> has been received for a <b>${schedule.service}</b> at <b>${schedule.address}</b> on <b>${date.appointment}</b>. 
    <br/><br/>
    You may reach this customer at <b>${schedule.phone}</b> to confirm or reschedule. 
    </br/><br/>
    This request was received on <b>${date.submitted}</b>`,
  };

  require('../scripts/mail')(message);

  await schedule.save();

  res.send(schedule);
});

module.exports = router;
