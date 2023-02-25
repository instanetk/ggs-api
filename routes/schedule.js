const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();
const { Schedule, validate } = require('../models/schedule');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

const CRM_URL = process.env.ZOHO_WEBLEAD_FUNCTION_URL;

router.get('/list', async (req, res) => {
  const { from, to } = req.query;

  let schedule;
  if (from === to) {
    schedule = await Schedule.find({
      date: new Date(from),
    }).sort({ date: 1 });
  } else {
    schedule = await Schedule.find({
      date: {
        $gte: new Date(from),
        $lt: new Date(to),
      },
    }).sort({ date: 1 });
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

  // console.log('status', appointment.status);
  // console.log('object', appointment);

  const status = ['active', 'contacted', 'visited', 'completed'];
  const index = status.indexOf(appointment.status);

  let set;

  switch (index) {
    case 0:
      set = status[1];
      break;
    case 1:
      set = status[2];
      break;
    case 2:
      set = status[3];
      break;
    case 3:
      set = status[0];
    default:
    case -1:
      set = status[0];
  }

  appointment.status = set;

  // console.log(appointment.status, status[index], index);

  const result = await appointment.save();

  res.send(result);
});

router.delete('/appointment', async (req, res) => {
  const { id } = req.query;

  await Schedule.deleteOne({ _id: id });

  res.send('deleted');
});

router.post('/', async (req, res) => {
  console.log(req.body.date, req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let schedule = await Schedule.findOne({ phone: req.body.phone });
  // if (schedule) return res.status(400).send('Appointment already set.');

  schedule = new Schedule(
    _.pick(req.body, ['name', 'last', 'phone', 'address', 'service', 'email', 'note', 'date', 'coordinates'])
  );
  console.log(schedule);
  const date = {
    appointment: new Date(schedule.date).toDateString(),
    submitted: new Date(schedule.submitted).toDateString() + ' at ' + new Date(schedule.submitted).toTimeString(),
  };
  const message = {
    text: `A new estimate request from ${schedule.name} has been received for a ${schedule.service} at ${
      schedule.address
    } on ${date.appointment}. 

    They said the following: ${schedule.note || 'No note appended.'}
  
    You may reach this customer at ${schedule.phone} to confirm or reschedule. Their email is ${schedule.email} .
    
    This request was received on ${date.submitted}`,
    html: `A new estimate request from <b>${schedule.name}</b> has been received for a <b>${
      schedule.service
    }</b> at <b>${schedule.address}</b> on <b>${date.appointment}</b>. 
    <br/><br/>
    They said the following: ${schedule.note || 'No note appended.'}
    <br/><br/>

    You may reach this customer at <b>${schedule.phone}</b> to confirm or reschedule. Their email is ${schedule.email} .
    </br/><br/>
    This request was received on <b>${date.submitted}</b>`,
  };

  const crmPayload = {
    Lead_Source: 'Web App',
    Lead_Status: 'Not Contacted',
    First_Name: req.body.name,
    Last_Name: req.body.last,
    Phone: req.body.phone,
    Email: req.body.email,
    Address_1_Formatted: req.body.address,
    Date: new Date(req.body.date).toLocaleDateString('en-US', { timeZone: 'UTC' }),
    Description: req.body.note,
    Service: req.body.service,
  };

  console.log(crmPayload);

  const payload = new FormData();
  payload.append('arguments', JSON.stringify(crmPayload));

  try {
    const result = await axios.post(CRM_URL, payload);

    console.log('ZOHO FUNCTION CALLED', result.data);
  } catch (ex) {
    console.log(ex);
  }

  try {
    await schedule.save();
    require('../scripts/mail')(message);
  } catch (ex) {
    console.log(ex.message);
  }

  res.send(schedule);
});

module.exports = router;
