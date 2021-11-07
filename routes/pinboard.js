const auth = require('../middleware/auth');
const { Pinboard, validate } = require('../models/pinboard');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

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
