const auth = require('../middleware/auth');
const { Pinboard, validate } = require('../models/pinboard');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
  let pin = await Pinboard.find({ _id: req.params.id });

  res.send(pin);
});

router.get('/', async (req, res) => {
  let pinboard = await Pinboard.find();

  res.send(pinboard);
});

router.put('/:id', async (req, res) => {
  let pin = await Pinboard.findById(req.params.id);
  if (!pin) return;

  pin.published = !pin.published;

  pin.save();

  res.send(pin);
});

router.put('/like/:id', async (req, res) => {
  let pin = await Pinboard.findById(req.params.id);
  if (!pin) return;

  pin.likes += 1;

  pin.save();

  res.send(pin);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let pin = new Pinboard(_.pick(req.body, ['data']));

  try {
    await pin.save();
  } catch (ex) {
    console.log(ex.message);
  }

  res.send(pin);
});

module.exports = router;
