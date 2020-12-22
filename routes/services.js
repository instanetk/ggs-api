const auth = require('../middleware/auth');
const { Service, validate } = require('../models/service');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const services = await Service.find({});
  res.send(services);
});

router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send('The server understood the request, but is refusing to fulfill it.');

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let service = await Service.findOne({ name: req.body.name });
  if (service) return res.status(400).send('Service already exists');

  service = new Service(_.pick(req.body, ['name', 'category', 'i18n', 'image', 'weight', 'featured']));

  await service.save();

  res.send(service);
});

module.exports = router;
