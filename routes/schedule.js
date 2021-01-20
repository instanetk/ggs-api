const { Schedule, validate } = require('../models/schedule');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/list', async (req, res) => {
  const { from, to } = req.query;

  let schedule;
  if (from === to) {
    schedule = await Schedule.find({
      date: new Date(from),
    });
  } else {
    schedule = await Schedule.find({
      date: {
        $gte: new Date(from),
        $lt: new Date(to),
      },
    });
  }

  res.send(schedule);
});

router.get('/appointment', async (req, res) => {
  const { id } = req.query;

  const appointment = await Schedule.find({ _id: id });
  if (!appointment) return res.status(404).send({ name: 'No such appointment' });

  res.send(appointment);
});

router.put('/appointment', async (req, res) => {
  const { id } = req.query;

  const appointment = await Schedule.findById(id);
  if (!appointment) return;
  console.log('PUT', appointment);

  appointment.completed = !appointment.completed;

  const result = await appointment.save();

  res.send(result);
});

router.post('/', async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let schedule = await Schedule.findOne({ phone: req.body.phone });
  // if (schedule) return res.status(400).send('Appointment already set.');

  schedule = new Schedule(_.pick(req.body, ['name', 'phone', 'address', 'service', 'date', 'coordinates']));
  console.log(schedule);
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

  try {
    await schedule.save();
    require('../scripts/mail')(message);
  } catch (ex) {
    console.log(ex.message);
  }

  res.send(schedule);
});

module.exports = router;
